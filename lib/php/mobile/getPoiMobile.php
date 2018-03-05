<?php header('Content-Type:text/xml; charset=UTF-8');
	include_once '../key.php';

	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");

			$id_poi = $_GET['id'];

			$sql = "SELECT id_poi, num_poi, rue_poi, commune_id_commune, photo_poi, desc_poi FROM poi WHERE id_poi = ".$id_poi;
            mysql_query("SET NAMES utf8mb4");
			$result = mysql_query($sql);
			print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
			print '<response>';
			$nbrows = mysql_num_rows($result);
			if ($nbrows == 0) {
			    print '<poi />';
			} else {
			    print '<poi>';
                while ($row = mysql_fetch_array($result)) {
                    $sql2 = "SELECT id_commune, lib_commune FROM commune WHERE commune.id_commune = ".$row['commune_id_commune'];
                    $result2 = mysql_query($sql2);
                    while ($row2 = mysql_fetch_array($result2)) {
                        $lib_commune = $row2['lib_commune'];
                    }
                    print '<id>'.$row['id_poi'].'</id>';
                    if ($row['num_poi'] == '') {
                        print '<num />';
                    } else {
                        print '<num>'.stripslashes($row['num_poi']).'</num>';
                    }
                    if ($row['rue_poi'] == '') {
                        print '<rue />';
                    } else {
                        print '<rue>'.stripslashes($row['rue_poi']).'</rue>';
                    }
                    if ($lib_commune == '') {
                        print '<ville />';
                    } else {
                        print '<ville>'.$lib_commune.'</ville>';
                    }
                    if ($row['photo_poi'] == '') {
                        print '<photo />';
                    } else {
                        print '<photo>/resources/pictures/'.$row['photo_poi'].'</photo>';
                    }
                    if ($row['desc_poi'] == '') {
                        print '<desc />';
                    } else {
                        print '<desc>'.stripslashes($row['desc_poi']).'</desc>';
                    }
                }
                print '</poi>';
			}
			print '</response>';

			mysql_free_result($result);
			mysql_free_result($result2);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>