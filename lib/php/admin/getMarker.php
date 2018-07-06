<?php
header ( 'Content-Type: text/html; charset=UTF-8' );
session_start ();
include_once '../key.php';

if (isset ( $_SESSION ['user'] )) {
	switch (SGBD) {
		case 'mysql' :
			if (DEBUG) {
				error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php\n", 3, LOG_FILE );
			}
			$link = mysql_connect ( DB_HOST, DB_USER, DB_PASS );
			mysql_select_db ( DB_NAME );
			mysql_query ( "SET NAMES utf8mb4" );
			$sql = "SELECT DISTINCT(poi.id_poi) AS idd,
						poi.*, 
						commune.lib_commune, 
						x(poi.geom_poi) AS X, 
						y(poi.geom_poi) AS Y, 
						subcategory.icon_subcategory,
						subcategory.lib_subcategory,
						priorite.lib_priorite,
						lib_pole,
						lib_status,
						color_status,
						users.lib_users
					FROM poi 
					INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) 
					INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) 
					INNER JOIN priorite ON (poi.priorite_id_priorite = priorite.id_priorite)
					INNER JOIN pole ON (poi.pole_id_pole = pole.id_pole) 
					INNER JOIN status ON (poi.status_id_status = status.id_status) 
					LEFT JOIN users ON (poi.lastmodif_user_poi = users.id_users)";
			$sqlappend = ' WHERE ';
			// TODO : chek user type and pole
			
			if (isset ( $_GET ['id'] )) {
				if (DEBUG) {
					error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php avec id\n", 3, LOG_FILE );
				}
				$sqlappend .= " delete_poi = FALSE AND poi.id_poi = " . $_GET ['id'];
			} else {
				$listType = $_GET ['listType'];
				if (DEBUG) {
					error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php avec listType $listType\n", 3, LOG_FILE );
				}
				// $tabListType = preg_split ( '#,#', $listType );
				$sqlappend .= " poi.geom_poi IS NOT NULL AND subcategory_id_subcategory IN ( " . $listType . ") AND poi.display_poi = TRUE AND poi.fix_poi = FALSE AND delete_poi = FALSE ";
				if (isset ( $_GET ['displayObservationsToBeAnalyzedByComCom'] ) && $_GET ['displayObservationsToBeAnalyzedByComCom'] == 1 && $_SESSION ["type"] == 2) {
					$sqlappend .= " AND (reponse_collectivite_poi IS NULL OR reponse_collectivite_poi = '') AND (transmission_poi IS NULL OR transmission_poi = 0) ";
				}
				if (isset ( $_GET ['commentToModerate'] ) && $_GET ['commentToModerate'] == 1 && ($_SESSION ["type"] == 4 || $_SESSION ["type"] == 1)) {
					$sql .= " INNER JOIN commentaires ON (poi.id_poi = commentaires.poi_id_poi) ";
					$sqlappend .= " AND commentaires.display_commentaires = 'Non modéré' ";
				}
			  if (isset ( $_GET ['priority'] ) && $_GET ['priority'] != '') {
					$sqlappend .= " AND poi.priorite_id_priorite = " . $_GET ['priority'] . ' ';
			  }
				
				if (DEBUG) {
					error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php displayObservationsToBeAnalyzedByPole = " . $_GET ['displayObservationsToBeAnalyzedByPole'] . ", type = " . $_SESSION ["type"] . "\n", 3, LOG_FILE );
				}
				if (isset ( $_GET ['displayObservationsToBeAnalyzedByPole'] ) && $_GET ['displayObservationsToBeAnalyzedByPole'] == 1 && $_SESSION ["type"] == 3) {
					$sqlappend .= " AND (reponsepole_poi is NULL OR reponsepole_poi = '') AND (traiteparpole_poi IS NULL OR traiteparpole_poi = 0) ";
				}
			}
			$whereSelectCommentAppend = '';
			if ($_SESSION ["type"] == 2) { // is communaute de communes
				$sqlappend .= ' AND moderation_poi = 1 
						AND commune_id_commune IN (' . str_replace ( ';', ',', $_SESSION ['territoire'] ) . ') 
						AND priorite.non_visible_par_collectivite = 0 ';
				$whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
			} elseif ($_SESSION ["type"] == 3) { // is pole technique
				$sqlappend .= ' AND moderation_poi = 1  
						AND transmission_poi = 1 
						AND poi.pole_id_pole = ' . $_SESSION ["pole"] . ' 
						AND priorite.non_visible_par_collectivite = 0 ';
				$whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
			} elseif ($_SESSION ["type"] == 4) { // is moderateur
				$sqlappend .= ' AND poi.pole_id_pole = ' . $_SESSION ["pole"] . ' ';
			}
			
			if (isset ( $_GET ["status"] ) && $_GET ["status"] != '') { // filter by status given by the collectivity
				$sqlappend .= ' AND poi.status_id_status = ' . $_GET ["status"];
			}
			if ($_GET ['dateLastModif'] == NULL || $_GET ['dateLastModif'] == 'undefined') {
				$datesqlappend = '';
				// $datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) <= 365';
			} else {
				$datesqlappend = " AND (lastdatemodif_poi >= '" . mysql_real_escape_string ( $_GET ['dateLastModif'] ) . "' OR datecreation_poi >= '" . mysql_real_escape_string ( $_GET ['dateLastModif'] ) . "') ";
				if (DEBUG) {
					error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php datesqlappend = " . $datesqlappend . "\n", 3, LOG_FILE );
				}
			}
			$sql .= $sqlappend . $datesqlappend;
			if (DEBUG) {
				error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php sql = $sql\n", 3, LOG_FILE );
			}
			$result = mysql_query ( $sql );
			$i = 0;
			if (DEBUG) {
				error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php avant while\n", 3, LOG_FILE );
			}
			while ( $row = mysql_fetch_array ( $result ) ) {
				$arr [$i] ['id'] = $row ['id_poi'];
				$arr [$i] ['lib_subcategory'] = stripslashes ( $row ['lib_subcategory'] );
				$arr [$i] ['date'] = $row ['datecreation_poi'];
				$arr [$i] ['desc'] = stripslashes ( $row ['desc_poi'] );
				$arr [$i] ['repgt'] = stripslashes ( $row ['reponse_collectivite_poi'] );
				$arr [$i] ['cmt'] = stripslashes ( $row ['commentfinal_poi'] );
				$arr [$i] ['prop'] = stripslashes ( $row ['prop_poi'] );
				$arr [$i] ['photo'] = $row ['photo_poi'];
				$arr [$i] ['num'] = stripslashes ( $row ['num_poi'] );
				$arr [$i] ['rue'] = stripslashes ( $row ['rue_poi'] );
				$arr [$i] ['commune'] = stripslashes ( $row ['lib_commune'] );
				$arr [$i] ['display_poi'] = stripslashes ( $row ['display_poi'] );
				$arr [$i] ['fix_poi'] = stripslashes ( $row ['fix_poi'] );
				$arr [$i] ['lib_priorite'] = stripslashes ( $row ['lib_priorite'] );
				$arr [$i] ['lib_pole'] = stripslashes ( $row ['lib_pole'] );
				$arr [$i] ['transmission_poi'] = stripslashes ( $row ['transmission_poi'] );
				$arr [$i] ['reponsepole_poi'] = stripslashes ( $row ['reponsepole_poi'] );
				$arr [$i] ['traiteparpole_poi'] = stripslashes ( $row ['traiteparpole_poi'] );
				$arr [$i] ['moderation_poi'] = stripslashes ( $row ['moderation_poi'] );
				if ($_SESSION ["type"] == 4 || $_SESSION ["type"] == 1) {
					$arr [$i] ['mail_poi'] = stripslashes ( $row ['mail_poi'] );
				}else{
					$arr [$i] ['mail_poi'] = "******";
				}
				$arr [$i] ['observationterrain_poi'] = stripslashes ( $row ['observationterrain_poi'] );
				$arr [$i] ['lib_status'] = stripslashes ( $row ['lib_status'] );
				$arr [$i] ['color_status'] = stripslashes ( $row ['color_status'] );
				$arr [$i] ['icon'] = 'resources/icon/marker/' . $row ['icon_subcategory'] . '.png';
				$arr [$i] ['iconCls'] = $row ['icon_subcategory'];
				$arr [$i] ['lastmodif_user_poi'] = $row ['lib_users'];
				$arr [$i] ['lat'] = $row ['Y'];
				$arr [$i] ['lon'] = $row ['X'];
				$arr [$i] ['lastdatemodif_poi'] = $row ['lastdatemodif_poi'];
				$sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $row ['id_poi'] . " " . $whereSelectCommentAppend;
				
				$result2 = mysql_query ( $sql2 );
				$j = 0;
				$comments = '<b>Commentaires</b><br />';
				$acceptedCommentCount = 0;
				while ( $row2 = mysql_fetch_array ( $result2 ) ) {
					$arr [$i] ['commentaires'] [$j] = stripslashes ( $row2 ['text_commentaires'] );
					$arr [$i] ['photos'] [$j] = stripslashes ( $row2 ['url_photo'] );
					if ($_SESSION ["type"] == 4 || $_SESSION ["type"] == 1) {
						$arr [$i] ['mail_commentaires'] [$j] = stripslashes ( $row2 ['mail_commentaires'] );
					}else{
						$arr [$i] ['mail_commentaires'] [$j] = "******";
					}
					$arr [$i] ['datecreation'] [$j] = stripslashes ( $row2 ['datecreation'] );
					$arr [$i] ['affiche'] [$j] = stripslashes ( $row2 ['display_commentaires'] );
					
					if ($_SESSION ["type"] == 4 || $_SESSION ["type"] == 1) {
						$color = 'green';
						if ($row2 ['display_commentaires'] == 'Non modéré') {
							$color = 'orange';
						} else if ($row2 ['display_commentaires'] == 'Modéré refusé') {
							$color = 'red';
						}
						$comments .= '<ul><li style="color:' . $color . ';">' . ($j+1) . '. ';
						if ($row2 ['datecreation'] != '0000-00-00 00:00:00') {
							$comments .= 'Ajouté le ' . $row2 ['datecreation'] . '';
						} else {
							$comments .= 'Ajouté le ?';
						}
						if ($row2 ['mail_commentaires'] != '') {
							$comments .= ", par " . $row2 ['mail_commentaires'] . " : ";
						} else {
							$comments .= ', par ? : ';
						}
						
						$comments .= nl2br ( $row2 ['text_commentaires'] ) . '</i></li>';
						if ($row2 ['url_photo'] != "") {
							$comments .= '<li><a href="./resources/pictures/' . $row2 ['url_photo'] . '" target="_blank">Photo associée</a></li>';
						}
						$comments .= '</ul><hr />';
					} else if ($_SESSION ["type"] == 2 || $_SESSION ["type"] == 3) {
						if ($row2 ['display_commentaires'] == 'Modéré accepté') {
							$acceptedCommentCount ++;
							$comments .= '<ul><li>' . $acceptedCommentCount . '. ';
							if ($row2 ['datecreation'] != '0000-00-00 00:00:00') {
								$comments .= 'Ajouté le ' . $row2 ['datecreation'] . ' : ';
							} else {
								$comments .= 'Ajouté le ? : ';
							}
							$comments .= nl2br ( $row2 ['text_commentaires'] ) . '</i></li>';
							if ($row2 ['url_photo'] != "") {
								$comments .= '<li><a href="./resources/pictures/' . $row2 ['url_photo'] . '" target="_blank">Photo associée</a></li>';
							}
							$comments .= '</ul><hr />';
						}
					}
					
					$j ++;
				}
				$arr [$i] ['num_comments'] = $j;
				$arr [$i] ['num_accepted_comments'] = $acceptedCommentCount;
				
				if ($j > 0) {
					if ($_SESSION ["type"] == 4 || $_SESSION ["type"] == 1) {
						$comments .= "Cliquer sur le bouton \"Commentaires\" ci-dessous pour le(s) modérer.";
					} else {
						$arr [$i] ['num_comments'] = $acceptedCommentCount;
						if ($acceptedCommentCount > 0) {
							$comments .= "Cliquer sur le bouton \"Commentaires\" ci-dessous pour le(s) afficher en vue tableau.";
						} else {
							$comments .= "Encore aucun commentaire associé";
						}
					}
				} else {
					$comments .= "Encore aucun commentaire associé";
				}
				
				$arr [$i] ['comments'] = stripslashes ( $comments );
				
				$i ++;
			}
			if (DEBUG) {
				error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getMarker.php retour json avec $i obs\n", 3, LOG_FILE );
			}
			echo '{"markers":' . json_encode ( $arr ) . '}';
			
			mysql_free_result ( $result );
			mysql_close ( $link );
			break;
		case 'postgresql' :
			// TODO
			break;
	}
}

?>