<?php
include_once '../../lib/php/key.php';
session_start();
if (isset ( $_SESSION ['type'] ) && $_SESSION ['type'] == 1) {
	$link = mysql_connect ( DB_HOST, DB_USER, DB_PASS );
	mysql_select_db ( DB_NAME );
	mysql_query ( "SET NAMES utf8mb4" );
	if (DEBUG) {
		error_log ( date ( "Y-m-d H:i:s" ) . " Entering upgradeSQL.php \n", 3, LOG_FILE );
	}
	echo "Update priorite table<br />\n";
	
	$sqlUpdate = "ALTER TABLE `priorite` ADD `visible_public_par_defaut` BOOLEAN NOT NULL DEFAULT TRUE AFTER `besoin_commentaire_association`;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	$sqlUpdate = "ALTER TABLE `priorite` ADD `visible_moderateur_par_defaut` BOOLEAN NOT NULL DEFAULT TRUE AFTER `visible_public_par_defaut`;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	mysql_close ( $link );
} else {
	echo "Vous n'êtes pas autorisé(e) à exécuter ce script.Vous devez être administrateur";
}
?>

