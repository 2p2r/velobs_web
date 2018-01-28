<?php header('Content-Type:text/xml; charset=UTF-8');
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			
			$sql = "SELECT id_category, lib_category FROM category ORDER BY id_category ASC";
			$result = mysql_query($sql);
			print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			print '<categories>';
			while ($row = mysql_fetch_array($result)) {
				$sql2 = "SELECT id_subcategory, lib_subcategory FROM subcategory WHERE subcategory.proppublic_subcategory = 1 AND subcategory.category_id_category = ".$row['id_category']." ORDER BY id_subcategory ASC";
				$result2 = mysql_query($sql2);
				if (mysql_num_rows($result2) == 0) {
					print '<categorie nom="'.stripslashes($row['lib_category']).'" id="'.$row['id_category'].'" />';
				} else {
					print '<categorie nom="'.$row['lib_category'].'" id="'.$row['id_category'].'" >';
					while ($row2 = mysql_fetch_array($result2)){
						print '<souscategorie nom="'.stripslashes($row2['lib_subcategory']).'" id="'.$row2['id_subcategory'].'" />';
					}
					print '</categorie>';			
				}
			}
			print '</categories>';

			mysql_free_result($result);
			mysql_free_result($result2);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}	
	
?>