<?php
header('Content-Type: text/html; charset=UTF-8');
session_start();
include_once '../key.php';
if (isset($_SESSION['user'])) {
    switch (SGBD) {
        case 'mysql':
            if (DEBUG) {
                error_log(date("Y-m-d H:i:s") . " - admin/getMarker.php\n", 3, LOG_FILE);
            }
            if ($_SESSION ["type"] != 4 && $_SESSION ["type"] != 1){
                echo "Vous devez être administrateur ou modérateur pour accéder à l'historique des observations";
                break;
            }
            if (! isset($_GET['id_poi']) || $_GET['id_poi'] == "") {
                echo '{"error":"Le numéro de l\'observation n\'a pas été fourni"}';
                error_log(date("Y-m-d H:i:s") . " - Le numéro de l'observation n'a pas été fourni\n", 3, LOG_FILE);
                break;
            }

            $arrayColumns = array();
            $arrayColumns['id']['intitule'] = 'Mode de géolocalisation utilisé';
            $arrayColumns['id']['dataType'] = 'integer';
            $arrayColumns['lib_subcategory']['intitule'] = 'Catégorie';
            $arrayColumns['lib_subcategory']['dataType'] = 'integer';
            $arrayColumns['rue_poi']['intitule'] = 'Nom de la voie';
            $arrayColumns['rue_poi']['dataType'] = 'string';
            $arrayColumns['num_poi']['intitule'] = 'Repère';
            $arrayColumns['num_poi']['dataType'] = 'string';
            $arrayColumns['lib_pole']['intitule'] = 'Pôle';
            $arrayColumns['lib_pole']['dataType'] = 'integer';
            $arrayColumns['lib_commune']['intitule'] = 'Commune';
            $arrayColumns['lib_commune']['dataType'] = 'integer';
            $arrayColumns['desc_poi']['intitule'] = 'Description du problème';
            $arrayColumns['desc_poi']['dataType'] = 'string';
            $arrayColumns['prop_poi']['intitule'] = 'Proposition';
            $arrayColumns['prop_poi']['dataType'] = 'string';
            $arrayColumns['observationterrain_poi']['intitule'] = 'Commentaire de terrain de l\'association';
            $arrayColumns['observationterrain_poi']['dataType'] = 'string';
            $arrayColumns['lib_priorite']['intitule'] = 'Priorité définie par l\'association';
            $arrayColumns['lib_priorite']['dataType'] = 'integer';
            $arrayColumns['moderation_poi']['intitule'] = 'Observation modérée';
            $arrayColumns['moderation_poi']['dataType'] = 'boolean';
            $arrayColumns['display_poi']['intitule'] = 'Observation affichée sur l\'interface publique (valable si la priorité le permet)';
            $arrayColumns['display_poi']['dataType'] = 'boolean';
            $arrayColumns['reponse_collectivite_poi']['intitule'] = 'Réponse de la collectivité';
            $arrayColumns['reponse_collectivite_poi']['dataType'] = 'string';
            $arrayColumns['lib_status']['intitule'] = 'Statut positionné par la collectivité';
            $arrayColumns['lib_status']['dataType'] = 'integer';
            $arrayColumns['transmission_poi']['intitule'] = 'La collectivité a transmis l\'observation au pôle technique';
            $arrayColumns['transmission_poi']['dataType'] = 'boolean';
            $arrayColumns['reponsepole_poi']['intitule'] = 'Réponse du pôle technique';
            $arrayColumns['reponsepole_poi']['dataType'] = 'string';
            $arrayColumns['traiteparpole_poi']['intitule'] = 'Le pôle a traité l\'observation';
            $arrayColumns['traiteparpole_poi']['dataType'] = 'boolean';
            $arrayColumns['commentfinal_poi']['intitule'] = 'Commentaire final de l\'association';
            $arrayColumns['commentfinal_poi']['dataType'] = 'string';
            $arrayColumns['datefix_poi']['intitule'] = 'Date de clôture de l\'observation';
            $arrayColumns['datefix_poi']['dataType'] = 'Date';
            $arrayColumns['adherent_poi']['intitule'] = 'Nom du contributeur';
            $arrayColumns['adherent_poi']['dataType'] = 'string';
            $arrayColumns['mail_poi']['intitule'] = 'Mail du contributeur';
            $arrayColumns['mail_poi']['dataType'] = 'mail';
            $arrayColumns['tel_poi']['intitule'] = 'Téléphone du contributeur';
            $arrayColumns['tel_poi']['dataType'] = 'string';
            $arrayColumns['mailsentuser_poi']['intitule'] = 'Mail envoyé au contributeur';
            $arrayColumns['mailsentuser_poi']['dataType'] = 'boolean';
            $arrayColumns['fix_poi']['intitule'] = 'Mail envoyé au contributeur';
            $arrayColumns['fix_poi']['dataType'] = 'boolean';
            $arrayColumns['delete_poi']['intitule'] = 'Observation supprimée';
            $arrayColumns['delete_poi']['dataType'] = 'boolean';
            $arrayColumns['datecreation_poi']['intitule'] = 'Date de création de l\'observation';
            $arrayColumns['datecreation_poi']['dataType'] = 'Date';
            $arrayColumns['lastdatemodif_poi']['intitule'] = 'Date de dernière modification';
            $arrayColumns['lastdatemodif_poi']['dataType'] = 'Date';
            $arrayColumns['geolocatemode_poi']['intitule'] = 'Mode de géolocalisation utilisé';
            $arrayColumns['geolocatemode_poi']['dataType'] = 'integer';
            $arrayColumns['latitude_poi']['intitule'] = 'Latitude observation';
            $arrayColumns['latitude_poi']['dataType'] = 'position';
            $numberOfColumns ++;
            $arrayColumns['longitude_poi']['intitule'] = 'Longitude observation';
            $arrayColumns['longitude_poi']['dataType'] = 'position';
            $numberOfColumns ++;
            $arrayColumns['photo_poi']['intitule'] = 'Photo';
            $arrayColumns['photo_poi']['dataType'] = 'photo';
            $arrayColumns['lastmodif_user_poi']['intitule'] = 'Personne ayant modifié';
            $arrayColumns['lastmodif_user_poi']['dataType'] = 'user';

            $arrayColumns['id_commentaires']['intitule'] = 'Identifiant du commentaire';
            $arrayColumns['id_commentaires']['dataType'] = 'id comment';
            $arrayColumns['text_commentaires']['intitule'] = 'Commentaire';
            $arrayColumns['text_commentaires']['dataType'] = 'string';
            $arrayColumns['url_photo']['intitule'] = 'Photo du commentaire';
            $arrayColumns['url_photo']['dataType'] = 'photo';
            $arrayColumns['mail_commentaires']['intitule'] = 'Mail';
            $arrayColumns['mail_commentaires']['dataType'] = 'mail';
            $arrayColumns['datecreation']['intitule'] = 'Date de création du commentaire';
            $arrayColumns['datecreation']['dataType'] = 'date';
            $arrayColumns['display_commentaires']['intitule'] = 'Modération du commentaire';
            $arrayColumns['display_commentaires']['dataType'] = 'string';

            $link = mysql_connect(DB_HOST, DB_USER, DB_PASS);
            mysql_select_db(DB_NAME);
            mysql_query("SET NAMES utf8mb4");

            $sqlPOI = "SELECT poi.*,
						commune.lib_commune,
						x(poi.geom_poi) AS X,
						y(poi.geom_poi) AS Y,
						subcategory.icon_subcategory,
						subcategory.lib_subcategory,
						priorite.lib_priorite,
						lib_pole,
						lib_status,
						color_status,
						users.lib_users
					FROM poi ";

            $sqlPOI .= "
					INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory)
					INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune)
					INNER JOIN priorite ON (poi.priorite_id_priorite = priorite.id_priorite)
					INNER JOIN pole ON (poi.pole_id_pole = pole.id_pole)
					INNER JOIN status ON (poi.status_id_status = status.id_status)
					LEFT JOIN users ON (poi.lastmodif_user_poi = users.id_users)";
            $sqlPOI .= " WHERE  poi.id_poi = " . mysql_real_escape_string($_GET['id_poi']);

            $result = mysql_query($sqlPOI);

            $rowPOI = mysql_fetch_array($result);
            if (!empty($rowPOI)){
                $arraySearch = array();
                $arraySearch = array_keys($rowPOI);
            }else{
                echo "Cette observation n'existe pas";
                break;
            }
            
