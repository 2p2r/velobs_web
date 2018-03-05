<?php
	session_start();
	include_once '../key.php';
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);	
				mysql_query("SET NAMES utf8mb4");
				
				$newrank = $_POST['newrank'] - 1;
				$id = $_POST['id_node'];
				$category = $_POST['category'];
			
				$sql = "SELECT treerank_subcategory FROM subcategory WHERE category_id_category = ".$category." AND id_subcategory = ".$id;
				$result = mysql_query($sql);
				$currentrank = mysql_result($result, 0);
				
				if ($newrank < $currentrank) {
					$newrank++;
					$sql = "UPDATE subcategory SET treerank_subcategory = (treerank_subcategory + 1) WHERE category_id_category = ".$category." AND treerank_subcategory >=  ".$newrank." AND treerank_subcategory < ".$currentrank;
					$result = mysql_query($sql);
					
					$sql = "UPDATE subcategory SET treerank_subcategory = ".$newrank." WHERE category_id_category = ".$category." AND id_subcategory = ".$id;
					$result = mysql_query($sql);
				} else if ($newrank > $currenrank) {
					$sql1 = "UPDATE subcategory SET treerank_subcategory = (treerank_subcategory - 1) WHERE category_id_category = ".$category." AND treerank_subcategory > ".$currentrank." AND treerank_subcategory <= ".$newrank;
					$result = mysql_query($sql1);
					
					$sql = "UPDATE subcategory SET treerank_subcategory = ".$newrank." WHERE category_id_category = ".$category." AND id_subcategory = ".$id;
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

?>