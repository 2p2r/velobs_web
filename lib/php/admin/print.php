<?php
	session_start();
    include_once '../key.php';
    require_once '../fpdf/fpdf.php';
    
    function get_pdf($poi_data) {
        $pdf = new FPDF();
        $pdf->AddPage("");
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(40, 10, 'Cyclofiche');
        $pdf->Output();
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