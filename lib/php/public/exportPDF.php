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

	if (isset($_GET['id_poi'])) {
        switch (SGBD) {
			case 'mysql':
			    $link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);	
				mysql_query("SET NAMES utf8mb4");
				if(is_numeric($_GET['id_poi'])){
				    $id_poi = $_GET['id_poi'];
				
                
                if (DEBUG) {
                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php id_poi = $id_poi $link\n", 3, LOG_FILE);
                }
                $sql = "SELECT poi.*, commune.lib_commune, subcategory.lib_subcategory FROM poi 
                INNER JOIN commune ON commune.id_commune = poi.commune_id_commune
                INNER JOIN subcategory ON subcategory.id_subcategory = poi.subcategory_id_subcategory
                WHERE id_poi = ". $id_poi;
                if (DEBUG) {
                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php $sql\n", 3, LOG_FILE);
                }
                $result = mysql_query($sql);
                $poi = mysql_fetch_array($result);
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
                
                $html = '<hr><p>Ce document est un export au format pdf de la fiche VelObs n°'.$poi['id_poi'].', en date du '.date('Y-m-d H:i:s').'</p>';
                $html .= '<p>Lien vers l\'observation sur l\'<a href="http://esitoul-dev.toulouse.inra.fr/velobs/index.php?id='.$poi['id_poi'].'">interface publique</a> sur l\'application VelObs </p>';
                $html .= '<p>Lien vers  l\'observation sur l\'<a href="http://esitoul-dev.toulouse.inra.fr/velobs/admin.php?id='.$poi['id_poi'].'">interface d\'administration</a> sur l\'application VelObs </p>';
                if ($NbreVotes > 0){
                    $html .= '<p>Cette observation a obtenu ' . $NbreVotes . ' vote(s).</p>';
                }
                
                
                $html .= '<br /><br /><hr><H1>Détails de l\'observation</H1>';
                $html .= '<ul><li>Type de l\'observation : <i>'.$poi['lib_subcategory'].'</i></li>';
                $html .= '<li>Commune : <i>'.$poi['lib_commune'].'</i></li>';
                $html .= '<li>Localisation précise : <i>'.$poi['rue_poi'].'</i></li>';
                $html .= '<li>Description : <i>'.$poi['desc_poi'].'</i></li>';
                $html .= '<li>Proposition : <i>'.$poi['prop_poi'].'</i></li>';
                $html .= '<li>Commentaire bénévole 2P2R : <i>'.$poi['commentfinal_poi'].'</i></li>';
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
                            $html .= '<li>Photo : </li></ul><img src="'.$photo_filename.'" height="300px" />';
                        }
                }
                $html .= '<hr><H1>Commentaires éventuels</H1>';
                $whereSelectCommentAppend = '';
                $whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
                $sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $poi ['id_poi'] . " " . $whereSelectCommentAppend ." ORDER BY id_commentaires ASC";
                
                $result2 = mysql_query ( $sql2 );
                while ( $row2 = mysql_fetch_array ( $result2 ) ) {
                    if (DEBUG) {
                        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - AJout comment ".$row2['id_commentaires']." \n", 3, LOG_FILE);
                    }
                    $html .=  "<li>Date Création : <i>" . strftime("%d/%m/%Y", strtotime($row2 ['datecreation'])) . "</i></li>";
                    $html .=  "<li>Auteur : <i>*****</i></li>";
                    $html .=  "<li>Commentaire : <i>".nl2br(stripslashes ( $row2 ['text_commentaires'] ))."</i></li>";
                    
                    //             $pdf->MultiCell(0, 5, utf8_decode("Auteur: *****\n\n"));
                    //             $pdf->MultiCell(0, 5, utf8_decode("Commentaire: ".stripslashes ( $row2 ['text_commentaires'] )."\n\n"));
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
                                if($width > 450){
                                    $height = ($height*450)/$width;
                                    $width = 450;
                                }
                                if (DEBUG) {
                                    error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php $width, $height\n", 3, LOG_FILE);
                                }
//                                 $comment .= $pdf->Image('../../../resources/pictures/' . $row2 ['url_photo'], NULL, NULL, 0, 0, $imagefiletype);
                                $html .= '<li>Photo : </li><img src="'.$photo_filename.'" width="'.$width.'"px height="'.$height.'px" />';
                                //$html .= '<li>Photo : </li><img src="'.$photo_filename.'" height="300px" />';
                                
                    }
                    $html .= '<HR width="150px"/>';
//                     $pdf->MultiCell(0, 5, $comment,0,L,false);
                    
//                     $j ++;
                }
                
                $pdf=new createPDF(utf8_decode($html),"Fiche VelObs ".$poi['id_poi'],"2P2R",time(),$poi['id_poi'],strftime("%d/%m/%Y", strtotime($poi['datecreation_poi'])));
                $pdf->run();
                 
//                 $pdf->setDateCreationPOI(utf8_decode(strftime("%d/%m/%Y", strtotime($poi['datecreation_poi']))));
//                 $pdf->AddPage();
//                 $pdf->AliasNbPages();
//                 $pdf->SetFont('Arial', '', 12);
//                 $y = 35;
//                 $decalage = 5;
//                 $pdf->Text(8, $y, utf8_decode('5 Avenue François Collignon'));
//                 $y += $decalage;
//                 $pdf->Text(8, $y, utf8_decode('31200 Toulouse'));
//                         $y += $decalage;
//                         $pdf->Text(8, $y, utf8_decode('Tél : 05 34 30 94 18'));
//                         $y += $decalage;
//                         //PutLink('mailto:toulouse@fubicy.org','toulouse@fubicy.org');
//                         $pdf->Text(8, $y, utf8_decode('Courriel : toulouse@fubicy.org'));
//                         $y += $decalage;
//                         $pdf->SetY($y);
//                         //$pdf->SetFont('Arial', 'B', 16);
                        
//                         $pdf->WriteHTML(utf8_decode($html));
//                         $pdf->Ln(10);
//                 $pdf->SetFont('Arial');
//                 $pdf->WriteHTML('On peut<br><p align="center">centrer du texte</p>et ajouter un trait de séparation :<br><hr>');
//                 $pdf->Output();
//                 $pdf_obj = get_pdf($poi);
                
                mysql_free_result($result);
                mysql_close($link);
                
//                 $pdf_obj->Output("I", "cyclofiche-" . $poi['id_poi'] . ".pdf");
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
    }
?>