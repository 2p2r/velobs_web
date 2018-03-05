<?php
	session_start();
	include_once '../key.php';
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);	
				mysql_query("SET NAMES utf8mb4");
				
				$sql = "SELECT id_pole, lib_pole FROM pole WHERE id_pole <> 12 ORDER BY lib_pole ASC";
				$result = mysql_query($sql);
				$i = 0;
				while ($row = mysql_fetch_array($result)){
					$arr[$i]['id_pole'] = $row['id_pole'];
					$arr[$i]['lib_pole'] = stripslashes($row['lib_pole']);
					$i++;
				}
				echo '({"pole":'.json_encode($arr).'})';
	
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
?>