<?php
	include_once '../key.php';
	include_once '../admin/adminfunction.php';
	
	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);	

			$latitude_poi = $_POST['lat'];
			$longitude_poi = $_POST['lng'];
			$date_poi = $_POST['date'];
			$temp = $_POST['desc'];
			$desc_poi = utf8_decode($temp);
			$desc_poi = mysql_real_escape_string($desc_poi);
			$temp2 = $_POST['prop'];
			$prop_poi = utf8_decode($temp2);
			$prop_poi = mysql_real_escape_string($prop_poi);
			$subcategory_id_subcategory = $_POST['subcat'];
			if ($_POST['photo'] != "") {
				$photo_poi = '600x800x'.$_POST['photo'];
			}
			
			switch ($_POST['typegeoloc']) {
				case 'gps':
					$geolocatemode_poi = 2;
					break;
				case '3g':
					$geolocatemode_poi = 3;
					break;
			}
			$mail_poi = mysql_real_escape_string($_POST['mail']);
			$tel_poi = mysql_real_escape_string($_POST['tel']);
			$rue_poi = mysql_real_escape_string($_POST['rue']);
			$num_poi = mysql_real_escape_string($_POST['num']);
			
			$sql = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$subcategory_id_subcategory;
			$result = mysql_query($sql);
			while ($row = mysql_fetch_array($result)) {
				$lib_subcategory = mysql_real_escape_string($row['lib_subcategory']);
			}
			
			$commune_id_commune = 99999;
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
					$pole_id_pole = $row['id_pole'];
				}
			}
			
			$sql = "SELECT lib_pole FROM pole WHERE id_pole = ".$pole_id_pole;
			$result = mysql_query($sql);
			while ($row = mysql_fetch_array($result)) {
				$lib_pole = mysql_real_escape_string($row['lib_pole']);	
			}
			
			$quartier_id_quartier = 99999;
			
			$sql = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$subcategory_id_subcategory;
			$result = mysql_query($sql);
			$lib_poi = mysql_result($result, 0);
			$lib_poi = mysql_real_escape_string($lib_poi);
				
			if ($_POST['photo'] != "") {
				$sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, photo_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status) VALUES (4, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$photo_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', '$mail_poi', '$tel_poi', 0, 0, 5)";
			} else {
				$sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status) VALUES (4, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', '$mail_poi', '$tel_poi', 0, 0, 5)";			
			}











			$result = mysql_query($sql);
			if (!$result) {
			    die("data ko");
				//die($sql);
			}
			// valeur de retour pour Loïc
			echo "data ok";	

			$id_poi = mysql_insert_id();
		
			$lib_poi .= " ".$id_poi;
			$sql = "UPDATE poi SET lib_poi = '".$lib_poi."' WHERE id_poi = ".$id_poi;
			$result = mysql_query($sql);
			
			mysql_free_result($result);
			mysql_close($link);
			
			/* envoi d'un mail aux administrateurs */
			$subject = 'Nouvelle observation à modérer';
			$message = 'Bonjour !<br />
Une nouvelle observation a été ajoutée. Veuillez vous connecter à l\'interface d\'administration pour la modérer.<br />
Cordialement, l\'application velobs)';
			$details = '
				
	------------- Détails de l\'observation -------------
	 # pole : '.$lib_pole.'
	 # latitude : '.$latitude_poi.'
	 # longitude : '.$longitude_poi.'
	 # catégorie : '.$lib_subcategory.'
	 # description du problème : '.$desc_poi.'
	 # proposition : '.$prop_poi.'
	 # soumis par : '.$mail_poi.'
				';
			$message .= $details;
			
			sendMail(MAIL_ALIAS_OBSERVATION_ADHERENTS, $subject, $message);
			/* fin envoi d'un mail aux administrateurs */		
			
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>
