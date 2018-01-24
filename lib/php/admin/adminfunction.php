<?php
	include_once '../key.php';
	include_once '../commonfunction.php';	
	
	/*	List of functions
	 * 		- getMarkerIcon
	 * 		- updateMarkerIcon 
	 * 
	 *		- getCategory
	 * 		- updateCategory
	 * 		- createCategory
	 * 		- deleteCategorys
	 * 
	 * 		- getSubCategory
	 * 		- updateSubCategory
	 * 		- createSubCategory
	 * 		- deleteSubCategorys
	 * 
	 * 		- getPoi
	 * 		- updatePoi
	 * 		- deletePois
	 * 		- deletePoisCorbeille
	 * 
	 *		- getCommune
	 * 		- updateCommune
	 * 		- createCommune
	 * 		- deleteCommunes
	 * 
	 *		- getPole
	 * 		- updatePole
	 * 		- createPole
	 * 		- deletePoles
	 * 
	 *		- getQuartier
	 * 		- updateQuartier
	 * 		- createQuartier
	 * 		- deleteQuartiers
	 * 
	 *		- getPriorite
	 * 		- updatePriorite
	 * 		- createPriorite
	 * 		- deletePriorites
	 * 
	 *		- getStatus
	 * 		- updateStatus
	 * 		- createStatus
	 * 		- deleteStatuss
	 *
	 *		- getUser
	 * 		- updateUser
	 * 		- createUser
	 * 		- deleteUsers
	 * 
	 * 		- resetPhotoPoi
	 * 
	 * 		- isModerate
	 * 
	 * 		- updateGeoPoi
	 * 		- resetGeoPoi
	 * 
	 * 		- updateGeoDefaultMap
	 * 
	 * 		- createPublicPoi
	 * 
	 * 		- isPropPublic
	 * 
	 * 		- normalize
	 * 
	 * 		- is_in_polygon
	 *
	 *	  - getNumPageIdParam
	 *
	 *	  - getComments
	 *	  - displayComment
	 *	  - editComment
	 *	  - getPhotos
	 * 
	 */ 


	/*	Function name	: getMarkerIcon
	 * 	Input			:
	 * 	Output			:
	 * 	Object			: populate icon grid
	 * 	Date			: Jan. 18, 2012
	 */

	function getMarkerIcon($start, $limit){ 
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$sql = "SELECT * FROM iconmarker ORDER BY id_iconmarker ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_icon'] = $row['id_iconmarker'];
						$arr[$i]['lib_icon'] = $row['name_iconmarker'];
						$arr[$i]['urllib_icon'] = $row['urlname_iconmarker'];
						$arr[$i]['color_icon'] = $row['color_iconmarker'];
						$arr[$i]['img_icon'] = 'resources/icon/marker/'.$arr[$i]['urllib_icon'].'.png';
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				mysql_free_result($result);
				mysql_close($link);
				
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/*	Function name	: updateMarkerIcon
	 * 	Input			:
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update icon grid
	 * 	Date			: Jan. 19, 2012
	 */
	
	function updateMarkerIcon() {
		$id_iconmarker = $_POST['id_icon'];
		$name_iconmarker = $_POST['lib_icon'];
		$color_iconmarker = $_POST['color_icon'];
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$sql = "UPDATE iconmarker SET name_iconmarker = '".$name_iconmarker."', color_iconmarker = '".$color_iconmarker."' WHERE id_iconmarker = ".$id_iconmarker;
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	 
	 
	/* 	Function name 	: getCategory
	 * 	Input			: start, limit 
	 * 	Output			: json categories
	 * 	Object			: populate category grid
	 * 	Date			: Jan. 18, 2012
	 */
	
	function getCategory($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM category ORDER BY lib_category ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_category'] = $row['id_category'];
						$arr[$i]['lib_category'] = stripslashes($row['lib_category']);
						$arr[$i]['icon_category'] = $row['icon_category'];
						$arr[$i]['treerank_category'] = $row['treerank_category'];
						$arr[$i]['display_category'] = $row['display_category'];
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: updateCategory
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update category grid
	 * 	Date			: Jan. 18, 2012
	 */
	
	function updateCategory() {
		$id_category = $_POST['id_category'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (isset($_POST['display_category'])) {
					$display_category = $_POST['display_category'];
					$sql = "UPDATE category SET display_category = $display_category WHERE id_category = $id_category";
				} else {
					$lib_category = mysql_real_escape_string($_POST['lib_category']);
					$icon_category = mysql_real_escape_string($_POST['icon_category']);
					$sql = "UPDATE category SET lib_category = '$lib_category', icon_category = '$icon_category' WHERE id_category = $id_category";
				}
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}


	/* 	Function name 	: createCategory
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create category
	 * 	Date			: Jan. 19, 2012
	 */

	function createCategory() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_category = mysql_real_escape_string($_POST['lib_category']);
				$icon_category = mysql_real_escape_string($_POST['icon_category']);	
				$display_category = $_POST['display_category'];
				
				$sql = "SELECT max(treerank_category) AS max FROM category";
				$result = mysql_query($sql);
				if (mysql_result($result, 0) == NULL) {
					$treerank_category = 0;
				} else {
					$treerank_category = mysql_result($result, 0);
					$treerank_category += 1;			
				}
				
				$sql = "INSERT INTO category (lib_category, icon_category, treerank_category, display_category) VALUES ('$lib_category', '$icon_category', $treerank_category, $display_category)";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: deleteCategorys
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete category(s)
	 * 	Date			: Jan. 19, 2012
	 */
	
	function deleteCategorys() {
		$ids = $_POST['ids'];
		$idcategorys = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idcategorys) < 1){
					echo '0';
				} else if (sizeof($idcategorys) == 1){
					$sql = "DELETE FROM category WHERE id_category = ".$idcategorys[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM category WHERE ";
					for ($i = 0; $i < sizeof($idcategorys); $i++){
						$sql = $sql . "id_category = ".$idcategorys[$i];
						if ($i < sizeof($idcategorys) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}


	/* 	Function name 	: getSubCategory
	 * 	Input			: start, limit 
	 * 	Output			: json subcategories
	 * 	Object			: populate subcategory grid
	 * 	Date			: Jan. 31, 2012
	 */
	
	function getSubCategory($start, $limit) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM subcategory INNER JOIN category ON (category.id_category = subcategory.category_id_category) ORDER BY treerank_subcategory ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_subcategory'] = $row['id_subcategory'];
						$arr[$i]['lib_subcategory'] = stripslashes($row['lib_subcategory']);
						$arr[$i]['icon_subcategory'] = $row['icon_subcategory'];
						$arr[$i]['lib_category'] = stripslashes($row['lib_category']);
						$arr[$i]['display_subcategory'] = $row['display_subcategory'];
						$arr[$i]['proppublic_subcategory'] = $row['proppublic_subcategory'];
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
	}
	
	
	/* 	Function name 	: updateSubCategory
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update subcategory grid
	 * 	Date			: Jan. 31, 2012
	 */
		
	function updateSubCategory() {
		$id_subcategory = $_POST['id_subcategory'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				if (isset($_POST['display_subcategory'])) {
					$display_subcategory = $_POST['display_subcategory'];
					$sql = "UPDATE subcategory SET display_subcategory = $display_subcategory WHERE id_subcategory = $id_subcategory";
					$result = mysql_query($sql);
				} else if (isset($_POST['proppublic_subcategory'])) {
					$proppublic_subcategory = $_POST['proppublic_subcategory'];
					$sql = "UPDATE subcategory SET proppublic_subcategory = $proppublic_subcategory WHERE id_subcategory = $id_subcategory";
					$result = mysql_query($sql);
				} else {
						$lib_subcategory = mysql_real_escape_string($_POST['lib_subcategory']);
						$icon_subcategory = mysql_real_escape_string($_POST['icon_subcategory']);
						if (is_numeric($_POST['category_id_category'])) {
							$category_id_category = $_POST['category_id_category'];
							
							$sql2 = "SELECT category_id_category FROM subcategory WHERE id_subcategory = ".$id_subcategory;
							$result2 = mysql_query($sql2);
							
							if (mysql_result($result2, 0) != $category_id_category) {
								$sql3 = "SELECT max(treerank_subcategory) AS max FROM subcategory WHERE category_id_category = ".$category_id_category;
								$result3 = mysql_query($sql3);
								if (mysql_result($result3, 0) != NULL) {
									$treerank_subcategory = mysql_result($result3, 0);
									$treerank_subcategory += 1;							
								} else {
									$treerank_subcategory = 0;
								}
								
								// modifier les treerank des autres subcategories
								$sql = "SELECT treerank_subcategory FROM subcategory WHERE id_subcategory = ".$id_subcategory;
								$result = mysql_query($sql);
								$currentTreerank = mysql_result($result, 0);
								$sql = "UPDATE subcategory SET treerank_subcategory = (treerank_subcategory - 1) WHERE category_id_category = ".mysql_result($result2, 0)." AND id_subcategory <> ".$id_subcategory." AND treerank_subcategory > ".$currentTreerank;
								$result = mysql_query($sql);
								
								$sql = "UPDATE subcategory SET lib_subcategory = '$lib_subcategory', icon_subcategory = '$icon_subcategory', category_id_category = $category_id_category, treerank_subcategory = $treerank_subcategory WHERE id_subcategory = $id_subcategory";	
								$result = mysql_query($sql);
								
							} else {
								$sql = "UPDATE subcategory SET lib_subcategory = '$lib_subcategory', icon_subcategory = '$icon_subcategory', category_id_category = $category_id_category WHERE id_subcategory = $id_subcategory";
								$result = mysql_query($sql);
							}
							
						} else {
							$sql = "UPDATE subcategory SET lib_subcategory = '$lib_subcategory', icon_subcategory = '$icon_subcategory' WHERE id_subcategory = $id_subcategory";
							$result = mysql_query($sql);
						}
				}
				
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: createSubCategory
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create subcategory
	 * 	Date			: Jan. 31, 2012
	 */

	function createSubCategory() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_subcategory = mysql_real_escape_string($_POST['lib_subcategory']);
				$icon_subcategory = mysql_real_escape_string($_POST['icon_subcategory']);
		
				$category_id_category = $_POST['category_id_category'];
				$display_subcategory = $_POST['display_subcategory'];
				$proppublic_subcategory = $_POST['proppublic_subcategory'];		
				
				$sql = "SELECT max(treerank_subcategory) AS max FROM subcategory WHERE category_id_category = ".$category_id_category;
				$result = mysql_query($sql);
				if (mysql_result($result, 0) != NULL) {
					$treerank_subcategory = 0;
				} else {
					$treerank_subcategory = mysql_result($result, 0);
					$treerank_subcategory += 1;			
				}
			
				$sql = "INSERT INTO subcategory (lib_subcategory, icon_subcategory, treerank_subcategory, category_id_category, display_subcategory, proppublic_subcategory) VALUES ('$lib_subcategory', '$icon_subcategory', $treerank_subcategory, $category_id_category , $display_subcategory, $proppublic_subcategory)";

				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: deleteSubCategorys
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete subcategory(s)
	 * 	Date			: Jan. 19, 2012
	 */
	
	function deleteSubCategorys() {
		$ids = $_POST['ids'];
		$idsubcategorys = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idsubcategorys) < 1){
					echo '0';
				} else if (sizeof($idsubcategorys) == 1){
					$sql = "DELETE FROM subcategory WHERE id_subcategory = ".$idsubcategorys[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM subcategory WHERE ";
					for ($i = 0; $i < sizeof($idsubcategorys); $i++){
						$sql = $sql . "id_subcategory = ".$idsubcategorys[$i];
						if ($i < sizeof($idsubcategorys) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}
	
	
	/*	Function name	: getPoi
	 * 	Input			:
	 * 	Output			:
	 * 	Object			: populate poi grid
	 * 	Date			: May 2, 2012
	 */

	function getPoi($start, $limit, $asc, $sort, $dir){
		switch (SGBD) {
			case 'mysql':
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - getPoi \n", 3, LOG_FILE);
				}
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				$whereClause = ' delete_poi = FALSE ';
				if (isset($_POST["basket"])){
					$whereClause = " delete_poi = TRUE ";
				}
				
				if ($_SESSION["type"] == 2){
					$whereClause .= ' AND moderation_poi = 1 AND display_poi = 1 AND commune_id_commune IN ('.str_replace(';',',',$_SESSION['territoire']).') AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ';
					
				}elseif($_SESSION["type"] == 3){
					$whereClause .= ' AND moderation_poi = 1 AND display_poi = 1 AND transmission_poi = 1 AND delete_poi = FALSE AND poi.pole_id_pole = ' . $_SESSION["pole"] . ' AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ';
				}elseif($_SESSION["type"] == 4){
					$whereClause .= ' AND poi.pole_id_pole = ' . $_SESSION["pole"] . ' ';
				}
				$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE $whereClause ";
				
				$sql .= " ORDER BY ";
				if ($sort == '0' && $dir == '0') {
					switch ($asc) {
						case 'subcategory':
							$sql .= " lib_subcategory ASC";
							break;
						case 'lib':
							$sql .= " lib_poi ASC";
							break;
						default:
							$sql .= " id_poi DESC";
							break;
					}
				} else {
					$sql .= $sort." ".$dir;
				}

				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - getPoi sql $sql retourne $nbrows (s'il n'y avait pas de limites)\n", 3, LOG_FILE);
				}
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['ref_poi'] = $row['ref_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_subcategory']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['adherentfirstname_poi'] = stripslashes($row['adherentfirstname_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
						$arr[$i]['communename_poi'] = stripslashes($row['communename_poi']);
						$arr[$i]['tel_poi'] = stripslashes($row['tel_poi']);
						$arr[$i]['mail_poi'] = stripslashes($row['mail_poi']);
						$arr[$i]['desc_poi'] = stripslashes($row['desc_poi']);
						$arr[$i]['prop_poi'] = stripslashes($row['prop_poi']);
						$arr[$i]['observationterrain_poi'] = stripslashes($row['observationterrain_poi']);
						$arr[$i]['reponsegrandtoulouse_poi'] = stripslashes($row['reponsegrandtoulouse_poi']);
						$arr[$i]['reponsepole_poi'] = stripslashes($row['reponsepole_poi']);
						$arr[$i]['commentfinal_poi'] = stripslashes($row['commentfinal_poi']);
						$arr[$i]['display_poi'] = $row['display_poi'];
						$arr[$i]['fix_poi'] = $row['fix_poi'];
						$arr[$i]['traiteparpole_poi'] = $row['traiteparpole_poi'];
						$arr[$i]['moderation_poi'] = $row['moderation_poi'];
						$arr[$i]['transmission_poi'] = $row['transmission_poi'];
						$arr[$i]['photo_poi'] = $row['photo_poi'];
						$arr[$i]['datecreation_poi'] = $row['datecreation_poi'];
						$arr[$i]['datefix_poi'] = $row['datefix_poi'];
						$arr[$i]['lib_subcategory'] = stripslashes($row['lib_subcategory']);
						$arr[$i]['lib_commune'] = stripslashes($row['lib_commune']);
						$arr[$i]['lib_pole'] = stripslashes($row['lib_pole']);
						$arr[$i]['lib_quartier'] = stripslashes($row['lib_quartier']);
						$arr[$i]['lib_priorite'] = stripslashes($row['lib_priorite']);
						$arr[$i]['lib_status'] = stripslashes($row['lib_status']);
						$arr[$i]['geolocatemode_poi'] = $row['geolocatemode_poi'];
						$arr[$i]['longitude_poi'] = $row['X'];
						$arr[$i]['latitude_poi'] = $row['Y'];
						$arr[$i]['lastdatemodif_poi'] = $row['lastdatemodif_poi'];

						$sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = ".$row['id_poi'];
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_comments'] = $nb2;


						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
					//echo '({"total":"'.$sql.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
					//echo '({"total":"'.$sql.'", "results":""})';
				}
				mysql_free_result($result);
				mysql_close($link);
				
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}




	/* 	Function name 	: updatePoi
	 * //methode appelée par poi1 à 4, quand quelqu'un modifie une information via la datatable sur l'interface d'administration
	 * 	Input			:  
	 * 	Output			: success => '1' / pas de modification => 2 : failed => '3'
	 * 	Object			: update poi grid
	 * 	Date			: July 13, 2015
	 */
	
	function updatePoi() {
		$id_poi = stripslashes($_POST['id_poi']);
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$arrayObs = getObservationDetailsInArray($id_poi);
				
				$arrayDetailsAndUpdateSQL = getObservationDetailsInString($arrayObs);
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($arrayDetailsAndUpdateSQL) ." infos chargées pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - updateObsBoolean ". $arrayDetailsAndUpdateSQL['updateObsBoolean'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - sqlUpdate ". $arrayDetailsAndUpdateSQL['sqlUpdate'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - detailObservationString ".$arrayDetailsAndUpdateSQL['detailObservationString'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
				
				}
				if ($arrayDetailsAndUpdateSQL['updateObsBoolean']){
					$sql = "UPDATE poi SET " . $arrayDetailsAndUpdateSQL['sqlUpdate'] . " WHERE id_poi = ".$id_poi ;
						
						$mails = array();
						//usertype_id_usertype : 1=Admin, 2=comcom, 3=pole tech, 4=moderateur
						// mail à la comcom si un pole a édité le champ 'Réponse pole'
						$poleedit = mysql_real_escape_string($_POST['poleedit']);
						//mail aux comptes comcom du territoire concerné par l'observation et aux modérateurs
						if ($poleedit == 1) {
							$subject = 'Modification de l\'observation n°'.$arrayObs['id_poi'].' par le pole '.$arrayObs['lib_pole'];
							$message = 'Bonjour !
Le pole '.$arrayObs['lib_pole'].' a modifié l\'observation n°'.$arrayObs['id_poi']."\n";
							$message .= "Lien vers la modération : ".URL.'/admin.php?id='.$arrayObs['id_poi']."\n".$arrayDetailsAndUpdateSQL['detailObservationString']."\n";
						
							$message .= "Cordialement, l'Association ".VELOBS_ASSOCIATION." :)";
							$whereClause = "(u.usertype_id_usertype = 2 AND u.territoire_id_territoire = ".$arrayObs['territoire_id_territoire'].") OR (u.usertype_id_usertype = 4 AND u.num_pole = ".$arrayObs['pole_id_pole'].")";
							$mailsComComModo = getMailsToSend($whereClause, $subject, $message );
							
						}
						//Priorités et leur iD
						// 				"1","Priorité 1"
						// 				"2","Priorité 2"
						// 					"4","A modérer"
						// 				"6","Clôturé"
						// 				"7","Refusé par l'association" : non affiché sur l'interface publique
						// 				"8","Urgence" : non affiché sur l'interface publique
						// 				"12","Refusé par la collectivité"
						// 				"15","Doublon"
						//on ne traite priorite_id_priorite que si il a été mis à jour
						$checkModerateBoxOnPOIGrid = 0;
						$updatePOI = 1; //flag permettant de savoir si on doit mettre à jour l'observation (en fonction de règles définies ci-dessous) et envoyer un mail au contributeur
						$returnCode = 0;
						if (isset($_POST['priorite_id_priorite']) 
								&& is_numeric($_POST['priorite_id_priorite']) 
								&& $arrayObs['priorite_id_priorite'] <> $_POST['priorite_id_priorite']) {
							$checkModerateBoxOnPOIGrid = 1;
							$new_id_priorite = $_POST['priorite_id_priorite'];
							// changement du workflow : si priorite == 1 ou priorite == 2 alors on modère par défaut
							if (($new_id_priorite == 1 || $new_id_priorite == 2)) {
								$subject = 'Merci pour votre participation';
								$message = "Bonjour !
L'observation que vous avez envoyée sur VelObs a changé de statut. Le problème identifié a été transmis aux services municipaux.\n".$arrayDetailsAndUpdateSQL['detailObservationString']
							.$signature;
									
							}
							
							// mail à la personne qui a envoyé la proposition pour le prévenir que son intervention a été prise en compte par la comcom et par l'asso, que si le champ commentfinal_poi n'est pas vide, sinon erreur
							//Priorité Cloturé
							if ($new_id_priorite == 6 ) {
								if ($arrayObs['commentfinal_poi'] == '' && $_POST['commentfinal_poi'] == '' ){
									$updatePOI  = 0;
									$returnCode = 10; // pour cloturer il faut que le commentaire final ne soit pas vide
								}
								$subject = 'Observation prise en compte';
								$message = "Bonjour !
L'Association ".VELOBS_ASSOCIATION." vous remercie. Le problème a bien été pris en compte et réglé par la collectivité.\n".$arrayDetailsAndUpdateSQL['detailObservationString'].'
'.$signature;
							}
							// mail à la personne qui a envoyé la proposition pour le prévenir que son intervention ne sera pas prise en compte par l'asso, que si le champ commentfinal_poi n'est pas vide, sinon erreur
							//Priorité Refusé par l'association
							if ($new_id_priorite == 7) {
								if ($arrayObs['commentfinal_poi'] == '' && $_POST['commentfinal_poi'] == '' ){
									$updatePOI  = 0;
									$returnCode = 10; // pour cloturer il faut que le commentaire final ne soit pas vide
								}
								$subject = 'Observation non transmise à la collectivité';
								$message = "Bonjour !
L'Association ".VELOBS_ASSOCIATION." et la collectivité vous remercient de votre participation.
Cependant le problème rapporté a été refusé par l'association et n'a pas été transmis à la collectivité.\n".$arrayDetailsAndUpdateSQL['detailObservationString'].'
							
'.$signature;
									
							}
							// mail à la personne qui a envoyé la proposition pour le prévenir que son intervention ne sera pas prise en compte par l'asso, que si le champ commentfinal_poi n'est pas vide, sinon erreur
							//Priorité Refusé par la collectivité
							if ($new_id_priorite == 12) {
								if ($arrayObs['commentfinal_poi'] == '' && $_POST['commentfinal_poi'] == '' ){
									$updatePOI  = 0;
									$returnCode = 10; // pour cloturer il faut que le commentaire final ne soit pas vide
								}
								$subject = 'Observation refusée par la collectivité';
								$message = "Bonjour !
L'Association ".VELOBS_ASSOCIATION." et la collectivité vous remercient de votre participation.
Cependant le problème rapporté a été refusé par la collectivité.\n".$arrayDetailsAndUpdateSQL['detailObservationString'].'
				
'.$signature;
									
							}
							// mail à la personne qui a envoyé la proposition pour le prévenir que son intervention est en doublon, que si le champ commentfinal_poi n'est pas vide, sinon erreur
							//Priorité DOUBLON
							if ($new_id_priorite == 15) {
								if ($arrayObs['commentfinal_poi'] == '' && $_POST['commentfinal_poi'] == '' ){
									$updatePOI  = 0;
									$returnCode = 11; // pour cloturer il faut que le commentaire final ne soit pas vide, et donner le numero du doublon
								}
								$subject = 'Observation doublon';
								$message = "Bonjour !
L'Association ".VELOBS_ASSOCIATION." et la collectivité vous remercient de votre participation.
Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.\n".$arrayDetailsAndUpdateSQL['detailObservationString'].'
							
Vous pouvez ajouter de nouvelles photos et ou commentaires à l\'observation existante.
'.$signature;
							}
							// mail à la personne qui a envoyé la proposition pour le prévenir que son intervention est une urgence, que si le champ commentfinal_poi n'est pas vide, sinon erreur
							//URGENCE
							if ($new_id_priorite == 8) {
								if ($arrayObs['commentfinal_poi'] == '' && $_POST['commentfinal_poi'] == '' ){
									$updatePOI  = 0;
									$returnCode = 10; // pour cloturer il faut que le commentaire final ne soit pas vide
								}
								/* envoi d'un mail à l'observateur*/
								$subject = 'Merci pour votre participation';
								$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques de la collectivité. Merci de faire le nécessaire.';
								//si la commune fait partie d'un territoire
								//premier territoire
								switch ($arrayObs['territoire_id_territoire']) {
									case 1:
										$message .= '
'.VELOBS_EMERGENCY_MAIL1."\n".$arrayDetailsAndUpdateSQL['detailObservationString'].$signature;
										break;
									default:
										$message .= "\n".$arrayDetailsAndUpdateSQL['detailObservationString'].$signature;
										break;
								}
							}
							
							if ($updatePOI == 1){
								$mailArray = [$arrayObs['mail_poi'],'Contributeur',$subject, $message ];
								array_push($mails,$mailArray);
								
							}
						}
						//si la modif a été faite par la comcom ou un pole technique
						if (isset($_SESSION['type']) && ($_SESSION['type'] == 2 || $_SESSION['type'] == 3) ){
							// mail à l'association vélo pour prévenir d'une modif + mail au(x) responsable(s) du pole
							$subject = 'Modification sur l\'observation n°'.$arrayObs['id_poi'].' - '.$arrayObs['lib_pole'];
							$message = 'Bonjour !
La collectivité ou un pôle technique (compte '.$_SESSION['user'].') a modifié l\'observation n°'.$arrayObs['id_poi'].' du pole '.$arrayObs['lib_pole']."\n
Veuillez consulter l'interface d'administration pour consulter les informations relatives.
Lien vers la modération : ".URL.'/admin.php?id='.$arrayObs['id_poi']."\n".
							$arrayDetailsAndUpdateSQL['detailObservationString'].'
'.$signature;
							//usertype_id_usertype : 1=Admin, 2=comcom, 3=pole tech, 4=moderateur
							//mail aux admins velobs et aux modérateurs du pole concerné par l'observation
							$whereClause = " u.usertype_id_usertype = 1 OR (u.usertype_id_usertype = 4 AND u.num_pole = ".$arrayObs['pole_id_pole'].")";
							$mailsAsso = getMailsToSend($whereClause, $subject, $message );
							
						}
						
							
						//si une règle de modération n'est pas respectée, on ne met pas à jour l'observation et on n'evoie pas de mail, et on retourne un code d'erreur
						if ($updatePOI == 0){
							echo $returnCode;
						}else{
							//on met à jour l'observation
							if (DEBUG){
								error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - sql ". $sql ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
							}
							$result = mysql_query($sql);
							//en cas d'erreur sur la requête,; on envoie un mail d'information à l'administrateur
							if (!$result) {
								if (DEBUG){
									error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Erreur ". mysql_errno($link) . " : " . mysql_error($link), 3, LOG_FILE);
								}
								sendMail(MAIL_FROM,"Erreur méthode updatePoi", "Erreur = " .  mysql_error($link) . ", requête = " . $sql);
								echo '3';
							}else{
								//si la mise à jour de l'observation s'est bien déroulée, on envoie les mails
								if ($mailsComComModo){
									$succes = sendMails($mailsComComModo);
								}
								if ($mailsAsso){
									$succes = sendMails($mailsAsso);
								}
								if ($mails){
									$succes = sendMails($mails);
								}
								//on retourne un code de succès à l'interface
								if ($checkModerateBoxOnPOIGrid){
									echo 4;
								}else{
									echo 1;
								}
							}
						}
					//}
				}else{
					//aucune mise à jour n'a été effectuée, car aucune information n'a été modifiée
					echo 2;
				}		
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}


	




	/* 	Function name 	: deletePois
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete poi(s)
	 * 	Date			: Jan. 22, 2012
	 */
	
	function deletePois() {
		$ids = $_POST['ids'];
		$idpois = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idpois) < 1){
					echo '0';
				} else if (sizeof($idpois) == 1){
					$sql = "DELETE FROM poi WHERE id_poi = ".$idpois[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM poi WHERE ";
					for ($i = 0; $i < sizeof($idpois); $i++){
						$sql = $sql . "id_poi = ".$idpois[$i];
						if ($i < sizeof($idpois) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}
	
	
	/* 	Function name 	: deletePoisCorbeille
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete poi(s)
	 * 	Date			: Jan. 22, 2012
	 */
	
	function deletePoisCorbeille() {
		$ids = $_POST['ids'];
		$idpois = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idpois) < 1){
					echo '0';
				} else if (sizeof($idpois) == 1){
					//$sql = "DELETE FROM poi WHERE id_poi = ".$idpois[0];
					$sql = "UPDATE poi SET delete_poi = TRUE WHERE id_poi = ".$idpois[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM poi WHERE ";
					for ($i = 0; $i < sizeof($idpois); $i++){
						/*$sql = $sql . "id_poi = ".$idpois[$i];
						if ($i < sizeof($idpois) - 1){
							$sql = $sql . " OR ";
						}*/
						
						$sql = "UPDATE poi SET delete_poi = TRUE WHERE id_poi = ".$idpois[$i];
						$result = mysql_query($sql);	 
					}
					//$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}
	
	
	/* 	Function name 	: getCommune
	 * 	Input			: start, limit 
	 * 	Output			: json communes
	 * 	Object			: populate commune grid
	 * 	Date			: Jan. 24, 2012
	 */
	
	function getCommune($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM commune ORDER BY lib_commune ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_commune'] = $row['id_commune'];
						$arr[$i]['lib_commune'] = stripslashes($row['lib_commune']);
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: updateCommune
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update commune grid
	 * 	Date			: Jan. 24, 2012
	 */
	
	function updateCommune() {
		$id_commune = $_POST['id_commune'];
		$lib_commune = $_POST['lib_commune'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "UPDATE commune SET lib_commune = '$lib_commune' WHERE id_commune = $id_commune";
				$result = mysql_query($sql);
				$sql = "UPDATE commune SET id_commune = $id_commune WHERE lib_commune = '$lib_commune'";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}


	/* 	Function name 	: createCommune
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create commune
	 * 	Date			: Jan. 24, 2012
	 */

	function createCommune() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_commune = mysql_real_escape_string($_POST['lib_commune']);
				$id_commune = $_POST['id_commune'];
					
				$sql = "INSERT INTO commune (lib_commune, id_commune) VALUES ('$lib_commune', $id_commune)";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: deleteCommunes
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete commune(s)
	 * 	Date			: Jan. 24, 2012
	 */
	
	function deleteCommunes() {
		$ids = $_POST['ids'];
		$idcitys = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idcitys) < 1){
					echo '0';
				} else if (sizeof($idcitys) == 1){
					$sql = "DELETE FROM commune WHERE id_commune = ".$idcitys[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM commune WHERE ";
					for ($i = 0; $i < sizeof($idcitys); $i++){
						$sql = $sql . "id_commune = ".$idcitys[$i];
						if ($i < sizeof($idcitys) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}
	
	
	/* 	Function name 	: getPole
	 * 	Input			: start, limit 
	 * 	Output			: json poles
	 * 	Object			: populate pole grid
	 * 	Date			: May 2, 2012
	 */
	
	function getPole($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM pole ORDER BY lib_pole ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_pole'] = $row['id_pole'];
						$arr[$i]['lib_pole'] = stripslashes($row['lib_pole']);
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: updatePole
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update pole grid
	 * 	Date			: May 2, 2012
	 */
	
	function updatePole() {
		$id_pole = $_POST['id_pole'];
		$lib_pole = $_POST['lib_pole'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "UPDATE pole SET lib_pole = '$lib_pole' WHERE id_pole = $id_pole";
				$result = mysql_query($sql);
// 				$sql = "UPDATE pole SET id_pole = $id_pole WHERE lib_pole = '$lib_pole'";
// 				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}
	
	
	/* 	Function name 	: createPole
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create pole
	 * 	Date			: May 2, 2012
	 */

	function createPole() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_pole = mysql_real_escape_string($_POST['lib_pole']);
				$id_pole = $_POST['id_pole'];
					
				$sql = "INSERT INTO pole (lib_pole, id_pole) VALUES ('$lib_pole', $id_pole)";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: deletePoles
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete pole(s)
	 * 	Date			: May 2, 2012
	 */
	
	function deletePoles() {
		$ids = $_POST['ids'];
		$idpoles = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idpoles) < 1){
					echo '0';
				} else if (sizeof($idpoles) == 1){
					$sql = "DELETE FROM pole WHERE id_pole = ".$idpoles[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM pole WHERE ";
					for ($i = 0; $i < sizeof($idpoles); $i++){
						$sql = $sql . "id_pole = ".$idpoles[$i];
						if ($i < sizeof($idpoles) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}
	
	
	/* 	Function name 	: getQuartier
	 * 	Input			: start, limit 
	 * 	Output			: json quartiers
	 * 	Object			: populate quartier grid
	 * 	Date			: May 2, 2012
	 */
	
	function getQuartier($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM quartier ORDER BY lib_quartier ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_quartier'] = $row['id_quartier'];
						$arr[$i]['lib_quartier'] = stripslashes($row['lib_quartier']);
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: updateQuartier
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update quartier grid
	 * 	Date			: May 2, 2012
	 */
	
// 	function updateQuartier() {
// 		switch (SGBD) {
// 			case 'mysql':
// 				$link = mysql_connect(HOST,DB_USER,DB_PASS);
// 				mysql_select_db(DB_NAME);
// 				mysql_query("SET NAMES 'utf8'");
				
// 				$id_quartier = $_POST['id_quartier'];
// 				$lib_quartier = $_POST['lib_quartier'];		
	
// 				$sql = "UPDATE quartier SET lib_quartier = '$lib_quartier' WHERE id_quartier = $id_quartier";
// 				$result = mysql_query($sql);
// 				if (!$result) {
// 					echo '2';
// 				} else {
// 					echo '1';
// 				}
				
// 				mysql_free_result($result);
// 				mysql_close($link);
// 				break;
// 			case 'postgresql':
// 				// TODO
// 				break;
// 		}
		
// 	}
	
	
	/* 	Function name 	: createQuartier
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create quartier
	 * 	Date			: May 2, 2012
	 */

// 	function createQuartier() {
// 		switch (SGBD) {
// 			case 'mysql':
// 				$link = mysql_connect(HOST,DB_USER,DB_PASS);
// 				mysql_select_db(DB_NAME);
// 				mysql_query("SET NAMES 'utf8'");
				
// 				$lib_quartier = mysql_real_escape_string($_POST['lib_quartier']);		
					
// 				$sql = "INSERT INTO quartier (lib_quartier) VALUES ('$lib_quartier')";
// 				$result = mysql_query($sql);
// 				if (!$result) {
// 					echo '2';
// 				} else {
// 					echo '1';
// 				}
				
// 				mysql_free_result($result);
// 				mysql_close($link);
// 				break;
// 			case 'postgresql':
// 				// TODO
// 				break;
// 		}
// 	}
	
	/* 	Function name 	: deleteQuartiers
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete quartier(s)
	 * 	Date			: May 2, 2012
	 */
	
// 	function deleteQuartiers() {
// 		$ids = $_POST['ids'];
// 		$idquartiers = json_decode(stripslashes($ids));
		
// 		switch (SGBD) {
// 			case 'mysql':
// 				$link = mysql_connect(HOST,DB_USER,DB_PASS);
// 				mysql_select_db(DB_NAME);
// 				mysql_query("SET NAMES 'utf8'");
	
// 				if (sizeof($idquartiers) < 1){
// 					echo '0';
// 				} else if (sizeof($idquartiers) == 1){
// 					$sql = "DELETE FROM quartier WHERE id_quartier = ".$idquartiers[0];
// 					$result = mysql_query($sql);
// 				} else {
// 					$sql = "DELETE FROM quartier WHERE ";
// 					for ($i = 0; $i < sizeof($idquartiers); $i++){
// 						$sql = $sql . "id_quartier = ".$idquartiers[$i];
// 						if ($i < sizeof($idquartiers) - 1){
// 							$sql = $sql . " OR ";
// 						}	 
// 					}
// 					$result = mysql_query($sql);
// 				}
// 				if (!$result) {
// 					echo '2';
// 				} else {
// 					echo '1';
// 				}
				
// 				mysql_free_result($result);
// 				mysql_close($link);
// 				break;
// 			case 'postgresql':
// 				// TODO
// 				break;
// 		}	
		
// 	}
	
	/* 	Function name 	: getPriorite
	 * 	Input			: start, limit 
	 * 	Output			: json priorites
	 * 	Object			: populate priorite grid
	 * 	Date			: May 3, 2012
	 */
	
	function getPriorite($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM priorite ORDER BY lib_priorite ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_priorite'] = $row['id_priorite'];
						$arr[$i]['lib_priorite'] = stripslashes($row['lib_priorite']);
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: updatePriorite
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update priorite grid
	 * 	Date			: May 3, 2012
	 */
	
	function updatePriorite() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$id_priorite = $_POST['id_priorite'];
				$lib_priorite = $_POST['lib_priorite'];		
	
				$sql = "UPDATE priorite SET lib_priorite = '$lib_priorite' WHERE id_priorite = $id_priorite";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}
	
	
	/* 	Function name 	: createPriorite
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create priorite
	 * 	Date			: May 3, 2012
	 */

	function createPriorite() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$lib_priorite = mysql_real_escape_string($_POST['lib_priorite']);		
					
				$sql = "INSERT INTO priorite (lib_priorite) VALUES ('$lib_priorite')";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: deletePriorites
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete priorite(s)
	 * 	Date			: May 3, 2012
	 */
	
	function deletePriorites() {
		$ids = $_POST['ids'];
		$idpriorites = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idpriorites) < 1){
					echo '0';
				} else if (sizeof($idpriorites) == 1){
					$sql = "DELETE FROM priorite WHERE id_priorite = ".$idpriorites[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM priorite WHERE ";
					for ($i = 0; $i < sizeof($idpriorites); $i++){
						$sql = $sql . "id_priorite = ".$idpriorites[$i];
						if ($i < sizeof($idpriorites) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}
	
	
	/* 	Function name 	: getStatus
	 * 	Input			: start, limit 
	 * 	Output			: json status
	 * 	Object			: populate status grid
	 * 	Date			: May 3, 2012
	 */
	
	function getStatus($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT * FROM status ORDER BY lib_status ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_status'] = $row['id_status'];
						$arr[$i]['lib_status'] = stripslashes($row['lib_status']);
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: updateStatus
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update status grid
	 * 	Date			: May 3, 2012
	 */
	
	function updateStatus() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$id_status = $_POST['id_status'];
				$lib_status = $_POST['lib_status'];		
	
				$sql = "UPDATE status SET lib_status = '$lib_status' WHERE id_status = $id_status";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}


	/* 	Function name 	: createStatus
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create status
	 * 	Date			: May 3, 2012
	 */

	function createStatus() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_status = mysql_real_escape_string($_POST['lib_status']);		
					
				$sql = "INSERT INTO status (lib_status) VALUES ('$lib_status')";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	
	/* 	Function name 	: deleteStatuss
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete statut(s)
	 * 	Date			: May 3, 2012
	 */
	
	function deleteStatuss() {
		$ids = $_POST['ids'];
		$idstatuss = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idstatuss) < 1){
					echo '0';
				} else if (sizeof($idstatuss) == 1){
					$sql = "DELETE FROM status WHERE id_status = ".$idstatuss[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM status WHERE ";
					for ($i = 0; $i < sizeof($idstatuss); $i++){
						$sql = $sql . "id_status = ".$idstatuss[$i];
						if ($i < sizeof($idstatuss) - 1){
							$sql = $sql . " OR ";
						}	 
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}	
		
	}


	/* 	Function name 	: getUser
		 * 	Input			: start, limit
		 * 	Output			: json status
		 * 	Object			: populate user grid
		 * 	Date			: July 9, 2015
	*/

	function getUser($start, $limit){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$sql = "SELECT users.*, usertype.lib_usertype, pole.lib_pole, territoire.lib_territoire FROM users INNER JOIN usertype ON (usertype.id_usertype = users.usertype_id_usertype) INNER JOIN pole ON (pole.id_pole = users.num_pole) INNER JOIN territoire ON (territoire.id_territoire = users.territoire_id_territoire) ORDER BY id_users ASC";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);

				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_users'] = $row['id_users'];
						$arr[$i]['lib_users'] = stripslashes($row['lib_users']);
						$arr[$i]['pass_users'] = stripslashes($row['pass_users']);
						$arr[$i]['nom_users'] = stripslashes($row['nom_users']);
						$arr[$i]['mail_users'] = stripslashes($row['mail_users']);
						$arr[$i]['lib_usertype'] = stripslashes($row['lib_usertype']);
						$arr[$i]['lib_userpole'] = stripslashes($row['lib_pole']);
						$arr[$i]['lib_territoire'] = stripslashes($row['lib_territoire']);
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: updateUser
		 * 	Input			:
		 * 	Output			: success => '1' / failed => '2'
		 * 	Object			: update user grid
		 * 	Date			: July 9, 2015
	 */

	function updateUser() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$id_users = mysql_real_escape_string($_POST['id_users']);
				$lib_users = mysql_real_escape_string($_POST['lib_users']);
				$pass_users = mysql_real_escape_string($_POST['pass_users']);
				$mail_users = mysql_real_escape_string($_POST['mail_users']);
				$nom_users = mysql_real_escape_string($_POST['nom_users']);

				if (is_numeric($_POST['territoire_id_territoire'])) {
					$territoire_id_territoire = $_POST['territoire_id_territoire'];
					$sql = "UPDATE users SET lib_users = '$lib_users', pass_users = '$pass_users', mail_users = '$mail_users', nom_users = '$nom_users', territoire_id_territoire = $territoire_id_territoire WHERE id_users = $id_users";
				} else if (is_numeric($_POST['usertype_id_usertype'])) {
					$usertype_id_usertype = $_POST['usertype_id_usertype'];
					$sql = "UPDATE users SET lib_users = '$lib_users', pass_users = '$pass_users', mail_users = '$mail_users', nom_users = '$nom_users', usertype_id_usertype = $usertype_id_usertype WHERE id_users = $id_users";
				} else if (is_numeric($_POST['num_pole'])) {
					$num_pole = $_POST['num_pole'];
					$sql = "UPDATE users SET lib_users = '$lib_users', pass_users = '$pass_users', mail_users = '$mail_users', nom_users = '$nom_users', num_pole = $num_pole WHERE id_users = $id_users";
				} else {
					$sql = "UPDATE users SET lib_users = '$lib_users', pass_users = '$pass_users', mail_users = '$mail_users', nom_users = '$nom_users' WHERE id_users = $id_users";
				}

				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}

	}


	/* 	Function name 	: createUser
		 * 	Input			:
		 * 	Output			: success => '1' / failed => '2'
		 * 	Object			: create user
		 * 	Date			: July 9, 2015
	 */

	function createUser() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$lib_users = mysql_real_escape_string($_POST['lib_users']);
				$nom_users = mysql_real_escape_string($_POST['nom_users']);
				$pass_users = mysql_real_escape_string($_POST['pass_users']);
				$mail_users = mysql_real_escape_string($_POST['mail_users']);

				$usertype_id_usertype = $_POST['usertype_id_usertype'];
				$num_pole = $_POST['num_pole'];
				$territoire_id_territoire = $_POST['territoire_id_territoire'];

				$sql = "INSERT INTO users (lib_users, nom_users, pass_users, mail_users, usertype_id_usertype, num_pole, territoire_id_territoire, language_id_language) VALUES ('$lib_users', '$nom_users', '$pass_users', '$mail_users', $usertype_id_usertype, $num_pole, $territoire_id_territoire, 1)";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				$message = "Bonjour,
Vous disposez maintenant d'un compte sur velobs vous permettant de mettre à jour les observations enregistrées dans le système. Vous pouvez vous connecter à l'interface d'administration à l'adresse : 
".URL."/admin.php
Vos identifiants sont :
	- Login : $lib_users
	- Mot de passe : $pass_users
En cas de question, vous pouvez trouver des informations sur https://github.com/2p2r/velobs_web. N'hésitez pas à envoyer un courriel à ". MAIL_ALIAS_OBSERVATION_ADHERENTS . " pour toute question sur VelObs.";
				sendMail($mail_users, "Création compte sur VelObs", $message);
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: deleteUsers
		 * 	Input			:
		 * 	Output			: success => '1' / failed => '2'
		 * 	Object			: delete user(s)
		 * 	Date			: July 9, 2015
	*/

	function deleteUsers() {
		$ids = $_POST['ids'];
		$idusers = json_decode(stripslashes($ids));

		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				if (sizeof($idusers) < 1){
					echo '0';
				} else if (sizeof($idusers) == 1){
					$sql = "DELETE FROM users WHERE id_users = ".$idusers[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM users WHERE ";
					for ($i = 0; $i < sizeof($idusers); $i++){
						$sql = $sql . "id_users = ".$idusers[$i];
						if ($i < sizeof($idusers) - 1){
							$sql = $sql . " OR ";
						}
					}
					$result = mysql_query($sql);
				}
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}

	}



	/* 	Function name 	: resetPhotoPoi
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: reset photo
	 * 	Date			: Jan. 22, 2012
	 */
	
	function resetPhotoPoi() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT photo_poi FROM poi WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)){
					unlink("../../../resources/pictures/".$row['photo_poi']);
				}
				$sql = "UPDATE poi SET photo_poi = NULL WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	

	/* 	Function name 	: updateGeoPoi
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: modif geo poi
	 * 	Date			: Jan. 23, 2012
	 */
	
	function updateGeoPoi() {
		$id_poi = $_POST['id_poi'];
		$latitude_poi = $_POST['latitude_poi'];
		$longitude_poi = $_POST['longitude_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				$locations = getLocations($latitude_poi,$longitude_poi);
				if (DEBUG){
					//error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - " . getLocations($latitude_poi,$longitude_poi)[1]."\n", 3, LOG_FILE);
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - locations - ".$locations[0].", " .$locations[1].", " .$locations[2].", " .$locations[3]."\n", 3, LOG_FILE);
				}
				$commune_id_commune =$locations[0];
				$lib_commune = $locations[1];
				$pole_id_pole = $locations[2];
				$lib_pole = $locations[3];
				
				
				$lastdatemodif_poi = date("Y-m-d H:i:s");
				$sql = "UPDATE poi SET commune_id_commune = ".$commune_id_commune.", pole_id_pole = ".$pole_id_pole.", geom_poi = GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), geolocatemode_poi = 1, lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
				$result = mysql_query($sql);

				if (!$result) {
					echo '2';
				} else {
					//echo $sql2;
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}


	/* 	Function name 	: resetGeoPoi
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: reset geo poi
	 * 	Date			: Jan. 23, 2012
	 */

	function resetGeoPoi() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$sql = "UPDATE poi SET geom_poi = NULL, geolocatemode_poi = NULL WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}

	}
	

	/* 	Function name 	: updateGeoDefaultMap
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update geo map settings default
	 * 	Date			: Jan. 23, 2012
	 */
	
	function updateGeoDefaultMap() {
		$lat = $_POST['lat'];
		$lon = $_POST['lon'];
		$zoom = $_POST['zoom'];
		$baselayer = $_POST['baselayer'];
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$sql = "UPDATE configmap SET lat_configmap = ".$lat.", lon_configmap = ".$lon.", zoom_configmap = ".$zoom.", baselayer_configmap = ".$baselayer." WHERE id_configmap = 1";
				$result = mysql_query($sql);
				
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}

	}

	/* 	Function name 	: createPublicPoi
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create public poi
	 * 	Date			: May 8, 2012
	 */

	function createPublicPoi() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$num_poi = mysql_real_escape_string($_POST['num_poi']);
				$mail_poi = mysql_real_escape_string($_POST['mail_poi']);
				$tel_poi = mysql_real_escape_string($_POST['tel_poi']);
				$rue_poi = mysql_real_escape_string($_POST['rue_poi']);
				$communename_poi = mysql_real_escape_string($_POST['communename_poi']);
				$desc_poi = mysql_real_escape_string($_POST['desc_poi']);
				$prop_poi = mysql_real_escape_string($_POST['prop_poi']);
				$adherent_poi = mysql_real_escape_string($_POST['adherent_poi']);
				$adherentfirstname_poi = mysql_real_escape_string($_POST['adherentfirstname_poi']);
				$latitude_poi = mysql_real_escape_string($_POST['latitude_poi']);
				$longitude_poi = mysql_real_escape_string($_POST['longitude_poi']);
				$subcategory_id_subcategory = mysql_real_escape_string($_POST['subcategory_id_subcategory']);
				
				$sql = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$subcategory_id_subcategory;
				$result = mysql_query($sql);
				$row = mysql_fetch_assoc( $result );
				$lib_subcategory = mysql_real_escape_string($row['lib_subcategory']);

				//détermination de la commune et du pole concernés par croisement du polygone de la commune ave latitude et longitude
				$commune_id_commune = 99999;
				$pole_id_pole = 9;
				$quartier_id_quartier = 99999;
				$locations = getLocations($latitude_poi,$longitude_poi);
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - place locations - ".$locations[0].", " .$locations[1].", " .$locations[2].", " .$locations[3]."\n", 3, LOG_FILE);
				}
				
				$commune_id_commune = $locations[0];
				$lib_commune = $locations[1];
				$pole_id_pole = $locations[2];
				$lib_pole = $locations[3];
				if ($commune_id_commune == 99999){
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " L'observation semble être dans une zone non couverte par velobs\n", 3, LOG_FILE);
					}
					$erreur = "L'observation semble être dans une zone non couverte par VelObs, si ce n'est pas le cas, merci de nous contacter à l'adresse " . MAIL_FROM;
					$return['success'] = false;
					$return['pb'] = $erreur;
				}
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - isset(_FILES['photo-path']) - ".isset($_FILES['photo-path']['name'])."\n", 3, LOG_FILE);
				}
				//si une photo a été associée au commentaire, on la traite
				if (!isset($erreur) && isset($_FILES['photo-path']) && $_FILES['photo-path']['name'] != ""){
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " photo-path isset " . $_FILES['photo-path'] . "\n", 3, LOG_FILE);
					}
					$dossier = '../../../resources/pictures/';
					$fichier = basename($_FILES['photo-path']['name']);
					$taille_maxi = 6291456;
					$taille = filesize($_FILES['photo-path']['tmp_name']);
					$extensions = array('.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG');
					$extension = strrchr($_FILES['photo-path']['name'], '.');
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " l'extension du fichier est  " . $extension . "\n", 3, LOG_FILE);
					}	
					if (!in_array($extension, $extensions)) {
						if (DEBUG){
							error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " l'extension !in_array \n", 3, LOG_FILE);
						}
						$erreur = getTranslation(1,'ERROR');
						$return['success'] = false;
						$return['pb'] = getTranslation(1,'PICTUREPNGGIFJPGJPEG');
					}
						
					if ($taille > $taille_maxi) {
						$erreur = getTranslation(1,'ERROR');
						$return['success'] = false;
						$return['pb'] = getTranslation(1,'PICTURESIZE');
					}
						
					if (!isset($erreur)){
						if (DEBUG){
							error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " pas d'erreur, on continue \n", 3, LOG_FILE);
						}
						$fichier = strtr($fichier,
								'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ_',
								'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy-');
						$fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);
						$fichier = 'poi_'.$fichier;
						$pathphoto = $dossier.$fichier;
						if (move_uploaded_file($_FILES['photo-path']['tmp_name'], $pathphoto)) {
							if (DEBUG){
								error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " dans move_uploaded_file \n", 3, LOG_FILE);
							}
							$size = getimagesize($pathphoto);
								
							if ($size[0] > 1024 || $size[1] > 1024) {
								if ($size[0] > $size[1]) {
									generate_image_thumbnail($pathphoto, $pathphoto, 1024, 768);
								} else {
									generate_image_thumbnail($pathphoto, $pathphoto, 768, 1024);
								}
							}
								
							$size = getimagesize($pathphoto);
							$newnamefichier = $size[0].'x'.$size[1].'x'.$fichier;
							$newpathphoto = $dossier.$newnamefichier;
							rename($pathphoto, $newpathphoto);
							$url_photo = $newnamefichier;
							
							$return['success'] = true;
							$return['ok'] = getTranslation($_SESSION['id_language'],'PHOTOTRANSFERTDONE');
						} else {
						 	$erreur = "Erreur lors du traitement de la photo.";
            				$return['success'] = false;
            				$return['pb'] = $erreur;
          				}
        			}
      			}
      			if (DEBUG){
        			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - entre 2 ".$return['success'] . " " .$return['pb']."\n", 3, LOG_FILE);
      			}
      			//si une photo a été associée au commentaire et que tout s'est bien passé, ou bien s'il n'y avait pas de photo, on peut créer l'observation dans la base de données
      			if (!isset($erreur) && ((isset($_FILES['photo-path']['name']) && $return['success'] ==  true) || (isset($_FILES['photo-path']['name']) && $_FILES['photo-path']['name'] == ''))){
        			if (DEBUG){
          				error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - place locations - ".$commune_id_commune.", " .$lib_commune.", " .$pole_id_pole.", " .$lib_pole."\n", 3, LOG_FILE);
        			}
				
				$datecreation_poi = date('Y-m-d H:i:s');			
				
				//si le mail de la personne qui soumet le POI est aussi un modérateur ou un administrateur, on positionne moderation_poi à vrai et on met la priorité à 1
				$sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
				$result2 = mysql_query($sql2);
				$num_rows2 = mysql_num_rows($result2);
				$priorityId = 1;
				$moderationFlag = 1;
				if ($num_rows2 == 0) {
					$priorityId = 4;
					$moderationFlag = 0;
				} 
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - place locations - ".$commune_id_commune.", " .$lib_commune.", " .$pole_id_pole.", " .$lib_pole."\n", 3, LOG_FILE);
				}

				// Construction de la référence du POI
				$sql = "SELECT IFNULL(max(seq), 0) as last_seq FROM poireferences WHERE year = " . date("y") . " AND month = " . date("m");
				$result = mysql_query($sql);
				$row = mysql_fetch_assoc( $result );
				$ref_sequence = $row['last_seq']+1;
				$ref_poi = "F" . date('ym') . str_pad($ref_sequence, 2, '0', STR_PAD_LEFT);

				$sql = "INSERT INTO poi (adherent_poi, adherentfirstname_poi, ref_poi, priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, mail_poi, tel_poi, num_poi, rue_poi, communename_poi, commune_id_commune, desc_poi, prop_poi, subcategory_id_subcategory, display_poi, fix_poi, datecreation_poi, geolocatemode_poi, moderation_poi, geom_poi, status_id_status, photo_poi) VALUES ('$adherent_poi', '$adherentfirstname_poi', '$ref_poi', $priorityId, $quartier_id_quartier, $pole_id_pole, '$lib_subcategory', '$mail_poi', '$tel_poi', '$num_poi', '$rue_poi', '$communename_poi', $commune_id_commune, '$desc_poi', '$prop_poi', $subcategory_id_subcategory , TRUE, FALSE, '$datecreation_poi', 1, $moderationFlag, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), 5, '$url_photo')";
				
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - createPublicPoi - Requete d'insertion sql = ".$sql."\n", 3, LOG_FILE);
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Erreur ". mysql_errno($link) . " : " . mysql_error($link)."\n", 3, LOG_FILE);
				}
				$result = mysql_query($sql);
				if ($result){
					$poiId = mysql_insert_id();

					// Le compteur de références est maintenu dans une table à part pour éviter de réattribuer une référence après une suppression.
					$sql = "INSERT INTO poireferences (year, month, seq) VALUES (" . date("y") . ", " . date("m") . ", " . $ref_sequence . ")";
					$result = mysql_query($sql);

					$arrayObs = getObservationDetailsInArray($poiId);
					$arrayDetailsAndUpdateSQL = getObservationDetailsInString($arrayObs);
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($arrayDetailsAndUpdateSQL) ." infos chargées pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - updateObsBoolean ". $arrayDetailsAndUpdateSQL['updateObsBoolean'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - sqlUpdate ". $arrayDetailsAndUpdateSQL['sqlUpdate'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - detailObservationString ".$arrayDetailsAndUpdateSQL['detailObservationString'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
					
					}
					$return['success'] = true;
					$return['ok'] = "L'observation a été correctement ajoutée sous la référence $ref_poi et est directement affichée (après rechargement de la page) puisque vous êtes référencé(e) comme modérateur ou administrateur de VelObs.";
						
					//si le contributeur n'est pas un modérateur ni un administrateur par ailleurs, on envoie des mails
					if ($num_rows2 == 0){
						$return['ok'] = "L'observation a bien été créée et est en attente de modération. Un courriel reprenant l'ensemble des informations de cette observation vous a été envoyé.";
							
						/* envoi d'un mail aux administrateurs de l'association et modérateurs */
						$whereClause = "u.usertype_id_usertype = 1 OR (u.usertype_id_usertype = 4 AND u.num_pole = ".$arrayObs['pole_id_pole'].")";
						$subject = 'Nouvelle observation à modérer sur le pole '.$arrayObs['lib_pole'];
						$message = "Bonjour !
Une nouvelle observation a été ajoutée sur le pole ".$arrayObs['lib_pole'].". Veuillez vous connecter à l'interface d'administration pour la modérer.
Lien vers la modération : ".URL.'/admin.php?id='.$arrayObs['id_poi']."\n".$arrayDetailsAndUpdateSQL['detailObservationString']."\n";
						$mails = array();
						$mails = getMailsToSend($whereClause, $subject, $message );
						if (DEBUG){
							error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Il y a ". count($mails) . " mails à envoyer \n", 3, LOG_FILE);
						}
// 						$succes = sendMails($mails);
						
						/* debut envoi d'un mail au contributeur */
						$tableName = 'subcategory';
						$sqlLibCategory = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$arrayObs['subcategory_id_subcategory'];
						$resultLibCategory = mysql_query($sqlLibCategory);
						$rowLibCategory = mysql_fetch_assoc( $resultLibCategory );
						$subcategory_lib = $rowLibCategory['lib_subcategory'];

						$sqlLibCommune = "SELECT lib_commune FROM commune WHERE id_commune = ".$arrayObs['commune_id_commune'];
						$resultLibCommune = mysql_query($sqlLibCommune);
						$rowLibCommune = mysql_fetch_assoc( $resultLibCommune );
						$commune_lib = $rowLibCommune['lib_commune'];

						$subject = 'Observation en attente de modération';
						$message = "Bonjour,
Vous venez​ de signaler un problème sur la plateforme Cyclo-fiche de Vélo-Cité et ​nous ​vous en remercions​!​
​Cette information ​sera ​modérée ​prochainement par notre équipe et transférée aux services de Bordeaux Métropole.​
Vélo-Cité vous informera des suites données à votre demande.
​Si vous observez une amélioration, n'hésitez pas à nous ​la ​signaler​.​

Référence: ".$arrayObs['ref_poi']."
Catégorie: ".$subcategory_lib."
Nom de la voie: ".$arrayObs['rue_poi']."
Nom de la commune: ".$commune_lib."
Description du problème: ".$arrayObs['desc_poi']."
Lien vers l'observation (non visible tant que la modération n'a pas été effectuée): ".(substr(URL, 0, 7) === "http://" ? 'http://': '').URL.'?id='.$arrayObs['id_poi']."\n\n
Cordialement, l'équipe ".VELOBS_ASSOCIATION." :)
05 56 81 63 89
velo-cite.org";
						$mailArray = [$arrayObs['mail_poi'],"Soumetteur", $subject, $message ];
						array_push($mails,$mailArray);
				
					}
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($mails) ." mails à envoyer\n", 3, LOG_FILE);
					}
					$succes = sendMails($mails);
				}else{
					
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Erreur ". mysql_errno($link) . " : " . mysql_error($link)."\n", 3, LOG_FILE);
					}
					sendMail(MAIL_FROM,"Erreur méthode createPublicPoi", "Erreur = " .  mysql_error($link) . ", requête = " . $sql);
					$return['success'] = false;
					$return['pb'] = "Erreur lors de l'ajout de l'observation, un mail a été envoyé aux administrateurs. Veuillez nous excuser pour ce dysfonctionnement.";
				}
				}else{
					
					$infoPOI = "Repere : $num_poi\nMail : $mail_poi\nTel : $tel_poi\nRue : $rue_poi\nCommune : $communename_poi\nDescription : $desc_poi\nProposition : $prop_poi\nNom : $adherent_poi\nPrenom : $adherentfirstname_poi\nLatitude : $latitude_poi\nLongitude : $longitude_poi\n Categorie : $subcategory_id_subcategory";
					sendMail(MAIL_FROM,"Erreur méthode createPublicPoi", "Erreur = " .  $return['pb'] . "\n" . $infoPOI);
					$return['success'] = false;
					$return['pb'] = "Erreur lors de l'ajout de l'observation : " . $return['pb'];
				
				}
				//retourne le résultat du traitement du commentaire
				echo json_encode($return);
				mysql_free_result($result);
				mysql_close($link);

				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

	/* 	Function name 	: isPropPublic
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: display proposition in public map
	 * 	Date			: Jan. 31, 2012
	 */
	
	function isPropPublic() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT id_subcategory FROM subcategory WHERE proppublic_subcategory = 1";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
		
				if ($nbrows > 0){
					echo '1';
				} else {
					echo '2';
				}
				
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: getNumPageIdParam
	 * 	Input			: id record, usertype and number of record per page in the store
	 * 	Output			: number of page to load
	 * 	Object			: set the right page in the store to popup the edit map
	 * 	Date			: July 25, 2015
	 */

	function getNumPageIdParam($idToFind, $usertype, $numRecordPerPage) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$line = -1;
				switch ($usertype) {
					case '1':
						$sql = "SELECT poi.id_poi FROM poi WHERE delete_poi = FALSE ORDER BY id_poi DESC";
						$result = mysql_query($sql);

						$i = 0;
						while ($row = mysql_fetch_array($result)) {
							$i++;
							if ($idToFind == $row['id_poi']) {
								$line = $i;
							}
						}

						if ($line != -1) {
							$numerofpage = ceil($line / $numRecordPerPage);
							echo ''.$numerofpage.'';
						} else {
							echo '-1';
						}

						break;
					case '2':
						$sql = "SELECT poi.id_poi FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
						$result = mysql_query($sql);

						$i = 0;
						while ($row = mysql_fetch_array($result)) {
							$i++;
							if ($idToFind == $row['id_poi']) {
								$line = $i;
							}
						}

						if ($line != -1) {
							$numerofpage = ceil($line / $numRecordPerPage);
							echo ''.$numerofpage.'';
						} else {
							echo '-1';
						}

						break;
					case '3':
						$sql = "SELECT poi.id_poi FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$_SESSION['pole']." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY id_poi DESC";
						$result = mysql_query($sql);

						$i = 0;
						while ($row = mysql_fetch_array($result)) {
							$i++;
							if ($idToFind == $row['id_poi']) {
								$line = $i;
							}
						}

						if ($line != -1) {
							$numerofpage = ceil($line / $numRecordPerPage);
							echo ''.$numerofpage.'';
						} else {
							echo '-1';
						}

						break;
					case '4':
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY id_poi DESC";
						$result = mysql_query($sql);

						$i = 0;
						while ($row = mysql_fetch_array($result)) {
							$i++;
							if ($idToFind == $row['id_poi']) {
								$line = $i;
							}
						}

						if ($line != -1) {
							$numerofpage = ceil($line / $numRecordPerPage);
							echo ''.$numerofpage.'';
						} else {
							echo '-1';
						}
						break;
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

	
	
	/* 	Function name 	: normalize
	 * 	Input			: string
	 * 	Output			: normalize string
	 * 	Object			: remove accent
	 * 	Date			: Feb. 2, 2012
	 */		
	
	function normalize ($string) {
		$table = array(
			'Š'=>'S', 'š'=>'s', 'Đ'=>'Dj', 'đ'=>'dj', 'Ž'=>'Z', 'ž'=>'z', 'Č'=>'C', 'č'=>'c', 'Ć'=>'C', 'ć'=>'c',
			'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A', 'Z'=>'C', 'È'=>'E', 'É'=>'E',
			'Ê'=>'E', 'Ë'=>'E', 'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I', 'Ñ'=>'N', 'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O',
			'Õ'=>'O', 'Ö'=>'O', 'Ø'=>'O', 'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U', 'Ý'=>'Y', 'Þ'=>'B', 'ß'=>'Ss',
			'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a', 'Z'=>'c', 'è'=>'e', 'é'=>'e',
			'ê'=>'e', 'ë'=>'e', 'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i', 'ð'=>'o', 'ñ'=>'n', 'ò'=>'o', 'ó'=>'o',
			'ô'=>'o', 'õ'=>'o', 'ö'=>'o', 'ø'=>'o', 'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ý'=>'y', 'ý'=>'y', 'þ'=>'b',
			'ÿ'=>'y', 'Ŕ'=>'R', 'ŕ'=>'r',
		);

		return strtr($string, $table);
	}
	
	
	/* 	Function name 	: is_in_polygon
	 * 	Input			: tableau de latitudes, tableau de longitudes, latitude et longitude du point à chercher, nombre de points
	 * 	Output			: 0 si pas dans le polygone, 1 si dans le polygone
	 * 	Object			: find point in polygon
	 * 	Date			: Nov. 30, 2012
	 */	
	
	function is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y) {
		$i = $j = $c = 0;
		for ($i = 0, $j = $points_polygon ; $i < $points_polygon; $j = $i++) {
			if ( (($vertices_y[$i]  >  $latitude_y != ($vertices_y[$j] > $latitude_y)) &&
			($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i]) ) )
			$c = !$c;
		}
		return $c;
	}

	/* 	Function name 	: getComments
	 * 	Input			: id
	 * 	Output			: json
	 * 	Object			: get comments per ID
	 * 	Date			: Dec. 13, 2015
	 */

	function getComments($id_poi) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$sql = "SELECT * FROM commentaires WHERE poi_id_poi = ".$id_poi;
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);

				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_commentaires'] = $row['id_commentaires'];
						$arr[$i]['text_commentaires'] = stripslashes($row['text_commentaires']);
						$arr[$i]['display_commentaires'] = $row['display_commentaires'];
						$arr[$i]['url_photo'] = $row['url_photo'];
						$arr[$i]['datecreation'] = $row['datecreation'];
						$arr[$i]['mail_commentaires'] = $row['mail_commentaires'];
						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
				} else {
					echo '({"total":"0", "results":""})';
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: displayComment
	 * 	Input			: id_comment, display_comment
	 * 	Output			: json
	 * 	Object			: display comments per ID
	 * 	Date			: Dec. 13, 2015
	 */

	function displayComment($id_comment, $display_comment) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");


				$sql = "UPDATE commentaires SET display_commentaires = $display_comment WHERE id_commentaires = $id_comment";
				$result = mysql_query($sql);

				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

	/* 	Function name 	: editComment
	 * 	Input			: id_comment, text_comment
	 * 	Output			: json
	 * 	Object			: edit comments per ID
	 * 	Date			: Dec. 13, 2015
	 */

	function editComment($id_comment, $text_comment) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$text = mysql_real_escape_string($text_comment);
				$sql = "UPDATE commentaires SET text_commentaires = '$text' WHERE id_commentaires = $id_comment";
				$result = mysql_query($sql);


				$sql = "SELECT poi_id_poi FROM commentaires WHERE id_commentaires = ".$id_comment;
				$res = mysql_query($sql);
				$row = mysql_fetch_row($res);
				$id_poi = $row[0];

				$lastdatemodif_poi = date("Y-m-d H:i:s");
				$sql3 = "UPDATE poi SET lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
				$result3 = mysql_query($sql3);

				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

	/* 	Function name 	: createPublicComment
		 * 	Output			: json
		 * 	Object			: add comment on POI
		 * 	Date			: Dec. 13, 2015
		 */

	function createPublicComment() {
		switch (SGBD) {
			case 'mysql':
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . "\n", 3, LOG_FILE);
				}
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$id_poi = $_POST['id_poi'];
				$text = mysql_real_escape_string($_POST['text_comment']);
				$mail_commentaires = mysql_real_escape_string($_POST['mail_comment']);
				
				//si une photo a été associée au commentaire, on la traite
				if (isset($_FILES['photo-path']) && $_FILES['photo-path']['name'] != ""){
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " photo-path isset " . $_FILES['photo-path']['name'] . "\n", 3, LOG_FILE);
					}
					$dossier = '../../../resources/pictures/';
					$fichier = basename($_FILES['photo-path']['name']);
					$taille_maxi = 6291456;
					$taille = filesize($_FILES['photo-path']['tmp_name']);
					$extensions = array('.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG');
					$extension = strrchr($_FILES['photo-path']['name'], '.');
						
					if (!in_array($extension, $extensions)) {
						$erreur = getTranslation($_SESSION['id_language'],'ERROR');
						$return['success'] = false;
						$return['pb'] = getTranslation($_SESSION['id_language'],'PICTUREPNGGIFJPGJPEG');
					}
						
					if ($taille > $taille_maxi) {
						$erreur = getTranslation($_SESSION['id_language'],'ERROR');
						$return['success'] = false;
						$return['pb'] = getTranslation($_SESSION['id_language'],'PICTURESIZE');
					}
						
					if (!isset($erreur)) {
						if (DEBUG){
							error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " pas d'erreur, on continue \n", 3, LOG_FILE);
						}
						$fichier = strtr($fichier,
								'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ_',
								'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy-');
						$fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);
						$fichier = 'poi_'.$id_poi.'_'.$fichier;
						$pathphoto = $dossier.$fichier;
						if (move_uploaded_file($_FILES['photo-path']['tmp_name'], $pathphoto)) {
							if (DEBUG){
								error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " dans move_uploaded_file \n", 3, LOG_FILE);
							}
							$size = getimagesize($pathphoto);
								
							if ($size[0] > 1024 || $size[1] > 1024) {
								if ($size[0] > $size[1]) {
									generate_image_thumbnail($pathphoto, $pathphoto, 1024, 768);
								} else {
									generate_image_thumbnail($pathphoto, $pathphoto, 768, 1024);
								}
							}
								
							$size = getimagesize($pathphoto);
							$newnamefichier = $size[0].'x'.$size[1].'x'.$fichier;
							$newpathphoto = $dossier.$newnamefichier;
							rename($pathphoto, $newpathphoto);
							$url_photo = $newnamefichier;
							
							$return['success'] = true;
							$return['ok'] = getTranslation($_SESSION['id_language'],'PHOTOTRANSFERTDONE');
						} else {
							$return['success'] = false;
							$return['pb'] = "Erreur lors du traitement de la photo.";
						}
					}
				}
				
				//si une photo a été associée au commentaire et que tout s'est bien passé, ou bien s'il n'y avaotr pas de photo, on peut crer le commentaire dans la base de données
				if ((isset($_FILES['photo-path']['name']) && $return['success'] ==  true) || (isset($_FILES['photo-path']['name']) && $_FILES['photo-path']['name'] == "")){
					// si le mail est un administrateur ou un modérateur alors on bypasse la modération
					$sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_commentaires."'";
					$result2 = mysql_query($sql2);
					$num_rows2 = mysql_num_rows($result2);
					$displayFlag = 1;
					if ($num_rows2 == 0) {
						$displayFlag = 0;
					}
					$sql = "INSERT INTO commentaires (text_commentaires, display_commentaires, mail_commentaires, poi_id_poi,url_photo) VALUES ('$text', $displayFlag, '$mail_commentaires',$id_poi,'$url_photo')";
					$result = mysql_query($sql);
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " " . $_POST['task'] .", sql : $sql\n", 3, LOG_FILE);
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Erreur ". mysql_errno($link) . " : " . mysql_error($link)."\n", 3, LOG_FILE);
					}
					$id_commentaire = mysql_insert_id();
					
					if (!$result) {
						$return['success'] = false;
						$return['pb'] = "Erreur lors de l'ajout du commentaire.";
					} else {
						$lastdatemodif_poi = date("Y-m-d H:i:s");
						$sql3 = "UPDATE poi SET lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
						if (DEBUG){
							error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " sql $sql3 \n", 3, LOG_FILE);
							error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Erreur ". mysql_errno($link) . " : " . mysql_error($link)."\n", 3, LOG_FILE);
						}
						$result3 = mysql_query($sql3);
						$return['success'] = true;
						$return['ok'] = "Le commentaire a été correctement ajouté et est directement affiché (après rechargement de la page) puisque vous êtes référencé(e) comme modérateur ou administrateur de VelObs.";
						//si le contributeur n'est pas un modérateur ni un administrateur par ailleurs, on envoie des mails
						if ($num_rows2 == 0){
							$return['ok'] = "Le commentaire a été correctement ajouté et est en attente de modération. Merci pour votre aide.";
							$arrayObs = getObservationDetailsInArray($id_poi);
							$arrayDetailsAndUpdateSQL = getObservationDetailsInString($arrayObs);
							$newCommentInfo = "Nouveau commentaire : $text \nPosté par $mail_commentaires \n";
							if ($url_photo != ""){
								$newCommentInfo .= "Photo : ".URL."/resources/pictures/".$url_photo."\n";
							}
							/* envoi d'un mail aux administrateurs de l'association et modérateurs */
							$whereClause = "u.usertype_id_usertype = 1 OR (u.usertype_id_usertype = 4 AND u.num_pole = ".$arrayObs['pole_id_pole'].")";
							$subject = 'Nouveau commentaire à modérer sur le pole '.$arrayObs['lib_pole'];
							$message = "Bonjour !
Un nouveau commentaire a été ajouté sur le pole ".$arrayObs['lib_pole'].". Veuillez vous connecter à l'interface d'administration pour le modérer (cliquer sur le bouton \"Commentaires\", en bas à droite, une fois les détails de l'observation affichés).
Lien vers la modération : ".URL.'/admin.php?id='.$arrayObs['id_poi']."\n".
$newCommentInfo. $arrayDetailsAndUpdateSQL['detailObservationString']."\n";
							$mails = array();
							$mails = getMailsToSend($whereClause, $subject, $message );
					
							/* debut envoi d'un mail au contributeur */
							$subject = 'Commentaire en attente de modération';
							$message = "Bonjour !
Vous venez d'ajouter un commentaire à l'observation ".$arrayObs['id_poi']." sur VelObs et nous vous en remercions. Celui-ci devrait être administré sous peu.\n".
$newCommentInfo.$arrayDetailsAndUpdateSQL['detailObservationString']."\n
Cordialement, l'Association ".VELOBS_ASSOCIATION." :)";
							$mailArray = [$mail_commentaires,"Soumetteur", $subject, $message ];
							array_push($mails,$mailArray);
							if (DEBUG){
								error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($mails) ." mails à envoyer\n", 3, LOG_FILE);
							}
							$succes = sendMails($mails);
						}
					}
				}
				
				//retourne le résultat du traitement du commentaire
				echo json_encode($return);
				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
?>
