<?php
	session_start();
	include '../key.php';
	include '../commonfunction.php';
	if (DEBUG){
		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - uploadPhotoSuppPublic \n", 3, LOG_FILE);
	}
    switch (SGBD) {
        case 'mysql':
            if (isset($_FILES['photo-path']) && isset($_POST['id_POI'])){
                $link = mysql_connect(HOST,DB_USER,DB_PASS);
                mysql_select_db(DB_NAME);

                $dossier = '../../../resources/pictures/';
                $fichier = basename($_FILES['photo-path']['name']);
                $taille_maxi = 6291456;
                $taille = filesize($_FILES['photo-path']['tmp_name']);
                $extensions = array('.png', '.gif', '.jpg', '.jpeg', '.PNG', '.GIF', '.JPG', '.JPEG');
                $extension = strrchr($_FILES['photo-path']['name'], '.');

                if (!in_array($extension, $extensions)) {
                    $erreur = getTranslation($_SESSION['id_language'],'ERROR');
                    $return['success'] = false;
                    $return['pb'] = getTranslation($_SESSION['id_language'],'PICTUREPNGGIFJPGJPEG');
                }

                if ($taille > $taille_maxi) {
                    $erreur = getTranslation($_SESSION['id_language'],'ERROR');
                    $return['success'] = false;
                    $return['pb'] = getTranslation($_SESSION['id_language'],'PICTURESIZE');
                }

                if (!isset($erreur)) {
                    $fichier = strtr($fichier,
                            'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ_',
                            'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy-');
                    $fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);
                    $fichier = 'poi_'.$_POST['id_POI'].'_'.$fichier;
                    $pathphoto = $dossier.$fichier;
                    if (move_uploaded_file($_FILES['photo-path']['tmp_name'], $pathphoto)){
                        $return['success'] = true;
                        $return['ok'] = getTranslation($_SESSION['id_language'],'PHOTOTRANSFERTDONE');
                        $size = getimagesize($pathphoto);

                        if ($size[0] > 1024 || $size[1] > 1024) {
                            if ($size[0] > $size[1]) {
                                generate_image_thumbnail($pathphoto, $pathphoto, 1024, 768);
                            } else {
                                generate_image_thumbnail($pathphoto, $pathphoto, 768, 1024);
                            }
                        }

                        $size = getimagesize($pathphoto);
                        $newnamefichier = $size[0].'x'.$size[1].'x'.$fichier;
                        $newpathphoto = $dossier.$newnamefichier;
                        rename($pathphoto, $newpathphoto);
                    } else {
                        $return['success'] = false;
                        $return['pb'] = getTranslation($_SESSION['id_language'],'ICONTRANSFERTFALSE');
                    }
                }
            }

            if ($return['success'] == true) {
                $id_poi = $_POST['id_POI'];
                $sql = "SELECT photo_poi FROM poi WHERE id_poi = ".$id_poi;
                $result = mysql_query($sql);
                while ($row = mysql_fetch_array($result)) {
                    unlink("../../data/pictures/".$row['photo_poi']);
                }

                $sql = "INSERT INTO photos (url_photos, display_photos) VALUES ('$newnamefichier',0)";
                $result = mysql_query($sql);

                $id_photo = mysql_insert_id();

                $sql1 = "INSERT INTO poi_photos (poi_id_poi, photos_id_photos) VALUES (".$id_poi.",".$id_photo.")";
                $result = mysql_query($sql1);

                $lastdatemodif_poi = date("Y-m-d");
                $sql3 = "UPDATE poi SET lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = ".$id_poi;
                $result3 = mysql_query($sql3);
                if (DEBUG){
                	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - uploadPhotoSuppPublic - $sql $result \n", 3, LOG_FILE);
                	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Erreur ". mysql_errno($link) . " : " . mysql_error($link)."\n", 3, LOG_FILE);
                }
                if (!isset($_SESSION['user'])) {
                	$arrayObs = getObservationDetailsInArray($id_poi);
                	$arrayDetailsAndUpdateSQL = getObservationDetailsInString($arrayObs);
                	if (DEBUG){
                		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($arrayDetailsAndUpdateSQL) ." infos chargées pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - updateObsBoolean ". $arrayDetailsAndUpdateSQL['updateObsBoolean'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - sqlUpdate ". $arrayDetailsAndUpdateSQL['sqlUpdate'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                		error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - detailObservationString ".$arrayDetailsAndUpdateSQL['detailObservationString'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                	
                	}
                	
                   $subject = 'Photo à modérer sur l\'observation n°'.$arrayObs['id_poi'];
                    $message = 'Bonjour !
Une nouvelle photo a été ajoutée sur l\'observation n°'.$arrayObs['id_poi'].'. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.php?id='.$arrayObs['id_poi']."\n".$arrayDetailsAndUpdateSQL['detailObservationString'].'
Cordialement, l\'application velobs:)';
                        // boucle sur les administrateurs #pole# généraux de l'association
                        $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1 OR (usertype_id_usertype = 4 AND num_pole = ".$arrayObs['pole_id_pole'].")";
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $to = $row['mail_users'];
							sendMail($to,$subject,$message);
                        }
                }
            } else {
                $return['success'] = false;
                $return['pb'] = getTranslation($_SESSION['id_language'],'ICONTRANSFERTFALSE');
            }
            echo json_encode($return);

            mysql_free_result($result);
            mysql_close($link);
            break;
        case 'postgresql':
            // TODO
            break;
    }



?>
