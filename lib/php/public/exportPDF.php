<?php
	session_start();
    include_once '../key.php';
    require_once '../fpdf/fpdf.php';
    include_once '../commonfunction.php';
    if (DEBUG) {
        error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - in exportPDF.php \n", 3, LOG_FILE);
    }
    function get_pdf($poi_data) {
        $pdf = new FPDF();
        $pdf->AddPage("");
        $pdf->SetTitle('VelObs Fiche ' . $poi_data['id_poi']);
        $pdf->SetMargins(10, 10);

        $pdf->Image('../../../resources/images/2p2r.png', NULL, NULL, 0, 30);
        $pdf->SetY(10);
        $pdf->SetX(30);

        $pdf->SetFont('Arial', 'B', 35);
        $pdf->Cell(170, 25, utf8_decode('VelObs Fiche ' . $poi_data['id_poi']), '', 2, 'C');

        $pdf->SetFont('Arial', '', 12);
        $currentDateTime = date('Y-m-d H:i:s');
        $pdf->Text(120, 10, utf8_decode('Date génération pdf : ' . $currentDateTime));

        $pdf->SetFont('Arial', 'B', 35);
        //$pdf->Cell(170, 15, utf8_decode($poi_data['ref_poi']), '', 0, 'C');

        $pdf->SetFont('Arial', '', 12);

        $pdf->Text(8, 48, utf8_decode('5 Avenue François Collignon'));
        $pdf->Text(8, 53, utf8_decode('31200 Toulouse'));
        $pdf->Text(8, 58, utf8_decode('Tél : 05 34 30 94 18'));
        //PutLink('mailto:toulouse@fubicy.org','toulouse@fubicy.org');
        $pdf->Text(8, 63, utf8_decode('Courriel : toulouse@fubicy.org'));

        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Text(78, 48, utf8_decode('Détails de l\'observation'));
        
        $pdf->SetY(53);
        $pdf->SetX(79);
        $pdf->SetFont('Arial','B', 12);
        $pdf->Write(0.4, utf8_decode('Date création observation : '));
        $pdf->SetFont('Arial', '', 12);
        $pdf->Write(0.4, utf8_decode(strftime("%d/%m/%Y", strtotime($poi_data['datecreation_poi']))));
        $pdf->SetY(59);
        $pdf->SetX(79);
        $pdf->SetFont('Arial','B', 12);
        $pdf->Write(0.4, 'Commune: ');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Write(0.4, utf8_decode($poi_data['lib_commune']));
        
        

        $pdf->SetY(65);
        $pdf->SetX(79);
        $pdf->SetFont('Arial','B', 12);
        $pdf->Write(0.4, utf8_decode('Localisation précise : '));
        $pdf->SetFont('Arial', '', 12);
        $pdf->SetY(63);
        $pdf->SetX(81);
        $pdf->MultiCell(0, 5, utf8_decode($poi_data['rue_poi']));

        $pdf->SetY(85);
        $pdf->SetX(8);
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, utf8_decode($poi_data['lib_subcategory']), '', 2, 'C');

        $pdf->SetFont('Arial', '', 12);
        $pdf->MultiCell(0, 5, utf8_decode("Description: " . $poi_data['desc_poi'] . "\n\n"));

        $pdf->MultiCell(0, 5, utf8_decode("Proposition: " . $poi_data['prop_poi'] . "\n\n"));

        $pdf->MultiCell(0, 5, utf8_decode("Commentaire bénévole 2P2R: " . $poi_data['commentfinal_poi'] . "\n\n"));

        $pdf->MultiCell(0, 5, utf8_decode("Commentaire Métropole: " . $poi_data['reponse_collectivite_poi'] . "\n\n"));

        if (isset($poi_data['photo_poi'])) {
            $photo_filename = '../../../resources/pictures/' . $poi_data['photo_poi'];
            if (file_exists($photo_filename) && is_file($photo_filename))
                $exifimagetype = exif_imagetype ( $photo_filename );
                $imagefiletype = [
                    1 => 'GIF',
                    2 => 'JPG',
                    3 => 'PNG'
                ][$exifimagetype];
                if (!is_null($imagefiletype))
                    $pdf->Image('../../../resources/pictures/' . $poi_data['photo_poi'], NULL, NULL, 0, 0, $imagefiletype);
        }
        $pdf->Line();
        $whereSelectCommentAppend = '';
        $whereSelectCommentAppend = ' AND display_commentaires = \'Modéré accepté\' ';
        $sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . $poi_data ['id_poi'] . " " . $whereSelectCommentAppend ." ORDER BY id_commentaires ASC";
        
        $result2 = mysql_query ( $sql2 );
        while ( $row2 = mysql_fetch_array ( $result2 ) ) {
            if (DEBUG) {
                error_log(date("Y-m-d H:i:s") . " " . __FUNCTION__ . " - AJout comment ".$row2['id_commentaires']." \n", 3, LOG_FILE);
            }
            $comment = utf8_decode("Date Création: " . strftime("%d/%m/%Y", strtotime($row2 ['datecreation'])) . "\n");
            $comment.= utf8_decode("Auteur: *****\n\n");
            $comment.= utf8_decode("Commentaire: ".stripslashes ( $row2 ['text_commentaires'] )."\n");
            
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

        return $pdf;
    }
    function PutLink($URL, $txt)
    {
        // Put a hyperlink
        $this->SetTextColor(0,0,255);
        $this->SetStyle('U',true);
        $this->Write(5,$txt,$URL);
        $this->SetStyle('U',false);
        $this->SetTextColor(0);
    }
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
                $pdf_obj = get_pdf($poi);
                
                mysql_free_result($result);
                mysql_close($link);
                
                $pdf_obj->Output("I", "cyclofiche-" . $poi['id_poi'] . ".pdf");
				}

				break;
			case 'postgresql':
				// TODO
				break;
		}
    }
?>