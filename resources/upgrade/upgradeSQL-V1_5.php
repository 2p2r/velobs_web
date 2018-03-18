<?php
include_once '../../lib/php/key.php';

$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
mysql_select_db(DB_NAME);
mysql_query("SET NAMES utf8mb4");
if (DEBUG){
	error_log(date("Y-m-d H:i:s") . " Entrée dans upgradeSQL.php \n", 3, LOG_FILE);
}
echo "Mise à jour des mots de passe avec blowfish_crypt (https://github.com/2p2r/velobs_web/issues/109)<br />\n";
$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
mysql_select_db(DB_NAME);
mysql_query("SET NAMES utf8mb4");

$sql = "SELECT * FROM users";
$result = mysql_query($sql);
if (!$result) {
	echo 'Requête invalide : ' . mysql_error();
}
	while ($row = mysql_fetch_array($result)) {
		
		if ($row['id_users'] == 1){
			echo "mise à jour ".$row['id_users'];
		
		$sqlUpdate = "UPDATE users set pass_users = '".create_password_hash(($row['pass_users']),'PASSWORD_BCRYPT')."' WHERE id_users = ".$row['id_users'];
		$resultUpdate = mysql_query($sqlUpdate);
		echo $sqlUpdate . " : ".$resultUpdate."<br />";
		}
	}
mysql_free_result($result);
mysql_close($link);

//hashing function
function create_password_hash($strPassword, $numAlgo = 1, $arrOptions = array())
{
	if (function_exists('password_hash')) {
		// php >= 5.5
		$hash = password_hash($strPassword, $numAlgo, $arrOptions);
	} else {
		$salt = mcrypt_create_iv(22, MCRYPT_DEV_URANDOM);
		$salt = base64_encode($salt);
		$salt = str_replace('+', '.', $salt);
		$hash = crypt($strPassword, '$2y$10$' . $salt . '$');
	}
	return $hash;
}

?>