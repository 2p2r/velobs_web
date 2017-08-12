<?php header('Content-Type: text/html; charset=UTF-8');

    include '../key.php';
	include '../admin/adminfunction.php';

	switch (SGBD) {
        case 'mysql':
            $link = mysql_connect(HOST,DB_USER,DB_PASS);
            mysql_select_db(DB_NAME);
            //mysql_query("SET NAMES 'utf8'");

            if (!isset($_FILES["photo1"])) {
                if (!isset($_POST['lat']) || !isset($_POST['lng']) || !isset($_POST['date']) || !isset($_POST['desc']) || !isset($_POST['prop']) || !isset($_POST['subcat']) || !isset($_POST['mail']) || !isset($_POST['tel']) || !isset($_POST['rue']) || !isset($_POST['num'])) {
                    echo 'dataKO';
                } else {

                    /*
                        ICI ON INSERE EN BASE SANS METTRE LA PHOTO
                    */

                    $latitude_poi = $_POST['lat'];
                    $longitude_poi = $_POST['lng'];

                    $date_poi = $_POST['date'];
                    $desc_poi = mysql_real_escape_string($_POST['desc']);
                    $prop_poi = mysql_real_escape_string($_POST['prop']);

                    $subcategory_id_subcategory = $_POST['subcat'];

                    $sql = "SELECT lib_subcategory FROM subcategory WHERE id_subcategory = ".$subcategory_id_subcategory;
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $lib_subcategory = $row['lib_subcategory'];
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

                    $sql = "SELECT lib_commune FROM commune WHERE id_commune = ".$commune_id_commune;
                    $result = mysql_query($sql);
                    while ($row = mysql_fetch_array($result)) {
                        $lib_commune = $row['lib_commune'];
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


                    // si le mail est un administrateur ou un modérateur alors on bypasse la modération
                    $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    if ($num_rows2 == 0) {
                        $sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status) VALUES (4, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', '$mail_poi', '$tel_poi', 0, 0, 5)";
                    } else {
                        $sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status) VALUES (1, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', '$mail_poi', '$tel_poi', 1, 0, 5)";
                    }

                    $result = mysql_query($sql);
                    if (!$result) {
                        die("sqlKO");
                    }

                    $id_poi = mysql_insert_id();

                    $lib_poi .= " ".$id_poi;
                    $sql = "UPDATE poi SET lib_poi = '".$lib_poi."' WHERE id_poi = ".$id_poi;
                    $result = mysql_query($sql);



                    echo 'dataOK';

                    // envoi mail aux administrateurs généraux de 2p2r

                    /* envoi d'un mail aux administrateurs de l'association */
                    $subject = 'Nouvelle observation à modérer';
                    $message = 'Bonjour !
Une nouvelle observation a été ajoutée. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
                    $details = '

    ------------- Détails de l\'observation -------------
     # pole : '.$lib_pole.'
     # repère : '.$num_poi.'
     # nom de la voie : '.$rue_poi.'
     # commune : '.$lib_commune.'
     # latitude : '.$latitude_poi.'
     # longitude : '.$longitude_poi.'
     # catégorie : '.$lib_subcategory.'
     # description du problème : '.$desc_poi.'
     # proposition : '.$prop_poi.'
     # soumis par : '.$mail_poi.'
                ';
                    $message .= $details;

                    $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                    $result2 = mysql_query($sql2);
                    $num_rows2 = mysql_num_rows($result2);
                    if ($num_rows2 == 0) {
                        // boucle sur les administrateurs généraux de l'association
                        $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1";
                        $result = mysql_query($sql);
                        while ($row = mysql_fetch_array($result)) {
                            $to = $row['mail_users'];
                            sendMail($to, $subject, $message);
                        }
                        /* fin envoi d'un mail aux administrateurs de l'association */
                    } else {
                        // pas d'envoi de mail >> bypass
                    }

                    // envoi mail aux responsables des poles 2p2r
                    /* envoi d'un mail aux administrateurs #pole# de l'association */
                    $subject = 'Nouvelle observation à modérer';
                    $message = 'Bonjour !
Une nouvelle a été ajoutée sur le pole - '.$lib_pole.' -. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
                    $details = '

    ------------- Détails de l\'observation -------------
     # pole : '.$lib_pole.'
     # repère : '.$num_poi.'
     # nom de la voie : '.$rue_poi.'
     # commune : '.$lib_commune.'
     # latitude : '.$latitude_poi.'
     # longitude : '.$longitude_poi.'
     # catégorie : '.$lib_subcategory.'
     # description du problème : '.$desc_poi.'
     # proposition : '.$prop_poi.'
     # soumis par : '.$mail_poi.'
                ';
                    $message .= $details;

                    $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
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
                    } else {
                        // pas d'envoi de mail >> bypass
                    }
                }
            } else {
                $allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
                $temp = explode(".", $_FILES["photo1"]["name"]);
                $extension = end($temp);

                if (!isset($_POST['lat']) || !isset($_POST['lng']) || !isset($_POST['date']) || !isset($_POST['desc']) || !isset($_POST['prop']) || !isset($_POST['subcat']) || !isset($_POST['mail']) || !isset($_POST['tel']) || !isset($_POST['rue']) || !isset($_POST['num'])) {
                    echo 'dataKOfile';
                } else {
                    if (!in_array($extension, $allowedExts)) {
                        echo 'dataOKfileKO';
                    } else if (($_FILES["photo1"]["type"] != "image/gif") && ($_FILES["photo1"]["type"] != "image/jpeg") && ($_FILES["photo1"]["type"] != "image/jpg") && ($_FILES["photo1"]["type"] != "image/png")) {
                        echo 'dataOKfileKO';
                    } else {

                        /*
                            ICI ON INSERE EN BASE AVEC LA PHOTO
                        */

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

                        $latitude_poi = $_POST['lat'];
                        $longitude_poi = $_POST['lng'];

                        $date_poi = $_POST['date'];
                        $desc_poi = mysql_real_escape_string($_POST['desc']);
                        $prop_poi = mysql_real_escape_string($_POST['prop']);

                        $subcategory_id_subcategory = $_POST['subcat'];

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

                        $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                        $result2 = mysql_query($sql2);
                        $num_rows2 = mysql_num_rows($result2);
                        if ($num_rows2 == 0) {
                            $sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status, photo_poi) VALUES (4, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', '$mail_poi', '$tel_poi', 0, 0, 5, '$photo_poi')";
                        } else {
                            $sql = "INSERT INTO poi (priorite_id_priorite, quartier_id_quartier, pole_id_pole, lib_poi, desc_poi, prop_poi, datecreation_poi, subcategory_id_subcategory, display_poi, geom_poi, geolocatemode_poi, commune_id_commune, num_poi, rue_poi, mail_poi, tel_poi, moderation_poi, fix_poi, status_id_status, photo_poi) VALUES (1, $quartier_id_quartier, $pole_id_pole, '$lib_poi', '$desc_poi', '$prop_poi', '$date_poi', $subcategory_id_subcategory, 1, GeomFromText('POINT(".$longitude_poi." ".$latitude_poi.")'), $geolocatemode_poi, $commune_id_commune, '$num_poi', '$rue_poi', '$mail_poi', '$tel_poi', 1, 0, 5, '$photo_poi')";
                        }

                        $result = mysql_query($sql);
                        if (!$result) {
                            die("sqlKO");
                        }

                        $id_poi = mysql_insert_id();

                        $lib_poi .= " ".$id_poi;
                        $sql = "UPDATE poi SET lib_poi = '".$lib_poi."' WHERE id_poi = ".$id_poi;
                        $result = mysql_query($sql);

                        mysql_free_result($result);
                        mysql_close($link);

                        echo 'dataOKfileOK';



                        // envoi mail aux administrateurs généraux de 2p2r

                    /* envoi d'un mail aux administrateurs de l'association */
                        $subject = 'Nouvelle observation à modérer';
                        $message = 'Bonjour !
Une nouvelle observation a été ajoutée. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
                        $details = '

    ------------- Détails de l\'observation -------------
     # pole : '.$lib_pole.'
     # repère : '.$num_poi.'
     # nom de la voie : '.$rue_poi.'
     # commune : '.$lib_commune.'
     # latitude : '.$latitude_poi.'
     # longitude : '.$longitude_poi.'
     # catégorie : '.$lib_subcategory.'
     # description du problème : '.$desc_poi.'
     # proposition : '.$prop_poi.'
     # soumis par : '.$mail_poi.'
                ';
                        $message .= $details;

                        $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
                        $result2 = mysql_query($sql2);
                        $num_rows2 = mysql_num_rows($result2);
                        if ($num_rows2 == 0) {
                            // boucle sur les administrateurs généraux de l'association
                            $sql = "SELECT mail_users FROM users WHERE usertype_id_usertype = 1";
                            $result = mysql_query($sql);
                            while ($row = mysql_fetch_array($result)) {
                                $to = $row['mail_users'];
                                sendMail($to, $subject, $message);
                            }
                            /* fin envoi d'un mail aux administrateurs de l'association */
                        } else {
                            // pas d'envoi de mail >> bypass
                        }

                    /* envoi d'un mail aux administrateurs #pole# de l'association */
                        $subject = 'Nouvelle observation à modérer';
                        $message = 'Bonjour !
Une nouvelle observation a été ajoutée sur le pole - '.$lib_pole.' -. Veuillez vous connecter à l\'interface d\'administration pour la modérer.
Lien vers la modération : '.URL.'/admin.html?id='.$id_poi.'
Cordialement, l\'Association '.VELOBS_ASSOCIATION.' :)';
                        $details = '

    ------------- Détails de l\'observation -------------
     # pole : '.$lib_pole.'
     # repère : '.$num_poi.'
     # nom de la voie : '.$rue_poi.'
     # commune : '.$lib_commune.'
     # latitude : '.$latitude_poi.'
     # longitude : '.$longitude_poi.'
     # catégorie : '.$lib_subcategory.'
     # description du problème : '.$desc_poi.'
     # proposition : '.$prop_poi.'
     # soumis par : '.$mail_poi.'
                ';
                        $message .= $details;

                        $sql2 = "SELECT id_users FROM users WHERE (usertype_id_usertype = 1 OR usertype_id_usertype = 4) AND mail_users LIKE '".$mail_poi."'";
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
                        } else {
                            // pas d'envoi de mail >> bypass
                        }
                    }
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
