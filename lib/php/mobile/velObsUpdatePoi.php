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

                    $sql = "SELECT max(id_commentaires) AS maxi FROM commentaires";
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $id_commentaire = $row['maxi'];
                    }

                    $sql = "INSERT INTO poi_commentaires (poi_id_poi, commentaires_id_commentaires) VALUES ($id_poi,$id_commentaire)";
                    $result = mysql_query($sql);

                    /* envoi d'un mail aux administrateurs */
                    $to      = 'observations_adherents_assovelo@le-pic.org';
                    $subject = '[Velobs 2P2R] Nouveau commentaire à modérer sur le POI n°'.$id_poi;
                    $message = 'Bonjour !
Un nouveau commentaire a été ajouté sur le POI n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'application vélo :)';
                    $headers = 'From: 2p2r@le-pic.org' . "\r\n" .
                    'Reply-To: 2p2r@le-pic.org' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                    mail($to, $subject, $message, $headers);
                    /* fin envoi d'un mail aux administrateurs */

                    $sql = "SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi;
                    $res = mysql_query($sql);
                    $row = mysql_fetch_row($res);
                    $pole_id_pole = $row[0];


                    /* envoi d'un mail aux administrateurs #pole# de l'association */
                   $subject = '[Velobs 2P2R] Nouveau commentaire à modérer sur le POI n°'.$id_poi;
                   $message = 'Bonjour !
Un nouveau commentaire a été ajouté sur le POI n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour le modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'application vélo :)';
                    $headers = 'From: 2p2r@le-pic.org' . "\r\n" .
                    'Reply-To: 2p2r@le-pic.org' . "\r\n" .
                    'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                    $sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    if ($num_rows2 == 0) {
                        // boucle sur les administrateurs #pole# généraux de l'association
                        $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 4 AND num_pole = ".$pole_id_pole;
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $to = $row['mail_users'];
                            mail($to, $subject, $message, $headers);
                        }
                        /* fin envoi d'un mail aux administrateurs #pole# de l'association */
                    } else {
                        // pas d'envoi de mail >> bypass
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

                    $sql = "SELECT max(id_photos) AS maxi FROM photos";
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $id_photo = $row['maxi'];
                    }
                    $sql = "INSERT INTO poi_photos (poi_id_poi, photos_id_photos) VALUES ($id_poi,$id_photo)";
                    $result = mysql_query($sql);

                    if ($_POST['comment'] != '') {
                        //$text_comment = $_POST['comment'];
                        $text_comment = mysql_real_escape_string($_POST['comment']);

                        $sql = "INSERT INTO commentaires (text_commentaires, display_commentaires) VALUES ('$text_comment',false)";
                        $result = mysql_query($sql);

                        $sql = "SELECT max(id_commentaires) AS maxi FROM commentaires";
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $id_commentaire = $row['maxi'];
                        }

                        $sql = "INSERT INTO poi_commentaires (poi_id_poi, commentaires_id_commentaires) VALUES ($id_poi,$id_commentaire)";
                        $result = mysql_query($sql);
                    }

                    /* envoi d'un mail aux administrateurs */
                    //$to      = 'observations_adherents_assovelo@le-pic.org';
                    $subject = '[Velobs 2P2R] Nouvelle photo à modérer sur le POI n°'.$id_poi;
                    $message = 'Bonjour !
Une nouvelle photo a été ajoutée sur le POI n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'application vélo :)';
                    $headers = 'From: 2p2r@le-pic.org' . "\r\n" .
                    'Reply-To: 2p2r@le-pic.org' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                    $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1";
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $to = $row['mail_users'];
                        if ($to != '') {
                            mail($to, $subject, $message, $headers);
                        }
                    }
                    /* fin envoi d'un mail aux administrateurs */

                    $sql = "SELECT pole_id_pole FROM poi WHERE id_poi = ".$id_poi;
                    $res = mysql_query($sql);
                    $row = mysql_fetch_row($res);
                    $pole_id_pole = $row[0];


                    /* envoi d'un mail aux administrateurs #pole# de l'association */
                   $subject = '[Velobs 2P2R] Nouveau commentaire à modérer sur le POI n°'.$id_poi;
                   $message = 'Bonjour !
Une nouvelle photo a été ajoutée sur le POI n°'.$id_poi.'. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'application vélo :)';
                    $headers = 'From: 2p2r@le-pic.org' . "\r\n" .
                    'Reply-To: 2p2r@le-pic.org' . "\r\n" .
                    'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                    $sql2 = "SELECT mail_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    if ($num_rows2 == 0) {
                        // boucle sur les administrateurs #pole# généraux de l'association
                        $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 4 AND num_pole = ".$pole_id_pole;
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $to = $row['mail_users'];
                            mail($to, $subject, $message, $headers);
                        }
                        /* fin envoi d'un mail aux administrateurs #pole# de l'association */
                    } else {
                        // pas d'envoi de mail >> bypass
                    }
                }
            }
            break;
        case 'postgresql':
            // TODO
            break;
    }

?>
