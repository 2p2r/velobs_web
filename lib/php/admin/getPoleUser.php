<?php
	session_start();
	include_once '../key.php';

	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				
				$sql = "SELECT p.id_pole, p.lib_pole, t.lib_territoire FROM pole p INNER JOIN territoire t ON t.id_territoire = p.territoire_id_territoire WHERE p.id_pole <> 9 ORDER BY t.lib_territoire, p.lib_pole ASC";
				$result = mysql_query($sql);
				$i = 0;
				while ($row = mysql_fetch_array($result)){
					$arr[$i]['id_userpole'] = $row['id_pole'];
					$arr[$i]['lib_userpole'] = stripslashes($row['lib_pole'] . " - " . $row['lib_territoire']);
					$i++;
				}
				echo '({"userpole":'.json_encode($arr).'})';

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

?>