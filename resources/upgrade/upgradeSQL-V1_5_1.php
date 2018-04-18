<?php
include_once '../../lib/php/key.php';

$link = mysql_connect ( DB_HOST, DB_USER, DB_PASS );
mysql_select_db ( DB_NAME );
mysql_query ( "SET NAMES utf8mb4" );
if (DEBUG) {
	error_log ( date ( "Y-m-d H:i:s" ) . " Entrée dans upgradeSQL.php \n", 3, LOG_FILE );
}
echo "Ajout de couleur aux statuts et généricité du code<br />\n";

$sqlUpdate = "ALTER TABLE poi CHANGE reponsegrandtoulouse_poi reponse_collectivite_poi mediumtext";
$resultUpdate = mysql_query ( $sqlUpdate );
echo $sqlUpdate . " : " . $resultUpdate . "<br />";
$sqlUpdate = "ALTER TABLE status ADD color_status varchar(20);";
$resultUpdate = mysql_query ( $sqlUpdate );
echo $sqlUpdate . " : " . $resultUpdate . "<br />";
$sqlUpdate = "UPDATE status SET color_status = 'black'";
$resultUpdate = mysql_query ( $sqlUpdate );
echo $sqlUpdate . " : " . $resultUpdate . "<br />";
mysql_close($link);

