<?php
	include '../key.php';
	include '../commonfunction.php';
	$_SESSION['id_language'] = 1;	
	
	switch (SGBD) {
		case 'mysql':
			if (isset($_FILES['photo-path']) && isset($_POST['id_POI'])) {
				if ($_FILES['photo-path']['name'] != '') {
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
						if (move_uploaded_file($_FILES['photo-path']['tmp_name'], $pathphoto)) {
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
				} else {
					$return['success'] = true;
					$return['nophoto'] = 0;
				}
				
			}
		
			if ($return['success'] == true && !isset($return['nophoto'])) {
				$sql = "SELECT photo_poi FROM poi WHERE id_poi = ".$_POST['id_POI'];
				$result = mysql_query($sql);
				while ($row = mysql_fetch_array($result)) {
					unlink("../../data/pictures/".$row['photo_poi']);
				}
				$sql = "UPDATE poi SET photo_poi = '$newnamefichier' WHERE id_poi = ".$_POST['id_POI'];
				$result = mysql_query($sql);
			} else if (!isset($return['nophoto'])) {
				$return['success'] = false;
				//echo 'effacer le poi n°'.$_POST['id_POI'];
				$sql = "DELETE FROM poi WHERE id_poi = ".$_POST['id_POI'];
				$result = mysql_query($sql);
				
				//$return['pb'] = getTranslation($_SESSION['id_language'],'ICONTRANSFERTFALSE');
			}
			echo json_encode($return);

			mysql_free_result($result);
			mysql_close($link);
			break;
		case 'postgresql':
			// TODO
			break;
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

	
?>