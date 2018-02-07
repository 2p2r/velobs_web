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
			
				$sql = "SELECT treerank_category FROM category WHERE id_category = ".$id;
				$result = mysql_query($sql);
				$currentrank = mysql_result($result, 0);
				
				if ($newrank < $currentrank) {
					$newrank++;
					$sql = "UPDATE category SET treerank_category = (treerank_category + 1) WHERE treerank_category >=  ".$newrank." AND treerank_category < ".$currentrank;
					$result = mysql_query($sql);
					
					$sql = "UPDATE category SET treerank_category = ".$newrank." WHERE id_category = ".$id;
					$result = mysql_query($sql);
				} else if ($newrank > $currenrank) {
					$sql1 = "UPDATE category SET treerank_category = (treerank_category - 1) WHERE treerank_category > ".$currentrank." AND treerank_category <= ".$newrank;
					$result = mysql_query($sql1);
					
					$sql = "UPDATE category SET treerank_category = ".$newrank." WHERE id_category = ".$id;
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