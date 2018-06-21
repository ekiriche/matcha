<?php

namespace App\Validation\Exceptions;

use Respect\Validation\Exceptions\ValidationException;

class HardPasswordException extends ValidationException
{
	public static $defaultTemplates = [
		self::MODE_DEFAULT => [
			self::STANDARD => 'Password must contain at least 1 number and 1 letter',
		],
	];
}

?>