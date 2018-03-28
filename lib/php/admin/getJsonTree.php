<?php
header ( 'Content-Type: text/html; charset=UTF-8' );
session_start ();
include_once '../key.php';
if (DEBUG) {
	error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getJsonTree.php\n", 3, LOG_FILE );
}
if (isset ( $_SESSION ['user'] )) {
	switch (SGBD) {
		case 'mysql' :
			$link = mysql_connect ( DB_HOST, DB_USER, DB_PASS );
			mysql_select_db ( DB_NAME );
			mysql_query ( "SET NAMES utf8mb4" );
			
			$json = "[";
			
			if ($_SESSION ['role'] == 3) { // pole technique
				$sql = "SELECT count(p.id_poi) as nbpoi, c.* FROM category AS c
                    INNER JOIN subcategory sc ON c.id_category = sc.category_id_category
                    INNER JOIN poi p ON p.subcategory_id_subcategory = sc.id_subcategory
                    WHERE c.display_category = TRUE AND sc.display_subcategory = TRUE
                    AND p.transmission_poi = TRUE AND p.pole_id_pole = " . $_SESSION ['pole'] . " AND p.delete_poi = FALSE
                    GROUP BY
                        c.id_category, c.lib_category, c.icon_category, c.treerank_category, c.display_category
                    ORDER BY c.treerank_category ASC";
			} else {
				$sql = "SELECT count(p.id_poi) as nbpoi, c.* FROM category AS c
                    INNER JOIN subcategory sc ON c.id_category = sc.category_id_category
                    INNER JOIN poi p ON p.subcategory_id_subcategory = sc.id_subcategory
                    WHERE c.display_category = TRUE AND sc.display_subcategory = TRUE
                    GROUP BY
                        c.id_category, c.lib_category, c.icon_category, c.treerank_category, c.display_category
                    ORDER BY c.treerank_category ASC";
			}
			
			$result = mysql_query ( $sql );
			while ( $row = mysql_fetch_array ( $result ) ) {
				$json .= "{";
				$json .= "'id_': '" . $row ['id_category'] . "',";
				$json .= "text: '" . addslashes ( $row ['lib_category'] ) . "',";
				$json .= "iconCls: '" . $row ['icon_category'] . "',";
				$json .= "expanded: true,";
				
				$sql2 = "SELECT distinct(subcategory.id_subcategory),
                        subcategory.lib_subcategory,
                        subcategory.icon_subcategory,
                        COUNT(poi.id_poi) as nb_poi
                        FROM subcategory
                        INNER JOIN poi ON (poi.subcategory_id_subcategory = subcategory.id_subcategory)
                        WHERE display_subcategory = TRUE AND
                        category_id_category =  " . $row ['id_category'] .
				" 		GROUP BY subcategory.id_subcategory 
						ORDER BY treerank_subcategory ASC";
				
				// $sql2 = "SELECT ,
				// COUNT(poi.id_poi) as nb_poi, subcategory.* FROM subcategory WHERE display_subcategory = TRUE AND category_id_category = ".$row['id_category']." ORDER BY treerank_subcategory ASC";
				$result2 = mysql_query ( $sql2 );
				if (mysql_num_rows ( $result2 ) > 0) {
					$json .= "leaf: false,";
					$json .= "children: [";
					while ( $row2 = mysql_fetch_array ( $result2 ) ) {
						$json .= "{";
						$json .= "id: '" . $row2 ['id_subcategory'] . "',";
						$json .= "text: '" . addslashes ( $row2 ['lib_subcategory'] ) . " (" . $row2 ['nb_poi'] . ")',";
						$json .= "iconCls: '" . $row2 ['icon_subcategory'] . "',";
						$json .= "leaf: true,";
						$json .= "checked: false";
						$json .= "},";
					}
					$json = substr ( $json, 0, strlen ( $json ) - 1 );
					$json .= "]";
					$json .= "},";
				} else {
					$json .= "leaf: true";
					$json .= "},";
				}
			}
			$json = substr ( $json, 0, strlen ( $json ) - 1 );
			$json .= "]";
			
			echo $json;
			
			mysql_free_result ( $result );
			mysql_free_result ( $result2 );
			mysql_close ( $link );
			
			break;
		case 'postgresql' :
			// TODO
			break;
	}
}

?>