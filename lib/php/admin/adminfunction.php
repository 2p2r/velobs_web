<?php
	include '../key.php';
	include '../commonfunction.php';	
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
	 * 		- getPoiBasket
	 * 		- getPoiBasketPole
	 * 		- findPoi
	 * 		- findPoiBasket
	 * 		- getPoiComcom
	 * 		- getPoiComcomPole
	 * 		- getPoiPole
	 * 		- findPoiGT
	 * 		- findPoiPole
	 * 		- updatePoi
	 *	  - updatePoiComcomCarto
	 *	  - updatePoiPoleTechCarto
	 *	  - updateAssoPoleCartoPoi
	 *	  - updateAdminPoi
	 * 		- createPoi
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
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				if ($sort == '0' && $dir == '0') {
					switch ($asc) {
						case 'subcategory':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY lib_subcategory ASC";
							break;
						case 'lib':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY lib_poi ASC";
							break;
						case 'default':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY id_poi DESC";
						case 'id':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY id_poi DESC";
							break;
						default:
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY id_poi DESC";
							break;
					}
				} else {
					$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY ".$sort." ".$dir;
				}

				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_subcategory']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
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

						$sql2 = "SELECT * FROM poi_commentaires WHERE poi_id_poi = ".$row['id_poi'];
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_comments'] = $nb2;

						$sql2 = "SELECT * FROM poi_photos WHERE poi_id_poi = ".$row['id_poi'];
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_photos'] = $nb2;

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


	/*	Function name	: getPoiBasket
	 * 	Input			:
	 * 	Output			:
	 * 	Object			: populate poi basket grid
	 * 	Date			: Dec 25, 2012
	 */

	function getPoiBasket($start, $limit, $asc){ 
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				switch ($asc) {
					case 'subcategory':
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = TRUE ORDER BY lib_subcategory ASC";
						break;
					case 'lib':
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = TRUE ORDER BY lib_poi ASC";
						break;
					case 'default':
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = TRUE ORDER BY id_poi ASC";
					case 'id':
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = TRUE ORDER BY id_poi ASC";
						break;
					default:
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = TRUE ORDER BY id_poi ASC";
						break;
				}
				
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
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
						$arr[$i]['delete_poi'] = $row['delete_poi'];
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


	/*	Function name	: getPoiBasketPole
		 * 	Input			:
		 * 	Output			:
		 * 	Object			: populate poi basket grid pole
		 * 	Date			: July 9, 2015
		 */

		function getPoiBasketPole($start, $limit, $asc){
			switch (SGBD) {
				case 'mysql':
					$link = mysql_connect(HOST,DB_USER,DB_PASS);
					mysql_select_db(DB_NAME);
					mysql_query("SET NAMES 'utf8'");

					switch ($asc) {
						case 'subcategory':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = TRUE ORDER BY lib_subcategory ASC";
							break;
						case 'lib':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = TRUE ORDER BY lib_poi ASC";
							break;
						case 'default':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = TRUE ORDER BY id_poi ASC";
						case 'id':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = TRUE ORDER BY id_poi ASC";
							break;
						default:
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = TRUE ORDER BY id_poi ASC";
							break;
					}

					$result = mysql_query($sql);
					$nbrows = mysql_num_rows($result);
					$sql .= " LIMIT ".$limit." OFFSET ".$start;
					$result = mysql_query($sql);

					$i = 0;
					if ($nbrows > 0) {
						while ($row = mysql_fetch_array($result)) {
							$arr[$i]['id_poi'] = $row['id_poi'];
							$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
							$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
							$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
							$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
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
							$arr[$i]['delete_poi'] = $row['delete_poi'];
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


	/*	Function name	: getPoiComcom
	 * 	Input			:
	 * 	Output			:
	 * 	Object			: populate poi grid
	 * 	Date			: May 21, 2012
	 */

	function getPoiComcom($start, $limit, $asc, $sort, $dir){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				if ($sort == '0' && $dir == '0') {
					switch ($asc) {
						case 'subcategory':
							//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY lib_subcategory ASC";
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY lib_subcategory ASC";
							break;
						case 'lib':
							//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY lib_poi ASC";
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY lib_poi ASC";
							break;
						case 'default':
							//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi ASC";
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
						case 'id':
							//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi ASC";
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
							break;
						default:
							//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi ASC";
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
							break;
					}
				} else {
					$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY ".$sort." ".$dir;
				}

				
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
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
						$arr[$i]['geolocatemode_poi'] = $row['geolocatemode_poi'];
						$arr[$i]['longitude_poi'] = $row['X'];
						$arr[$i]['latitude_poi'] = $row['Y'];
						$arr[$i]['lib_status'] = stripslashes($row['lib_status']);

						$sql2 = "SELECT * FROM poi_commentaires INNER JOIN commentaires ON (poi_commentaires.commentaires_id_commentaires = commentaires.id_commentaires) WHERE poi_id_poi = ".$row['id_poi']." AND commentaires.display_commentaires = 1";
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_comments'] = $nb2;

						$sql2 = "SELECT * FROM poi_photos INNER JOIN photos ON (poi_photos.photos_id_photos = photos.id_photos) WHERE poi_id_poi = ".$row['id_poi']." AND display_photos = 1";
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_photos'] = $nb2;

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


	/*	Function name	: getPoiComcomPole
		 * 	Input			:
		 * 	Output			:
		 * 	Object			: populate poi grid asso pole
		 * 	Date			: July 9, 2015
		 */

		function getPoiComcomPole($start, $limit, $asc, $sort, $dir){
			switch (SGBD) {
				case 'mysql':
					$link = mysql_connect(HOST,DB_USER,DB_PASS);
					mysql_select_db(DB_NAME);
					mysql_query("SET NAMES 'utf8'");

					if ($sort == '0' && $dir == '0') {
						switch ($asc) {
							case 'subcategory':
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY lib_subcategory ASC";
								$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY lib_subcategory ASC";
								break;
							case 'lib':
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY lib_poi ASC";
								$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY lib_poi ASC";
								break;
							case 'default':
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
								$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY id_poi ASC";
							case 'id':
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole <> 9 AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
								$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY id_poi ASC";
								break;
							default:
								$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY id_poi DESC";
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi DESC";
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE delete_poi = FALSE ORDER BY id_poi DESC";
								//$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE moderation_poi = 1 AND commune_id_commune IN (".str_replace(';',',',$_SESSION['territoire']).") AND delete_poi = FALSE AND priorite.id_priorite <> 7 AND priorite.id_priorite <> 15 ORDER BY id_poi ASC";
								break;
						}
					} else {
						$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE pole_id_pole = ".$_SESSION['pole']." AND delete_poi = FALSE ORDER BY ".$sort." ".$dir;
					}



					$result = mysql_query($sql);
					$nbrows = mysql_num_rows($result);
					$sql .= " LIMIT ".$limit." OFFSET ".$start;
					$result = mysql_query($sql);

					$i = 0;
					if ($nbrows > 0) {
						while ($row = mysql_fetch_array($result)) {
							$arr[$i]['id_poi'] = $row['id_poi'];
							$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
							$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
							$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
							$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
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
							$arr[$i]['geolocatemode_poi'] = $row['geolocatemode_poi'];
							$arr[$i]['longitude_poi'] = $row['X'];
							$arr[$i]['latitude_poi'] = $row['Y'];
							$arr[$i]['lib_status'] = stripslashes($row['lib_status']);
							$arr[$i]['lastdatemodif_poi'] = $row['lastdatemodif_poi'];

							$sql2 = "SELECT * FROM poi_commentaires WHERE poi_id_poi = ".$row['id_poi'];
							$res2 = mysql_query($sql2);
							$nb2 = mysql_num_rows($res2);
							$arr[$i]['num_comments'] = $nb2;

							$sql2 = "SELECT * FROM poi_photos WHERE poi_id_poi = ".$row['id_poi'];
							$res2 = mysql_query($sql2);
							$nb2 = mysql_num_rows($res2);
							$arr[$i]['num_photos'] = $nb2;

							$i++;
						}
						echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
						//echo '({"total":"'.$sql.'","results":'.json_encode($arr).'})';
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


	/*	Function name	: getPoiPole
	 * 	Input			:
	 * 	Output			:
	 * 	Object			: populate poi grid
	 * 	Date			: November 19, 2012
	 */

	function getPoiPole($start, $limit, $asc, $num_pole, $sort, $dir){
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				if ($sort == '0' && $dir == '0') {
					switch ($asc) {
						case 'subcategory':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$num_pole." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY lib_subcategory ASC";
							break;
						case 'lib':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$num_pole." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY lib_poi ASC";
							break;
						case 'default':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$num_pole." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY id_poi DESC";
						case 'id':
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$num_pole." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY id_poi DESC";
							break;
						default:
							$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$num_pole." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY id_poi DESC";
							break;
					}
				} else {
					$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) WHERE moderation_poi = 1 AND pole_id_pole = ".$num_pole." AND transmission_poi = 1 AND delete_poi = FALSE ORDER BY ".$sort." ".$dir;
				}
				
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$sql .= " LIMIT ".$limit." OFFSET ".$start;
				$result = mysql_query($sql);
				
				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
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
						$arr[$i]['geolocatemode_poi'] = $row['geolocatemode_poi'];
						$arr[$i]['longitude_poi'] = $row['X'];
						$arr[$i]['latitude_poi'] = $row['Y'];

						$sql2 = "SELECT * FROM poi_commentaires INNER JOIN commentaires ON (poi_commentaires.commentaires_id_commentaires = commentaires.id_commentaires) WHERE poi_id_poi = ".$row['id_poi']." AND commentaires.display_commentaires = 1";
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_comments'] = $nb2;

						$sql2 = "SELECT * FROM poi_photos INNER JOIN photos ON (poi_photos.photos_id_photos = photos.id_photos) WHERE poi_id_poi = ".$row['id_poi']." AND display_photos = 1";
						$res2 = mysql_query($sql2);
						$nb2 = mysql_num_rows($res2);
						$arr[$i]['num_photos'] = $nb2;

						$i++;
					}
					echo '({"total":"'.$nbrows.'","results":'.json_encode($arr).'})';
					//echo '({"total":"'.$sql.'","results":'.json_encode($arr).'})';
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


	/*	Function name	: findPoi
	 * 	Input			: query
	 * 	Output			:
	 * 	Object			: populate poi grid
	 * 	Date			: May 2, 2012
	 */

	function findPoi($query) {
		$query = trim($query);
		$query = normalize($query); 
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE LOWER(poi.lib_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.mail_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.adherent_poi) LIKE LOWER('%".$query."%') OR LOWER(commune.lib_commune) LIKE LOWER('%".$query."%') OR LOWER(pole.lib_pole) LIKE LOWER('%".$query."%') OR LOWER(quartier.lib_quartier) LIKE LOWER('%".$query."%') OR OR LOWER(priorite.lib_priorite) LIKE LOWER('%".$query."%') LOWER(poi.rue_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.tel_poi) LIKE LOWER('%".$query."%') WHERE delete_poi = FALSE ORDER BY id_poi ASC";
				//$sql = "SELECT poi.*, subcategory.lib_subcategory, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) WHERE LOWER(poi.lib_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.mail_poi) LIKE LOWER('%".$query."%') OR LOWER(commune.lib_commune) LIKE LOWER('%".$query."%') OR LOWER(poi.adresse_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.tel_poi) LIKE LOWER('%".$query."%') ORDER BY id_poi ASC";

				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$result = mysql_query($sql);
				
				$i = 0;
				if (strlen($query) < 3){
					$nbrows = 0;
				}
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {					
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
						$arr[$i]['tel_poi'] = stripslashes($row['tel_poi']);
						$arr[$i]['mail_poi'] = stripslashes($row['mail_poi']);
						$arr[$i]['desc_poi'] = stripslashes($row['desc_poi']);
						$arr[$i]['prop_poi'] = stripslashes($row['prop_poi']);
						$arr[$i]['observationterrain_poi'] = stripslashes($row['observationterrain_poi']);
						$arr[$i]['reponsegrandtoulouse_poi'] = stripslashes($row['reponsegrandtoulouse_poi']);
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


	/*	Function name	: findPoiBasket
	 * 	Input			: query
	 * 	Output			:
	 * 	Object			: populate poi grid
	 * 	Date			: Dec 25, 2012
	 */

	function findPoiBasket($query) {
		$query = trim($query);
		$query = normalize($query); 
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$sql = "SELECT poi.*, subcategory.lib_subcategory, commune.lib_commune, pole.lib_pole, quartier.lib_quartier, priorite.lib_priorite, status.lib_status, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) INNER JOIN quartier ON (quartier.id_quartier = poi.quartier_id_quartier) INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) INNER JOIN status ON (status.id_status = poi.status_id_status) WHERE LOWER(poi.lib_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.mail_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.adherent_poi) LIKE LOWER('%".$query."%') OR LOWER(commune.lib_commune) LIKE LOWER('%".$query."%') OR LOWER(pole.lib_pole) LIKE LOWER('%".$query."%') OR LOWER(quartier.lib_quartier) LIKE LOWER('%".$query."%') OR OR LOWER(priorite.lib_priorite) LIKE LOWER('%".$query."%') LOWER(poi.rue_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.tel_poi) LIKE LOWER('%".$query."%') WHERE delete_poi = TRUE ORDER BY id_poi ASC";
				//$sql = "SELECT poi.*, subcategory.lib_subcategory, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y FROM poi INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) WHERE LOWER(poi.lib_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.mail_poi) LIKE LOWER('%".$query."%') OR LOWER(commune.lib_commune) LIKE LOWER('%".$query."%') OR LOWER(poi.adresse_poi) LIKE LOWER('%".$query."%') OR LOWER(poi.tel_poi) LIKE LOWER('%".$query."%') ORDER BY id_poi ASC";

				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);
				$result = mysql_query($sql);
				
				$i = 0;
				if (strlen($query) < 3){
					$nbrows = 0;
				}
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {					
						$arr[$i]['id_poi'] = $row['id_poi'];
						$arr[$i]['lib_poi'] = stripslashes($row['lib_poi']);
						$arr[$i]['adherent_poi'] = stripslashes($row['adherent_poi']);
						$arr[$i]['num_poi'] = stripslashes($row['num_poi']);
						$arr[$i]['rue_poi'] = stripslashes($row['rue_poi']);
						$arr[$i]['tel_poi'] = stripslashes($row['tel_poi']);
						$arr[$i]['mail_poi'] = stripslashes($row['mail_poi']);
						$arr[$i]['desc_poi'] = stripslashes($row['desc_poi']);
						$arr[$i]['prop_poi'] = stripslashes($row['prop_poi']);
						$arr[$i]['observationterrain_poi'] = stripslashes($row['observationterrain_poi']);
						$arr[$i]['reponsegrandtoulouse_poi'] = stripslashes($row['reponsegrandtoulouse_poi']);
						$arr[$i]['commentfinal_poi'] = stripslashes($row['commentfinal_poi']);
						$arr[$i]['display_poi'] = $row['display_poi'];
						$arr[$i]['fix_poi'] = $row['fix_poi'];
						$arr[$i]['traiteparpole_poi'] = $row['traiteparpole_poi'];
						$arr[$i]['moderation_poi'] = $row['moderation_poi'];
						$arr[$i]['delete_poi'] = $row['delete_poi'];
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


	/* 	Function name 	: updatePoi
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update poi grid
	 * 	Date			: July 13, 2015
	 */
	
	function updatePoi() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				// on regarde dans quelle comcom le POI appartient et on switch le contenu du mail en fonction
				$sqlCommune = "SELECT commune_id_commune FROM poi WHERE id_poi LIKE ".$id_poi;
				$res = mysql_query($sqlCommune);
				$row = mysql_fetch_row($res);
				$commune_id_commune = $row[0];

				$sqlTerritoire = "SELECT id_territoire FROM territoire WHERE ids_territoire LIKE '%".$commune_id_commune."%'";
				$res = mysql_query($sqlTerritoire);
				$rowTerritoire = mysql_fetch_row($res);
				$num_rows_territoire = mysql_num_rows($res);
				
				$sqlMailPOI = "SELECT mail_poi FROM poi WHERE id_poi = ".$id_poi;
				$result4 = mysql_query($sqlMailPOI);
				$rowMailPOI = mysql_fetch_array($result4);

				if (isset($_POST['display_poi'])) {
					$display_poi = $_POST['display_poi'];
					$sql = "UPDATE poi SET display_poi = $display_poi WHERE id_poi = $id_poi";
				} else if (isset($_POST['fix_poi'])) {
					$fix_poi = $_POST['fix_poi'];
					$sql = "UPDATE poi SET fix_poi = $fix_poi WHERE id_poi = $id_poi";
				} else if (isset($_POST['delete_poi'])) {
					$delete_poi = $_POST['delete_poi'];
					$sql = "UPDATE poi SET delete_poi = $delete_poi WHERE id_poi = $id_poi";
				} else if (isset($_POST['traiteparpole_poi'])) {
					$traiteparpole_poi = $_POST['traiteparpole_poi'];
					$sql = "UPDATE poi SET traiteparpole_poi = $traiteparpole_poi WHERE id_poi = $id_poi";
				} else if (isset($_POST['moderation_poi'])) {
					
					$sql2 = "SELECT id_priorite FROM priorite INNER JOIN poi ON (poi.priorite_id_priorite = priorite.id_priorite) WHERE id_poi = ".$id_poi;
					$result2 = mysql_query($sql2);
					$row2 = mysql_fetch_array($result2);
					$id_priorite = $row2['id_priorite'];
					
					if ($id_priorite == 4) {
						$temp = "notmoderate";
					} else {
						$fix_poi = $_POST['moderation_poi'];
						$sql = "UPDATE poi SET moderation_poi = $fix_poi WHERE id_poi = $id_poi";
						
						// gestion du champ mailsentuser_poi + envoi de mail dès que modéré
						$sql2 = "SELECT mailsentuser_poi FROM poi WHERE id_poi = ".$id_poi;
						$result2 = mysql_query($sql2);
						$row2 = mysql_fetch_array($result2);
						$mailsent = $row2['mailsentuser_poi'];
						
						if ($id_priorite == 8) {
							if (($mailsent == 0) && ($fix_poi == true)) {
								/* envoi d'un mail à l'observateur */
								$to = $rowMailPOI['mail_poi'];	
								$subject = 'Merci pour votre participation';

								if ($num_rows_territoire == 1) {
									switch ($rowTerritoire[0]) {
										case 1:
											$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques.
'.VELOBS_EMERGENCY_MAIL1.'.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.':)';
											break;
										case 2:
											$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques.
Veuillez contacter les services techniques de la communauté de communes.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.':)';
											break;
										case 3:
											$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques.
Veuillez contacter les services techniques de la communauté de communes.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.':)';
											break;
									}
								} else {
									$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques.
Veuillez contacter les services techniques de votre commune.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
								}

								sendMail($to, $subject, $message);

								// et on fixe à true le champ mailsentuser_poi
								$sql3 = "UPDATE poi SET mailsentuser_poi = 1 WHERE id_poi = ".$id_poi;
								$result3 = mysql_query($sql3);

							}
						} else {
							if (($mailsent == 0) && ($fix_poi == true)) {

								/* envoi d'un mail à l'observateur */
								$to = $rowMailPOI['mail_poi'];
								$subject = 'Merci pour votre participation';

								if ($num_rows_territoire == 1) {
									switch ($rowTerritoire[0]) {
										case 1:
											$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié a été envoyé aux services municipaux.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' :)';
											break;
										case 2:
											$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié a été envoyé aux services municipaux.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' :)';
											break;
										case 3:
											$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié a été envoyé aux services municipaux.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' :)';
											break;
									}
								} else {
									$message = 'Bonjour !
L\'observation que vous avez envoyée a été modérée par l\'association. Le problème identifié a été envoyé aux services municipaux.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
								}
								sendMail($to, $subject, $message);

								// on fixe à true le champ mailsentuser_poi
								$sql3 = "UPDATE poi SET mailsentuser_poi = 1 WHERE id_poi = ".$id_poi;
								$result3 = mysql_query($sql3);
							}
						}
					}
					
				} else if (isset($_POST['transmission_poi'])) {
					$transmission_poi = $_POST['transmission_poi'];
					$sql = "UPDATE poi SET transmission_poi = $transmission_poi WHERE id_poi = $id_poi";
				} else {
					$lib_poi = mysql_real_escape_string($_POST['lib_poi']);
					$adherent_poi = mysql_real_escape_string($_POST['adherent_poi']);
					$num_poi = mysql_real_escape_string($_POST['num_poi']);
					$rue_poi = mysql_real_escape_string($_POST['rue_poi']);
					$mail_poi = mysql_real_escape_string($_POST['mail_poi']);
					$tel_poi = mysql_real_escape_string($_POST['tel_poi']);
					$desc_poi = mysql_real_escape_string($_POST['desc_poi']);
					$prop_poi = mysql_real_escape_string($_POST['prop_poi']);
					$observationterrain_poi = mysql_real_escape_string($_POST['observationterrain_poi']);
					$reponsegrandtoulouse_poi = mysql_real_escape_string($_POST['reponsegrandtoulouse_poi']);
					$reponsepole_poi = mysql_real_escape_string($_POST['reponsepole_poi']);
					$commentfinal_poi = mysql_real_escape_string($_POST['commentfinal_poi']);
					$datecreation_poi = mysql_real_escape_string($_POST['datecreation_poi']);
					$datefix_poi = mysql_real_escape_string($_POST['datefix_poi']);
					$poleedit = mysql_real_escape_string($_POST['poleedit']);
					
					if (is_numeric($_POST['subcategory_id_subcategory'])) {	
						$subcategory_id_subcategory = $_POST['subcategory_id_subcategory'];
						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi', subcategory_id_subcategory = $subcategory_id_subcategory WHERE id_poi = $id_poi";
					} else if (is_numeric($_POST['commune_id_commune'])) {	
						$commune_id_commune = $_POST['commune_id_commune'];
						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi', commune_id_commune = $commune_id_commune WHERE id_poi = $id_poi";
					} else if (is_numeric($_POST['pole_id_pole'])) {	
						$pole_id_pole = $_POST['pole_id_pole'];
						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi', pole_id_pole = $pole_id_pole WHERE id_poi = $id_poi";
					} else if (is_numeric($_POST['quartier_id_quartier'])) {	
						$quartier_id_quartier = $_POST['quartier_id_quartier'];
						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi', quartier_id_quartier = $quartier_id_quartier WHERE id_poi = $id_poi";
					} else if (is_numeric($_POST['priorite_id_priorite']) && $_POST['priorite_id_priorite'] != 3101) {
						$priorite_id_priorite = $_POST['priorite_id_priorite'];
						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi', priorite_id_priorite = $priorite_id_priorite WHERE id_poi = $id_poi";

						// changement du workflow : si priorite == 1 ou priorite == 2 alors on modère par défaut
						if ($priorite_id_priorite == 1 || $priorite_id_priorite == 2) {
							$sqlbis = "UPDATE poi SET moderation_poi = 1 WHERE id_poi = $id_poi";
							$resultbis = mysql_query($sqlbis);
							$moderatebydefault = 1;
						}

						// mail à la personne qui a envoyé la proposition pour le prévenir que son intervention a été prise en compte par la comcom et par l'asso
						if ($priorite_id_priorite == 6) {
							$to = $rowMailPOI['mail_poi'];
							
							$sql5 = "SELECT commentfinal_poi FROM poi WHERE id_poi = ".$id_poi;
							$result5 = mysql_query($sql5);
							$row5 = mysql_fetch_array($result5);
							$comment = $row5['commentfinal_poi'];
							
							$subject = 'Observation prise en compte';

							if ($num_rows_territoire == 1) {
								switch ($rowTerritoire[0]) {
									case 1:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' vous remercient. Le problème a bien été pris en compte et réglé par la collectivité.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' :)';
										break;
									case 2:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' vous remercient. Le problème a bien été pris en compte et réglé par la collectivité.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' :)';
										break;
									case 3:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' vous remercient. Le problème a bien été pris en compte et réglé par la collectivité.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' :)';
										break;
								}
							} else {
								$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' vous remercie. Le problème a bien été pris en compte et réglé par la collectivité.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
							}

						sendMail($to, $subject, $message);
						}

						if ($priorite_id_priorite == 7 || $priorite_id_priorite == 12) {
							$to = $rowMailPOI['mail_poi'];
							
							$sql5 = "SELECT commentfinal_poi FROM poi WHERE id_poi = ".$id_poi;
							$result5 = mysql_query($sql5);
							$row5 = mysql_fetch_array($result5);
							$comment = $row5['commentfinal_poi'];
							
							$subject = 'Observation non transmise à la collectivité';

							if ($num_rows_territoire == 1) {
								switch ($rowTerritoire[0]) {
									case 1:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' vous remercient de votre participation.
Cependant le problème rapporté a été refusé.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' :)';
										break;
									case 2:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' vous remercient de votre participation.
Cependant le problème rapporté a été refusé.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' :)';
										break;
									case 3:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' vous remercient de votre participation.
Cependant le problème rapporté a été refusé.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' :)';
										break;
								}
							} else {
								$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' vous remercie de votre participation.
Cependant le problème rapporté a été refusé.
Voici le commentaire final de l\'association : '.$comment.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
							}
	
							sendMail($to, $subject, $message);
						}

						if ($priorite_id_priorite == 15) {
							$sql6 = "SELECT mail_poi FROM poi WHERE id_poi = ".$id_poi;
							$result6 = mysql_query($sql6);
							$row6 = mysql_fetch_array($result6);
							$to = $row6['mail_poi'];
							
							$subject = 'Observation doublon';

							if ($num_rows_territoire == 1) {
								switch ($rowTerritoire[0]) {
									case 1:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' vous remercient de votre participation.
Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' :)';
										break;
									case 2:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' vous remercient de votre participation.
Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' :)';
										break;
									case 3:
										$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' vous remercient de votre participation.
Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' :)';
										break;
								}
							} else {
								$message = 'Bonjour !
L\'Association '.VELOBS_ASSOCIATION.' vous remercie de votre participation.
Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
							}
							sendMail($to, $subject, $message);

							$sql7 = "UPDATE poi SET mailsentuser_poi = 1 WHERE id_poi = ".$id_poi;
							$result7 = mysql_query($sql7);

							$sql8 = "UPDATE poi SET moderation_poi = 1 WHERE id_poi = $id_poi";
							$result8 = mysql_query($sql8);
						}
						
					} else if (is_numeric($_POST['status_id_status'])) {
						$status_id_status = $_POST['status_id_status'];
						
						$sql3 = "SELECT lib_status FROM status WHERE id_status = ".$status_id_status;
						$result3 = mysql_query($sql3);
						$row3 = mysql_fetch_array($result3);
						$lib_status = $row3['lib_status'];
						
						
						$sql2 = "SELECT pole.* FROM pole INNER JOIN poi ON (id_pole = pole_id_pole) WHERE id_poi = ".$id_poi;
						$result2 = mysql_query($sql2);
						$row2 = mysql_fetch_array($result2);
						$lib_pole = $row2['lib_pole'];
						$id_pole = $row2['id_pole'];
						$territoire_id_territoire = $row2['territoire_id_territoire'];
						
						
						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi', status_id_status = $status_id_status WHERE id_poi = $id_poi";

						// mail à l'association vélo pour prévenir d'un changement de statut + mail au(x) responsable(s) du pole
						$subject = 'Changement de statut de l\'observation n°'.$id_poi.' - '.$lib_pole;

						if ($num_rows_territoire == 1) {
							switch ($rowTerritoire[0]) {
								case 1:
									$message = 'Bonjour !
'.VELOBS_COLLECTIVITE1.' a effectué un changement de statut sur l\'observation n°'.$id_poi.' du pole '.$lib_pole.'
Nouveau statut : '.$lib_status.'
Veuillez consulter l\'interface d\'administration pour consulter les informations relatives.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE1.' :)';
									break;
								case 2:
									$message = 'Bonjour !
'.VELOBS_COLLECTIVITE2.' a effectué un changement de statut sur l\'observation n°'.$id_poi.' du pole '.$lib_pole.'
Nouveau statut : '.$lib_status.'
Veuillez consulter l\'interface d\'administration pour consulter les informations relatives.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE2.' :)';
									break;
								case 3:
									$message = 'Bonjour !
'.VELOBS_COLLECTIVITE3.' a effectué un changement de statut sur l\'observation n°'.$id_poi.' du pole '.$lib_pole.'
Nouveau statut : '.$lib_status.'
Veuillez consulter l\'interface d\'administration pour consulter les informations relatives.
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' et '.VELOBS_COLLECTIVITE3.' :)';
									break;
							}
						} else {
							$message = 'Bonjour !
Un changement de statut a été effectué sur l\'observation n°'.$id_poi.' du pole '.$lib_pole.'
Nouveau statut : '.$lib_status.'
Veuillez consulter l\'interface d\'administration pour consulter les informations relatives.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
						}

						$sql2 = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1 OR (usertype_id_usertype = 4 AND num_pole = ".$id_pole.")";
						$result2 = mysql_query($sql2);
						while ($row2 = mysql_fetch_array($result2)) {
							$to = $row2['mail_users'];
							sendMail($to, $subject, $message);
						}
					} else {
						// mail à la comcom si un pole a édité le champ 'Réponse pole'
						if ($poleedit == 1) {

							$sql2 = "SELECT pole.* FROM pole INNER JOIN poi ON (id_pole = pole_id_pole) WHERE id_poi = ".$id_poi;
							$result2 = mysql_query($sql2);
							$row2 = mysql_fetch_array($result2);
							$lib_pole = $row2['lib_pole'];
							$territoire_id_territoire = $row2['territoire_id_territoire'];
							

							$subject = 'Modification de l\'observation n°'.$id_poi.' par le pole '.$lib_pole;
							$message = 'Bonjour !
Le pole '.$lib_pole.' a modifié l\'observation n°'.$id_poi.'.
Veuillez consulter l\'interface d\'administration pour voir cette modification.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';

							$sql3 = "SELECT mail_users FROM users WHERE usertype_id_usertype = 2 AND territoire_id_territoire = ".$territoire_id_territoire;
							$result3 = mysql_query($sql3);
							while ($row3 = mysql_fetch_array($result3)) {
								$to = $row3['mail_users'];
								sendMail($to, $subject, $message);
							}
						}

						$sql = "UPDATE poi SET adherent_poi = '$adherent_poi', lib_poi = '$lib_poi', rue_poi = '$rue_poi', num_poi = '$num_poi', tel_poi = '$tel_poi', mail_poi = '$mail_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', observationterrain_poi = '$observationterrain_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', commentfinal_poi = '$commentfinal_poi', datecreation_poi = '$datecreation_poi', datefix_poi = '$datefix_poi' WHERE id_poi = $id_poi";
					}
				}

				// ajout date de dernière modification du poi
				$lastdatemodif_poi = date("Y-m-d");
				$sql3 = "UPDATE poi SET lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
				$result3 = mysql_query($sql3);

				if ($temp == "notmoderate") {
					echo '3';
				} else {
					$result = mysql_query($sql);
					if (!$result) {
						echo '2';
					} else {
						if ($moderatebydefault == 1) {
							echo '4';
						} else {
							echo '1';
						}
					}
				}

				mysql_free_result($result);
				mysql_close($link);
				break;
			case 'postgresql':
				// TODO
				break;
		}
		
	}


	/* 	Function name 	: updatePoiComcomCarto
	 * 	Input			:
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update poi via carto from comcom
	 * 	Date			: July 19, 2015
	 */

	function updatePoiComcomCarto() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$reponsegrandtoulouse_poi = mysql_real_escape_string($_POST['reponsegrandtoulouse_poi']);
				$reponsepole_poi = mysql_real_escape_string($_POST['reponsepole_poi']);
				$lastdatemodif_poi = date("Y-m-d");

				$sql = "UPDATE poi SET reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', lastdatemodif_poi = '$lastdatemodif_poi'";

				if (is_numeric($_POST['commune_id_commune'])) {
					$commune_id_commune = $_POST['commune_id_commune'];
					$sql .= ", commune_id_commune = $commune_id_commune";
				}

				if (is_numeric($_POST['pole_id_pole'])) {
					$pole_id_pole = $_POST['pole_id_pole'];
					$sql .= ", pole_id_pole = $pole_id_pole";
				}

				if (is_numeric($_POST['status_id_status'])) {
					$status_id_status = $_POST['status_id_status'];
					$sql .= ", status_id_status = $status_id_status";
				}

				if (isset($_POST['transmission_poi'])) {
					$transmission_poi = $_POST['transmission_poi'];
					$sql .= ", transmission_poi = $transmission_poi";
				}

				if (isset($_POST['traiteparpole_poi'])) {
					$traiteparpole_poi = $_POST['traiteparpole_poi'];
					$sql .= ", traiteparpole_poi = $traiteparpole_poi";
				}

				$sql .= " WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				if (!$result) {
					echo '2';
				} else {
					echo '1';
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: updatePoiPoleTechCarto
	 * 	Input			:
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update poi via carto from comcom
	 * 	Date			: July 19, 2015
	 */

	function updatePoiPoleTechCarto() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$reponsepole_poi = mysql_real_escape_string($_POST['reponsepole_poi']);
				$lastdatemodif_poi = date("Y-m-d");

				$sql = "UPDATE poi SET reponsepole_poi = '$reponsepole_poi', lastdatemodif_poi = '$lastdatemodif_poi'";

				if (isset($_POST['traiteparpole_poi'])) {
					$traiteparpole_poi = $_POST['traiteparpole_poi'];
					$sql .= ", traiteparpole_poi = $traiteparpole_poi";
				}

				$sql .= " WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				if (!$result) {
					echo $sql;
				} else {
					echo '1';
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: updateAssoPoleCartoPoi
	 * 	Input			:
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update poi via carto from modo
	 * 	Date			: July 20, 2015
	 */

	function updateAssoPoleCartoPoi() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$reponsegrandtoulouse_poi = mysql_real_escape_string($_POST['reponsegrandtoulouse_poi']);
				$reponsepole_poi = mysql_real_escape_string($_POST['reponsepole_poi']);
				$observationterrain_poi = mysql_real_escape_string($_POST['observationterrain_poi']);
				$num_poi = mysql_real_escape_string($_POST['num_poi']);
				$rue_poi = mysql_real_escape_string($_POST['rue_poi']);
				$longitude_poi = $_POST['longitude_poi'];
				$latitude_poi = $_POST['latitude_poi'];
				$lastdatemodif_poi = date("Y-m-d");
				$desc_poi = mysql_real_escape_string($_POST['desc_poi']);
				$prop_poi = mysql_real_escape_string($_POST['prop_poi']);
				$commentfinal_poi = mysql_real_escape_string($_POST['commentfinal_poi']);
				$moderation_poi = $_POST['moderation_poi'];
				$display_poi = $_POST['display_poi'];

				$sql = "UPDATE poi SET display_poi = $display_poi, moderation_poi = $moderation_poi, commentfinal_poi = '$commentfinal_poi',desc_poi = '$desc_poi', prop_poi = '$prop_poi', geom_poi = GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), observationterrain_poi = '$observationterrain_poi', num_poi = '$num_poi', rue_poi = '$rue_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', lastdatemodif_poi = '$lastdatemodif_poi'";

				if (is_numeric($_POST['subcategory_id_subcategory'])) {
					$subcategory_id_subcategory = $_POST['subcategory_id_subcategory'];
					$sql .= ", subcategory_id_subcategory = $subcategory_id_subcategory";
				}

				if (is_numeric($_POST['priorite_id_priorite'])) {
					$priorite_id_priorite = $_POST['priorite_id_priorite'];
					$sql .= ", priorite_id_priorite = $priorite_id_priorite";
				}

				if (is_numeric($_POST['commune_id_commune'])) {
					$commune_id_commune = $_POST['commune_id_commune'];
					$sql .= ", commune_id_commune = $commune_id_commune";
				}

				if (is_numeric($_POST['pole_id_pole'])) {
					$pole_id_pole = $_POST['pole_id_pole'];
					$sql .= ", pole_id_pole = $pole_id_pole";
				}

				if (is_numeric($_POST['status_id_status'])) {
					$status_id_status = $_POST['status_id_status'];
					$sql .= ", status_id_status = $status_id_status";
				}

				$sql .= " WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				if (!$result) {
					echo $sql;
				} else {
					echo '1';
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: updateAdminPoi
	 * 	Input			:
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: update poi via carto from comcom
	 * 	Date			: July 21, 2015
	 */

	function updateAdminPoi() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$reponsegrandtoulouse_poi = mysql_real_escape_string($_POST['reponsegrandtoulouse_poi']);
				$reponsepole_poi = mysql_real_escape_string($_POST['reponsepole_poi']);
				$observationterrain_poi = mysql_real_escape_string($_POST['observationterrain_poi']);
				$commentfinal_poi = mysql_real_escape_string($_POST['commentfinal_poi']);
				$num_poi = mysql_real_escape_string($_POST['num_poi']);
				$rue_poi = mysql_real_escape_string($_POST['rue_poi']);
				$longitude_poi = $_POST['longitude_poi'];
				$latitude_poi = $_POST['latitude_poi'];
				$lastdatemodif_poi = date("Y-m-d");
				$desc_poi = mysql_real_escape_string($_POST['desc_poi']);
				$prop_poi = mysql_real_escape_string($_POST['prop_poi']);

				$moderation_poi = $_POST['moderation_poi'];
				$display_poi = $_POST['display_poi'];

				$sql = "UPDATE poi SET display_poi = $display_poi, moderation_poi = $moderation_poi, commentfinal_poi = '$commentfinal_poi', desc_poi = '$desc_poi', prop_poi = '$prop_poi', geom_poi = GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), observationterrain_poi = '$observationterrain_poi', num_poi = '$num_poi', rue_poi = '$rue_poi', reponsepole_poi = '$reponsepole_poi', reponsegrandtoulouse_poi = '$reponsegrandtoulouse_poi', lastdatemodif_poi = '$lastdatemodif_poi'";

				if (is_numeric($_POST['subcategory_id_subcategory'])) {
					$subcategory_id_subcategory = $_POST['subcategory_id_subcategory'];
					$sql .= ", subcategory_id_subcategory = $subcategory_id_subcategory";
				}

				if (is_numeric($_POST['priorite_id_priorite'])) {
					$priorite_id_priorite = $_POST['priorite_id_priorite'];
					$sql .= ", priorite_id_priorite = $priorite_id_priorite";
				}

				if (is_numeric($_POST['commune_id_commune'])) {
					$commune_id_commune = $_POST['commune_id_commune'];
					$sql .= ", commune_id_commune = $commune_id_commune";
				}

				if (is_numeric($_POST['pole_id_pole'])) {
					$pole_id_pole = $_POST['pole_id_pole'];
					$sql .= ", pole_id_pole = $pole_id_pole";
				}

				if (is_numeric($_POST['status_id_status'])) {
					$status_id_status = $_POST['status_id_status'];
					$sql .= ", status_id_status = $status_id_status";
				}

				$sql .= " WHERE id_poi = $id_poi";
				$result = mysql_query($sql);
				if (!$result) {
					echo $sql;
				} else {
					echo '1';
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
	}


	/* 	Function name 	: createPoi
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create poi
	 * 	Date			: Jan. 23, 2012
	 */

	function createPoi() {		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_poi = mysql_real_escape_string($_POST['lib_poi']);
				$adherent_poi = mysql_real_escape_string($_POST['adherent_poi']);
				$num_poi = mysql_real_escape_string($_POST['num_poi']);
				$rue_poi = mysql_real_escape_string($_POST['rue_poi']);
				$desc_poi = mysql_real_escape_string($_POST['desc_poi']);
				$prop_poi = mysql_real_escape_string($_POST['prop_poi']);
				$observationterrain_poi = mysql_real_escape_string($_POST['observationterrain_poi']);
				$subcategory_id_subcategory = $_POST['subcategory_id_subcategory'];
				$commune_id_commune = $_POST['commune_id_commune'];
				$pole_id_pole = $_POST['pole_id_pole'];
				$priorite_id_priorite = $_POST['priorite_id_priorite'];
				if (isset($_POST['status_id_status'])) {
					$status_id_status = $_POST['status_id_status'];
				} else {
					$status_id_status = 5;
				}
				$quartier_id_quartier = $_POST['quartier_id_quartier'];
				$display_poi = $_POST['display_poi'];
				$datecreation_poi = date('Y-m-d');		
						
				$sql = "INSERT INTO poi (lib_poi, adherent_poi, num_poi, rue_poi, commune_id_commune, pole_id_pole, priorite_id_priorite, status_id_status, quartier_id_quartier, desc_poi, prop_poi, observationterrain_poi, subcategory_id_subcategory, display_poi, fix_poi, datecreation_poi, geolocatemode_poi, moderation_poi) VALUES ('$lib_poi', '$adherent_poi', '$num_poi', '$rue_poi', $commune_id_commune, $pole_id_pole, $priorite_id_priorite, $status_id_status, $quartier_id_quartier, '$desc_poi', '$prop_poi', '$observationterrain_poi', $subcategory_id_subcategory , $display_poi, FALSE, '$datecreation_poi', 1, 1)";
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
				$sql = "UPDATE pole SET id_pole = $id_pole WHERE lib_pole = '$lib_pole'";
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
	
	function updateQuartier() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$id_quartier = $_POST['id_quartier'];
				$lib_quartier = $_POST['lib_quartier'];		
	
				$sql = "UPDATE quartier SET lib_quartier = '$lib_quartier' WHERE id_quartier = $id_quartier";
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
	
	
	/* 	Function name 	: createQuartier
	 * 	Input			: 
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: create quartier
	 * 	Date			: May 2, 2012
	 */

	function createQuartier() {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
				
				$lib_quartier = mysql_real_escape_string($_POST['lib_quartier']);		
					
				$sql = "INSERT INTO quartier (lib_quartier) VALUES ('$lib_quartier')";
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
	
	/* 	Function name 	: deleteQuartiers
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: delete quartier(s)
	 * 	Date			: May 2, 2012
	 */
	
	function deleteQuartiers() {
		$ids = $_POST['ids'];
		$idquartiers = json_decode(stripslashes($ids));
		
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				if (sizeof($idquartiers) < 1){
					echo '0';
				} else if (sizeof($idquartiers) == 1){
					$sql = "DELETE FROM quartier WHERE id_quartier = ".$idquartiers[0];
					$result = mysql_query($sql);
				} else {
					$sql = "DELETE FROM quartier WHERE ";
					for ($i = 0; $i < sizeof($idquartiers); $i++){
						$sql = $sql . "id_quartier = ".$idquartiers[$i];
						if ($i < sizeof($idquartiers) - 1){
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
	
	
	/* 	Function name 	: isModerate
	 * 	Input			:  
	 * 	Output			: success => '1' / failed => '2'
	 * 	Object			: alert if new record
	 * 	Date			: Jan. 22, 2012
	 */
	
	function isModerate() {
		$id_poi = $_POST['id_poi'];
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");
	
				$sql = "SELECT id_poi FROM poi WHERE moderation_poi = 0 OR moderation_poi IS NULL";
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
				
				$sql = "SELECT id_commune, AsText(geom_commune) AS geom FROM commune";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$commune = $row['geom'];
					$temp = substr($commune,9,-2);
					$tab = explode(',',$temp);
					$vertices_x = array();
					$vertices_y = array();
					for ($i = 0; $i < count($tab) - 1; $i++) {
						$temp = explode(" ",$tab[$i]);
						array_push($vertices_x,$temp[0]);
						array_push($vertices_y,$temp[1]);
					}
					$points_polygon = count($vertices_x) - 1;
					if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_poi, $latitude_poi)) {
						//echo "Is in polygon!";
						$commune_id_commune = $row['id_commune'];
					}
				}
				
				$pole_id_pole = 9;
				$sql = "SELECT id_pole, AsText(geom_pole) AS geom FROM pole";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$pole = $row['geom'];
					$temp = substr($pole,9,-2);
					$tab = explode(',',$temp);
					$vertices_x = array();
					$vertices_y = array();
					for ($i = 0; $i < count($tab) - 1; $i++) {
						$temp = explode(" ",$tab[$i]);
						array_push($vertices_x,$temp[0]);
						array_push($vertices_y,$temp[1]);
					}
					$points_polygon = count($vertices_x) - 1;
					if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_poi, $latitude_poi)) {
						//echo "Is in polygon!";
						$pole_id_pole = $row['id_pole'];
					}
				}
				
				$sql2 = "UPDATE poi SET commune_id_commune = ".$commune_id_commune.", pole_id_pole = ".$pole_id_pole." WHERE id_poi = $id_poi";
				$result2 = mysql_query($sql2);
				
				$lastdatemodif_poi = date("Y-m-d");
				$sql = "UPDATE poi SET geom_poi = GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), geolocatemode_poi = 1, lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
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
				$desc_poi = mysql_real_escape_string($_POST['desc_poi']);
				$prop_poi = mysql_real_escape_string($_POST['prop_poi']);
				$latitude_poi = $_POST['latitude_poi'];
				$longitude_poi = $_POST['longitude_poi'];
				$subcategory_id_subcategory = $_POST['subcategory_id_subcategory'];

				$sql = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$subcategory_id_subcategory;
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$lib_subcategory = $row['lib_subcategory'];
				}
				//détermination de la commune concernée par croisement du polygone de la commune ave latitude et longitude
				$commune_id_commune = 99999;
				$sql = "SELECT id_commune, AsText(geom_commune) AS geom, lib_commune FROM commune";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$commune = $row['geom'];
					$temp = substr($commune,9,-2);
					$tab = explode(',',$temp);
					$vertices_x = array();
					$vertices_y = array();
					for ($i = 0; $i < count($tab) - 1; $i++) {
						$temp = explode(" ",$tab[$i]);
						array_push($vertices_x,$temp[0]);
						array_push($vertices_y,$temp[1]);
					}
					$points_polygon = count($vertices_x) - 1;
					if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_poi, $latitude_poi)) {
						//echo "Is in polygon!";
						$commune_id_commune = $row['id_commune'];
						$lib_commune = $row['lib_commune'];
					}
				}

// 				$sql = "SELECT lib_commune FROM commune WHERE id_commune = ".$commune_id_commune;
// 				$result = mysql_query($sql);
// 				while ($row = mysql_fetch_array($result)) {
// 					$lib_commune = $row['lib_commune'];
// 				}
				//détermination du pole concerné par croisement du polygone de la commune ave latitude et longitude
				$pole_id_pole = 9;
				$sql = "SELECT id_pole, AsText(geom_pole) AS geom, lib_pole FROM pole";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$pole = $row['geom'];
					$temp = substr($pole,9,-2);
					$tab = explode(',',$temp);
					$vertices_x = array();
					$vertices_y = array();
					for ($i = 0; $i < count($tab) - 1; $i++) {
						$temp = explode(" ",$tab[$i]);
						array_push($vertices_x,$temp[0]);
						array_push($vertices_y,$temp[1]);
					}
					$points_polygon = count($vertices_x) - 1;
					if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_poi, $latitude_poi)) {
						//echo "Is in polygon!";
						$pole_id_pole = $row['id_pole'];
					}
				}
				
