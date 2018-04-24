<?php
header ( 'Content-Type: text/html; charset=UTF-8' );
include_once '../key.php';

switch (SGBD) {
	case 'mysql' :
		if (DEBUG) {
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php \n", 3, LOG_FILE );
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
					FROM poi
					INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory)
					INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune)
					INNER JOIN priorite ON (poi.priorite_id_priorite = priorite.id_priorite)
					INNER JOIN status ON (status.id_status = poi.status_id_status) ";
		if (isset ( $_GET ['id'] )) {
			$sqlappend .= " WHERE delete_poi = FALSE AND poi.id_poi = " . $_GET ['id'];
		} else {
			
			if ($_GET ['date'] == NULL) {
				$datesqlappend = '';
				// $datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) <= 365';
			} else {
				switch ($_GET ['date']) {
					case '1year' :
						$datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) <= 365';
						break;
					case '2year' :
						$datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) > 365 AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) <= 730';
						break;
					case '3year' :
						$datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) > 730';
						break;
					case 'all' :
						$datesqlappend = '';
						break;
					default :
						$datesqlappend = '';
						// $datesqlappend = ' AND (TO_DAYS(NOW()) - TO_DAYS(datecreation_poi)) <= 365';
						break;
				}
			}
			
			if ($_GET ['status'] == NULL || $_GET ['status'] == 'all') {
				$statussqlappend = '';
			} else {
				$statussqlappend = ' AND status_id_status = ' . $_GET ['status'];
			}
			$listType = $_GET ['listType'];
			$tabListType = preg_split ( '#,#', $listType );
			$sqlappend = " WHERE poi.geom_poi IS NOT NULL AND ( ";
			for($i = 0; $i < count ( $tabListType ); $i ++) {
				$sqlappend .= " subcategory_id_subcategory = " . $tabListType [$i] . " OR";
			}
			$sqlappend = substr ( $sqlappend, 0, strlen ( $sqlappend ) - 3 );
			$sqlappend .= " ) AND poi.display_poi = TRUE 
					AND poi.fix_poi = FALSE 
					AND poi.moderation_poi = TRUE 
					AND priorite.non_visible_par_public = 0
					AND poi.delete_poi = 0 ";
			//TODO : check exclusion, delete this equest when the priority combo is added
			if ($_GET ['done'] == 0) {
				$sqlappend .= " AND priorite.id_priorite <> 6 ";
			} else {
				$sqlappend .= " AND priorite.id_priorite = 6 ";
			}
			
			$sqlappend .= $datesqlappend . $statussqlappend;
		}
		$sql .= $sqlappend;
		$result = mysql_query ( $sql );
		if (DEBUG) {
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php sql = $sql\n", 3, LOG_FILE );
		}
		$i = 0;
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
			$arr [$i] ['lib_priorite'] = stripslashes ( $row ['lib_priorite'] );
			$arr [$i] ['lib_status'] = stripslashes ( $row ['lib_status'] );
			$arr [$i] ['color_status'] = stripslashes ( $row ['color_status'] );
			// TODO : combiner icone de subcategory + priorité
			$arr [$i] ['icon'] = 'resources/icon/marker/' . $row ['icon_subcategory'] . '.png';
			$arr [$i] ['iconCls'] = $row ['icon_subcategory'];
			$arr [$i] ['lat'] = $row ['Y'];
			$arr [$i] ['lon'] = $row ['X'];
			$arr [$i] ['lastdatemodif_poi'] = $row ['lastdatemodif_poi'];
			$sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $row ['id_poi'] . " AND display_commentaires = \'Modéré accepté\'";
			$result2 = mysql_query ( $sql2 );
			$j = 0;
			while ( $row2 = mysql_fetch_array ( $result2 ) ) {
				$arr [$i] ['commentaires'] [$j] = stripslashes ( $row2 ['text_commentaires'] );
				$arr [$i] ['photos'] [$j] = stripslashes ( $row2 ['url_photo'] );
				$arr [$i] ['mail_commentaires'] [$j] = stripslashes ( $row2 ['mail_commentaires'] );
				$arr [$i] ['datecreation'] [$j] = stripslashes ( $row2 ['datecreation'] );
				$j ++;
			}
			
			$i ++;
		}
		if (DEBUG) {
			error_log ( date ( "Y-m-d H:i:s" ) . " - public/getMarker.php Nombre d'observations correspondantes = " . $i, 3, LOG_FILE );
		}
		echo '{"markers":' . json_encode ( $arr ) . '}';
		
		mysql_free_result ( $result );
		mysql_close ( $link );
		break;
	case 'postgresql' :
		// TODO
		break;
}

?>