<?php header('Content-Type: text/html; charset=UTF-8');

    include_once '../key.php';
	include_once '../admin/adminfunction.php';

	switch (SGBD) {
        case 'mysql':
            $link = mysql_connect(HOST,DB_USER,DB_PASS);
            mysql_select_db(DB_NAME);
            mysql_query("SET NAMES utf8mb4");
            $url_photo = '';
            $createObservation = 1;
            if (isset($_FILES["photo1"])) {
                // photo présente
                $allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
                $temp = explode(".", $_FILES["photo1"]["name"]);
                $extension = end($temp);

                if (!in_array($extension, $allowedExts)) {
                    echo 'dataOKfileKO';
                    $createObservation = 0;
                } else if (($_FILES["photo1"]["type"] != "image/gif") && ($_FILES["photo1"]["type"] != "image/jpeg") && ($_FILES["photo1"]["type"] != "image/jpg") && ($_FILES["photo1"]["type"] != "image/png")) {
                    echo 'dataOKfileKO';
                    $createObservation = 0;
                } else {
                    $id_poi = $_POST['id_poi'];
                    $dossier = '../../../resources/pictures/';
                    $fichier = basename($_FILES['photo1']['name']);
                    $pathphoto = $dossier.$fichier;
                    if (move_uploaded_file($_FILES['photo1']['tmp_name'], $pathphoto)) {
                        $size = getimagesize($pathphoto);
                        $newnamefichier = $size[0].'x'.$size[1].'x'.$fichier;
                        $newpathphoto = $dossier.$newnamefichier;
                        rename($pathphoto, $newpathphoto);
                    } else {
                        echo "pictureKO";
                    }
                    $url_photo = $newnamefichier;
                }
            }
                if ($createObservation){
                    $id_poi = mysql_real_escape_string($_POST['id_poi']);
                    $text = mysql_real_escape_string($_POST['text_comment']);
                    $mail_commentaires = mysql_real_escape_string($_POST['mail_comment']);
                    
                    $sql = "INSERT INTO commentaires (text_commentaires, display_commentaires, mail_commentaires, poi_id_poi, url_photo) VALUES ('$text', 0, '$mail_commentaires',$id_poi, '$url_photo')";
                    $result = mysql_query($sql);
                    $id_commentaire = mysql_insert_id();

                    $sql = "SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi;
                    $res = mysql_query($sql);
                    $row = mysql_fetch_row($res);
                    $pole_id_pole = $row[0];
                    echo 'dataOK';
                    
                    
                    
                    $arrayObs = getObservationDetailsInArray($id_poi);
                    $arrayDetailsAndUpdateSQL = getObservationDetailsInString($arrayObs);
                    if (DEBUG){
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($arrayDetailsAndUpdateSQL) ." infos chargées pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - updateObsBoolean ". $arrayDetailsAndUpdateSQL['updateObsBoolean'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - sqlUpdate ". $arrayDetailsAndUpdateSQL['sqlUpdate'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    	error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - detailObservationString ".$arrayDetailsAndUpdateSQL['detailObservationString'] ." pour l'update de l'obs $id_poi \n", 3, LOG_FILE);
                    		
                    }
                    if ($num_rows2 == 0){
                    	$newCommentInfo = "Nouveau commentaire : ". $_POST['text_comment']."\nPosté par $mail_commentaires \n";
						if ($url_photo != ""){
							$newCommentInfo .= "Photo associée : ".URL."/resources/pictures/".$url_photo."\n";
						}
						/* envoi d'un mail aux administrateurs de l'association et modérateurs */
						$whereClause = "u.usertype_id_usertype = 1 OR (u.usertype_id_usertype = 4 AND u.num_pole = ".$arrayObs['pole_id_pole'].")";
						$subject = 'Nouveau commentaire à modérer sur le pole '.$arrayObs['lib_pole'];
						$message = "Bonjour !<br />
Un nouveau commentaire a été ajouté sur le pole ".$arrayObs['lib_pole'].". Veuillez vous connecter à l'interface d'administration pour le modérer (cliquer sur le bouton \"Commentaires\", en bas à droite, une fois les détails de l'observation affichés).<br />
<a href=\"".URL.'/admin.php?id='.$arrayObs['id_poi']."\">Lien vers la modération</a>.<br />".
$newCommentInfo. $arrayDetailsAndUpdateSQL['detailObservationString']."\n";
						$mails = array();
						$mails = getMailsToSend($whereClause, $subject, $message );
					
						/* debut envoi d'un mail au contributeur */
						$subject = 'Commentaire en attente de modération';
						$message = "Bonjour !<br />
Vous venez d'ajouter un commentaire à l'observation ".$arrayObs['id_poi']." sur VelObs et nous vous en remercions. Celui-ci devrait être administré sous peu.<br />".
$newCommentInfo.$arrayDetailsAndUpdateSQL['detailObservationString']."<br />
Cordialement, l'Association ".VELOBS_ASSOCIATION." :)<br />";
					$mailArray = [$mail_commentaires,"Soumetteur", $subject, $message ];
					array_push($mails,$mailArray);
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - Il y a ". count($mails) ." mails à envoyer\n", 3, LOG_FILE);
					}
					$succes = sendMails($mails);
                }
            }
            break;
        case 'postgresql':
            // TODO
            break;
    }

?>
