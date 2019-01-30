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
    $sqlUpdate = "CREATE TABLE IF NOT EXISTS `users_link_pole` (
        `user_link_pole_id` int(11) NOT NULL,
        `id_user` int(11) NOT NULL,
        `territoire_id_territoire` int(11) NOT NULL,
        `num_pole` int(11) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='link between users and territoires/poles';";
    
    $resultUpdate = mysql_query ( $sqlUpdate );
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    
    $sqlUpdate = " ALTER TABLE `users_link_pole`
        ADD PRIMARY KEY (`user_link_pole_id`),
        ADD KEY `id_user` (`id_user`),
        ADD KEY `territoire_id_territoire` (`territoire_id_territoire`),
        ADD KEY `num_pole` (`num_pole`);";
    $resultUpdate = mysql_query ( $sqlUpdate );
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
    
    $sqlUpdate = " ALTER TABLE `users_link_pole`
        MODIFY `user_link_pole_id` int(11) NOT NULL AUTO_INCREMENT;";
    $resultUpdate = mysql_query ( $sqlUpdate );
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
        
    $sqlUpdate = " ALTER TABLE `users_link_pole`
        ADD CONSTRAINT `poles_FK` FOREIGN KEY (`num_pole`) REFERENCES `pole` (`id_pole`),
        ADD CONSTRAINT `territoires_FK` FOREIGN KEY (`territoire_id_territoire`) REFERENCES `territoire` (`id_territoire`),
        ADD CONSTRAINT `users_FK` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_users`);";
    $resultUpdate = mysql_query ( $sqlUpdate );
    echo $sqlUpdate . " : " . $resultUpdate . "<br />";
        
    mysql_close($link);
} else {
    echo "Vous n'êtes pas autorisé(e) à exécuter ce script.Vous devez être administrateur";
}
?>

