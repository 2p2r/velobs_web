<?php
	session_start();
    include_once '../key.php';
    require_once '../fpdf/fpdf.php';
    include_once '../commonfunction.php';
    if (DEBUG) {
        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php \n", 3, LOG_FILE);
    }
    require('WriteHTMLForPdfExport.php');
    


//         $pdf->Line();
//         

//         return $pdf;
//     }

    if (isset($_GET['id_poi']) && $_GET['id_poi'] != '') {
        switch (SGBD) {
			case 'mysql':
			    $link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);	
				mysql_query("SET NAMES utf8mb4");
				if(is_numeric($_GET['id_poi'])){
				    $id_poi = $_GET['id_poi'];
				
                
                if (DEBUG) {
                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php id_poi = $id_poi\n", 3, LOG_FILE);
                }
                $sql = "SELECT poi.*, x(poi.geom_poi) AS X, y(poi.geom_poi) AS Y, users.lib_users, usertype.lib_usertype, commune.lib_commune, subcategory.lib_subcategory, pole.lib_pole,priorite.lib_priorite, status.lib_status FROM poi 
                INNER JOIN commune ON commune.id_commune = poi.commune_id_commune
                INNER JOIN pole ON pole.id_pole = poi.pole_id_pole
                INNER JOIN subcategory ON subcategory.id_subcategory = poi.subcategory_id_subcategory
                INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite) 
                INNER JOIN status ON (status.id_status = poi.status_id_status)
                LEFT OUTER JOIN users ON users.id_users = poi.lastmodif_user_poi
                LEFT OUTER JOIN usertype ON users.usertype_id_usertype = usertype.id_usertype
                WHERE id_poi = ". $id_poi;
                $whereSelectPOIAppend = '';
                if (isset($_SESSION['user']) && isset($_SESSION['type']) && isset($_SESSION['pole'])){
                    //si l'utilisateur fait partie d'un pole technique ou d'une communauté de communes, on vérifie que le POI correspons bien à une priorité qui lui est accessible
                    if ($_SESSION['type'] == 3 || $_SESSION['type'] == 2){
                        $whereSelectPOIAppend = ' AND priorite.non_visible_par_collectivite = 0 ';
                    }
                } else{
                    //si le POI est dans une priorité non accessible par le public, on ne le retourne pas
                    $whereSelectPOIAppend = ' AND priorite.non_visible_par_public = 0 ';
                }
                $sql .= $whereSelectPOIAppend;
                
                if (DEBUG) {
                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php $sql\n", 3, LOG_FILE);
                }
                $result = mysql_query($sql);
                $poi = mysql_fetch_array($result);
                
                if (!isset($poi) || $poi == null){
                    header("HTTP/1.1 404 Observation does not exist");
                    header("Connection: close");
                    ?>
	    <html><body>L'observation que vous souhaitez imprimer n'est pas encore accessible. Soit elle n'a pas encore été modérée, soit l'état affecté par l'association ne permet pas sa diffusion.</body></html>
	    <?php 
	    exit();
                }
                if (DEBUG) {
                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php ".$poi['id_poi']."\n", 3, LOG_FILE);
                }
                
                $sqlVote = "SELECT count(*) AS nombre_vote FROM support_poi WHERE poi_poi_id = " . $poi ['id_poi'];
                
                $resultVote = mysql_query ( $sqlVote );
                $NbreVotes = 0;
                while ( $rowVote = mysql_fetch_array ( $resultVote ) ) {
                    $NbreVotes = $rowVote['nombre_vote'];
                    if (DEBUG) {
                        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - Nombre de votes \n", 3, LOG_FILE);
                        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - Nombre de votes ".$rowVote['nombre_vote']." \n", 3, LOG_FILE);
                    }
                }
                
                $html = '<hr><p>Ce document est un export au format pdf de la fiche VelObs n°'.$poi['id_poi'].', en date du '.date('Y-m-d H:i:s').'.</p>';
                $html .= '<p>Lien vers l\'observation sur l\'<a href="'.URL.'/index.php?id='.$poi['id_poi'].'">interface publique</a> de l\'application <a href="https://2p2r.org/articles-divers/page-sommaire/article/velobs">VelObs</a>.</p>';
                $html .= '<p>Lien vers  l\'observation sur l\'<a href="'.URL.'/admin.php?id='.$poi['id_poi'].'">interface d\'administration</a> de l\'application <a href="https://2p2r.org/articles-divers/page-sommaire/article/velobs">VelObs</a>.</p>';
                if ($NbreVotes > 0){
                    $html .= '<p>Cette observation a obtenu ' . $NbreVotes . ' vote(s).</p>';
                }
                if ($poi ['lastdatemodif_poi'] != ""){
                    $html .= '<p>Date de dernière modification de l\'observation : <i>'.strftime("%d/%m/%Y", strtotime($poi ['lastdatemodif_poi'])).'</i>, par <i>'.$poi['lib_users'].' ('.$poi['lib_usertype'].')</i></p>';
                }else{
                    $html .= '<p><i>Cette observation n\'a encore jamais été modifiée depuis sa création.</i></p>';
                }
                
                
                
                $html .= '<br /><br /><hr><H1>Détails de l\'observation</H1>';
                $html .= '<ul><li>Type de l\'observation : <i>'.$poi['lib_subcategory'].'</i></li>';
                $html .= '<li>Pôle territorial : <i>'.$poi['lib_pole'].'</i></li>';
                $html .= '<li>Commune : <i>'.$poi['lib_commune'].'</i></li>';
                $html .= '<li>Localisation précise : <i>'.$poi['rue_poi'].'</i></li>';
                $html .= '<li>Repère : <i>'.$poi['num_poi'].'</i></li>';
                $html .= '<li>Position GPS : <i><a href="'.URL.'/index.php?id='.$poi['id_poi'].'">'.$poi['X'].' ' . $poi['Y'] .'</a></i></li>';
                $html .= '<li>Description : <i>'.$poi['desc_poi'].'</i></li>';
                $html .= '<li>Proposition : <i>'.$poi['prop_poi'].'</i></li>';
                $html .= '<li>Priorité donnée par '.VELOBS_ASSOCIATION.' : <i>'.$poi['lib_priorite'].'</i></li>';
                $html .= '<li>Statut positionné par la collectivité : <i>'.$poi['lib_status'].'</i></li>';
                $html .= '<li>Commentaire bénévole '.VELOBS_ASSOCIATION.' : <i>'.$poi['commentfinal_poi'].'</i></li>';
                $html .= '<li>Commentaire collectivité : <i>'.$poi['reponse_collectivite_poi'].'</i></li>';
                if (isset($poi['photo_poi'])) {
                    $photo_filename = '../../../resources/pictures/' . $poi['photo_poi'];
                    if (file_exists($photo_filename) && is_file($photo_filename))
                        $exifimagetype = exif_imagetype ( $photo_filename );
                        $imagefiletype = [
                            1 => 'GIF',
                            2 => 'JPG',
                            3 => 'PNG'
                        ][$exifimagetype];
                        if (!is_null($imagefiletype)){
                            list($width, $height) = getimagesize($photo_filename);
                            if (DEBUG) {
                                error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php $width, $height\n", 3, LOG_FILE);
                            }
                            if($width > 250){
                                $height = ($height*250)/$width;
                                $width = 250;
                            }
                            $html .= '<li>Photo : </li></ul><img src="'.$photo_filename.'"  width="'.$width.'"px height="'.$height.'px"  />';
                            $html .= '<li><a href="'.URL.'/resources/pictures/' . $poi['photo_poi'].'">Lien photo</a></li><br />';
                        }
                }
                $html .= '<br /><hr /><H1>Commentaires éventuels</H1>';
                $whereSelectCommentAppend = '';
                
                if (isset($_SESSION['user']) && isset($_SESSION['type']) && isset($_SESSION['pole'])){
                    $extraSQL = "";
                    //si l'utilisateur fait partie d'un pole technique ou d'une communauté de communes, on restreint les commentaires aux seuls modérés positivement par l'assocation
                    if ($_SESSION['type'] == 3 || $_SESSION['type'] == 2){
                        $whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
                    }
                    
                }else{
                    //si personne n'est connecté, on restreint les commentaires aux seuls modérés positivement par l'assocation
                    $whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
                }
                
                
                $sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $poi ['id_poi'] . " " . $whereSelectCommentAppend ." ORDER BY id_commentaires ASC";
                
                $result2 = mysql_query ( $sql2 );
                $nbComment = 0;
                while ( $row2 = mysql_fetch_array ( $result2 ) ) {
                    if (DEBUG) {
                        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - AJout comment ".$row2['id_commentaires']." \n", 3, LOG_FILE);
                    }
                    if ($row2 ['display_commentaires'] =="Non modéré" || $row2 ['display_commentaires'] =="Modéré refusé"){
                        $html .=  "<li>Statut : <i><red>".$row2 ['display_commentaires'] ."</red></i></li>";
                    }else{
                        $html .=  "<li>Statut : <i>".$row2 ['display_commentaires'] ."</i></li>";
                    }
                    $html .=  "<li>Date Création : <i>" . strftime("%d/%m/%Y", strtotime($row2 ['datecreation'])) . "</i></li>";
                    $html .=  "<li>Commentaire : <i>".nl2br(stripslashes ( $row2 ['text_commentaires'] ))."</i></li>";
                    
                    
                    if (isset($row2 ['url_photo'])) {
                        $photo_filename = '../../../resources/pictures/' . $row2 ['url_photo'];
                        if (file_exists($photo_filename) && is_file($photo_filename))
                            $exifimagetype = exif_imagetype ( $photo_filename );
                            $imagefiletype = [
                                1 => 'GIF',
                                2 => 'JPG',
                                3 => 'PNG'
                            ][$exifimagetype];
                            if (!is_null($imagefiletype))
                                list($width, $height) = getimagesize($photo_filename);
                                if (DEBUG) {
                                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php $width, $height\n", 3, LOG_FILE);
                                }
                                if($width > 250){
                                    $height = ($height*250)/$width;
                                    $width = 250;
                                }
                                if (DEBUG) {
                                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php $width, $height\n", 3, LOG_FILE);
                                }
//                                 $comment .= $pdf->Image('../../../resources/pictures/' . $row2 ['url_photo'], NULL, NULL, 0, 0, $imagefiletype);
                                $html .= '<li>Photo : </li><img src="'.$photo_filename.'" width="'.$width.'"px height="'.$height.'px" />';
                                $html .= '<li><a href="'.URL.'/resources/pictures/' . $row2 ['url_photo'].'">Lien photo</a></li><br />';
                                //$html .= '<li>Photo : </li><img src="'.$photo_filename.'" height="300px" />';
                                
                    }
                    $html .= '<HR width="150px"/>';
//                     $pdf->MultiCell(0, 5, $comment,0,L,false);
                    
                     $nbComment ++;
                }
                if ($nbComment == 0){
                    $html .= '<li>Aucun commentaire n\'a encore été ajouté à cette observation. Pour en ajouter un, accédez à l\'<a href="'.URL.'/index.php?id='.$poi['id_poi'].'">interface publique</a> de l\'observation.</li>';
                }
                $pdf=new createPDF(utf8_decode($html),utf8_decode("Fiche VelObs n°".$poi['id_poi']),VELOBS_ASSOCIATION,time(),$poi['id_poi'],strftime("%d/%m/%Y", strtotime($poi['datecreation_poi'])));
                $pdf->run();
                 
                mysql_free_result($result);
                mysql_close($link);
                
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
	}else{
	    if (DEBUG) {
	        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php aucun id_poi spécifié\n", 3, LOG_FILE);
	    }
	    header("HTTP/1.1 404 Observation does not exist");
// 	    header("Location: $newplace");
	    header("Connection: close");
	    ?>
	    <html><body>Aucun numéro d'observation n'a été spécifié</body></html>
	    <?php 
	    exit();
// 	    $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');
// 	    header($protocol);
// 	    http_response_code(404);
	}
?>
