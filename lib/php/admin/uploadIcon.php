<?php
	session_start();
	include_once '../key.php';
	include_once '../commonfunction.php';
	
	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");

				if (isset($_FILES['photo-path'])) {
					$dossier = '../../../resources/icon/marker/';
					$fichier = basename($_FILES['photo-path']['name']);
					$taille_maxi = 52400;
					$taille = filesize($_FILES['photo-path']['tmp_name']);
					$extensions = array('.png');
					$extension = strrchr($_FILES['photo-path']['name'], '.'); 
					if (!in_array($extension, $extensions)) {
						$erreur = getTranslation($_SESSION['id_language'],'ERROR');
						$return['success'] = false;
						$return['pb'] = getTranslation($_SESSION['id_language'],'ICONPNG');
					}
					if ($taille > $taille_maxi) {
						$erreur = getTranslation($_SESSION['id_language'],'ERROR');
						$return['success'] = false;
						$return['pb'] = getTranslation($_SESSION['id_language'],'ICONSIZE');
					}

					if (!isset($erreur)) {
						$fichier = strtr($fichier, 
								'ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝàáâãäåçèéêëìíîïðòóôõöùúûüýÿ_', 
								'AAAAAACEEEEIIIIOOOOOUUUUYaaaaaaceeeeiiiioooooouuuuyy-');
						$fichier = preg_replace('/([^.a-z0-9]+)/i', '-', $fichier);
			
						$sql = "SELECT max(id_iconmarker) AS nb FROM iconmarker";
						$result = mysql_query($sql);
						$lastid = mysql_result($result, 0);
						$lastid += 1;
						$fichier = 'iconmarker'.$lastid.'.png';
						$fichierdatabase = 'iconmarker'.$lastid.'.png';
						$pathphoto = $dossier.$fichier;

						$size = getimagesize($_FILES['photo-path']['tmp_name']);
						if ($size[0] != 32 || $size[1] != 37) {
							$return['pb'] = getTranslation($_SESSION['id_language'],'ICONSIZEPIXEL');
						} else {													
							if (move_uploaded_file($_FILES['photo-path']['tmp_name'], $pathphoto)) {
								$return['success'] = true;
								$return['ok'] = getTranslation($_SESSION['id_language'],'ICONTRANSFERTDONE');
								$size = getimagesize($pathphoto);
								$newpathphoto = $dossier.$fichier;
								rename($pathphoto, $newpathphoto);
			
								$newpathphoto16x18 = $dossier."16x18/".$fichier;
								copy($newpathphoto, $newpathphoto16x18);
								$percent = 0.5;
								list($width, $height) = getimagesize($newpathphoto16x18);
								$newwidth = $width * $percent;
								$newheight = $height * $percent;
								$img = imagecreatefrompng($newpathphoto);
								$im = imagecreatetruecolor ($newwidth, $newheight);
								imagealphablending($im,FALSE);
								imagesavealpha($im,TRUE);
								imagecopyresampled($im, $img, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
								imagepng($im,$newpathphoto16x18);
								$handle = @fopen('../../../resources/css/iconmarker.css', 'a+');
								if ($handle){
									fwrite($handle, '.iconmarker'.$lastid.'{ background-image: url(../icon/marker/16x18/iconmarker'.$lastid.'.png) !important; }
');
									fclose($handle);
								}
							} else {
								$return['success'] = false;
								$return['pb'] = getTranslation($_SESSION['id_language'],'ICONTRANSFERTFALSE');
							}
						}
					}
				}
				break;
			case 'postgresql':
				// TODO
				break;
		}

		if ($return['success'] == true){
			$urlname = substr($fichierdatabase,0,strlen($fichierdatabase)-4);
			$sql = "INSERT INTO iconmarker (urlname_iconmarker) VALUES ('$urlname')";
			$result = mysql_query($sql);
		}
		
		mysql_free_result($result);
		mysql_close($link);
		
		echo json_encode($return);

	}

?>