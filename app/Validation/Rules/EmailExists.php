<?php

namespace App\Validation\Rules;

use Respect\Validation\Rules\AbstractRule;
use App\Config\db;

class EmailExists extends AbstractRule
{
	public function validate($email)
	{
		$db = new db();
        $db = $db->connect();

        $stm = $db->prepare("SELECT email FROM users WHERE email = ?");
        $stm->bindParam(1, $email);
        $stm->execute();
        if ($stm->rowCount() == 0)
        	return false;
        return true;
	}
}

?>