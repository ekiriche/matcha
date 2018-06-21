<?php

namespace App\Profile;

use App\Config\db;
use App\Tokens;

class Profile
{
	public function getInfo($login, $column)
	{
		$db = new db();
		$db = $db->connect();

		$query = $db->query("SELECT * FROM `user_profile` WHERE login = '$login'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		//print_r($result);
		if ($column == 'all')
		{
			$query = $db->query("SELECT * FROM `users` WHERE login = '$login'");
			$result2 = $query->fetch(\PDO::FETCH_ASSOC);
			$result['user_id'] = $result2['id'];
			$result['firstname'] = $result2['firstname'];
			$result['password'] = $result2['password'];
			$result['lastname'] = $result2['lastname'];
			$result['is_authrised'] = $result2['is_authrised'];
			$result['access_token'] = $result2['access_token'];
			$result['email'] = $result2['email'];
			$result['date_of_creation'] = $result2['date_of_creation'];

			$sql = "SELECT path, is_main_picture FROM pictures WHERE user_id = " . $result['user_id'];
			$query = $db->query($sql);
			$result3 = $query->fetchAll(\PDO::FETCH_ASSOC);

			$result['pictures'] = $result3;

			return ($result);
		}
		return ($result[$column]);
	}

	public function getInfoByUserId($user_id)
	{
		$db = new db();
		$db = $db->connect();

		$query = $db->query("SELECT * FROM user_profile WHERE user_id = '$user_id'");
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		$query = $db->query("SELECT * FROM users where id = '$user_id'");
		$result2 = $query->fetch(\PDO::FETCH_ASSOC);
		$result['login'] = $result2['login'];
		$result['firstname'] = $result2['firstname'];
		$result['password'] = $result2['password'];
		$result['lastname'] = $result2['lastname'];
		$result['is_authorised'] = $result2['is_authrised'];
		$result['access_token'] = $result2['access_token'];
		$result['email'] = $result2['email'];
		$result['date_of_creation'] = $result2['date_of_creation'];
		$result['last_visit'] = $result2['last_visit'];
		$sql = "SELECT path, is_main_picture FROM pictures WHERE user_id = '$user_id'";
		$query = $db->query($sql);
		$result3 = $query->fetchAll(\PDO::FETCH_ASSOC);
		$result['pictures'] = $result3;

		//$this->Tokens->getAccessTime($result['access_token']);

		return $result;
	}

	public function getAllUsersInfoForMap()
	{
		$db = new db();
		$db = $db->connect();

		$query = $db->query("SELECT users.id, users.firstname, users.lastname, user_profile.latitude, user_profile.longitude, pictures.path FROM ((users INNER JOIN user_profile ON users.id = user_profile.user_id) INNER JOIN pictures ON users.id = pictures.user_id) WHERE pictures.is_main_picture = 1 AND users.is_authorised = 2");
		$result = $query->fetchAll(\PDO::FETCH_ASSOC);
		return $result;
	}
}

?>
