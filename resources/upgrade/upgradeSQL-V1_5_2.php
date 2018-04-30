<?php
include_once '../../lib/php/key.php';
session_start();
if (isset ( $_SESSION ['type'] ) && $_SESSION ['type'] == 1) {
	$link = mysql_connect ( DB_HOST, DB_USER, DB_PASS );
	mysql_select_db ( DB_NAME );
	mysql_query ( "SET NAMES utf8mb4" );
	if (DEBUG) {
		error_log ( date ( "Y-m-d H:i:s" ) . " Entrée dans upgradeSQL.php \n", 3, LOG_FILE );
	}
	echo "Mise à jour de la table priorité<br />\n";
	
	$sqlUpdate = "ALTER TABLE priorite ADD non_visible_par_collectivite BOOLEAN NOT NULL DEFAULT FALSE AFTER lib_priorite;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "ALTER TABLE priorite ADD non_visible_par_public BOOLEAN NOT NULL DEFAULT FALSE AFTER non_visible_par_collectivite;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "ALTER TABLE priorite ADD priorite_sujet_email TEXT NOT NULL AFTER non_visible_par_public, ADD priorite_corps_email TEXT NOT NULL AFTER priorite_sujet_email;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "ALTER TABLE priorite ADD besoin_commentaire_association BOOLEAN NOT NULL DEFAULT FALSE AFTER priorite_corps_email;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 0, non_visible_par_public = 0, priorite_sujet_email = 'Merci pour votre participation',priorite_corps_email = 'Bonjour !
L''observation que
vous avez envoyée sur VelObs a changé de statut.

Le problème identifié a été transmis aux services municipaux.',besoin_commentaire_association = 0 WHERE id_priorite = 1;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 0, non_visible_par_public = 0, priorite_sujet_email = 'Merci pour votre participation',priorite_corps_email = 'Bonjour !
L''observation que vous avez envoyée sur VelObs a changé de statut. Le problème identifié a été transmis aux services municipaux.\n',besoin_commentaire_association = 0 WHERE id_priorite = 2;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 0, non_visible_par_public = 1, priorite_sujet_email = '',priorite_corps_email = '',besoin_commentaire_association = 0 WHERE id_priorite = 4;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 1, non_visible_par_public = 0, priorite_sujet_email = 'Observation prise en compte',priorite_corps_email = 'Bonjour !
L''association #VELOBS_ASSOCIATION# vous remercie. Le problème a bien été pris en compte et réglé par la collectivité.',besoin_commentaire_association = 1 WHERE id_priorite = 6;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 1, non_visible_par_public = 1, priorite_sujet_email = 'Observation non transmise à la collectivité',priorite_corps_email = 'Bonjour !
L''association #VELOBS_ASSOCIATION# et la collectivité vous remercient de votre participation.
Cependant le problème rapporté a été refusé par L''association et n''a pas été transmis à la collectivité.',besoin_commentaire_association = 1 WHERE id_priorite = 7;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 1, non_visible_par_public = 0, priorite_sujet_email = 'Merci pour votre participation',priorite_corps_email = 'Bonjour !
L''observation que vous avez envoyée a été modérée par L''association. Le problème identifié est une urgence qui nécessite une intervention rapide des services techniques de la collectivité. Merci de faire le nécessaire.
Veuillez téléphoner au 05 61 222 222 pour prévenir de ce problème si celui-ci est sur la commune de Toulouse.',besoin_commentaire_association = 1 WHERE id_priorite = 8;";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 1, non_visible_par_public = 0, priorite_sujet_email = 'Observation refusée par la collectivité',priorite_corps_email = 'Bonjour !
L''association #VELOBS_ASSOCIATION# et la collectivité vous remercient de votre participation. Cependant le problème rapporté a été refusé par la collectivité.',besoin_commentaire_association = 1 WHERE id_priorite = 12;
";
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	$sqlUpdate = "UPDATE priorite SET non_visible_par_collectivite = 1, non_visible_par_public = 1, priorite_sujet_email = 'Observation en doublon',priorite_corps_email = 'Bonjour !
L''association #VELOBS_ASSOCIATION# et la collectivité vous remercient de votre participation. Le problème que vous avez identifié nous a déjà été rapporté par un autre observateur.',besoin_commentaire_association = 1 WHERE id_priorite = 15;";
	
	$resultUpdate = mysql_query ( $sqlUpdate );
	echo $sqlUpdate . " : " . $resultUpdate . "<br />";
	mysql_close ( $link );
} else {
	echo "Vous n'êtes pas autorisé(e) à exécuter ce script.Vous devez être administrateur";
}
?>

