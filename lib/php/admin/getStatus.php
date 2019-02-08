<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	
	//if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				
				$sql = "SELECT id_status, lib_status, color_status, is_active_status FROM status WHERE is_active_status = true ORDER BY lib_status ASC";
				$result = mysql_query($sql);
				$i = 0;
				while ($row = mysql_fetch_array($result)){
					$arr[$i]['id_status'] = $row['id_status'];
					$arr[$i]['lib_status'] = stripslashes($row['lib_status']);
					$arr[$i]['color_status'] = stripslashes($row['color_status']);
					$arr[$i]['is_active_status'] = stripslashes($row['is_active_status']);
					$i++;
				}
				echo '({"status":'.json_encode($arr).'})';
	
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	//}
	
?>
