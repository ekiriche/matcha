<?php

namespace App\Validation\Rules;

use Respect\Validation\Rules\AbstractRule;
use App\Config\db;

class LoginAvailable extends AbstractRule
{
	public function validate($login)
	{
		$db = new db();
		$db = $db->connect();

		$stm = $db->prepare("SELECT * FROM users WHERE login = ?");
		$stm->bindParam(1, $login);
		$stm->execute();
		if ($stm->rowCount() == 0)
			return true;
		return false;
	}
}

?>