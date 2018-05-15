<?php

namespace App\Config;

class db {
	private $DB_DSN = 'mysql:dbname=codecourse;host=localhost';
	private $DB_USER = 'root';
	private $DB_PASSWORD = 'qwerty';

	public function connect() {
		$dbConnection = new \Slim\PDO\database($this->DB_DSN, $this->DB_USER, $this->DB_PASSWORD);
		$dbConnection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		return $dbConnection;
	}
}

?>