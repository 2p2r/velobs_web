<?php
header ( 'Content-Type: text/html; charset=UTF-8' );
include_once '../key.php';

switch (SGBD) {
	case 'mysql' :
		if (DEBUG) {
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php \n", 3, LOG_FILE );
			error_log ( date ( "Y-m-d H:i:s" ) . " - bounds = ".$_POST['bounds']." \n", 3, LOG_FILE );
		}
		$link = mysql_connect ( DB_HOST, DB_USER, DB_PASS );
		mysql_select_db ( DB_NAME );
		mysql_query ( "SET NAMES utf8mb4" );
		$sql = "SELECT poi.*,
					commune.lib_commune,
					x(poi.geom_poi) AS X,
					y(poi.geom_poi) AS Y,
					subcategory.icon_subcategory,
					subcategory.lib_subcategory,
					status.lib_status,
					status.color_status,
					priorite.lib_priorite
					FROM poi ";
		if ($_POST ['getCount']){
		    $sql = "SELECT COUNT(DISTINCT(poi.id_poi)) as total_number_of_observations
					FROM poi ";
		}
		$sql .= "	INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory)
					INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune)
					INNER JOIN priorite ON (poi.priorite_id_priorite = priorite.id_priorite)
					INNER JOIN status ON (status.id_status = poi.status_id_status) ";
		if (isset ( $_POST ['id'] )) {
			$sqlappend .= " WHERE delete_poi = FALSE AND poi.id_poi = " . $_POST ['id'];
		} else {
			if (DEBUG) {
				error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php dateLastModif = ".$_POST ['dateLastModif']."\n", 3, LOG_FILE );
			}
			if ($_POST ['dateLastModif'] == NULL || $_POST ['dateLastModif'] == 'undefined') {
				$datesqlappend = '';
				// $datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) <= 365';
			} else {
				$datesqlappend = " AND (lastdatemodif_poi >= '".mysql_real_escape_string($_POST['dateLastModif'])."' OR datecreation_poi >= '".mysql_real_escape_string($_POST['dateLastModif'])."') ";
				if (DEBUG) {
					error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php datesqlappend = ".$datesqlappend."\n", 3, LOG_FILE );
				}
			}
			if (isset($_POST['bounds']) && $_POST['bounds'] != ''){
			    $boundsSQL = " AND ST_Within(poi.geom_poi,ST_GeomFromText('".$_POST['bounds']."') )=1 ";
			}
			if (isset ($_POST ['status']) && ($_POST ['status'] == "" || $_POST ['status'] == 'all'|| $_POST ['status'] == 'undefined')) {
				$statussqlappend = '';
			} else {
				$statussqlappend = ' AND status_id_status = ' . $_POST ['status'];
			}
			$listType = mysql_real_escape_string($_POST ['listType']);
			$sqlappend = " WHERE poi.geom_poi IS NOT NULL AND subcategory_id_subcategory IN ( " . $listType . ") AND poi.display_poi = TRUE 
					AND poi.fix_poi = FALSE 
					AND poi.moderation_poi = TRUE 
					AND priorite.non_visible_par_public = 0
					AND poi.delete_poi = 0 ";
			//une priorite a ete selectionnee, on n'affiche qu'elle
			if (isset($_POST ['priorite']) && $_POST ['priorite'] != "") {
				$sqlappend .= " AND priorite.id_priorite =  " . mysql_real_escape_string($_POST ['priorite']);
			} else{
			//aucune priorite n'a ete selectionnee, on n'affiche que celles visibles par défaut par le public 
				$sqlappend .= " AND priorite.visible_public_par_defaut =  1 ";
			}
			if (isset ( $_POST ["nbSupportMinimum"] ) && $_POST ["nbSupportMinimum"] != '' && $_POST ["nbSupportMinimum"] > 0) { // filter by status given by the collectivity
			    $sqlappend .= ' AND poi.id_poi IN (select poi_poi_id from support_poi group by poi_poi_id having count(*) >= '.$_POST ["nbSupportMinimum"].')';
			}
			if (isset ( $_POST ["alreadyLoadedObservations"] ) && $_POST ["alreadyLoadedObservations"] != '') { // filter by status given by the collectivity
			    $sqlappend .= ' AND poi.id_poi NOT IN ('.$_POST ["alreadyLoadedObservations"].')';
			}
			
			$sqlappend .= $datesqlappend . $statussqlappend . $boundsSQL;
		}
		$sql .= $sqlappend;
		$result = mysql_query ( $sql );
		if (DEBUG) {
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php sql = $sql\n", 3, LOG_FILE );
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php datesqlappend = $datesqlappend\n", 3, LOG_FILE );
		}
		
		if ($_POST ['getCount']){
		    
		    
		    while ( $row = mysql_fetch_array ( $result ) ) {
		        $total_number_of_observations = $row ['total_number_of_observations'];
		        
		    }
		    echo '{"total_number_of_observations":' . $total_number_of_observations . '}';
		}else{
		$i = 0;
		while ( $row = mysql_fetch_array ( $result ) ) {
			$arr [$i] ['id'] = $row ['id_poi'];
			$arr [$i] ['lib_subcategory'] = stripslashes ( $row ['lib_subcategory'] );
			$arr [$i] ['date'] = $row ['datecreation_poi'];
			$arr [$i] ['desc'] = stripslashes ( nl2br($row ['desc_poi']) );
			$arr [$i] ['repgt'] = stripslashes ( nl2br($row ['reponse_collectivite_poi']) );
			$arr [$i] ['reppole'] = stripslashes ( nl2br($row ['reponsepole_poi']) );
			$arr [$i] ['cmt'] = stripslashes ( nl2br($row ['commentfinal_poi']) );
			$arr [$i] ['prop'] = stripslashes ( nl2br($row ['prop_poi']) );
			$arr [$i] ['photo'] = $row ['photo_poi'];
			$arr [$i] ['num'] = stripslashes ( $row ['num_poi'] );
			$arr [$i] ['rue'] = stripslashes ( $row ['rue_poi'] );
			$arr [$i] ['commune'] = stripslashes ( $row ['lib_commune'] );
			$arr [$i] ['lib_priorite'] = stripslashes ( $row ['lib_priorite'] );
			$arr [$i] ['lib_status'] = stripslashes ( $row ['lib_status'] );
			$arr [$i] ['color_status'] = stripslashes ( $row ['color_status'] );
			// TODO : combiner icone de subcategory + priorité
			$arr [$i] ['icon'] = 'resources/icon/marker/' . $row ['icon_subcategory'] . '.png';
			$arr [$i] ['iconCls'] = $row ['icon_subcategory'];
			$arr [$i] ['lat'] = $row ['Y'];
			$arr [$i] ['lon'] = $row ['X'];
			$arr [$i] ['mail_poi'] = "***";
			$arr [$i] ['lastdatemodif_poi'] = $row ['lastdatemodif_poi'];
			//récupération des commentaires
			$sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $row ['id_poi'] . " AND display_commentaires = 'Modéré accepté'";
			$result2 = mysql_query ( $sql2 );
			$j = 0;
			while ( $row2 = mysql_fetch_array ( $result2 ) ) {
				$arr [$i] ['commentaires'] [$j] = stripslashes ( nl2br($row2 ['text_commentaires']) );
				$arr [$i] ['photos'] [$j] = stripslashes ( $row2 ['url_photo'] );
				$arr [$i] ['mail_commentaires'] [$j] = stripslashes ( $row2 ['mail_commentaires'] );
				$arr [$i] ['datecreation'] [$j] = stripslashes ( $row2 ['datecreation'] );
				$j ++;
			}
			$arr [$i] ['num_comments'] =$j;
			$arr [$i] ['num_accepted_comments'] =$j;
			//Récupération du soutien
			$sqlSupport = "SELECT count(*) FROM support_poi WHERE poi_poi_id = " . $row ['id_poi'];
			$resultSupport = mysql_query ( $sqlSupport );
			$arr [$i] ['support'] = mysql_result($resultSupport,0);
			$i ++;
		}
		if (DEBUG) {
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php Nombre d'observations correspondantes = " . $i."\n", 3, LOG_FILE );
		}
		echo '{"markers":' . json_encode ( $arr ) . '}';
		}
		
		mysql_free_result ( $result );
		mysql_close ( $link );
		break;
	case 'postgresql' :
		// TODO
		break;
}

?>