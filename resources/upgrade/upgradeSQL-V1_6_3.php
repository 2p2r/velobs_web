<?php
include_once '../../lib/php/key.php';
session_start();

if (isset($_SESSION['type']) && $_SESSION['type'] == 1) {
   
    $link = mysql_connect(DB_HOST, DB_USER, DB_PASS);
    mysql_select_db(DB_NAME);
    mysql_query("SET NAMES utf8mb4");
    if (DEBUG) {
        error_log(date("Y-m-d H:i:s") . " Entering upgradeSQL-XXX.php \n", 3, LOG_FILE);
    }
    echo "Update translation<br />\n";
    $sqlUpdate = "UPDATE translation SET lib_translation = 'La photo semble trop lourde.' WHERE lib_translation = 'La taille de la photo ne doit pas dépasser 1 Mo !' ;";
    $resultUpdate = mysql_query($sqlUpdate);
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    $sqlUpdate = "UPDATE translation SET lib_translation = 'The picture seems too heavy.' WHERE lib_translation = 'The image size should not exceed 1 MB!' ;";
    $resultUpdate = mysql_query($sqlUpdate);
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    mysql_close($link);
} else {
    echo "Vous n'êtes pas autorisé(e) à exécuter ce script. Vous devez être administrateur";
}
?>

