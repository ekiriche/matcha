<?php

namespace App\Config;

class db {
	private $DB_DSN = 'mysql:dbname=matcha;host=localhost';
	private $DB_USER = 'root';
	private $DB_PASSWORD = 'qwerty';

	public function connect() {
		$dbConnection = new \Slim\PDO\database($this->DB_DSN, $this->DB_USER, $this->DB_PASSWORD);
		$dbConnection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
		$this->init($dbConnection);

		return $dbConnection;
	}

	public function init($dbConnection)
	{
		$dbName = "matcha";
		$dbConnection->query("CREATE DATABASE IF NOT EXISTS $dbName");
		//$dbConnection->query("use $dbName");
		$sql = "CREATE TABLE IF NOT EXISTS `users` (
			  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
			  `login` varchar(255) NOT NULL,
			  `email` varchar(255) NOT NULL,
			  `firstname` varchar(255) NOT NULL,
			  `lastname` varchar(255) NOT NULL,
			  `password` varchar(255) NOT NULL,
			  `is_authorised` tinyint(1) NOT NULL DEFAULT '0',
			  `reg_link` varchar(255) NOT NULL,
			  `date_of_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
			  `last_visit` timestamp NULL DEFAULT NULL,
			  `access_token` varchar(255) DEFAULT NULL
			)";
		$dbConnection->query($sql);
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `pictures` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `user_id` int(11) NOT NULL,
		  `path` text NOT NULL,
		  `is_main_picture` tinyint(1) NOT NULL
		)");
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `user_profile` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `user_id` int(11) NOT NULL,
		  `login` varchar(255) NOT NULL,
		  `gender` varchar(255) DEFAULT NULL,
		  `sexual_preference` varchar(255) DEFAULT NULL,
		  `birthdate` varchar(16) DEFAULT NULL,
		  `age` int(11) DEFAULT NULL,
		  `biography` text,
		  `tags` text,
		  `latitude` float DEFAULT NULL,
		  `longitude` float DEFAULT NULL,
		  `location` varchar(255) DEFAULT NULL,
		  `fame_rating` int(11) DEFAULT NULL
		)");
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `views` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `viewer` int(11) NOT NULL,
		  `target` int(11) NOT NULL
		)");
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `likes` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `liker` int(11) NOT NULL,
		  `target` int(11) NOT NULL
		)");
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `blocks` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `blocker` int(11) NOT NULL,
		  `target` int(11) NOT NULL
		)");
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `reports` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `reporter` int(11) NOT NULL,
		  `target` int(11) NOT NULL
		)");
		$dbConnection->query("CREATE TABLE IF NOT EXISTS `chat_history` (
		  `id` int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
		  `user_id` int(11) NOT NULL,
		  `target_id` int(11) NOT NULL,
		  `message` varchar(255) NOT NULL,
		  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
		)");
	}
}

?>
