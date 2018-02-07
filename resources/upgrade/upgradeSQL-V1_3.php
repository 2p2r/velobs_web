<?php
include_once '../../lib/php/key.php';
$link = mysql_connect(HOST,DB_USER,DB_PASS);
mysql_select_db(DB_NAME);
mysql_query("SET NAMES utf8mb4");
if (DEBUG){
	error_log(date("Y-m-d H:i:s") . " Entrée dans upgradeSQL.php \n", 3, LOG_FILE);
}
echo "Ajoute des colonnes à la table commentaires\n";


$sql = "ALTER TABLE commentaires ADD url_photo varchar(500) default null";
$result = mysql_query($sql);
echo $sql . " : ".$result."\n";
$sql = "ALTER TABLE commentaires ADD mail_commentaires varchar(100) default null";
$result = mysql_query($sql);
echo $sql . " : ".$result."\n";
$sql = "ALTER TABLE commentaires ADD poi_id_poi int(11) not null";
$result = mysql_query($sql);
echo $sql . " : ".$result."\n";

echo "Met à jour la table commentaires à partir du contenu de la table poi_commentaires\n";
$sql = "SELECT poi_id_poi, commentaires_id_commentaires FROM poi_commentaires";
$result = mysql_query($sql);

while ($row = mysql_fetch_array($result)) {
	$id_poi = mysql_real_escape_string($row['poi_id_poi']);
	$id_commentaire = mysql_real_escape_string($row['commentaires_id_commentaires']);
	$result2 = mysql_query("UPDATE commentaires SET poi_id_poi =". $id_poi ." WHERE id_commentaires =". $id_commentaire);
	if (DEBUG){
		error_log(date("Y-m-d H:i:s") . " UPDATE commentaires SET poi_id_poi = mysql_real_escape_string($id_poi) WHERE id_commentaires = mysql_real_escape_string($id_commentaire) \n", 3, LOG_FILE);
	}
	echo "UPDATE commentaires SET poi_id_poi =". $id_poi ." WHERE id_commentaires =". $id_commentaire." : ".$result2."\n";
}
echo "Renomme la table poi_commentaires\n";
$sql = "ALTER TABLE poi_commentaires RENAME TO poi_commentairesToDelete";
$result = mysql_query($sql);
echo $sql . " : ".$result."\n";

echo "Insère dans la table commentaires les enregistrements des tables photos et poi_photos\n";
$sql = "SELECT pp.poi_id_poi, pp.photos_id_photos, p.* FROM poi_photos pp INNER JOIN photos p ON p.id_photos = pp.photos_id_photos";
$result = mysql_query($sql);
while ($row = mysql_fetch_array($result)) {
	$id_poi = mysql_real_escape_string($row['poi_id_poi']);
	$display_commentaires = mysql_real_escape_string($row['display_photos']);
	$url_photo = mysql_real_escape_string($row['url_photos']);
	$datecreation = mysql_real_escape_string($row['datecreation']);
	$result2 = mysql_query("INSERT INTO commentaires (poi_id_poi, display_commentaires, url_photo, datecreation) VALUES(".$id_poi.",".$display_commentaires.",'".$url_photo."','".$datecreation."')");
	if (DEBUG){
		error_log(date("Y-m-d H:i:s") . " INSERT INTO commentaires (poi_id_poi, display_commentaires, url_photo, datecreation) VALUES($id_poi,$display_commentaires,$url_photo,$datecreation) \n", 3, LOG_FILE);
	}
	echo "INSERT INTO commentaires (poi_id_poi, display_commentaires, url_photo, datecreation) VALUES(".$id_poi.",".$display_commentaires.",'".$url_photo."','".$datecreation."') : ".$result2."\n";
}
$sql = "ALTER TABLE poi_photos RENAME TO poi_photosToDelete";
$result = mysql_query($sql);
echo $sql . " : ".$result."\n";
$sql = "ALTER TABLE photos RENAME TO photosToDelete";
$result = mysql_query($sql);
echo $sql . " : ".$result."\n\n";
echo "\n";
echo "##################################################\n";
echo "Après test, vous pourrez supprimer les tables photosToDelete, poi_photosToDelete et poi_commentairesToDelete\n\n";


?>