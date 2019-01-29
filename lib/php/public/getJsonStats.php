<?php header('Content-Type: text/html; charset=UTF-8');
session_start();	
include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
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
				$sqlGetStats = "SELECT COUNT(p.id_poi) as nb_poi, s.id_status, s.lib_status, s.color_status
					FROM poi p
					INNER JOIN status s ON (p.status_id_status = s.id_status)
					INNER JOIN priorite ON (p.priorite_id_priorite = priorite.id_priorite)
					WHERE p.status_id_status =  ".$row['id_status'] . "
						AND p.delete_poi = 0 ";
				$sqlappend = "";
				if (isset($_SESSION ["type"])){
				if ($_SESSION ["type"] == 2) { // is communaute de communes
					$sqlappend .= ' AND p.moderation_poi = 1 
							AND p.commune_id_commune IN (' . str_replace ( ';', ',', $_SESSION ['territoire'] ) . ') 
							AND priorite.non_visible_par_collectivite = 0 ';
				} elseif ($_SESSION ["type"] == 3) { // is pole technique
					$sqlappend .= ' AND p.moderation_poi = 1  
							AND p.transmission_poi = 1 
							AND p.pole_id_pole = ' . $_SESSION ["pole"] . ' 
							AND priorite.non_visible_par_collectivite = 0 ';
				} elseif ($_SESSION ["type"] == 4) { // is moderateur
					$sqlappend .= ' AND p.pole_id_pole IN (' . $_SESSION ["pole"] . ') ';
				}
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " - getJsonStats.php ".$_SESSION["type"]."\n", 3, LOG_FILE);
				}
				}
				$sqlGetStats .= $sqlappend;
				
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " - getJsonStats.php ".$sqlGetStats."\n", 3, LOG_FILE);
				}
				$result2 = mysql_query($sqlGetStats);
				while ($row2 = mysql_fetch_array($result2)){	
					$arr[$i]['status'] = addslashes($row2['lib_status']);
					$arr[$i]['nb_poi'] = $row2['nb_poi'];
					$arr[$i]['color_status'] = addslashes($row2['color_status']);
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