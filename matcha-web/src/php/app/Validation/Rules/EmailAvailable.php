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

		$sql = "SELECT * FROM `users` WHERE `email` = ?";
		$stm = $db->prepare($sql);
		$stm->bindParam(1, $input);
		$stm->execute();
		if ($stm->rowCount() == 0)
			return true;
		return false;
	}
}

?>