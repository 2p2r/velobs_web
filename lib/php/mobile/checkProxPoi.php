<?php header('Content-Type:text/xml; charset=UTF-8');
	include_once '../key.php';

	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");

            print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
            print '<response>';
            //$buffer = $_POST['buffer'];
            if (!isset($_POST['lat']) || !isset($_POST['lng'])) {
                print '<coderetour result="-1" />';
                print '<listpoi>';
                print '</listpoi>';
                print '</response>';
            } else {
                if (!isset($_POST['buffer'])) {
                    $buffer = 0.25;
                } else {
                    $buffer = $_POST['buffer'] / 1000;
                }
                $centerlat = $_POST['lat'];
                $centerlng = $_POST['lng'];
                $sql = "SELECT  datecreation_poi, prop_poi, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y,commune_id_commune, desc_poi, num_poi, photo_poi, id_poi, lib_poi, rue_poi, status_id_status, subcategory_id_subcategory, 6371 * 2 * asin(sqrt(power(sin((".$centerlat." - abs(y(geom_poi))) * pi() / 180 / 2), 2) + cos(".$centerlat." * pi() / 180) * cos(abs(y(geom_poi)) * pi() / 180) * power(sin((".$centerlng." - x(geom_poi)) * pi() / 180 / 2), 2) )) AS distance, priorite_id_priorite FROM poi WHERE priorite_id_priorite <> 6 AND moderation_poi = 1 AND (status_id_status LIKE 1 OR status_id_status LIKE 3 OR status_id_status LIKE 5) HAVING distance < ".$buffer." ORDER BY distance";
                //$sql = "SELECT id_poi, lib_poi, rue_poi, status_id_status, subcategory_id_subcategory, 6371 * 2 * asin(sqrt(power(sin((".$centerlat." - abs(y(geom_poi))) * pi() / 180 / 2), 2) + cos(".$centerlat." * pi() / 180) * cos(abs(y(geom_poi)) * pi() / 180) * power(sin((".$centerlng." - x(geom_poi)) * pi() / 180 / 2), 2) )) AS distance FROM poi HAVING distance < ".$buffer." ORDER BY distance";
                $result = mysql_query($sql);
                $num_rows = mysql_num_rows($result);
                if ($num_rows == 0) {
                    print '<coderetour result="0" />';
                    print '<listpoi>';
                    print '</listpoi>';
                } else {
                    print '<coderetour result="'.$num_rows.'" />';
                    print '<listpoi>';
                    while ($row = mysql_fetch_array($result)) {
                        $sql2 = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$row['subcategory_id_subcategory'];
                        $result2 = mysql_query($sql2);
                        while ($row2 = mysql_fetch_array($result2)) {
                            $subcategory = $row2['lib_subcategory'];
                        }
                        mysql_free_result($result2);
                        $sql3 = "SELECT id_commune, lib_commune FROM commune WHERE commune.id_commune = ".$row['commune_id_commune'];
                        $result3 = mysql_query($sql3);
                        while ($row3 = mysql_fetch_array($result3)) {
                            $lib_commune = $row3['lib_commune'];
                        }
                        mysql_free_result($result3);
                        $distance = intval($row['distance'] * 1000);
                        //print '<poi id="'.$row['id_poi'].'" category="'.addslashes(stripslashes($subcategory)).'" adresse="'.addslashes(stripslashes($row['rue_poi'])).'" distance="'.$distance.'" />';
                        //print '<poi id="'.$row['id_poi'].'" category="'.addslashes(stripslashes($subcategory)).'" adresse="'.addslashes(stripslashes($row['rue_poi'])).'" distance="'.$distance.'" status="'.$row['status_id_status'].'"/>';
                        //print '<poi id="'.$row['id_poi'].'" category="'.stripslashes($subcategory).'" adresse="'.stripslashes($row['rue_poi']).'" distance="'.$distance.'" status="'.$row['status_id_status'].'" photo="'.$row['photo_poi'].'" num="'.stripslashes($row['num_poi']).'" desc="'.stripslashes($row['desc_poi']).'" ville="'.stripslashes($lib_commune).'" />';
                        print '<poi id="'.$row['id_poi'].'">';
                            print '<category><![CDATA['.stripslashes($subcategory).']]></category>';
                            print '<adresse><![CDATA['.stripslashes($row['rue_poi']).']]></adresse>';
                            print '<desc><![CDATA['.stripslashes($row['desc_poi']).']]></desc>';
                            print '<distance>'.$distance.'</distance>';
                            print '<status><![CDATA['.$row['status_id_status'].']]></status>';
                            print '<photo>'.$row['photo_poi'].'</photo>';
                            print '<num><![CDATA['.stripslashes($row['num_poi']).']]></num>';
			    			print '<latitude>'.$row['Y'].'</latitude>';
                            print '<longitude>'.$row['X'].'</longitude>';
                            print '<ville><![CDATA['.stripslashes($lib_commune).']]></ville>';
			    			print '<prop><![CDATA['.stripslashes($row['prop_poi']).']]></prop>';
			    			print '<dateCreation><![CDATA['.stripslashes($row['datecreation_poi']).']]></dateCreation>';
                        print '</poi>';
                    }
                    print '</listpoi>';
                }
                print '</response>';
                mysql_free_result($result);
                mysql_close($link);
            }
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>
