<?php header('Content-Type: text/html; charset=UTF-8');
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			if (DEBUG){
				error_log(date("Y-m-d H:i:s") . " - getJsonStats.php \n", 3, LOG_FILE);
			}
			$sql = "SELECT s.id_status 
					FROM status AS s
					ORDER BY s.lib_status ASC";
		
			$result = mysql_query($sql);
			$i = 0;
			while ($row = mysql_fetch_array($result)){
				$sql2 = "SELECT COUNT(p.id_poi) as nb_poi, s.id_status, s.lib_status 
						FROM status s 
						INNER JOIN poi p ON p.status_id_status = s.id_status 
						WHERE p.status_id_status =  ".$row['id_status'];
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " - getJsonStats.php $sql2 \n", 3, LOG_FILE);
				}
				$result2 = mysql_query($sql2);
				while ($row2 = mysql_fetch_array($result2)){	
					$arr[$i]['status'] = addslashes($row2['lib_status']);
					$arr[$i]['nb_poi'] = $row2['nb_poi'];
					$i++;
				}
			}
			echo '({"statistiques":'.json_encode($arr).'})';
		
			mysql_free_result($result);
			mysql_free_result($result2);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>