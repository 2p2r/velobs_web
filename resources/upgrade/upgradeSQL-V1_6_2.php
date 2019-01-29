<?php
include_once '../../lib/php/key.php';
session_start();
if (isset($_SESSION['type']) && $_SESSION['type'] == 1) {
    $link = mysql_connect(DB_HOST, DB_USER, DB_PASS);
    mysql_select_db(DB_NAME);
    mysql_query("SET NAMES utf8mb4");
    if (DEBUG) {
        error_log(date("Y-m-d H:i:s") . " Entering upgradeSQL.php \n", 3, LOG_FILE);
    }
    echo "Alter users table<br />\n";
    
    $sqlUpdate = "ALTER TABLE `users` ADD `is_active_user` boolean DEFAULT TRUE AFTER `nom_users`;";
    $resultUpdate = mysql_query($sqlUpdate);
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    
    $sql = "SELECT * FROM users";
    $result = mysql_query($sql);
    if (! $result) {
        echo 'Requête invalide : ' . mysql_error();
    } else {
        while ($row = mysql_fetch_array($result)) {
            echo "Inserting " . $row['id_users'] . " in link_users_pole table<br />";
            $sqlUpdate = "INSERT INTO users_link_pole (id_user, territoire_id_territoire,num_pole) VALUES(" . $row['id_users'] . ", " . $row['territoire_id_territoire'] . ", " . $row['num_pole'] . ")";
            $resultUpdate = mysql_query($sqlUpdate);
            echo $sqlUpdate . " : " . $resultUpdate . "<br />";
            mysql_free_result($resultUpdate);
        }
    }
    mysql_free_result($result);
    echo "Alter users table, renaming columns<br />\n";
    $sqlUpdate = "ALTER TABLE users RENAME COLUMN num_pole TO num_pole_toDelete;";
    $resultUpdate = mysql_query($sqlUpdate);
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    $sqlUpdate = "ALTER TABLE users RENAME COLUMN territoire_id_territoire TO territoire_id_territoire_toDelete;";
    $resultUpdate = mysql_query($sqlUpdate);
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    mysql_close($link);
    
    mysql_close($link);
} else {
    echo "Vous n'êtes pas autorisé(e) à exécuter ce script.Vous devez être administrateur";
}
?>

