<?php header('Content-Type: text/html; charset=UTF-8');
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");
			
			$json = "[";
			$sql = "SELECT c.* 
					FROM category AS c
					WHERE c.display_category = TRUE 
					ORDER BY c.treerank_category ASC";
		
			$result = mysql_query($sql);
			while ($row = mysql_fetch_array($result)){
				$sql2 = "SELECT distinct(subcategory.id_subcategory), 
							subcategory.lib_subcategory, 
							subcategory.icon_subcategory 
						FROM subcategory 
						INNER JOIN poi ON (poi.subcategory_id_subcategory = subcategory.id_subcategory) 
						WHERE display_subcategory = TRUE AND 
							category_id_category =  ".$row['id_category']."
						ORDER BY treerank_subcategory ASC";
				$result2 = mysql_query($sql2);
				if (mysql_num_rows($result2) > 0){
					$json .= "{";
					$json .= "'id_': '".$row['id_category']."',";
					$json .= "text: '".addslashes($row['lib_category'])."',";
					$json .= "iconCls: '".$row['icon_category']."',";
					$json .= "expanded: true,";
					$json .= "checked: true,";
					$json .= "leaf: false,";
					$json .= "children: [";
					while ($row2 = mysql_fetch_array($result2)){
							$json .= "{";
							$json .= "id: '".$row2['id_subcategory']."',";
							$json .= "text: '".addslashes($row2['lib_subcategory'])."',";
							$json .= "iconCls: '".$row2['icon_subcategory']."',";
							$json .= "leaf: true,";
							$json .= "},";
					}
					$json = substr($json, 0, strlen($json)-1);
					$json .= "]";
					$json .= "},";
				} else {
					$json .= "leaf: true";
					$json .= "},";
				}
			}
			$json = substr($json, 0, strlen($json)-1);
			$json .= "]";
		
			echo $json;


			mysql_free_result($result);
			mysql_free_result($result2);
			mysql_free_result($result3);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>