//             if (is_countable($arraySearch) && count($arraySearch) == 0){
//                 echo "Cette observation n'existe pas";
//                 break;
//             }
            error_log(date("Y-m-d H:i:s") . " - rowPOI " . $sqlPOI . " \n", 3, LOG_FILE);

            $array1 = array(
                'id' => $rowPOI['id_poi'],
                "lib_subcategory" => stripslashes($rowPOI['lib_subcategory']),
                'datecreation_poi' => $rowPOI['datecreation_poi'],
                'desc_poi' => stripslashes($rowPOI['desc_poi']),
                'reponse_collectivite_poi' => stripslashes($rowPOI['reponse_collectivite_poi']),
                'commentfinal_poi' => stripslashes($rowPOI['commentfinal_poi']),
                'prop_poi' => stripslashes($rowPOI['prop_poi']),
                'photo_poi' => stripslashes($rowPOI['photo_poi']),
                'num_poi' => stripslashes($rowPOI['num_poi']),
                'rue_poi' => stripslashes($rowPOI['rue_poi']),
                'lib_commune' => stripslashes($rowPOI['lib_commune']),
                'display_poi' => stripslashes($rowPOI['display_poi']),
                'fix_poi' => stripslashes($rowPOI['fix_poi']),
                'lib_priorite' => stripslashes($rowPOI['lib_priorite']),
                'lib_pole' => stripslashes($rowPOI['lib_pole']),
                'transmission_poi' => stripslashes($rowPOI['transmission_poi']),
                'reponsepole_poi' => stripslashes($rowPOI['reponsepole_poi']),
                'mail_poi' => stripslashes($rowPOI['mail_poi']),
                'observationterrain_poi' => stripslashes($rowPOI['observationterrain_poi']),
                'mail_poi' => stripslashes($rowPOI['lib_status']),
                'lastmodif_user_poi' => stripslashes($rowPOI['lib_users']),
                'latitude_poi' => stripslashes($rowPOI['X']),
                'longitude_poi' => stripslashes($rowPOI['Y']),
                'lastdatemodif_poi' => stripslashes($rowPOI['lastdatemodif_poi'])
            );
            $arrayPOI = $array1;
            $sql = "SELECT poi_history.*,
						commune.lib_commune, 
						x(poi_history.geom_poi) AS X, 
						y(poi_history.geom_poi) AS Y, 
						subcategory.icon_subcategory,
						subcategory.lib_subcategory,
						priorite.lib_priorite,
						lib_pole,
						lib_status,
						color_status,
						users.lib_users
					FROM poi_history ";

            $sql .= "
					INNER JOIN subcategory ON (subcategory.id_subcategory = poi_history.subcategory_id_subcategory) 
					INNER JOIN commune ON (commune.id_commune = poi_history.commune_id_commune) 
					INNER JOIN priorite ON (poi_history.priorite_id_priorite = priorite.id_priorite)
					INNER JOIN pole ON (poi_history.pole_id_pole = pole.id_pole) 
					INNER JOIN status ON (poi_history.status_id_status = status.id_status) 
					LEFT JOIN users ON (poi_history.lastmodif_user_poi = users.id_users)";
            $sql .= " WHERE  poi_history.id_poi = " . mysql_real_escape_string($_GET['id_poi']) . " ORDER BY history_id DESC";
            // TODO : chek user type and pole

            $result = mysql_query($sql);
            if (DEBUG) {
                error_log(date("Y-m-d H:i:s") . " - admin/getMarker.php avant while " . $sql . "\n", 3, LOG_FILE);
            }

            $i = 0;
            while ($row = mysql_fetch_array($result)) {
                $array2 = array(
                    'id' => $row['id_poi'],
                    "lib_subcategory" => stripslashes($row['lib_subcategory']),
                    'datecreation_poi' => $row['datecreation_poi'],
                    'desc_poi' => stripslashes($row['desc_poi']),
                    'reponse_collectivite_poi' => stripslashes($row['reponse_collectivite_poi']),
                    'commentfinal_poi' => stripslashes($row['commentfinal_poi']),
                    'prop_poi' => stripslashes($row['prop_poi']),
                    'photo_poi' => stripslashes($row['photo_poi']),
                    'num_poi' => stripslashes($row['num_poi']),
                    'rue_poi' => stripslashes($row['rue_poi']),
                    'lib_commune' => stripslashes($row['lib_commune']),
                    'display_poi' => stripslashes($row['display_poi']),
                    'fix_poi' => stripslashes($row['fix_poi']),
                    'lib_priorite' => stripslashes($row['lib_priorite']),
                    'lib_pole' => stripslashes($row['lib_pole']),
                    'transmission_poi' => stripslashes($row['transmission_poi']),
                    'reponsepole_poi' => stripslashes($row['reponsepole_poi']),
                    'mail_poi' => stripslashes($row['mail_poi']),
                    'observationterrain_poi' => stripslashes($row['observationterrain_poi']),
                    'mail_poi' => stripslashes($row['lib_status']),
                    'lastmodif_user_poi' => stripslashes($row['lib_users']),
                    'lat' => stripslashes($row['X']),
                    'lon' => stripslashes($row['Y']),
                    'lastdatemodif_poi' => stripslashes($row['lastdatemodif_poi'])
                );
                $keys = array_keys($array1);
                foreach ($keys as $key) {
                    if ($array1[$key] != $array2[$key]) {
                        // echo $row ['history_id'] . " Modif sur la clé " . $key .", valeur changée de ". $array2[$key] . " en " . $array1[$key]."<br />";
                        $modificationArray[$row['history_date']]['POI'][$key]["avant"] = $array2[$key];
                        $modificationArray[$row['history_date']]['POI'][$key]["apres"] = $array1[$key];
                    }
                }
                $array1 = $array2;
            }
            $sql2 = "SELECT * FROM commentaires WHERE poi_id_poi = " . mysql_real_escape_string($_GET['id_poi']) . " ORDER BY id_commentaires ASC";

            $result2 = mysql_query($sql2);
            while ($row2 = mysql_fetch_array($result2)) {
                $modificationArray[$row2['datecreation']]['comment']['id_commentaires'] = $row2['id_commentaires'];
                $modificationArray[$row2['datecreation']]['comment']['text_commentaires'] = $row2['text_commentaires'];
                $modificationArray[$row2['datecreation']]['comment']['url_photo'] = $row2['url_photo'];
                $modificationArray[$row2['datecreation']]['comment']['mail_commentaires'] = $row2['mail_commentaires'];
                $modificationArray[$row2['datecreation']]['comment']['display_commentaires'] = $row2['display_commentaires'];
            }
            echo '<ul><li>Informations actuelles de l\'observation n° '.mysql_real_escape_string($_GET['id_poi']).'<ul>' ;
            foreach (array_keys($arrayPOI) as $key) {
                if (!array_key_exists($key,$arrayColumns)){
                    echo '<li>'.$key.' nexiste pas dans les intitules</li>';
                }
                if ($arrayColumns[$key]['dataType'] == "photo") {
                    echo "<li>" . $arrayColumns[$key]['intitule'] . " : <a href=\"../../../../resources/pictures/" . $arrayPOI[$key] . "\" target=\"_blank\">".$arrayPOI[$key]."</a></li>";
                }else{
                    echo "<li>" . $arrayColumns[$key]['intitule'] . " : " . $arrayPOI[$key] . "</li>";
                }
                
                
            }
            echo '</ul></li></ul>';
            $keysHistory = array_keys($modificationArray);
            rsort($keysHistory);
            if (count($keysHistory) == 0){
                echo "Aucune modification n'a encore été apportée à cette observation ou alors les modifications ont été apportées avant la mise en place de l'historisation sur velobs (2018-05-30)";
            }
            foreach ($keysHistory as $key) {
                echo "<ul><li>" . $key . "<ul>";
                if (array_key_exists('POI', $modificationArray[$key])) {
                    foreach (array_keys($modificationArray[$key]['POI']) as $key2) {

                        if ($arrayColumns[$key2]['dataType'] == "photo") {
                            if ($modificationArray[$key]['POI'][$key2]["apres"] == "") {
                                echo "<li>" . $arrayColumns[$key2]['intitule'] . " " . $modificationArray[$key]['POI'][$key2]["avant"] . " supprimée</li>";
                            } else {
                                echo "<li>" . $arrayColumns[$key2]['intitule'] . " " . $modificationArray[$key]['POI'][$key2]["avant"] . " remplacée par " . $modificationArray[$key]['POI'][$key2]["apres"] . "</li>";
                            }
                        } else {
                            echo "<li>" . $arrayColumns[$key2]['intitule'] . " : " . $modificationArray[$key]['POI'][$key2]["apres"] . " (Valeur précédente : " . $modificationArray[$key]['POI'][$key2]["avant"] . ")</li>";
                        }
                    }
                    echo "</ul></ul>";
                } elseif (array_key_exists('comment', $modificationArray[$key])) {
                    echo "<li>Commentaire ajouté<ul>";
                    foreach (array_keys($modificationArray[$key]['comment']) as $key2) {

                        if ($arrayColumns[$key2]['dataType'] == "photo") {
                            echo "<li>" . $arrayColumns[$key2]['intitule'] . " <a href=\"../../../../resources/pictures/" . $modificationArray[$key]['comment'][$key2] . "\" target=\"_blank\">".$modificationArray[$key]['comment'][$key2]."</a></li>";
                        } else {
                            echo "<li>" . $arrayColumns[$key2]['intitule'] . " : " . $modificationArray[$key]['comment'][$key2] . "</li>";
                        }
                    }
                    echo "</ul></li></ul></li></ul>";
                }
            }
            if (DEBUG) {
                error_log(date("Y-m-d H:i:s") . " - admin/getMarker.php retour json avec $i obs\n", 3, LOG_FILE);
            }
            mysql_free_result($result);
            mysql_close($link);
            break;
        case 'postgresql':
            // TODO
            break;
    }
}else{
    echo "Vous devez être administrateur ou modérateur pour accéder à l'historique des observations";
}

?>
