<?php
	session_start();
	include_once '../key.php';

	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				
				$sql = "SELECT id_users, lib_users, nom_users, mail_users FROM users WHERE is_active_user = TRUE AND usertype_id_usertype = 4 ORDER BY lib_users ASC";
				$result = mysql_query($sql);
				$i = 0;
				while ($row = mysql_fetch_array($result)){
					$arr[$i]['id_users'] = $row['id_users'];
					$arr[$i]['lib_users'] = stripslashes($row['lib_users']." (".$row['nom_users']." - " . $row['mail_users'].")");
					$i++;
				}
				echo '({"users":'.json_encode($arr).'})';

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

?>