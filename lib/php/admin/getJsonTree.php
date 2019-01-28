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
				$whereClauseSQL = " display_subcategory = TRUE 
						 	AND p.pole_id_pole = " . $_SESSION ['pole'] . " 
						 	AND priorite.non_visible_par_collectivite = 0  
						 	AND delete_poi = FALSE 
						 	AND p.geom_poi IS NOT NULL 	
						 	AND moderation_poi = 1 
						 	AND p.display_poi = TRUE 
						 	AND p.fix_poi = FALSE	
						 	AND p.transmission_poi = TRUE ";
			} else if ($_SESSION ['role'] == 4) { // moderateur
				$whereClauseSQL = " display_subcategory = TRUE 
						 	AND p.pole_id_pole = " . $_SESSION ['pole'] . " 
						 	AND p.delete_poi = FALSE 
						 	AND p.geom_poi IS NOT NULL 
						 	AND p.display_poi = TRUE 
						 	AND p.fix_poi = FALSE ";
			}else if ($_SESSION ['role'] == 2) { // communaute de commune
				$whereClauseSQL = " display_subcategory = TRUE 
							AND moderation_poi = 1 
							AND display_poi = 1 
							AND commune_id_commune IN (" . str_replace ( ';', ',', $_SESSION ['territoire'] ) . ") 
							AND delete_poi = FALSE 
							AND priorite.non_visible_par_collectivite = 0 ";
				
				
			}else {
				$whereClauseSQL = " display_subcategory = TRUE 
						 	AND p.delete_poi = FALSE ";
			}
			
			$sql = "SELECT count(p.id_poi) as nbpoi, c.* FROM category AS c
                    INNER JOIN subcategory sc ON c.id_category = sc.category_id_category
                    INNER JOIN poi p ON p.subcategory_id_subcategory = sc.id_subcategory
                    INNER JOIN priorite ON (p.priorite_id_priorite = priorite.id_priorite)
                    WHERE $whereClauseSQL
                    GROUP BY
                        c.id_category, c.lib_category, c.icon_category, c.treerank_category, c.display_category
                    ORDER BY c.treerank_category ASC";
			$sql2 = "SELECT distinct(subcategory.id_subcategory),
                        subcategory.lib_subcategory,
                        subcategory.icon_subcategory,
                        COUNT(p.id_poi) as nb_poi
                        FROM subcategory
                        INNER JOIN poi p ON (p.subcategory_id_subcategory = subcategory.id_subcategory)
						INNER JOIN priorite ON (p.priorite_id_priorite = priorite.id_priorite)
                        WHERE category_id_category =  idCategory AND 
						 	$whereClauseSQL
				        GROUP BY subcategory.id_subcategory
						ORDER BY treerank_subcategory ASC";
			if (DEBUG) {
				error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getJsonTree.php $sql \n $sql2\n", 3, LOG_FILE );
			}
			$result = mysql_query ( $sql );
			while ( $row = mysql_fetch_array ( $result ) ) {
				$json .= "{";
				$json .= "'id_': '" . $row ['id_category'] . "',";
				$json .= "text: '" . addslashes ( $row ['lib_category'] ) . "',";
				$json .= "iconCls: '" . $row ['icon_category'] . "',";
				$json .= "expanded: true,";
				
				$sqlSubCategory =str_replace('idCategory',$row['id_category'],$sql2);
				if (DEBUG) {
					error_log ( date ( "Y-m-d H:i:s" ) . " - admin/getJsonTree.php $sqlSubCategory\n", 3, LOG_FILE );
				}
				$result2 = mysql_query ( $sqlSubCategory );
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