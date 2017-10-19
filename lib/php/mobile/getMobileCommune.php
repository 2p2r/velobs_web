<?php header('Content-Type:text/xml');
	include_once '../key.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);	
			
			$sql = "SELECT id_commune, lib_commune FROM commune ORDER BY id_commune ASC";
			$result = mysql_query($sql);
			print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			print '<communes>';
			while ($row = mysql_fetch_array($result)) {
				print '<commune nom="'.stripslashes($row['lib_commune']).'" id="'.$row['id_commune'].'" />';
			}
			print '</communes>';

			mysql_free_result($result);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}	
	
?>