<?php header('Content-Type: text/html; charset=UTF-8');

    include_once '../key.php';

 	include_once '../admin/adminfunction.php';

	switch (SGBD) {
        case 'mysql':
            $link = mysql_connect(HOST,DB_USER,DB_PASS);
            mysql_select_db(DB_NAME);
            $output = var_export($_POST, true);
            if (DEBUG){
            	error_log(date("Y-m-d H:i:s") . "  - velObsRecord.php $output\n", 3, LOG_FILE);
            }
            //mysql_query("SET NAMES 'utf8'");
			//TODO : ne faire qu'un traitement et exclusre la photo s'il n'y en a pas....
            $createObservation = 1;
            if (!isset($_POST['latitude_poi']) || !isset($_POST['longitude_poi']) || !isset($_POST['desc_poi']) || !isset($_POST['prop_poi']) || !isset($_POST['subcategory_id_subcategory']) || !isset($_POST['mail_poi']) || !isset($_POST['tel_poi']) || !isset($_POST['rue_poi']) || !isset($_POST['num_poi'])) {
            	if (DEBUG){
            		error_log(date("Y-m-d H:i:s") . "  - velObsRecord.php, manque des infos\n", 3, LOG_FILE);
            	}
            	$createObservation = 0;
            	echo 'Des informations sont manquantes pour créer l\'observation';
            	
            }
            if (isset($_FILES["photo1"]) && $createObservation) {
            	if (DEBUG){
            		error_log(date("Y-m-d H:i:s") . "  - velObsRecord.php, photo1 is set\n", 3, LOG_FILE);
            	}
            	$allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
            	$temp = explode(".", $_FILES["photo1"]["name"]);
            	$extension = end($temp);
            	
            		if (!in_array($extension, $allowedExts)) {
            			echo 'L\'extension du nom de la photo n\'est pas correct';
            			$createObservation = 0;
            		} else if (($_FILES["photo1"]["type"] != "image/gif") && ($_FILES["photo1"]["type"] != "image/jpeg") && ($_FILES["photo1"]["type"] != "image/jpg") && ($_FILES["photo1"]["type"] != "image/png")) {
            			echo 'Le type du fichier soumis come photo n\'est pas correct';
            			$createObservation = 0;
            		} else {
            	
            			/*
            			 ICI ON INSERE EN BASE AVEC LA PHOTO
            			*/
            			if (DEBUG){
            				error_log(date("Y-m-d H:i:s") . "  - velObsRecord.php, photo1 is set, tout a l'air OK on enregistre la photo sur le serveur\n", 3, LOG_FILE);
            			}
            			$dossier = '../../../resources/pictures/';
            			$fichier = basename($_FILES['photo1']['name']);
            			$pathphoto = $dossier.$fichier;
            			if (move_uploaded_file($_FILES['photo1']['tmp_name'], $pathphoto)) {
            				$size = getimagesize($pathphoto);
            				$newnamefichier = $size[0].'x'.$size[1].'x'.$fichier;
            				$newpathphoto = $dossier.$newnamefichier;
            				rename($pathphoto, $newpathphoto);
            			} else {
            				echo "Une erreur est survenue lors du traitement de la photo.";
            				$createObservation = 0;
            			}
            			$photo_poi = $newnamefichier;
            			
            		}
            }
            if ($createObservation){
            	if (DEBUG){
            		error_log(date("Y-m-d H:i:s") . "  - velObsRecord.php, createObservation = $createObservation \n $photo_poi\n", 3, LOG_FILE);
            	}

                    /*
                        ICI ON INSERE EN BASE SANS METTRE LA PHOTO
                    */

                    $latitude_poi = $_POST['latitude_poi'];
                    $longitude_poi = $_POST['longitude_poi'];

                    $date_poi = date("Y-m-d H:i:s");
                    $desc_poi = mysql_real_escape_string($_POST['desc_poi']);
                    $prop_poi = mysql_real_escape_string($_POST['prop_poi']);

                    $subcategory_id_subcategory = $_POST['subcategory_id_subcategory'];

                    $sql = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$subcategory_id_subcategory;
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $lib_subcategory = $row['lib_subcategory'];
                    }
                    $lib_poi = mysql_real_escape_string($lib_subcategory);
                    
                    switch ($_POST['geolocatemode_poi']) {
                        case 'gps':
                            $geolocatemode_poi = 2;
                            break;
                        case '3g':
                            $geolocatemode_poi = 3;
                            break;
                    }

                    $mail_poi = mysql_real_escape_string($_POST['mail_poi']);
                    $tel_poi = mysql_real_escape_string($_POST['tel_poi']);

                    $rue_poi = mysql_real_escape_string($_POST['rue_poi']);
                    $num_poi = mysql_real_escape_string($_POST['num_poi']);
                    
                    $commune_id_commune = 99999;
					$pole_id_pole = 9;
					$quartier_id_quartier = 99999;
                    $locations = getLocations($latitude_poi,$longitude_poi);
                    if (DEBUG){
                    	//error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - " . getLocations($latitude_poi,$longitude_poi)[1]."\n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - locations - ".$locations[0].", " .$locations[1].", " .$locations[2].", " .$locations[3]."\n", 3, LOG_FILE);
                    }
                    $commune_id_commune =$locations[0];
                    $lib_commune = $locations[1];
                    $pole_id_pole = $locations[2];
                    $lib_pole = $locations[3];
                    if ($commune_id_commune == 99999){
                    	if (DEBUG){
                    		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " L'observation semble être dans une zone non couverte par velobs\n", 3, LOG_FILE);
                    	}
                    	$infoPOI = "Repere : $num_poi\nMail : $mail_poi\nTel : $tel_poi\nRue : $rue_poi\nCommune : $communename_poi\nDescription : $desc_poi\nProposition : $prop_poi\nNom : $adherent_poi\nPrénom : $adherentfirstname_poi\nLatitude : $latitude_poi\nLongitude : $longitude_poi\n Categorie : $subcategory_id_subcategory";
                    	sendMail(MAIL_FROM,"Erreur creation observation sur mobile", "Message affiché à l'utilisateur : L'observation semble être dans une zone non couverte par VelObs, si ce n'est pas le cas, merci de nous contacter à l'adresse " . MAIL_FROM. "\n" . $infoPOI);
                    		
                     	die("L'observation semble être dans une zone non couverte par VelObs, si ce n'est pas le cas, merci de nous contacter à l'adresse " . MAIL_FROM);
                    }
                    

                    // si le mail est un administrateur ou un modérateur alors on bypasse la modération
                    $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    $priorityId = 1;
                    $moderationFlag = 1;
                    
                    if ($num_rows2 == 0) {
                    	$priorityId = 4;
                    	$moderationFlag = 0;
                    }
                        $sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status, photo_poi) VALUES ($priorityId, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', $mail_poi', '$tel_poi', $moderationFlag, 0, 5, '$photo_poi')";
                    	
                    $result = mysql_query($sql);
                    if (!$result) {
                        echo "La création de l'observation a échoué.";
                    }else{
                    	$id_poi = mysql_insert_id();
                    	echo 'dataOK';
                    }
                    $arrayObs = getObservationDetailsInArray($id_poi);
                    $arrayDetailsAndUpdateSQL = getObservationDetailsInString($arrayObs);
                    if (DEBUG){
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($arrayDetailsAndUpdateSQL) ." infos chargées pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - updateObsBoolean ". $arrayDetailsAndUpdateSQL['updateObsBoolean'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - sqlUpdate ". $arrayDetailsAndUpdateSQL['sqlUpdate'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - detailObservationString ".$arrayDetailsAndUpdateSQL['detailObservationString'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    		
                    }
                    if ($num_rows2 == 0){
                    	/* envoi d'un mail aux administrateurs de l'association et modérateurs */
                    	$whereClause = "u.usertype_id_usertype = 1 OR (u.usertype_id_usertype = 4 AND u.num_pole = ".$arrayObs['pole_id_pole'].")";
                    	$subject = 'Nouvelle observation à modérer sur le pole '.$arrayObs['lib_pole'];
                    	$message = "Bonjour !
Une nouvelle observation a été ajoutée sur le pole ".$arrayObs['lib_pole'].". Veuillez vous connecter à l'interface d'administration pour la modérer.
Lien vers la modération : ".URL.'/admin.php?id='.$arrayObs['id_poi']."\n".$arrayDetailsAndUpdateSQL['detailObservationString']."\n";
                    	$mails = array();
                    	$mails = getMailsToSend($whereClause, $subject, $message );
                    	if (DEBUG){
                    		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Il y a ". count($mails) . " mails à envoyer \n", 3, LOG_FILE);
                    	}
                    	//
                    
                    	/* debut envoi d'un mail au contributeur */
                    	$subject = 'Observation en attente de modération';
                    	$message = "Bonjour !
Vous venez d'ajouter une observation à VelObs et nous vous en remercions. Celle-ci devrait être administrée sous peu.\n".
                    $arrayDetailsAndUpdateSQL['detailObservationString']."\n
Cordialement, l'Association ".VELOBS_ASSOCIATION." :)";
                    	$mailArray = [$arrayObs['mail_poi'],"Soumetteur", $subject, $message ];
                    	array_push($mails,$mailArray);
                    	if (DEBUG){
                    		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($mails) ." mails à envoyer\n", 3, LOG_FILE);
                    	}
                    	$succes = sendMails($mails);
                    }
            }
            mysql_free_result($result);
            mysql_close($link);

            break;
        case 'postgresql':
            // TODO
            break;
    }

?>