// 				$sql = "SELECT lib_pole FROM pole WHERE id_pole = ".$pole_id_pole;
// 				$result = mysql_query($sql);
// 				while ($row = mysql_fetch_array($result)) {
// 					$lib_pole = $row['lib_pole'];	
// 				}
				
				$quartier_id_quartier = 99999;
				
				$datecreation_poi = date('Y-m-d');			
				//TODO : supprimer le id_poi du lib_poi généré
				$sql = "SELECT max(id_poi) + 1, lib_subcategory FROM poi INNER JOIN subcategory ON (poi.subcategory_id_subcategory = subcategory.id_subcategory) WHERE subcategory_id_subcategory = ".$subcategory_id_subcategory;
				$result = mysql_query($sql);
				$lib_poi = mysql_real_escape_string(mysql_result($result, 0, 0)." ".mysql_result($result, 0, 1));
				//si le mail de la personne qui soumet le POI est aussi un modérateur, on positionne moderation_poi à vrai
				$sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
				$result2 = mysql_query($sql2);
				$num_rows2 = mysql_num_rows($result2);
				if ($num_rows2 == 0) {
					$sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, mail_poi, tel_poi, num_poi, rue_poi, commune_id_commune, desc_poi, prop_poi, subcategory_id_subcategory, display_poi, fix_poi, datecreation_poi, geolocatemode_poi, moderation_poi, geom_poi, status_id_status) VALUES (4, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$mail_poi', '$tel_poi', '$num_poi', '$rue_poi', $commune_id_commune, '$desc_poi', '$prop_poi', $subcategory_id_subcategory , TRUE, FALSE, '$datecreation_poi', 1, FALSE, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), 5)";
				} else {
					$sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, mail_poi, tel_poi, num_poi, rue_poi, commune_id_commune, desc_poi, prop_poi, subcategory_id_subcategory, display_poi, fix_poi, datecreation_poi, geolocatemode_poi, moderation_poi, geom_poi, status_id_status) VALUES (1, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$mail_poi', '$tel_poi', '$num_poi', '$rue_poi', $commune_id_commune, '$desc_poi', '$prop_poi', $subcategory_id_subcategory , TRUE, FALSE, '$datecreation_poi', 1, TRUE, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), 5)";
				}

				$result = mysql_query($sql);
				
				$sql = "SELECT max(id_poi) FROM poi";
				$result = mysql_query($sql);
				$max = mysql_result($result, 0, 0);
				//echo $max;
				
				$sql = "SELECT subcategory.lib_subcategory FROM subcategory INNER JOIN poi ON (poi.subcategory_id_subcategory = subcategory.id_subcategory) WHERE poi.id_poi = ".$max;
				//echo $sql;
				$result = mysql_query($sql);
				$libsubcat = mysql_result($result, 0, 0);
				$lib = $max." ".$libsubcat;
				
				$sql = "UPDATE poi SET lib_poi = '$lib' WHERE id_poi = ".$max;
				$result = mysql_query($sql);

				$linktomoderation = URL.'/admin.html?id='.$max;

				/* envoi d'un mail aux administrateurs de l'association */
				$subject = 'Nouvelle observation à modérer';
				$message = 'Bonjour !
