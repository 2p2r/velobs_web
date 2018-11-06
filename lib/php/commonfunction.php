<?php
	include_once 'key.php';
	/* 	Function name 	: getTranslation
	 * 	Input			: language id, string
	 * 	Output			: string translation
	 * 	Object			: translate
	 * 	Date			: Jan. 18, 2012
	 */
	function getTranslation($language,$value) {
		switch (SGBD) {
			case 'mysql':
				$sql = "SELECT lib_translation FROM translation WHERE language_id_language = ".$language." AND code_translation = '".$value."'";
				$result = mysql_query($sql);
				return mysql_result($result, 0);
				
						
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	/*	Function name	: getLocations
	 * 	Input			: $latitude_poi and $longitude_poi
	* 	Output			: $array array containing commune and pole data, where the point($latitude_poi, $longitude_poi) stands
	* 	Object			: converts latitude and longitude in human understandeable information
	* 	Date			: septembre 19 2017 et novembre 2017
	*/
	function getLocations($latitude_poi, $longitude_poi){
		switch (SGBD) {
			case 'mysql':
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php -  ".$latitude_poi.", ".$longitude_poi."\n", 3, LOG_FILE);
				}
				//détermination de la commune concernée par croisement du polygone de la commune avec latitude et longitude				
				$commune_id_commune = 99999;
				$sql = "SELECT id_commune, AsText(geom_commune) AS geom, lib_commune FROM commune";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					if (isWithinPolygons($row['geom'], $latitude_poi, $longitude_poi)) {												
						//echo "Is in polygon!";
						$commune_id_commune = $row['id_commune'];
						$lib_commune = $row['lib_commune'];
					}
				}								
				//détermination du pole concerné par croisement du polygone du pole avec latitude et longitude
				$pole_id_pole = 9;
				$sql = "SELECT id_pole, AsText(geom_pole) AS geom, lib_pole FROM pole";
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					if (isWithinPolygons($row['geom'], $latitude_poi, $longitude_poi)){	
						//echo "Is in polygon!";
						$pole_id_pole = $row['id_pole'];
						$lib_pole = $row['lib_pole'];
					}
				}
				$array = [$commune_id_commune,$lib_commune,$pole_id_pole,$lib_pole];
				return $array;
	
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}
	
	/*	Function name	: isWithinPolygons
	 * 	Input			: $geom_value, $latitude_poi and $longitude_poi
	 * 	Output		: if within polygons and outside the holes 1 else 0 
	 * 	Object		: checks if the poi belongs to polygons of the geom
	 *               POLYGON((x1 y1,x2 y2),(x3 y3,x4 y4),(x5 y5,x6 y6)) 
	 *               MULTIPOLYGON(((x1 y1,x2 y2),(x3 y3,x4 y4)),((x5 y5,x6 y6)(x7 y7,x5 y5)))
	 * 	Date			: novembre 2017
	 */	
	function isWithinPolygons($geom_value, $latitude_poi, $longitude_poi){		
		// get all polygons
		if (substr($geom_value,0,1) == 'M') {
			$start = 15;
			$length = -3;
		}
		else{
			$start = 9;
			$length = -2;
		}
		$polygons = explode(')),((', substr($geom_value, $start, $length)); 
		// check all polygons
		$inPolygon = FALSE;
		for ($i = 0; ($i < count($polygons)) && !$inPolygon ; $i++) {
			// get rings
			$rings = explode('),(', $polygons[$i]); 				
			if (isWithinPolygon($rings[0], $latitude_poi, $longitude_poi)){
				$inHole = FALSE;
				for ($j = 1; ($j < count($rings)) && !$inHole; $j++) {					
					$inHole = isWithinRing($rings[$j], $latitude_poi, $longitude_poi);
				}
				$inPolygon = !$inHole;
			}
		}
		return ($inPolygon);
	}
	/*	Function name	: isWithinPolygon
	 * 	Input			: $polyg , $latitude_poi and $longitude_poi
	* 	Output		: if within the simple polygon  1 else 0
	* 	Object		: check if the poi belongs to a simple polygon
	* 	Date			: novembre 2017
	*/
	function isWithinPolygon($polyg, $latitude_poi, $longitude_poi){
		$tab = explode(',',$polyg);
		$vertices_x = array();
		$vertices_y = array();
		for ($i = 0; $i < count($tab) - 1; $i++) {
			$temp = explode(" ",$tab[$i]);
			array_push($vertices_x,$temp[0]);
			array_push($vertices_y,$temp[1]);
		}
		$points_polygon = count($vertices_x) - 1;
		return(is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_poi, $latitude_poi));	
	}			
	
	
	
	/* 	Function name 	: generate_image_thumbnail
	 * 	Input			: une url d'image en entrée, le path en sortie, la largeur et la hauteur
	* 	Output			: ---
	* 	Object			: génère les images medium et small
	* 	Date			: Jul. 11, 2012
	*/
	function generate_image_thumbnail($source_image_path, $thumbnail_image_path, $width, $height) {
		list($source_image_width, $source_image_height, $source_image_type) = getimagesize($source_image_path);
		//	echo $source_image_path." ".$source_image_type;
		switch ($source_image_type)	{
			case IMAGETYPE_GIF:
				$source_gd_image = imagecreatefromgif($source_image_path);
				break;
			case IMAGETYPE_JPEG:
				$source_gd_image = imagecreatefromjpeg($source_image_path);
				$exif = exif_read_data($source_image_path);
				if ($source_gd_image && $exif && isset($exif['Orientation'])) {
					$ort = $exif['Orientation'];

					if ($ort == 6 || $ort == 5)
					    $source_gd_image = imagerotate($source_gd_image, 270, null);
					if ($ort == 3 || $ort == 4)
						$source_gd_image = imagerotate($source_gd_image, 180, null);
					if ($ort == 8 || $ort == 7)
						$source_gd_image = imagerotate($source_gd_image, 90, null);

					if (function_exists('imageflip') && ($ort == 5 || $ort == 4 || $ort == 7))
						imageflip($source_gd_image, IMG_FLIP_HORIZONTAL);
				}
				break;
			case IMAGETYPE_PNG:
				$source_gd_image = imagecreatefrompng($source_image_path);
				imagealphablending($source_gd_image, true);
				break;
		}
	
		if ($source_gd_image === false) {
			return false;
		}
	
		$thumbnail_image_width = $width;
		$thumbnail_image_height = $height;
	
		$source_aspect_ratio = $source_image_width / $source_image_height;
		$thumbnail_aspect_ratio = $thumbnail_image_width / $thumbnail_image_height;
	
		if ($source_image_width <= $thumbnail_image_width && $source_image_height <= $thumbnail_image_height) {
			$thumbnail_image_width = $source_image_width;
			$thumbnail_image_height = $source_image_height;
		} elseif ($thumbnail_aspect_ratio > $source_aspect_ratio) {
			$thumbnail_image_width = (int) ($thumbnail_image_height * $source_aspect_ratio);
		} else {
			$thumbnail_image_height = (int) ($thumbnail_image_width / $source_aspect_ratio);
		}
		//echo $thumbnail_image_width." ".$thumbnail_image_height;
		$thumbnail_gd_image = imagecreatetruecolor($thumbnail_image_width, $thumbnail_image_height);
	
		imagealphablending($thumbnail_gd_image, false);
		imagesavealpha($thumbnail_gd_image, true);
	
		imagecopyresampled($thumbnail_gd_image, $source_gd_image, 0, 0, 0, 0, $thumbnail_image_width, $thumbnail_image_height, $source_image_width, $source_image_height);
		switch ($source_image_type)	{
			case IMAGETYPE_GIF:
				imagegif($thumbnail_gd_image, $thumbnail_image_path);
				break;
			case IMAGETYPE_JPEG:
				imagejpeg($thumbnail_gd_image, $thumbnail_image_path, 100);
				break;
			case IMAGETYPE_PNG:
				imagepng($thumbnail_gd_image, $thumbnail_image_path, 0);
				break;
		}
		//imagejpeg($thumbnail_gd_image, $thumbnail_image_path, 100);
		imagedestroy($source_gd_image);
		imagedestroy($thumbnail_gd_image);
	
		return true;
	}
	/*	Function name	: getObservationDetailsInArray
	 * 	Input			: $id_poi, id of the POI for which we want to extract data from database
	* 	Output			: array $observationArray
	* 	Object			: extract data of the POI from the database
	* 	Date			: septembre 19 2017
	*/
	function getObservationDetailsInArray($id_poi){
		
		$sql = "SELECT poi.*, 
					commune.id_commune, 
					commune.lib_commune, 
					x(poi.geom_poi) AS longitude_poi, 
					y(poi.geom_poi) AS latitude_poi,
					subcategory.id_subcategory, 
					subcategory.icon_subcategory, 
					subcategory.lib_subcategory, 
					priorite.lib_priorite, 
					status.lib_status, 
					pole.lib_pole,
					pole.territoire_id_territoire
				FROM poi
					INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory)
					INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune)
					INNER JOIN priorite ON (poi.priorite_id_priorite = priorite.id_priorite)
					INNER JOIN status ON (poi.status_id_status = status.id_status)
					INNER JOIN pole ON (poi.pole_id_pole = pole.id_pole)
				WHERE poi.id_poi = ".$id_poi;
		$result = mysql_query($sql);
		$nbrows = mysql_num_rows($result);
		$row = mysql_fetch_assoc( $result );
		$observationArray = array();
		if ($result && $nbrows ==1){
			$observationArray['id_poi'] = stripslashes($row['id_poi']);
			$observationArray['desc_poi'] = stripslashes($row['desc_poi']);
			$observationArray['prop_poi'] = stripslashes($row['prop_poi']);
			$observationArray['num_poi'] = stripslashes($row['num_poi']);
			$observationArray['ref_poi'] = stripslashes($row['ref_poi']);
			$observationArray['rue_poi'] = stripslashes($row['rue_poi']);
			$observationArray['communename_poi'] = stripslashes($row['communename_poi']);
			$observationArray['mailsentuser_poi'] = stripslashes($row['mailsentuser_poi']);
			$observationArray['mail_poi'] = stripslashes($row['mail_poi']);
			$observationArray['reponsegrandtoulouse_poi'] = stripslashes($row['reponsegrandtoulouse_poi']);
			$observationArray['reponsepole_poi'] = stripslashes($row['reponsepole_poi']);
			$observationArray['mailsentuser_poi'] = stripslashes($row['mailsentuser_poi']);
			$observationArray['delete_poi'] = stripslashes($row['delete_poi']);
			$observationArray['lastdatemodif_poi'] = stripslashes($row['lastdatemodif_poi']);
			$observationArray['traiteparpole_poi'] = stripslashes($row['traiteparpole_poi']);
			$observationArray['transmission_poi'] = stripslashes($row['transmission_poi']);
			$observationArray['commentfinal_poi'] = stripslashes($row['commentfinal_poi']);
			$observationArray['observationterrain_poi'] = stripslashes($row['observationterrain_poi']);
			$observationArray['geolocatemode_poi'] = stripslashes($row['geolocatemode_poi']);
			$observationArray['latitude_poi'] = stripslashes($row['latitude_poi']);
			$observationArray['longitude_poi'] = stripslashes($row['longitude_poi']);
			$observationArray['photo_poi'] = stripslashes($row['photo_poi']);
			$observationArray['datefix_poi'] = stripslashes($row['datefix_poi']);
			$observationArray['datecreation_poi'] = stripslashes($row['datecreation_poi']);
			$observationArray['moderation_poi'] = stripslashes($row['moderation_poi']);
			$observationArray['fix_poi'] = stripslashes($row['fix_poi']);
			$observationArray['display_poi'] = stripslashes($row['display_poi']);
			$observationArray['tel_poi'] = stripslashes($row['tel_poi']);
			$observationArray['adherent_poi'] = stripslashes($row['adherent_poi']);
			$observationArray['adherentfirstname_poi'] = stripslashes($row['adherentfirstname_poi']);
			//clés étrangères
			$observationArray['commune_id_commune'] = stripslashes($row['commune_id_commune']);
			$observationArray['subcategory_id_subcategory'] = stripslashes($row['subcategory_id_subcategory']);
			$observationArray['priorite_id_priorite'] = stripslashes($row['priorite_id_priorite']);
			$observationArray['pole_id_pole'] = stripslashes($row['pole_id_pole']);
			$observationArray['quartier_id_quartier'] = stripslashes($row['quartier_id_quartier']);
			$observationArray['status_id_status'] = stripslashes($row['status_id_status']);
			//donnees de tables autres que poi, sur clés étrangères
			$observationArray['lib_priorite'] = stripslashes($row['lib_priorite']);
			$observationArray['lib_commune'] = stripslashes($row['lib_commune']);
			$observationArray['lib_subcategory'] = stripslashes($row['lib_subcategory']);
			$observationArray['lib_status'] = stripslashes($row['lib_status']);
			$observationArray['territoire_id_territoire'] = stripslashes($row['territoire_id_territoire']);
			$observationArray['lib_pole'] = stripslashes($row['lib_pole']);
		}
		return $observationArray;
	}
	
	/*	Function name	: getObservationDetailsInString
	 * 	Input			: $arrayObservation : array containaing data linked to a POI
	* 	Output			: $arrayDetailsAndUpdateSQL with SQL update request, details about the data linked to a POI and a n flag telling if the POI needs to be updated
	* 	Object			: get the sql update request, determined by comparing data from a persisted poi and data contained in $_POST, and detailed message to be sent in an e-mail
	* 	Date			: septembre 19 2017
	*/
	
	function getObservationDetailsInString($arrayObservation){
		
		$DetailObservation = "";
		$sqlUpdate = '';
		$updateObservationBoolean = 0;
		
		
		$arrayColumns = array();
		$numberOfColumns = 0;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'subcategory_id_subcategory' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'subcategory_id_subcategory' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Catégorie : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'integer' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'rue_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'rue_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Nom de la voie : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'communename_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'communename_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Nom de la commune : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'num_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'num_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Repère : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'ref_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'ref_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Référence : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'pole_id_pole' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'pole_id_pole' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Pôle : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'integer' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'commune_id_commune' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'commune_id_commune' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Commune : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'integer' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'desc_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'desc_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Description du problème : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'prop_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'prop_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Proposition : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'observationterrain_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'observationterrain_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Commentaire de terrain de l\'association : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'priorite_id_priorite' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'priorite_id_priorite' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Priorité définie par l\'association : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'integer' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'moderation_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'moderation_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Observation transmise à la collectivité : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'display_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'display_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Observation affichée sur l\'interface publique : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'reponsegrandtoulouse_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'reponsegrandtoulouse_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# [Public] Réponse de la collectivité : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'status_id_status' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'status_id_status' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Statut positionné par la collectivité : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'integer' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'transmission_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'transmission_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# La collectivité a transmis l\'observation au pôle technique : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'reponsepole_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'reponsepole_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# [Privé] Réponse du pôle technique : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'traiteparpole_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'traiteparpole_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Le pôle a traité l\'observation : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'commentfinal_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'commentfinal_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Commentaire Vélo-Cité : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'datefix_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'datefix_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Date de clôture de l\'observation : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'Date' ;
// 		$numberOfColumns++;
// 		$arrayColumns[$numberOfColumns]['columnSQL'] = 'fix_poi' ;
// 		$arrayColumns[$numberOfColumns]['columnPOST'] = 'fix_poi' ;
// 		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# fix_poi (?) : ' ;
// 		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		//info personne qui a remonté l'observationr
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'adherent_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'adherent_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Nom du contributeur : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'adherentfirstname_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'adherentfirstname_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Nom du contributeur : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'mail_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'mail_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Mail du contributeur : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'mail' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'tel_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'tel_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Téléphone du contributeur : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'string' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'mailsentuser_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'mailsentuser_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Mail envoyé au contributeur : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'delete_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'delete_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Observation supprimée : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'boolean' ;
		$numberOfColumns++;
		//informations générales observation
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'datecreation_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'datecreation_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Date de création de l\'observation : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'Date' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'lastdatemodif_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'lastdatemodif_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Date de dernière modification : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'Date' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'geolocatemode_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'geolocatemode_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Mode de géolocalisation utilisé : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'integer' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'latitude_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'latitude_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Latitude observation : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'position' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'longitude_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'longitude_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Longitude observation : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'position' ;
		$numberOfColumns++;
		$arrayColumns[$numberOfColumns]['columnSQL'] = 'photo_poi' ;
		$arrayColumns[$numberOfColumns]['columnPOST'] = 'photo_poi' ;
		$arrayColumns[$numberOfColumns]['columnIntitule'] = '# Photo : ' ;
		$arrayColumns[$numberOfColumns]['dataType'] = 'photo' ;
		
		
		
		for ($i = 0; $i < count($arrayColumns); $i++) {
			$columnUpdated = 0;
			if (DEBUG) {
				error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, traitement de " . $arrayColumns[$i]['columnSQL'] . " \n", 3, LOG_FILE );
			}
			if (isset($_POST[$arrayColumns[$i]['columnPOST']])){
				if ($arrayColumns[$i]['dataType'] == 'boolean'){
					if (DEBUG) {
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, " . $arrayColumns [$i] ['columnSQL'] . ", boolean\n", 3, LOG_FILE );
					}
					$OldValue = (strlen($arrayObservation[$arrayColumns[$i]['columnSQL']]) > 0)?$arrayObservation[$arrayColumns[$i]['columnSQL']]:0;
					switch ($_POST [$arrayColumns [$i] ['columnPOST']]){
						case 'false':
							$NewValue = 0;
							break;
						case 'true':
							$NewValue = 1;
							break;
					}
				}elseif ($arrayColumns[$i]['dataType'] == 'integer' && !is_numeric($_POST[$arrayColumns[$i]['columnPOST']])){
					if (DEBUG) {
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, " . $arrayColumns [$i] ['columnSQL'] . ", integer et non numerique\n", 3, LOG_FILE );
					}
				
					
					$OldValue = $arrayObservation[$arrayColumns[$i]['columnSQL']];
					$NewValue = $OldValue;
				}elseif ($arrayColumns[$i]['dataType'] == 'photo'){
					if (DEBUG) {
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, " . $arrayColumns [$i] ['columnSQL'] . ", photo\n", 3, LOG_FILE );
					}
				
					$OldValue = URL."/resources/pictures/".$arrayObservation[$arrayColumns[$i]['columnSQL']];
					$NewValue = URL."/resources/pictures/".$_POST[$arrayColumns[$i]['columnPOST']];
				}else{
					if (DEBUG) {
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, " . $arrayColumns [$i] ['columnSQL'] . ", ".$arrayColumns[$i]['dataType']."\n", 3, LOG_FILE );
					}
					$OldValue = $arrayObservation[$arrayColumns[$i]['columnSQL']];
					$NewValue = $_POST[$arrayColumns[$i]['columnPOST']];
				}
				if (DEBUG){
					error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php - getObservationDetailsInString ".$arrayColumns[$i]['columnSQL']." oldValue= ".$OldValue ." et newValue = ".$NewValue."\n", 3, LOG_FILE);
				}
				
				if ($OldValue != $NewValue){
					$columnUpdated = 1;
					if ($arrayColumns[$i]['dataType'] == 'position'){
						if ($positionAlreadyMoidified != 1){
							//les latitude et longitude stockés sous forme d'un point par POI, et non pas comme 2 champs distincts
							$sqlUpdate .= ", geom_poi = GeomFromText('POINT(".$_POST['longitude_poi']." ".$_POST['latitude_poi'].")')";
							$positionAlreadyMoidified = 1;
						}
						
					}else{
						$sqlUpdate .= ", " . $arrayColumns [$i] ['columnSQL'] . " = '" . mysql_real_escape_string ( $NewValue ) . "'";
					}
					switch ($arrayColumns [$i] ['columnSQL']){
						case 'status_id_status' :
							$tableName = 'status';
							$sqlNewLib = "SELECT *
								FROM ".$tableName."
								WHERE id_".$tableName." = ".$_POST[$arrayColumns [$i] ['columnPOST']];
							$resultNewLib= mysql_query($sqlNewLib);
							$rowNewLib = mysql_fetch_assoc( $resultNewLib );
							$NewValue = $rowNewLib['lib_'.$tableName];
							$OldValue = $arrayObservation['lib_'.$tableName];
							break;
						case 'pole_id_pole' :
							$tableName = 'pole';
							$sqlNewLib = "SELECT *
								FROM ".$tableName."
								WHERE id_".$tableName." = ".$_POST[$arrayColumns [$i] ['columnPOST']];
							$resultNewLib= mysql_query($sqlNewLib);
							$rowNewLib = mysql_fetch_assoc( $resultNewLib );
							$NewValue = $rowNewLib['lib_'.$tableName];
							$OldValue = $arrayObservation['lib_'.$tableName];
							break;
						case 'commune_id_commune' :
							$tableName = 'commune';
							$sqlNewLib = "SELECT *
								FROM ".$tableName."
								WHERE id_".$tableName." = ".$_POST[$arrayColumns [$i] ['columnPOST']];
							$resultNewLib= mysql_query($sqlNewLib);
							$rowNewLib = mysql_fetch_assoc( $resultNewLib );
							$NewValue = $rowNewLib['lib_'.$tableName];
							$OldValue = $arrayObservation['lib_'.$tableName];
							break;
						case 'subcategory_id_subcategory' :
							$tableName = 'subcategory';
							$sqlNewLib = "SELECT *
								FROM ".$tableName."
								WHERE id_".$tableName." = ".$_POST[$arrayColumns [$i] ['columnPOST']];
							$resultNewLib= mysql_query($sqlNewLib);
							$rowNewLib = mysql_fetch_assoc( $resultNewLib );
							$NewValue = $rowNewLib['lib_'.$tableName];
							$OldValue = $arrayObservation['lib_'.$tableName];
							break;
						case 'priorite_id_priorite' :
								$tableName = 'priorite';
								$sqlNewLib = "SELECT *
								FROM ".$tableName."
								WHERE id_".$tableName." = ".$_POST[$arrayColumns [$i] ['columnPOST']];
								$resultNewLib= mysql_query($sqlNewLib);
								$rowNewLib = mysql_fetch_assoc( $resultNewLib );
								$NewValue = $rowNewLib['lib_'.$tableName];
								$OldValue = $arrayObservation['lib_'.$tableName];
								//si la priorite change, on modifie par défaut le champ moderation
								$_POST['moderation_poi'] = 'true';
								//$sqlUpdate .= ", moderation_poi = 1";
								break;
					}
					if ($arrayColumns[$i]['dataType'] == 'boolean'){
						$OldValue = 'Oui';
						$NewValue = 'Oui';
						if ($arrayObservation [$arrayColumns [$i] ['columnSQL']] == "" || $arrayObservation [$arrayColumns [$i] ['columnSQL']] == 0){
							$OldValue = 'Non';
						}
						if ($_POST[$arrayColumns [$i] ['columnPOST']] == "" || $_POST[$arrayColumns [$i] ['columnPOST']] == 'false'){
							$NewValue = 'Non';
						}
					}elseif($arrayColumns [$i] ['columnSQL'] =='geolocatemode_poi'){
						switch ($_POST[$arrayColumns [$i] ['columnPOST']]) {
							case 1:
								$NewValue = "Positionnement manuel sur une carte";
								break;
							case 2:
								$NewValue = "GPS";
								break;
							case '3g':
								$NewValue = "3g";
								break;
							default :
								$NewValue = "?";
								break;
						}
						switch ($arrayObservation [$arrayColumns [$i] ['columnSQL']]) {
							case 1:
								$OldValue = "Positionnement manuel sur une carte";
								break;
							case 2:
								$OldValue = "GPS";
								break;
							case '3g':
								$OldValue = "3g";
								break;
							default :
								$OldValue = "?";
								break;
						}
					}
					$DetailObservation .= "       ".$arrayColumns [$i] ['columnIntitule'] . "\"" .((strlen ( $OldValue ) > 0) ?  $OldValue : "Non Renseigné") . "\" remplacé par \"" . $NewValue . "\"\n";
					
					$updateObservationBoolean = 1;
				} 
			}
			//la colonne courante n'est pas mise à jour dans la session, on affiche l'info qui est stockée en base de données
			if (!$columnUpdated) {
					if (DEBUG) {
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, " . $arrayColumns [$i] ['columnSQL'] . " non mis à jour\n", 3, LOG_FILE );
					}
					$OldValue = $arrayObservation [$arrayColumns [$i] ['columnSQL']];
					switch ($arrayColumns[$i]['columnSQL']){
						case 'status_id_status' :
							$OldValue = $arrayObservation['lib_status'];
							break;
						case 'pole_id_pole' :
							$OldValue = $arrayObservation['lib_pole'];
							break;
						case 'commune_id_commune' :
							$OldValue = $arrayObservation['lib_commune'];
							break;
						case 'subcategory_id_subcategory' :
							$OldValue = $arrayObservation['lib_subcategory'];
							break;
						case 'photo_poi' :
							$OldValue = strlen($arrayObservation[$arrayColumns[$i]['columnSQL']]>0)?URL."/resources/pictures/".$arrayObservation[$arrayColumns[$i]['columnSQL']]:"";
							break;
						case 'priorite_id_priorite' :
							$OldValue = $arrayObservation['lib_priorite'];
							break;
					}
					if ($arrayColumns[$i]['dataType'] == 'boolean'){
						$OldValue = 'Oui';
						if ($arrayObservation [$arrayColumns [$i] ['columnSQL']] == "" || $arrayObservation [$arrayColumns [$i] ['columnSQL']] == 0){
							$OldValue = 'Non';
						}
					}elseif($arrayColumns [$i] ['columnSQL'] =='geolocatemode_poi'){
						switch ($arrayObservation [$arrayColumns [$i] ['columnSQL']]) {
							case 1:
								$OldValue = "Positionnement manuel sur une carte";
								break;
							case 2:
								$OldValue = "GPS";
								break;
							case '3g':
								$OldValue = "3g";
								break;
							default :
								$OldValue = "?";
								break;
						}
					}
					$DetailObservation .= $arrayColumns [$i] ['columnIntitule'] . "\"" . ((strlen ( $OldValue ) > 0) ? $OldValue : "Non Renseigné") . "\"\n";
				}
		}
		if (DEBUG) {
			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, sqlUpdate " . $sqlUpdate . " \n", 3, LOG_FILE );
			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php, updateObservationBoolean " . $updateObservationBoolean . " \n", 3, LOG_FILE );
		}
		$DetailObservation .= "# Lien vers l'observation publique (non visible tant que la modération n'a pas été effectuée) : ".URL.'?id='.$arrayObservation['id_poi'];
		$helpReadingDetailsOfPOI = '';
		if ($sqlUpdate != ""){
			$helpReadingDetailsOfPOI = "(les lignes avec un alinéa correspondent aux informations modifiées)";
			$lastdatemodif_poi = date("Y-m-d H:i:s");
			$sqlUpdate = " lastdatemodif_poi = '$lastdatemodif_poi' ".$sqlUpdate;
		}
		$DetailObservation = "------------- Détails de l'observation ------------- \n" . $helpReadingDetailsOfPOI."\n# Numéro observation : ". $arrayObservation['id_poi']."\n".$DetailObservation;
		$arrayDetailsAndUpdateSQL=array();
		$arrayDetailsAndUpdateSQL['updateObsBoolean'] = $updateObservationBoolean;
		$arrayDetailsAndUpdateSQL['sqlUpdate'] = $sqlUpdate;
		$arrayDetailsAndUpdateSQL['detailObservationString'] = str_replace('\n', '<br />', $DetailObservation);
		return $arrayDetailsAndUpdateSQL;
	}
	/*	Function name	: getMailsToSend
	 * 	Input			: $whereClauseSelectionUsers : constraint to get e-mail of users
	 * 	Input			: $subject of the e-mail to be sent to the selected users
	 * 	Input			: $message, body of the e-mail to be sent to the selected users
	* 	Output			: $mails, an array containing e-mails, user status, subject and message
	* 	Object			: get the e-mail adresses and link th e subject and message to be sent
	* 	Date			: septembre 19 2017
	*/
	function getMailsToSend($whereClauseSelectionUsers, $subject, $message){
		$sql = "SELECT u.mail_users, ut.lib_usertype, u.lib_users FROM users u inner join usertype ut on ut.id_usertype = u.usertype_id_usertype WHERE " . $whereClauseSelectionUsers;
		if (DEBUG){
			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " requete de recuperation des mails des utilisateurs ". $sql . " \n", 3, LOG_FILE);
		}
		$result = mysql_query($sql);
		$mails = array();
		if ($result){
			if (DEBUG){
				error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Récupération des mails à envoyer \n", 3, LOG_FILE);
			}
			while ($row2 = mysql_fetch_array($result)) {
				$mailArray = [$row2['mail_users'],$row2['lib_usertype']." - ".$row2['lib_users'], $subject, $message ];
				array_push($mails,$mailArray);
			}
			
		}
		if (DEBUG){
			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Il y a ". count($mails) . " mails à envoyer \n", 3, LOG_FILE);
		}
		return $mails;
	}
	/*	Function name	: sendMails
	 * 	Input			: array $mailsArray (created with getMailsToSend)
	* 	Output			: true
	* 	Object			: sends e-mails to addresses in the array, with subject and body contained in the same array
	* 	Date			: septembre 19 2017
	*/
	function sendMails($mailsArray){
		foreach ($mailsArray as $key => $value) {
// 			if (DEBUG){
// 				error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Clé : $key; Valeur : $value[0],  $value[1],  $value[2]\n", 3, LOG_FILE);
// 			}
			sendMail($value[0], $value[2], $value[3]);
		}
		return true;
	}
	/*	Function name	: sendMail
	 * 	Input			: $to : e-mail address
	* 	Input			: $subject : subject of the e-mail
	* 	Input			: $body : body of the e-mail
	* 	Object			: sends simple e-mails
	* 	Date			: septembre 19 2017
	*/
	function sendMail ($to, $subject, $body){
		$NL = '\r\n';
		$headers = 'From: '. MAIL_FROM . $NL .
				'Reply-To: ' . MAIL_REPLY_TO . $NL .
				'Mime-Version: 1.0' . $NL .
				'Content-Type: multipart/alternative; boundary="boundary-string"' . $NL .
				'X-Mailer: PHP/' . phpversion();
		if (DEBUG){
			error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - commonfunction.php - Mail avec comme sujet = ".MAIL_SUBJECT_PREFIX . ' '.$subject ." et envoyé à " . $to ."\n", 3, LOG_FILE);
		}

		$logodata = file_get_contents('./logo-main.png');
		$b64logo = base64_encode($logodata);
	
		$message = '--boundary-string' . $NL . $NL .

			'Content-Type: text/html; charset="utf-8"' . $NL .
			'Content-Transfer-Encoding: quoted-printable' . $NL .
			'Content-Disposition: inline' . $NL . $NL .		
			"<p>$body</p>" . $NL . $NL .

			'--boundary-string' . $NL . $NL .
			
			'Content-ID: <cid:assologo>' . $NL .
			'Content-Type: IMAGE/PNG' . $NL .
			'Content-Transfer-Encoding: BASE64' . $NL . $NL .

			$b64logo . $NL . $NL;

			'--boundary-string' . $NL . $NL .
			
		mail($to, MAIL_SUBJECT_PREFIX . ' '.$subject, $message, $headers);
		//mail($to, MAIL_SUBJECT_PREFIX . ' '.$subject, $body);
	}
?>
