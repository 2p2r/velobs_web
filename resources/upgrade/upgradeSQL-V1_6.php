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
	echo "Update poi table<br />\n";
	
	$sqlUpdate = "ALTER TABLE `poi` ADD `lastmodif_user_poi` INT NULL AFTER `lastdatemodif_poi`;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	$sqlUpdate = "ALTER TABLE poi ADD FOREIGN KEY (lastmodif_user_poi) REFERENCES users(id_users);";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	echo "Create poi_history table<br />\n";
	$sqlUpdate = "CREATE TABLE IF NOT EXISTS `poi_history` (
  `id_poi` int(11) NOT NULL,
  `lib_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adherent_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rue_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geom_poi` geometry DEFAULT NULL,
  `desc_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `prop_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `display_poi` tinyint(1) DEFAULT NULL,
  `fix_poi` tinyint(1) DEFAULT NULL,
  `moderation_poi` tinyint(1) DEFAULT NULL,
  `datecreation_poi` date DEFAULT NULL,
  `datefix_poi` date DEFAULT NULL,
  `photo_poi` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geolocatemode_poi` int(11) DEFAULT NULL,
  `subcategory_id_subcategory` int(11) DEFAULT NULL,
  `commune_id_commune` int(11) DEFAULT NULL,
  `pole_id_pole` int(11) DEFAULT NULL,
  `quartier_id_quartier` int(11) DEFAULT NULL,
  `priorite_id_priorite` int(11) DEFAULT NULL,
  `observationterrain_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `reponse_collectivite_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `commentfinal_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `status_id_status` int(11) DEFAULT NULL,
  `transmission_poi` tinyint(1) DEFAULT NULL,
  `traiteparpole_poi` tinyint(1) DEFAULT NULL,
  `reponsepole_poi` mediumtext COLLATE utf8mb4_unicode_ci,
  `mailsentuser_poi` tinyint(1) DEFAULT '0',
  `delete_poi` tinyint(1) DEFAULT '0',
  `lastdatemodif_poi` date DEFAULT NULL,
  `lastmodif_user_poi` int(11) DEFAULT NULL,
  `history_id` int(11) NOT NULL,
  `history_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `poi_history` ADD PRIMARY KEY (`history_id`);

ALTER TABLE `poi_history` MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	echo "Create generate_poi_history trigger on poi table<br />\n";
	$sqlUpdate  = "DELIMITER $$
	CREATE TRIGGER `generate_history` BEFORE UPDATE ON `poi`
	FOR EACH ROW INSERT INTO poi_history SELECT p.*,NULL,NOW() FROM poi p WHERE p.id_poi = OLD.id_poi
	$$
	DELIMITER ;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	
	echo "Update commentaires table<br />\n";
	$sqlUpdate = "ALTER TABLE `commentaires` ADD `lastdatemodif_comment` DATE NULL;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "ALTER TABLE `commentaires` ADD `lastmodif_user_comment` INT NULL;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	echo "Create comment_history table<br />\n";
	$sqlUpdate  = "CREATE TABLE IF NOT EXISTS `comment_history` (
  `id_commentaires` int(11) NOT NULL,
  `text_commentaires` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_commentaires` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Non modéré',
  `datecreation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url_photo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mail_commentaires` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `poi_id_poi` int(11) NOT NULL,
  `lastdatemodif_comment` date DEFAULT NULL,
  `lastmodif_user_comment` int(11) DEFAULT NULL,
  `history_id` int(11) NOT NULL,
  `history_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `comment_history` ADD PRIMARY KEY (`history_id`);
ALTER TABLE `comment_history` MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	
	
	echo "Create generate_comment_history trigger on commentaires table <br />\n";
	$sqlUpdate  = "DELIMITER $$
CREATE TRIGGER `generate_comment_history` BEFORE UPDATE ON `commentaires`
 FOR EACH ROW INSERT INTO comment_history SELECT c.*,NULL,NOW() FROM commentaires c WHERE c.id_commentaires = OLD.id_commentaires
$$
DELIMITER ;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	
	mysql_close ( $link );
} else {
	echo "Vous n'êtes pas autorisé(e) à exécuter ce script.Vous devez être administrateur";
}
?>

