<?php

namespace App\Validation\Rules;

use Respect\Validation\Rules\AbstractRule;

class HardPassword extends AbstractRule
{
	public function validate($input)
	{
		$containsLetter  = preg_match('/[a-zA-Z]/',    $input);
		$containsDigit   = preg_match('/\d/',          $input);

		if ($containsDigit && $containsLetter)
			return true;
		return false;
	}
}

?>