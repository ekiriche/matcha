<?php

namespace App\Auth;

use App\Config\db;

class Auth
{
	public function user()
	{
		return $_SESSION["user"];
	}

	public function check()
	{
		return isset($_SESSION["user"]);
	}

	public function attempt($login, $password)
	{
		$db = new db();
		$db = $db->connect();

		$hashed_password = hash("sha256", $password);
		$sql = "SELECT * FROM `users` WHERE `login` = '$login' AND `password` = '$hashed_password'";
		$stm = $db->prepare($sql);
		$stm->execute();
		if ($stm->rowCount() == 0)
			return false;
		$_SESSION["user"] = $login;
		return true;
	}

	public function logout()
	{
		unset($_SESSION["user"]);
	}

	public function confirm_reg($email, $reg_link)
	{
		$db = new db();
		$db = $db->connect();

		$sql = "SELECT * FROM `users` WHERE `reg_link` = '$reg_link'";
		$stm = $db->prepare($sql);
		$stm->execute();
		if ($stm->rowCount() == 0)
			return false;
		$stm = $db->prepare("UPDATE `users` SET `is_authorised` = 1 WHERE `email` = ?");
		$stm->bindParam(1, $email);
		$stm->execute();
		return true;
	}
}

?>