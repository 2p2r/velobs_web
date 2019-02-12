<?php
include_once '../key.php';
if (isset ( $_POST ['lat']) && isset ( $_POST ['lon']) ){
    if (DEBUG) {
        error_log(date("Y-m-d H:i:s") . " - public/getAdresse.php \n", 3, LOG_FILE);
    }
    $url = 'https://api-adresse.data.gouv.fr/reverse/?lon=' . $_POST['lon'] . '&lat=' . $_POST['lat'];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $data = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (DEBUG) {
        error_log(date("Y-m-d H:i:s") . " - public/getAdresse.php $data \n", 3, LOG_FILE);
    }
    
    $obj = json_decode($data, true);
    if ($obj != null){
        //var_dump($obj['features']);
    }
    echo $obj['features'][0]['properties']['name'];
}else{
	    if (DEBUG) {
	        error_log ( date ( "Y-m-d H:i:s" ) . " - public/getAdresse.php sans GET \n", 3, LOG_FILE );
	    }
	echo "pas GET";
	}
?>