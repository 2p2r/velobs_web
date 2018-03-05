<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				
				$sql = "SELECT id_category, lib_category FROM category ORDER BY lib_category ASC";
				$result = mysql_query($sql);
				$i = 0;
				while ($row = mysql_fetch_array($result)){
					$arr[$i]['id_category'] = $row['id_category'];
					$arr[$i]['lib_category'] = stripslashes($row['lib_category']);
					$i++;
				}
				echo '({"category":'.json_encode($arr).'})';
	
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
?>