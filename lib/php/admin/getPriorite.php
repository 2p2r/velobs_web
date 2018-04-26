<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			
			$sql = "SELECT id_priorite, lib_priorite FROM priorite ";
		if (isset($_SESSION['user'])) {
		
				
				if ($_SESSION ["type"] == 3 || $_SESSION ["type"] == 2){
					$sql .= " WHERE priorite.non_visible_par_collectivite = 0 ";
				}
				
				
				
	}else{
		$sql .= " WHERE priorite.non_visible_par_public = 0 ";
	}
	$sql .= " ORDER BY lib_priorite ASC";
	
	$result = mysql_query($sql);
	$i = 0;
	while ($row = mysql_fetch_array($result)){
		$arr[$i]['id_priorite'] = $row['id_priorite'];
		$arr[$i]['lib_priorite'] = stripslashes($row['lib_priorite']);
		$arr[$i]['non_visible_par_collectivite'] = stripslashes($row['non_visible_par_collectivite']);
		$arr[$i]['non_visible_par_public'] = stripslashes($row['non_visible_par_public']);
		$arr[$i]['priorite_sujet_email'] = stripslashes($row['priorite_sujet_email']);
		$arr[$i]['priorite_corps_email'] = stripslashes($row['priorite_corps_email']);
		$arr[$i]['besoin_commentaire_association'] = stripslashes($row['besoin_commentaire_association']);
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
	
?>