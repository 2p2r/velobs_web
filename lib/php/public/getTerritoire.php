<?php header('Content-Type: text/html; charset=UTF-8');
	include_once '../key.php';

	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			
			$sql = "SELECT id_territoire, lib_territoire FROM territoire ORDER BY lib_territoire ASC";
			$result = mysql_query($sql);
			$i = 0;
			while ($row = mysql_fetch_array($result)){
				$arr[$i]['id_territoire'] = $row['id_territoire'];
				$arr[$i]['lib_territoire'] = stripslashes($row['lib_territoire']);
				$i++;
			}
			echo '({"territoire":'.json_encode($arr).'})';

			mysql_free_result($result);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}
	
?>