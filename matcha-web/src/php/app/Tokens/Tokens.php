<?php

namespace App\Tokens;

use \Firebase\JWT\JWT;
use App\Config\db;

class Tokens
{
	public function createAccessToken($username, $expireTime)
	{
		$accessTime = time() + $expireTime;
		$db = new db();
		$db = $db->connect();

		$query = $db->query("SELECT id FROM users WHERE login = '$username'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		$token = array(
			"iss" => "http://localhost:8100/",
			"uid" => $username,
			"user_id" => $result['id'],
			"exp" => $accessTime
		);

		$jwt = JWT::encode($token, "secret", 'HS512');
		$stm = $db->prepare("UPDATE users SET access_token = ?, last_visit = now() WHERE login = ?");
		$stm->bindParam(1, $jwt);
		$stm->bindParam(2, $username);
		$stm->execute();
		return $jwt;
	}

	public function getAccessTime($jwt)
	{
		try {
			$token = JWT::decode($jwt, 'secret', (array)'HS512');
			$token_decoded = (array) $token;
			return $token_decoded['exp'];
		}
		catch (\Firebase\JWT\ExpiredException $e)
		{
			return 'expired';
		}
	}

	public function tokenNotExpired($jwt)
	{
		$result = $this->getAccessTime($jwt);
		if ($result == 'expired')
			return false;
		return true;
	}

	public function tokenExists($jwt)
	{
		$db = new db();
		$db = $db->connect();

		if ($this->getAccessTime($jwt) == 'expired')
			return 'expired';
		$token = (array) JWT::decode($jwt, 'secret', (array)'HS512');
		$stm = $db->prepare("SELECT login FROM users WHERE login = ? AND access_token = ?");
		$stm->bindParam(1, $token['uid']);
		$stm->bindParam(2, $jwt);
		$stm->execute();
		if ($stm->rowCount() == 0)
			return 'not exists';
		return 'exists';
	}

	public function ultimateTokenFunction($jwt)
	{
		if ($this->tokenExists($jwt) == false)
			return false;
		if ($this->tokenNotExpired($jwt) == true)
			return true;
		$token = (array) JWT::decode($jwt, 'secret', (array)'HS512');
		return ($this->createAccessToken($token['uid']));
	}
}

?>
