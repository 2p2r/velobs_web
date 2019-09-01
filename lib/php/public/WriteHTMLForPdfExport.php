<?php

require_once '../fpdf/fpdf.php';


class PDF_HTML extends FPDF
{
    var $B=0;
    var $I=0;
    var $U=0;
    var $HREF='';
    var $ALIGN='';
    var $ID_POI = '';
    var $DATE_CREATION_POI = '';
    function setIdPOI($id_poi)
    {
        $this->ID_POI = $id_poi;
    }
    function setDateCreationPOI($date_creation_poi)
    {
        $this->DATE_CREATION_POI = $date_creation_poi;
    }
    // Page header
    function Header()
    {
        // Logo
        $this->Image('../../../resources/images/2p2r.png',10,6,30);
        // Arial bold 15
        $this->SetFont('Arial','B',15);
        // Move to the right
        $this->Cell((210-$this->GetStringWidth("Fiche VelObs "))/2);
        // Title
        $this->Cell($this->GetStringWidth("Fiche VelObs ")+10,10,' Fiche VelObs '.$this->ID_POI,1,0,'C');
        $this->SetFont('Arial','',10);
        $this->Cell(0,10,utf8_decode(' Date création :  '.$this->DATE_CREATION_POI),0,0,'R');
        // Line break
        $this->Ln(20);
    }
    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        $this->SetX(10);
        $this->SetFont('Arial', '', 8);
        $currentDateTime = date('Y-m-d H:i:s');
        $this->Cell(0, 10, utf8_decode('Date génération pdf : ' . $currentDateTime),0,0,'C');
        $this->SetX(-25);
        // Arial italic 8
        $this->SetFont('Arial','I',8);
        // Page number
        $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
    }
    function WriteHTML($html)
    {
        //Parseur HTML
        $html=str_replace("\n",' ',$html);
        $a=preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
        foreach($a as $i=>$e)
        {
            if($i%2==0)
            {
                //Texte
                if($this->HREF)
                    $this->PutLink($this->HREF,$e);
                elseif($this->ALIGN=='center')
                    $this->Cell(0,5,$e,0,1,'C');
                else
                    $this->Write(5,$e);
            }
            else
            {
                //Balise
                if($e[0]=='/')
                    $this->CloseTag(strtoupper(substr($e,1)));
                else
                {
                    //Extraction des attributs
                    $a2=explode(' ',$e);
                    $tag=strtoupper(array_shift($a2));
                    $prop=array();
                    foreach($a2 as $v)
                    {
                        if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                            $prop[strtoupper($a3[1])]=$a3[2];
                    }
                    $this->OpenTag($tag,$prop);
                }
            }
        }
    }

    function OpenTag($tag,$prop)
    {
        //Balise ouvrante
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,true);
        if($tag=='A')
            $this->HREF=$prop['HREF'];
        if($tag=='BR')
            $this->Ln(5);
        if($tag=='P')
            $this->ALIGN=$prop['ALIGN'];
        if($tag=='HR')
        {
            if( !empty($prop['WIDTH']) )
                $Width = $prop['WIDTH'];
            else
                $Width = $this->w - $this->lMargin-$this->rMargin;
            $this->Ln(2);
            $x = $this->GetX();
            $y = $this->GetY();
            $this->SetLineWidth(0.4);
            $this->Line($x,$y,$x+$Width,$y);
            $this->SetLineWidth(0.2);
            $this->Ln(2);
        }
    }

    function CloseTag($tag)
    {
        //Balise fermante
        if($tag=='B' || $tag=='I' || $tag=='U')
            $this->SetStyle($tag,false);
        if($tag=='A')
            $this->HREF='';
        if($tag=='P')
            $this->ALIGN='';
    }

    function SetStyle($tag,$enable)
    {
        //Modifie le style et sélectionne la police correspondante
        $this->$tag+=($enable ? 1 : -1);
        $style='';
        foreach(array('B','I','U') as $s)
            if($this->$s>0)
                $style.=$s;
        $this->SetFont('',$style);
    }

    function PutLink($URL,$txt)
    {
        //Place un hyperlien
        $this->SetTextColor(0,0,255);
        $this->SetStyle('U',true);
        $this->Write(5,$txt,$URL);
        $this->SetStyle('U',false);
        $this->SetTextColor(0);
    }
}
?>