<?php
	include '../key.php';
	include '../commonfunction.php';	
	
	switch (SGBD) {
		case 'mysql':
			$dossier = '../../../resources/pictures/';
			$fichier = basename($_FILES['photo']['name']);
			$taille_maxi = 2000000;
			$taille = filesize($_FILES['photo']['tmp_name']);
			$extensions = array('.png', '.jpg', '.jpeg', '.JPG', '.JPEG');
			$extension = strrchr($_FILES['photo']['name'], '.'); 
			if (!in_array($extension, $extensions)) {
				$erreur = "photo ko";
			}
			if ($taille > $taille_maxi) {
				$erreur = "photo ko";
			}
				 
			if (substr_count($contenu_du_fichier, $fichier) != 0) {
				$erreur = "photo ko";
			}
		
			if (!isset($erreur)) {
				$pathphoto = $dossier.$fichier;
				if (move_uploaded_file($_FILES['photo']['tmp_name'], $pathphoto)) {
					$size = getimagesize($pathphoto);
					$newnamefichier = $size[0].'x'.$size[1].'x'.$fichier;
					$newpathphoto = $dossier.$newnamefichier;
					rename($pathphoto, $newpathphoto);
					$erreur = "photo ok";					
					echo $erreur;
				} else {
					$erreur = "photo ko";
					echo $erreur;
				}
			} else {
				echo $erreur;
			}
			fclose ($fp);
			
			break;
		case 'postgresql':
			// TODO
			break;
	}
?>
