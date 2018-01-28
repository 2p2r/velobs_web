<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
            mysql_query("SET NAMES utf8mb4");

			$pseudo = mysql_real_escape_string($_POST['login']);
			$pass = mysql_real_escape_string($_POST['password']);
			$sql = "SELECT users.*, language.* FROM users INNER JOIN language ON (language.id_language = users.language_id_language) WHERE lib_users = '".$pseudo."' AND pass_users = '".$pass."'";
			$result = mysql_query($sql);
			if (!$result) {
				$arr['msg'] = 'Invalid request : '.mysql_error()."\n";
				//$arr['msg'] .= 'Request : '.$sql;
				$arr['success'] = FALSE;
			} else {
				if (mysql_num_rows($result) != 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr['id_users'] = $row['id_users'];
						$arr['type_users'] = $row['usertype_id_usertype'];
						$arr['who'] = $row['lib_users'];

						$arr['mail_users'] = $row['mail_users'];
						$arr['role_users'] = $row['role_users'];
						$arr['nom_users'] = $row['nom_users'];
						$arr['territoire_users'] = $row['territoire_id_territoire'];

						$arr['success'] = TRUE;
						$_SESSION['user'] = $row['lib_users'];
						$_SESSION['pole'] = $row['num_pole'];

						$_SESSION['mail'] = $row['mail_users'];
						$_SESSION['role'] = $row['usertype_id_usertype'];
						$_SESSION['nom'] = $row['nom_users'];
						//si l'utilisateur fait partie d'une communauté de commune
                        if ($row['usertype_id_usertype'] == 2) {
                            $sql2 = "SELECT ids_territoire FROM territoire WHERE id_territoire = ".$row['territoire_id_territoire'];
                        	$result2 = mysql_query($sql2);
                        	while ($row2 = mysql_fetch_array($result2)) {
                        	    $_SESSION['territoire'] = $row2['ids_territoire'];
                        	}
                        }//si l'utilisateur fait partie d'un pole technique ou est responsable pole 2P2R
                        else if (($row['usertype_id_usertype'] == 3) || ($row['usertype_id_usertype'] == 4)) {
                            $_SESSION['territoire'] = 0;
                        }

                        $_SESSION['header_logo'] = $row['territoire_id_territoire'];

						$_SESSION['type'] = $row['usertype_id_usertype'];
						$_SESSION['id_language'] = $row['language_id_language'];
						$_SESSION['extension_language'] = $row['extension_language'];
					}
				} else {
					$arr['msg'] = 'Bad idenfication';
					$arr['success'] = FALSE;
				}
			}
			mysql_free_result($result);
			mysql_close($link);

			break;
		case 'postgresql':
			// TODO
			break;
	}

	echo json_encode($arr);
?>