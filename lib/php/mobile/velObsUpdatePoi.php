<?php header('Content-Type: text/html; charset=UTF-8');

    include '../key.php';
	include '../admin/adminfunction.php';

	switch (SGBD) {
        case 'mysql':
            $link = mysql_connect(HOST,DB_USER,DB_PASS);
            mysql_select_db(DB_NAME);
            //mysql_query("SET NAMES 'utf8'");

            if (!isset($_FILES["photo1"])) {
                // pas de photo et commentaire non vide
                if ($_POST['comment'] != '') {
                    $id_poi = $_POST['id'];
                    //$text_comment = $_POST['comment'];
                    $text_comment = mysql_real_escape_string($_POST['comment']);

                    $sql = "INSERT INTO commentaires (text_commentaires, display_commentaires) VALUES ('$text_comment',false)";
                    $result = mysql_query($sql);

                    $id_commentaire = mysql_insert_id();
                    $sql = "INSERT INTO poi_commentaires (poi_id_poi, commentaires_id_commentaires) VALUES ($id_poi,$id_commentaire)";
                    $result = mysql_query($sql);

                    /* envoi d'un mail aux administrateurs */
                    $subject = 'Nouveau commentaire à modérer sur l\'observation n°'.$id_poi;
                    $message = 'Bonjour !
Un nouveau commentaire a été ajouté sur l\'observation n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.php?id='.$id_poi.'
Cordialement, l\'application velobs)';

                    sendMail(MAIL_ALIAS_OBSERVATION_ADHERENTS, $subject, $message);
                    /* fin envoi d'un mail aux administrateurs */

                    $sql = "SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi;
                    $res = mysql_query($sql);
                    $row = mysql_fetch_row($res);
                    $pole_id_pole = $row[0];


                    /* envoi d'un mail aux administrateurs #pole# de l'association */
                   $subject = 'Nouveau commentaire à modérer sur l\'observation n°'.$id_poi;
                   $message = 'Bonjour !
Un nouveau commentaire a été ajouté sur l\'observation n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.php?id='.$id_poi.'
Cordialement, l\'application velobs)';

                    $sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    if ($num_rows2 == 0) {
                        // boucle sur les administrateurs #pole# généraux de l'association
                        $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 4 AND num_pole = ".$pole_id_pole;
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $to = $row['mail_users'];
                            sendMail($to, $subject, $message);
                        }
                        /* fin envoi d'un mail aux administrateurs #pole# de l'association */
                    } 
                }
            } else {
                // photo présente
                $allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
                $temp = explode(".", $_FILES["photo1"]["name"]);
                $extension = end($temp);

                if (!in_array($extension, $allowedExts)) {
                    //echo 'dataOKfileKO';
                } else if (($_FILES["photo1"]["type"] != "image/gif") && ($_FILES["photo1"]["type"] != "image/jpeg") && ($_FILES["photo1"]["type"] != "image/jpg") && ($_FILES["photo1"]["type"] != "image/png")) {
                    //echo 'dataOKfileKO';
                } else {
                    $id_poi = $_POST['id'];
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

                    $sql = "INSERT INTO photos (url_photos, display_photos) VALUES ('$photo_poi',false)";
                    $result = mysql_query($sql);

                    $id_photo = mysql_insert_id();
                    $sql = "INSERT INTO poi_photos (poi_id_poi, photos_id_photos) VALUES ($id_poi,$id_photo)";
                    $result = mysql_query($sql);

                    if ($_POST['comment'] != '') {
                        //$text_comment = $_POST['comment'];
                        $text_comment = mysql_real_escape_string($_POST['comment']);

                        $sql = "INSERT INTO commentaires (text_commentaires, display_commentaires) VALUES ('$text_comment',false)";
                        $result = mysql_query($sql);

                        $id_commentaire  = mysql_insert_id();
                        $sql = "INSERT INTO poi_commentaires (poi_id_poi, commentaires_id_commentaires) VALUES ($id_poi,$id_commentaire)";
                        $result = mysql_query($sql);
                    }

                    /* envoi d'un mail aux administrateurs */
                    $subject = 'Nouvelle photo à modérer sur l\'observation n°'.$id_poi;
                    $message = 'Bonjour !
Une nouvelle photo a été ajoutée sur l\'observation n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.php?id='.$id_poi.'
Cordialement, l\'application velobs)';

                    $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1";
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $to = $row['mail_users'];
                        if ($to != '') {
                            sendMail($to, $subject, $message);
                        }
                    }
                    /* fin envoi d'un mail aux administrateurs */

                    $sql = "SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi;
                    $res = mysql_query($sql);
                    $row = mysql_fetch_row($res);
                    $pole_id_pole = $row[0];


                    /* envoi d'un mail aux administrateurs #pole# de l'association */
                   $subject = 'Nouveau commentaire à modérer sur l\'observation n°'.$id_poi;
                   $message = 'Bonjour !
Une nouvelle photo a été ajoutée sur l\'observation n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.php?id='.$id_poi.'
Cordialement, l\'application velobs)';

                    $sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    if ($num_rows2 == 0) {
                        // boucle sur les administrateurs #pole# généraux de l'association
                        $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 4 AND num_pole = ".$pole_id_pole;
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $to = $row['mail_users'];
                            sendMail($to, $subject, $message);
                        }
                        /* fin envoi d'un mail aux administrateurs #pole# de l'association */
                    } 
                }
            }
            break;
        case 'postgresql':
            // TODO
            break;
    }

?>
