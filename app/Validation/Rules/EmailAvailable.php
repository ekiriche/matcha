<?php

namespace App\Validation\Rules;

use Respect\Validation\Rules\AbstractRule;
use App\Config\db;


class EmailAvailable extends AbstractRule
{
	public function validate($input)
	{
		$db = new db();
		$db = $db->connect();

		$sql = "SELECT * FROM `users` WHERE `email` = '$input'";
		$stm = $db->prepare($sql);
		$stm->execute();
		if ($stm->rowCount() == 0)
			return true;
		return false;
	}
}

?>