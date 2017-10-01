<?php header('Content-Type: text/html; charset=UTF-8');

    include_once '../key.php';
	include_once '../admin/adminfunction.php';

	switch (SGBD) {
        case 'mysql':
            $link = mysql_connect(HOST,DB_USER,DB_PASS);
            mysql_select_db(DB_NAME);
            //mysql_query("SET NAMES 'utf8'");
            $photo_poi = '';
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
                    $photo_poi = $newnamefichier;
                }
                if ($createObservation){
                    $id_poi = mysql_real_escape_string($_POST['id_poi']);
                    $text = mysql_real_escape_string($_POST['comment_poi']);
                    $mail_commentaires = mysql_real_escape_string($_POST['mail_poi']);
                    
                    $sql = "INSERT INTO commentaires (text_commentaires, display_commentaires, mail_commentaires, poi_id_poi, url_photo) VALUES ('$text', 0, '$mail_commentaires',$id_poi, '$photo_poi')";
                    $result = mysql_query($sql);
                    $id_commentaire = mysql_insert_id();

                    $sql = "SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi;
                    $res = mysql_query($sql);
                    $row = mysql_fetch_row($res);
                    $pole_id_pole = $row[0];
                    echo 'dataOK';
                        /* envoi d'un mail aux administrateurs #pole# de l'association */
                        $subject = 'Nouveau commentaire/photo à modérer sur l\'observation n°'.$id_poi;
                        $message = 'Bonjour !
Une nouvelle photo a été ajoutée sur l\'observation n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.php?id='.$id_poi.'
Cordialement, l\'application velobs)';
                        
                        	$sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1 OR (usertype_id_usertype = 4 AND num_pole = ".$pole_id_pole.")";
                        
                        	$result = mysql_query($sql);
                        	while ($row = mysql_fetch_array($result)) {
                        		$to = $row['mail_users'];
                        		sendMail($to, $subject, $message);
                        	}
                        	/* fin envoi d'un mail aux administrateurs #pole# de l'association */
//                         }
                }
            }
            break;
        case 'postgresql':
            // TODO
            break;
    }

?>
