<?php
	session_start();
	include_once '../key.php';
	include_once '../commonfunction.php';	
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				if (isset($_FILES['photo-path']) && isset($_POST['id_POI'])){
					$link = mysql_connect(HOST,DB_USER,DB_PASS);
					mysql_select_db(DB_NAME);	
					mysql_query("SET NAMES utf8mb4");
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " UploadPhoto.php\n", 3, LOG_FILE);
					}
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
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " $erreur\n", 3, LOG_FILE);
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
				
					$sql = "UPDATE poi SET photo_poi = '$newnamefichier' WHERE id_poi = ".$_POST['id_POI'];
					if (DEBUG){
						error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Mise à jour observation avec $sql\n", 3, LOG_FILE);
					}
					$result = mysql_query($sql);
					$lastdatemodif_poi = date("Y-m-d H:i:s");
						$sql3 = "UPDATE poi SET lastdatemodif_poi = '$lastdatemodif_poi' WHERE id_poi = $id_poi";
					$result = mysql_query($sql);
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
	}

	

?>