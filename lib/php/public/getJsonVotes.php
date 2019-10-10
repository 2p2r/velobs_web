<?php header('Content-Type: text/html; charset=UTF-8');
session_start();	
include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			if (DEBUG){
				error_log(date("Y-m-d H:i:s") . " - getJsonVotes.php, nb de votes à retourner :  ".$_GET['nb2return']."\n", 3, LOG_FILE);
			}
			$nbObservationsToReturn = 5;
			if (isset($_GET['nb2return']) && is_numeric($_GET['nb2return']) && $_GET['nb2return'] > 0){
				$nbObservationsToReturn = $_GET['nb2return'];
			}
			$sql = "SELECT count(*) as nb_votes, poi_poi_id, lib_subcategory, lib_pole, lib_territoire
			FROM `support_poi` 
			INNER JOIN poi ON poi.id_poi = support_poi.poi_poi_id 
			INNER JOIN pole ON poi.pole_id_pole = pole.id_pole 
			INNER JOIN territoire ON pole.territoire_id_territoire = territoire.id_territoire
			INNER JOIN subcategory ON poi.subcategory_id_subcategory = subcategory.id_subcategory 
			GROUP BY poi_poi_id 
			ORDER BY nb_votes desc 
			LIMIT " . $nbObservationsToReturn;
		
			$result = mysql_query($sql);
			$i = 0;
			
			while ($row = mysql_fetch_array($result)){
					$arr[$i]['nbVotes'] = $row['nb_votes'];
					$arr[$i]['id_poi'] = $row['poi_poi_id'];
					$arr[$i]['url'] = URL."/index.php?id=".$row['poi_poi_id'];
					$arr[$i]['categorie'] = $row['lib_subcategory'];
					$arr[$i]['territoire'] = $row['lib_territoire'] . " " . $row['lib_pole'];
					$i++;
			}
			echo '{"statistiques":'.json_encode($arr).'}';
		
			mysql_free_result($result);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>