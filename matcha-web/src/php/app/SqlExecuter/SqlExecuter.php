<?php

namespace App\SqlExecuter;

use App\Config\db;

class SqlExecuter
{
	public function getColumnFromTable($login, $column, $table)
	{
		$db = new db();
//		$db = $db->connect();

		$sql = "SELECT '$column' FROM '$table' WHERE login = '$login'";
		$query = $db->query($sql);
		$result = $query->fetch(\PDO::FETCH_ASSOC);
		return $result['$column'];
	}
}

?>