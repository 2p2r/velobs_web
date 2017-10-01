<?php
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);	
			
			$sql = "SELECT id_pole, lib_pole FROM pole ORDER BY lib_pole ASC";
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
	
?>