<?php header('Content-Type:text/xml');
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);	
			
			$sql = "SELECT id_pole, lib_pole FROM pole ORDER BY id_pole ASC";
			$result = mysql_query($sql);
			print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			print '<poles>';
			while ($row = mysql_fetch_array($result)) {
				print '<pole nom="'.stripslashes($row['lib_pole']).'" id="'.$row['id_pole'].'" />';
			}
			print '</poles>';

			mysql_free_result($result);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}	
	
?>