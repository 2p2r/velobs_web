<?php
	include_once '../key.php';

	$temp = array();
	$tab = array(); 
	$handle = @fopen('../../../resources/css/iconmarker.css', 'r');
	if ($handle){
		while (!feof($handle)){
			array_push($tab, trim(fgets($handle, 4096)));
		}
		fclose($handle);
	}
	if ($handle){
		foreach($tab as $cle => $valeur) { 
			$temp_css = explode('{', $valeur);
			$icon_css = substr($temp_css[0],1);
			array_push($temp, $icon_css);
		}
		fclose($handle);
	}
	sort($temp);
	array_shift($temp);
	foreach ($temp as $key => $val) {
		$arr[$key]['id_icon'] = $key;
		switch ($_GET['case']){
			case 'subcategory': 
				$arr[$key]['icon_subcategory'] = $val;
				break;
			case 'category': 
				$arr[$key]['icon_category'] = $val;
				break;
		}
	}

	echo '({"icon":'.json_encode($arr).'})';

?>