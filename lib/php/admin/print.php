<?php
	session_start();
    include_once '../key.php';
    require_once '../fpdf/fpdf.php';
    
    function get_pdf($poi_data) {
        $pdf = new FPDF();
        $pdf->AddPage("");
        $pdf->SetMargins(10, 10);

        $pdf->Image('../../../resources/images/velocite.png', NULL, NULL, 0, 30);
        $pdf->SetY(10);
        $pdf->SetX(30);

        $pdf->SetFont('Arial', 'B', 50);
        $pdf->Cell(170, 15, utf8_decode('Cyclofiche'), '', 2, 'C');

        $pdf->SetFont('Arial', '', 12);
        $pdf->Text(170, 10, utf8_decode('Date: ' . $poi_data['datecreation_poi']));

        $pdf->SetFont('Arial', 'B', 35);
        $pdf->Cell(170, 15, utf8_decode($poi_data['ref_poi']), '', 0, 'C');

        $pdf->SetFont('Arial', '', 12);

        $pdf->Text(8, 48, utf8_decode('16 rue Ausone'));
        $pdf->Text(8, 53, utf8_decode('33000 Bordeaux'));
        $pdf->Text(8, 58, utf8_decode('Tél : 05 56 81 63 89'));
        $pdf->Text(8, 63, utf8_decode('Courriel : bordeaux@fubicy.org'));

        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Text(78, 48, utf8_decode('Localisation de la demande'));
        
        $pdf->SetY(53);
        $pdf->SetX(79);
        $pdf->SetFont('Arial','B', 12);
        $pdf->Write(0.4, 'Commune: ');
        $pdf->SetFont('Arial', '', 12);
        $pdf->Write(0.4, utf8_decode($poi_data['commune_poi']));

        $pdf->SetY(59);
        $pdf->SetX(79);
        $pdf->SetFont('Arial','B', 12);
        $pdf->Write(0.4, utf8_decode('Localisation précise : '));
        $pdf->SetFont('Arial', '', 12);
        $pdf->SetY(63);
        $pdf->SetX(81);
        $pdf->MultiCell(0, 5, utf8_decode($poi_data['num_poi']));

        $pdf->SetY(85);
        $pdf->SetX(8);
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, utf8_decode($poi_data['lib_poi']), '', 2, 'C');

        $pdf->SetFont('Arial', '', 12);
        $pdf->MultiCell(0, 5, utf8_decode($poi_data['desc_poi'] . "\n\n"));

        $pdf->Image('../../../resources/pictures/' . $poi_data['photo_poi']);

        return $pdf;
    }

	if (isset($_SESSION['user']) && isset($_GET['id_poi'])) {
        switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);	
				mysql_query("SET NAMES 'utf8'");
                
                $id_poi = mysql_real_escape_string($_GET['id_poi']);
            
                $sql = "SELECT * FROM poi WHERE id_poi = ". $id_poi;
                $result = mysql_query($sql);
                $poi = mysql_fetch_array($result);
                
                $pdf_obj = get_pdf($poi);
                
                mysql_free_result($result);
                mysql_close($link);
                
                $pdf_obj->Output();

				break;
			case 'postgresql':
				// TODO
				break;
		}
    }
?>