<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';

	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				if (DEBUG) {
					error_log(date("Y-m-d H:i:s") . " - getMarkerPole.php, listType " . $_GET['listType'] . " , ou id = ".$_GET['id']."\n", 3, LOG_FILE );
				}
				$sql = "SELECT *, commune.lib_commune, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y, subcategory.icon_subcategory FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN priorite ON (poi.priorite_id_priorite = priorite.id_priorite) WHERE ";
				$whereClause = '';
				if (isset($_GET['id'])) {
					 $whereClause .= " delete_poi = FALSE AND poi.id_poi = ".$_GET['id'];
				} else {
					$listType = $_GET['listType'];
// 					$tabListType = preg_split('#,#', $listType);
// 						$whereClause = "  poi.geom_poi IS NOT NULL AND ( ";
// 					for ($i = 0; $i < count($tabListType); $i++) {
// 						$whereClause .= " subcategory_id_subcategory = ".$tabListType[$i]." OR";
// 					}
// 					$whereClause .= substr($whereClause, 0, strlen($whereClause)-3);
					$whereClause .= " priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 AND delete_poi = FALSE AND poi.geom_poi IS NOT NULL AND subcategory_id_subcategory IN (".$listType.")" ;
					$whereClause .= " AND moderation_poi = 1 AND poi.display_poi = TRUE AND poi.fix_poi = FALSE AND poi.transmission_poi = TRUE AND poi.pole_id_pole = ".$_SESSION['pole']." AND poi.delete_poi = FALSE ";

				}
				$sql .= $whereClause;
				if (DEBUG) {
					error_log(date("Y-m-d H:i:s") . " - getMarkerPole.php, sql " . $sql."\n", 3, LOG_FILE );
				}
				$result = mysql_query($sql);

				$i = 0;
				while ($row = mysql_fetch_array($result)) {
				$arr[$i]['id'] = $row['id_poi'];
				$arr[$i]['lib'] = stripslashes($row['lib_poi']);
				$arr[$i]['date'] = $row['datecreation_poi'];
				$arr[$i]['desc'] = stripslashes($row['desc_poi']);
				$arr[$i]['repgt'] = stripslashes($row['reponsegrandtoulouse_poi']);
				$arr[$i]['cmt'] = stripslashes($row['commentfinal_poi']);
				$arr[$i]['prop'] = stripslashes($row['prop_poi']);
				$arr[$i]['photo'] = $row['photo_poi'];
				$arr[$i]['num'] = stripslashes($row['num_poi']);
				$arr[$i]['rue'] = stripslashes($row['rue_poi']);
				$arr[$i]['commune'] = stripslashes($row['lib_commune']);
				$arr[$i]['reppole'] = stripslashes($row['reponsepole_poi']);

				$arr[$i]['traite'] = $row['traiteparpole_poi'];

				/*$arr[$i]['icon'] = 'resources/icon/marker/'.$row['icon_subcategory'].'.png';
				$arr[$i]['iconCls'] = $row['icon_subcategory'];*/

				if ($row['lib_priorite'] == 'DONE') {
					$arr[$i]['icon'] = 'resources/icon/marker/done.png';
					$arr[$i]['iconCls'] = 'done';
				} else {
					$arr[$i]['icon'] = 'resources/icon/marker/'.$row['icon_subcategory'].'.png';
					$arr[$i]['iconCls'] = $row['icon_subcategory'];
				}

				$arr[$i]['lat'] = $row['Y'];
				$arr[$i]['lon'] = $row['X'];

					$i++;
				}
				if (DEBUG) {
					error_log(date("Y-m-d H:i:s") . " - getMarkerPole.php, $i observations retournées \n", 3, LOG_FILE );
				}
				echo '{"markers":'.json_encode($arr).'}';

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

?>