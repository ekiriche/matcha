<?php

namespace App\Controllers;

class Controller
{
	protected $container;

	function __construct($container)
	{
		$this->container = $container;
	}

	function __get($property)
	{
		if ($this->container[$property])
			return $this->container[$property];
	}
}