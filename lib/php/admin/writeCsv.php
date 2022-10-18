<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';
	
// 	if (isset($_SESSION['user'])) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				mysql_query("SET NAMES utf8mb4");
				if (isset($_GET['type'])) {
					switch ($_GET['type']) {
						case 'category':
							$file = "category_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM category ORDER BY id_category ASC";
								$result = mysql_query($sql);
								$csv = '"id_category";"lib_category";"display_category"';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_category'].';"'.$row['lib_category'].'";'.$row['display_category'];
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'subcategory':
							$file = "subcategory_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM subcategory INNER JOIN category ON (category.id_category = subcategory.category_id_category) ORDER BY id_subcategory ASC";
								$result = mysql_query($sql);
								$csv = '"id_subcategory";"lib_subcategory";"lib_category";"display_subcategory"';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_subcategory'].';"'.$row['lib_subcategory'].'";"'.$row['lib_category'].'";'.$row['display_subcategory'];
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;	
												
						case 'poi':
						    if (DEBUG){
						        error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Exporting poi in csv \n", 3, LOG_FILE);
						    }
						    $filenamePrefix = 'velobs_poi_';
						    if (isset($_GET['commune_poi'])&& $_GET['commune_poi'] != ''){
						        $filenamePrefix .= 'commune_';
						    }else if (isset($_GET['territoire_poi'])&& $_GET['territoire_poi'] != ''){
						        $filenamePrefix .= 'territoire_';
						    }else if (isset($_GET['customPolygon_poi'])&& $_GET['customPolygon_poi'] != ''){
						        $filenamePrefix .= 'custom_';
						    }
						    $file = $filenamePrefix .date('Y-m-d_H-i-s').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
							    if (isset($_SESSION['user']) && isset($_SESSION['type']) && isset($_SESSION['pole'])){
									$extraSQL = "";
									//si l'utilisateur fait partie d'un pole technique, on restreint les POI correspondant à une priorite qui lui est accessible, qui a été modéré et qui lui a été transmis par la collectivité
									if ($_SESSION['type'] == 3){
										$extraSQL = " AND poi.pole_id_pole = " .$_SESSION['pole'] . " 
												AND priorite.non_visible_par_collectivite = 0 
												AND poi.moderation_poi = 1 
												AND poi.transmission_poi = 1";
									}//si l'utilisateur fait partie d'une communauté de communes, on restreint les POI correspondant à une priorite qui lui est accessible, qui a été modéré et ce quel que soit le territoire
									elseif ($_SESSION['type'] == 2){
										$extraSQL = " AND priorite.non_visible_par_collectivite = 0 
												AND moderation_poi = 1 ";
									}//si l'utilisateur fait partie des modérateurs, on restreint les POI correspondant au pole
// 									elseif ($_SESSION['type'] == 4){
// 										$extraSQL = " AND poi.pole_id_pole = " .$_SESSION['pole'] . " ";
// 									}
							    }
							    if (isset($_GET['pole_poi']) && $_GET['pole_poi'] != ''){
							        $extraSQL .= " AND pole.id_pole = " .$_GET['pole_poi'] . " ";
							    }elseif (isset($_GET['commune_poi']) && $_GET['commune_poi'] != ''){
								    $extraSQL .= " AND commune.id_commune = " .$_GET['commune_poi'] . " "; 
								}elseif (isset($_GET['territoire_poi']) && $_GET['territoire_poi'] != ''){
								    $sqlTerritoire = "SELECT ids_territoire FROM territoire WHERE id_territoire = ". $_GET['territoire_poi'];
								    $resultTerritoire = mysql_query($sqlTerritoire);
								    
								    while ($row = mysql_fetch_array($resultTerritoire)) {
								       $ids_communes = $row['ids_territoire'];
								    }
								    $extraSQL .= " AND commune.id_commune IN (" .str_replace(";",",",$ids_communes) . ") ";
								}elseif (isset($_GET['customPolygon_poi']) && $_GET['customPolygon_poi'] != ''){
								    $extraSQL .= " AND ST_Within(poi.geom_poi,ST_GeomFromText('".$_GET['customPolygon_poi']."') )=1";
								}
								//si personne n'est connecté, on ne récupère que les observations dont la priorité est visible par le public
								if (!isset($_SESSION['user'])) {
								    $extraSQL .= " AND priorite.non_visible_par_public = 0 "; 
								}
								$sql = "SELECT 
											poi.*, 
											priorite.lib_priorite, 
											pole.lib_pole, 
											x(poi.geom_poi) AS X, 
											y(poi.geom_poi) AS Y, 
											lib_category, 
											lib_subcategory, 
											lib_commune,
											lib_status,
                                            COALESCE(users.mail_users, 'Inconnu') as emailModif
										FROM poi 
											INNER JOIN subcategory ON (subcategory.id_subcategory = poi.subcategory_id_subcategory) 
											INNER JOIN category ON (subcategory.category_id_category = category.id_category) 
											INNER JOIN commune ON (commune.id_commune = poi.commune_id_commune) 
											INNER JOIN pole ON (pole.id_pole = poi.pole_id_pole) 
											INNER JOIN priorite ON (priorite.id_priorite = poi.priorite_id_priorite)
											INNER JOIN status ON (status.id_status = poi.status_id_status)
                                            LEFT JOIn users on poi.lastmodif_user_poi = users.id_users
										WHERE 
											poi.delete_poi = FALSE 
											$extraSQL
										ORDER BY id_poi DESC";
								if (DEBUG){
								    error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " Exporting poi in csv withn sql $sql\n", 3, LOG_FILE);
								}
								$result = mysql_query($sql);
								$csv = '"Identifiant";"Commentaire final de l\'association";"Réponse de la collectivité";"Observation terrain";"Priorité";"Pôle";"Adhérent";"Libellé observation";"Catégorie";"Sous-catégorie";"Repère";"Rue";"Commune";"Description";"Proposition";"Modération";"Affichage sur la carte";"Latitude";"Longitude";"Date création";"Mode géolocalisation";"Email";"Statut";"Traité par le pôle";"Transmis au pôle";"Lien administration";"Créer pdf";"Date dernière modification";"Mail dernière modification"';
								$csv .= "\r\n";
								$numberOfRecords = 0;
								while ($row = mysql_fetch_array($result)) {
								    $numberOfRecords++;
								    if (!isset($_SESSION['user']) || ($_SESSION ["type"] == 2 || $_SESSION ["type"] == 3)) {
										$row ['mail_poi'] = '******' ;
										$row ['tel_poi'] = '******' ;
										$row ['adherent_poi'] = '******' ;
									}
									$dateLastModif = $row['datelastmodif_poi'];
									if ($row['datelastmodif_poi'] == null){
									    $dateLastModif = $row['datecreation_poi'];
									}else{
									    $dateLastModif = $row['datelastmodif_poi'];
									}
									$csv .= stripslashes($row['id_poi'].';"'.str_replace('"', "", $row['commentfinal_poi']).'";"'.str_replace('"', "", $row['reponse_collectivite_poi']).'";"'.str_replace('"', "", $row['observationterrain_poi']).'";"'.$row['lib_priorite'].'";"'.$row['lib_pole'].'";"'.$row['adherent_poi'].'";"'.str_replace('"', "", $row['lib_poi']).'";"'.stripslashes($row['lib_category']).'";"'.stripslashes($row['lib_subcategory']).'";"'.str_replace('"', "", $row['num_poi']).'";"'.str_replace('"', "", $row['rue_poi']).'";"'.$row['lib_commune'].'";"'.str_replace('"', "", $row['desc_poi']).'";"'.str_replace('"', "", $row['prop_poi']).'";'.$row['moderation_poi'].';'.$row['display_poi'].';'.$row['Y'].';'.$row['X'].';"'.$row['datecreation_poi'].'";'.$row['geolocatemode_poi'].';"'.$row['mail_poi'].'";"'.$row['lib_status'].'";"'.$row['traiteparpole_poi'].'";"'.$row['transmission_poi'].'";"'.URL.'/admin.php?id='.$row['id_poi'].'";"'.URL.'/lib/php/public/exportPDF.php?id_poi='.$row['id_poi'].'";"'.$dateLastModif.'";"'.$row['emailModif'].'"');
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								if ($numberOfRecords == 0){
								    echo '{"success": false, "message": "Aucune observation ne correspond à la recherche"}';
								}else{
								    echo '{"success": true, "file": "'.$file.'"}';
								}
								
							}
							break;
						case 'commune':
							$file = "commune_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM commune ORDER BY id_commune ASC";
								$result = mysql_query($sql);
								$csv = '"id_commune";"lib_commune";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_commune'].';"'.$row['lib_commune'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'pole':
							$file = "pole_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM pole ORDER BY id_pole ASC";
								$result = mysql_query($sql);
								$csv = '"id_pole";"lib_pole";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_pole'].';"'.$row['lib_pole'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'quartier':
							$file = "quartier_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM quartier ORDER BY id_quartier ASC";
								$result = mysql_query($sql);
								$csv = '"id_quartier";"lib_quartier";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_quartier'].';"'.$row['lib_quartier'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
							
						case 'priorite':
							$file = "priorite_".date('Y-m-d').".csv";
							$fh = fopen("../../../resources/csv/".$file, 'w');
							if (!$fh) {
								echo '{"success": false}';
							} else {
								$sql = "SELECT * FROM priorite ORDER BY id_priorite ASC";
								$result = mysql_query($sql);
								$csv = '"id_priorite";"lib_priorite";';
								$csv .= "\r\n";
								while ($row = mysql_fetch_array($result)) {
									$csv .= $row['id_priorite'].';"'.$row['lib_priorite'].'";';
									$csv .= "\r\n";
								}
								fputs($fh, $csv);
								fclose($fh);
								echo '{"success": true, "file": "'.$file.'"}';
							}
							break;
					}
				}
				else{
					echo '{"success": false}';
				}
							
				mysql_free_result($result);
				mysql_close($link);	
				break;
			case 'postgresql':
				// TODO
				break;
		}

// 	}
?>
