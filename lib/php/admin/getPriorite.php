<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				
				$sql = "SELECT id_priorite, lib_priorite FROM priorite ORDER BY lib_priorite ASC";
				$result = mysql_query($sql);
				$i = 0;
				while ($row = mysql_fetch_array($result)){
					$arr[$i]['id_priorite'] = $row['id_priorite'];
					$arr[$i]['lib_priorite'] = stripslashes($row['lib_priorite']);
					$i++;
				}
				echo '({"priorite":'.json_encode($arr).'})';
	
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
?>