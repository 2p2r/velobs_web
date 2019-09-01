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
                
                $pdf=new PDF_HTML();
                $pdf->setIdPOI($poi['id_poi']);
                $pdf->setDateCreationPOI(utf8_decode(strftime("%d/%m/%Y", strtotime($poi['datecreation_poi']))));
                $pdf->AddPage();
                $pdf->AliasNbPages();
                $pdf->SetFont('Arial', '', 12);
                $y = 35;
                $decalage = 5;
                $pdf->Text(8, $y, utf8_decode('5 Avenue François Collignon'));
                $y += $decalage;
                $pdf->Text(8, $y, utf8_decode('31200 Toulouse'));
                        $y += $decalage;
                        $pdf->Text(8, $y, utf8_decode('Tél : 05 34 30 94 18'));
                        $y += $decalage;
                        //PutLink('mailto:toulouse@fubicy.org','toulouse@fubicy.org');
                        $pdf->Text(8, $y, utf8_decode('Courriel : toulouse@fubicy.org'));
                        $y += $decalage;
                        $pdf->SetY($y);
                        //$pdf->SetFont('Arial', 'B', 16);
                        $html = '<hr><p align="center"><b>Détails de l\'observation</b></p>';
                        $html .= '<p align="left">Type de l\'observation : '.$poi['lib_subcategory'].'</p><br />';
                        $html .= '<p align="left">Commune : '.$poi['lib_commune'].'</p><br />';
                        $html .= '<p align="left">Localisation précise : '.$poi['rue_poi'].'</p>';
                        $html .= '<p align="left">Description : '.$poi['desc_poi'].'</p><br />';
                        $html .= '<p align="left">Proposition : '.$poi['prop_poi'].'</p><br />';
                        $html .= '<p align="left">Commentaire bénévole 2P2R : '.$poi['commentfinal_poi'].'</p><br />';
                        $html .= '<p align="left">Commentaire collectivité : '.$poi['reponse_collectivite_poi'].'</p><br />';
                        if (isset($poi['photo_poi'])) {
                            $photo_filename = '../../../resources/pictures/' . $poi['photo_poi'];
                                        if (file_exists($photo_filename) && is_file($photo_filename))
                                                $exifimagetype = exif_imagetype ( $photo_filename );
                                            $imagefiletype = [
                                                    1 => 'GIF',
                                                2 => 'JPG',
                                                3 => 'PNG'
                                            ][$exifimagetype];
                                            if (!is_null($imagefiletype))
                                                $html .= '<p align="left">Photo : </p><br /><img src="../../../resources/pictures/' . $poi['photo_poi'].'" /><br />';
                                        }
                                        $html .= '<hr><p align="center">Commentaires éventuels</p><br />';
                                        $whereSelectCommentAppend = '';
                                                $whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
                                                $sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $poi ['id_poi'] . " " . $whereSelectCommentAppend ." ORDER BY id_commentaires ASC";
                                        
                                                $result2 = mysql_query ( $sql2 );
                                                while ( $row2 = mysql_fetch_array ( $result2 ) ) {
                                                    if (DEBUG) {
                                                        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - AJout comment ".$row2['id_commentaires']." \n", 3, LOG_FILE);
                                                    }
                                                    $html .=  "Date Création: " . strftime("%d/%m/%Y", strtotime($row2 ['datecreation'])) . "<br />";
                                                    $html .=  "Auteur: *****<br />";
                                                    $html .=  "Commentaire: ".stripslashes ( $row2 ['text_commentaires'] )."<br />";
                                        
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
                                                                        $comment .= $pdf->Image('../../../resources/pictures/' . $row2 ['url_photo'], NULL, NULL, 0, 0, $imagefiletype);
                                                        }
                                                        $pdf->MultiCell(0, 5, $comment,0,L,false);
                                            
                                                        $j ++;
                                                    }
                        $pdf->WriteHTML(utf8_decode($html));
                        $pdf->Ln(10);
                $pdf->SetFont('Arial');
                $pdf->WriteHTML('On peut<br><p align="center">centrer du texte</p>et ajouter un trait de séparation :<br><hr>');
                $pdf->Output();
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