Une nouvelle observation a été ajoutée sur le pole - '.$lib_pole.' -. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$max.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
				$details = '
				
	------------- Détails de l\'observation -------------
	 # pole : '.$lib_pole.'
	 # repère : '.$num_poi.'
	 # nom de la voie : '.$rue_poi.'
	 # commune : '.$lib_commune.'
	 # latitude : '.$latitude_poi.'
	 # longitude : '.$longitude_poi.'
	 # catégorie : '.$lib_subcategory.'
	 # description du problème : '.$desc_poi.'
	 # proposition : '.$prop_poi.'
	 # soumis par : '.$mail_poi.'
				';
				$message .= $details;
				// si la personne qui soumet le POI n'est pas admin ou moderateur sur un pole, on envoie un mail aux admin
				$sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
				$result2 = mysql_query($sql2);
				$num_rows2 = mysql_num_rows($result2);
				if ($num_rows2 == 0) {
					// boucle sur les administrateurs généraux de l'association
					$sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1";
					$result = mysql_query($sql);
					while ($row = mysql_fetch_array($result)) {
						$to = $row['mail_users'];
						if ($to != '') {
							sendMail($to, $subject, $message);
						}
					}
					$sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 4 AND num_pole = ".$pole_id_pole;
					$result = mysql_query($sql);
					while ($row = mysql_fetch_array($result)) {
						$to = $row['mail_users'];
						if ($to != '') {
							sendMail($to, $subject, $message);
						}
					}
					/* fin envoi d'un mail aux administrateurs de l'association */
				} 

				if (!$result) {
					//echo $sql;
					//echo '999999999';
					echo $max;
				} else {
					//echo $sql;
					//echo mysql_insert_id();
					echo $max;
				}

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

				$sql = "SELECT * FROM commentaires WHERE id_commentaires IN (SELECT commentaires_id_commentaires FROM poi_commentaires WHERE poi_id_poi = ".$id_poi.")";
				$result = mysql_query($sql);
				$nbrows = mysql_num_rows($result);

				$i = 0;
				if ($nbrows > 0) {
					while ($row = mysql_fetch_array($result)) {
						$arr[$i]['id_commentaires'] = $row['id_commentaires'];
						$arr[$i]['text_commentaires'] = stripslashes($row['text_commentaires']);
						$arr[$i]['display_commentaires'] = $row['display_commentaires'];
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


				$sql = "SELECT poi_id_poi FROM poi_commentaires WHERE commentaires_id_commentaires = ".$id_comment;
				$res = mysql_query($sql);
				$row = mysql_fetch_row($res);
				$id_poi = $row[0];

				$lastdatemodif_poi = date("Y-m-d");
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
		 * 	Input			: id_poi, text_comment
		 * 	Output			: json
		 * 	Object			: add comment on POI
		 * 	Date			: Dec. 13, 2015
		 */

	function createPublicComment($id_poi, $text_comment) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$text = mysql_real_escape_string($text_comment);

				$sql = "INSERT INTO commentaires (text_commentaires, display_commentaires) VALUES ('$text', 0)";
				$result = mysql_query($sql);

				$sql = "SELECT max(id_commentaires) AS maxi FROM commentaires";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$id_commentaire = $row['maxi'];
				}

				$sql = "INSERT INTO poi_commentaires (poi_id_poi, commentaires_id_commentaires) VALUES ($id_poi, $id_commentaire)";
				$result = mysql_query($sql);

				$lastdatemodif_poi = date("Y-m-d");
				$sql3 = "UPDATE poi SET lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
				$result3 = mysql_query($sql3);

				/* envoi d'un mail aux administrateurs */
				$subject = 'Nouveau commentaire à modérer sur l\'observation n°'.$id_poi;
				$message = 'Bonjour !
Un nouveau commentaire a été ajouté sur l\'observation n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'application VelObs :)';
				$details = '

	------------- Commentaire -------------
	 '.$text.'
				';
				$message .= $details;

				/* envoi d'un mail aux administrateurs #pole# de l'association */
				// boucle sur les administrateurs #pole# généraux de l'association
				$sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1 OR (usertype_id_usertype = 4 AND num_pole = (SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi."))";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$to = $row['mail_users'];
						sendMail($to, $subject, $message);
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

	/* 	Function name 	: createPublicCommentSession
		 * 	Input			: id_poi, text_comment
		 * 	Output			: json
		 * 	Object			: add comment on POI
		 * 	Date			: Dec. 13, 2015
		 */

	function createPublicCommentSession($id_poi, $text_comment) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES 'utf8'");

				$text = mysql_real_escape_string($text_comment);

				$sql = "INSERT INTO commentaires (text_commentaires, display_commentaires) VALUES ('$text', 0)";
				$result = mysql_query($sql);

				$sql = "SELECT max(id_commentaires) AS maxi FROM commentaires";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					$id_commentaire = $row['maxi'];
				}

				$sql = "INSERT INTO poi_commentaires (poi_id_poi, commentaires_id_commentaires) VALUES ($id_poi, $id_commentaire)";
				$result = mysql_query($sql);

				$lastdatemodif_poi = date("Y-m-d");
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

   /* 	Function name 	: getPhotos
		 * 	Input			: id
		 * 	Output			: json
		 * 	Object			: get photos per ID
		 * 	Date			: Dec. 14, 2015
		 */

		function getPhotos($id_poi) {
			switch (SGBD) {
				case 'mysql':
					$link = mysql_connect(HOST,DB_USER,DB_PASS);
					mysql_select_db(DB_NAME);
					mysql_query("SET NAMES 'utf8'");

					$sql = "SELECT * FROM photos WHERE id_photos IN (SELECT photos_id_photos FROM poi_photos WHERE poi_id_poi = ".$id_poi.")";
					$result = mysql_query($sql);
					$nbrows = mysql_num_rows($result);

					$i = 0;
					if ($nbrows > 0) {
						while ($row = mysql_fetch_array($result)) {
							$arr[$i]['id_photos'] = $row['id_photos'];
							$arr[$i]['url_photos'] = stripslashes($row['url_photos']);
							$arr[$i]['display_photos'] = $row['display_photos'];
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

		/* 	Function name 	: getPhotosCom
		 * 	Input			: id
		 * 	Output			: json
		 * 	Object			: get photos per ID
		 * 	Date			: Dec. 14, 2015
		 */

		function getPhotosCom($id_poi) {
			switch (SGBD) {
				case 'mysql':
					$link = mysql_connect(HOST,DB_USER,DB_PASS);
					mysql_select_db(DB_NAME);
					mysql_query("SET NAMES 'utf8'");

					$sql = "SELECT * FROM photos WHERE id_photos IN (SELECT photos_id_photos FROM poi_photos WHERE poi_id_poi = ".$id_poi.") AND display_photos = 1";
					$result = mysql_query($sql);
					$nbrows = mysql_num_rows($result);

					$i = 0;
					if ($nbrows > 0) {
						while ($row = mysql_fetch_array($result)) {
							$arr[$i]['id_photos'] = $row['id_photos'];
							$arr[$i]['url_photos'] = stripslashes($row['url_photos']);
							$arr[$i]['display_photos'] = $row['display_photos'];
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

		/* 	Function name 	: displayPhoto
			 * 	Input			: id_photo, display_photo
			 * 	Output			: json
			 * 	Object			: display photo per ID
			 * 	Date			: Dec. 13, 2015
			 */

			function displayPhoto($id_photo, $display_photo) {
				switch (SGBD) {
					case 'mysql':
						$link = mysql_connect(HOST,DB_USER,DB_PASS);
						mysql_select_db(DB_NAME);
						mysql_query("SET NAMES 'utf8'");

						$sql = "UPDATE photos SET display_photos = $display_photo WHERE id_photos = $id_photo";
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

?>
