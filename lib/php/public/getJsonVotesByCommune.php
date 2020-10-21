<?php header('Content-Type: text/html; charset=UTF-8');
session_start();	
include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			if (DEBUG){
				error_log(date("Y-m-d H:i:s") . " - getJsonVotesByCommune.php, nb de votes à retourner :  ".$_GET['nb2return']."\r\n", 3, LOG_FILE);
			}
			$nbObservationsToReturn = 5;
			if (isset($_GET['nb2return']) && is_numeric($_GET['nb2return']) && $_GET['nb2return'] > 0){
				$nbObservationsToReturn = $_GET['nb2return'];
			}
			$sql = "SELECT count(*) as nb_votes, poi_poi_id, lib_subcategory, lib_pole, lib_territoire, lib_commune 
			FROM `support_poi` 
			INNER JOIN poi ON poi.id_poi = support_poi.poi_poi_id 
			INNER JOIN pole ON poi.pole_id_pole = pole.id_pole
			INNER JOIN commune ON poi.commune_id_commune = commune.id_commune 
			INNER JOIN territoire ON pole.territoire_id_territoire = territoire.id_territoire
			INNER JOIN subcategory ON poi.subcategory_id_subcategory = subcategory.id_subcategory 
			GROUP BY poi_poi_id 
			ORDER BY territoire.lib_territoire ASC, commune.lib_commune ASC, nb_votes DESC, poi.id_poi ASC";

			$result = mysql_query($sql);
			$i = 0;
			
			while ($row = mysql_fetch_array($result)){
				if (count($arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']]) >  $nbObservationsToReturn){
					next;
				}
					$arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['nbVotes'] = $row['nb_votes'];
					$arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['id_poi'] = $row['poi_poi_id'];
					$arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['url'] = URL."/index.php?id=".$row['poi_poi_id'];
					$arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['categorie'] = $row['lib_subcategory'];
					$i++;
			}
			$topVotedText = "";
			foreach(array_keys($arr) as $territoire){
			$topVotedText .= "<div class=\"voteTerritoire\"><H1>Territoire : " . $territoire ."</H1></div>\r\n";
				foreach(array_keys($arr[$territoire]) as $pole){
					$topVotedText .=  "<div class=\"votePole\"><H2>Pôle : " . $pole ."</H2></div>\r\n";
					foreach(array_keys($arr[$territoire][$pole]) as $commune){
						$topVotedText .=  "<div class=\"voteCommune\"><H3>Commune : " . $commune ."</H3>\r\n";
						$topVotedText .=  "<ul>";
						foreach(array_keys($arr[$territoire][$pole][$commune]) as $mostVoted){
							$topVotedText .=  "<li>Nombre de votes : ".$arr[$territoire][$pole][$commune][$mostVoted]['nbVotes']." votes pour l'observation <a href=\"".$arr[$territoire][$pole][$commune][$mostVoted]['url']."\" targe=\"_blank\">".$arr[$territoire][$pole][$commune][$mostVoted]['id_poi']."</a> (catégorie ".$arr[$territoire][$pole][$commune][$mostVoted]['categorie'].")</li>\r\n";
						
						}
						$topVotedText .=  "</ul></div>\r\n";

					}
				}
			}
			
			//echo '{"statistiques":'.json_encode($arr).'}';
			$html = "<html><head><title>Observations ouvertes les plus votées, par territoire et commune</title></head><body>\r\n";
			$html.= "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../resources/css/public.css?v1.7.1\" />\r\n";
			echo $html;
			echo $topVotedText;
			echo "</body></html>";
			mysql_free_result($result);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>