<?php

header('Content-Type: text/html; charset=UTF-8');
session_start();
include_once '../key.php';

switch (SGBD) {
    case 'mysql':
        $link = mysql_connect(DB_HOST, DB_USER, DB_PASS);
        mysql_select_db(DB_NAME);
        mysql_query("SET NAMES utf8mb4");
        $topVotedText = "";
        if (DEBUG) {
            error_log(date("Y-m-d H:i:s") . " - getJsonVotesByCommune.php, nb de votes à retourner :  " . $_GET['nb2return'] . "\r\n", 3, LOG_FILE);
        }
        $nbObservationsToReturn = 5;
        if (isset($_GET['nb2return']) && is_numeric($_GET['nb2return']) && $_GET['nb2return'] > 0) {
            $nbObservationsToReturn = $_GET['nb2return'];
        }
        $groupByCity = 0;
        if (isset($_GET['groupByCity']) && is_numeric($_GET['groupByCity']) && $_GET['groupByCity'] == 1) {
            $groupByCity = 1;
        }
        $sql = "SELECT count(*) as nb_votes, poi_poi_id, lib_subcategory, lib_pole, lib_territoire, lib_commune 
			FROM `support_poi` 
			INNER JOIN poi ON poi.id_poi = support_poi.poi_poi_id 
			INNER JOIN pole ON poi.pole_id_pole = pole.id_pole
			INNER JOIN commune ON poi.commune_id_commune = commune.id_commune 
			INNER JOIN territoire ON pole.territoire_id_territoire = territoire.id_territoire
			INNER JOIN subcategory ON poi.subcategory_id_subcategory = subcategory.id_subcategory 
			GROUP BY poi_poi_id ";

        $sqlGlobalVotes = " ORDER BY nb_votes DESC, poi.id_poi ASC LIMIT 5";
        $sqlCityVotes = " ORDER BY territoire.lib_territoire ASC, commune.lib_commune ASC, nb_votes DESC, poi.id_poi ASC";

        $result = mysql_query($sql . $sqlGlobalVotes);
        $globalTop5counter = 0;
        $arrayGlobalTop5 = array();
        while ($row = mysql_fetch_array($result)) {
            $rank = $row['nb_votes']*10000+$row['poi_poi_id'];
            $arrayGlobalTop5[$rank]['nbVotes'] = $row['nb_votes'];
            $arrayGlobalTop5[$rank]['id_poi'] = $row['poi_poi_id'];
            $arrayGlobalTop5[$rank]['url'] = URL . "/index.php?id=" . $row['poi_poi_id'];
            $arrayGlobalTop5[$rank]['categorie'] = $row['lib_subcategory'];
            $arrayGlobalTop5[$rank]['territoire'] = $row['lib_territoire'] . " - " . $row['lib_pole'];
            $globalTop5counter ++;
        }

        $ranks = array_keys($arrayGlobalTop5);
        rsort($ranks);
        $sortNumber = 1;
        $topVotedText .= "<div class=\"voteTerritoire\"><H1>Top  " . count(array_keys($arrayGlobalTop5)) . " des observations pour tout le territoire couvert</H1>\r\n";
        $topVotedText .= "<ul>";
        foreach ($ranks as $rank) {
            
                $topVotedText .= "<li>" . $arrayGlobalTop5[$rank]['nbVotes'] . " vote(s) pour l'observation <a href=\"" . $arrayGlobalTop5[$rank]['url'] . "\" target=\"_blank\">" . $arrayGlobalTop5[$rank]['id_poi'] . "</a> (catégorie " . $arrayGlobalTop5[$rank]['categorie'] . ", localisée sur " . $arrayGlobalTop5[$rank]['territoire'] . ")</li>\r\n";
            
        }
        $topVotedText .= "</ul></div>\r\n";
        $result = mysql_query($sql . $sqlCityVotes);
        $i = 0;

        $arr = array();

        if ($groupByCity) {
            while ($row = mysql_fetch_array($result)) {
                if (count(array_keys($arr[$row['lib_commune']])) > $nbObservationsToReturn - 1) {
                    continue;
                }
                $arr[$row['lib_commune']][$i]['nbVotes'] = $row['nb_votes'];
                $arr[$row['lib_commune']][$i]['id_poi'] = $row['poi_poi_id'];
                $arr[$row['lib_commune']][$i]['url'] = URL . "/index.php?id=" . $row['poi_poi_id'];
                $arr[$row['lib_commune']][$i]['categorie'] = $row['lib_subcategory'];
                $arr[$row['lib_commune']][$i]['territoire'] = $row['lib_territoire'] . " - " . $row['lib_pole'];
                $i ++;
            }
            
            $cities = array_keys($arr);
            sort($cities);
            foreach ($cities as $city) {
                $topVotedText .= "<div class=\"voteTerritoire\"><H1>Commune : " . $city . "</H1>\r\n";
                $topVotedText .= "<ul>";
                foreach (array_keys($arr[$city]) as $mostVoted) {
                    $topVotedText .= "<li>" . $arr[$city][$mostVoted]['nbVotes'] . " vote(s) pour l'observation <a href=\"" . $arr[$city][$mostVoted]['url'] . "\" target=\"_blank\">" . $arr[$city][$mostVoted]['id_poi'] . "</a> (catégorie " . $arr[$city][$mostVoted]['categorie'] . ", localisée sur " . $arr[$city][$mostVoted]['territoire'] . ")</li>\r\n";
                }
                $topVotedText .= "</ul></div>\r\n";
            }
        } else {

            while ($row = mysql_fetch_array($result)) {
                if (count(array_keys($arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']])) > $nbObservationsToReturn - 1) {
                    continue;
                }
                $arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['nbVotes'] = $row['nb_votes'];
                $arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['id_poi'] = $row['poi_poi_id'];
                $arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['url'] = URL . "/index.php?id=" . $row['poi_poi_id'];
                $arr[$row['lib_territoire']][$row['lib_pole']][$row['lib_commune']][$i]['categorie'] = $row['lib_subcategory'];
                $i ++;
            }
            foreach (array_keys($arr) as $territoire) {
                $topVotedText .= "<div class=\"voteTerritoire\"><H1>Territoire : " . $territoire . "</H1></div>\r\n";
                foreach (array_keys($arr[$territoire]) as $pole) {
                    $topVotedText .= "<div class=\"votePole\"><H2>Pôle : " . $pole . "</H2></div>\r\n";
                    foreach (array_keys($arr[$territoire][$pole]) as $commune) {
                        $topVotedText .= "<div class=\"voteCommune\"><H3>Commune : " . $commune . "</H3>\r\n";
                        $topVotedText .= "<ul>";
                        foreach (array_keys($arr[$territoire][$pole][$commune]) as $mostVoted) {
                            $topVotedText .= "<li>" . $arr[$territoire][$pole][$commune][$mostVoted]['nbVotes'] . " vote(s) pour l'observation <a href=\"" . $arr[$territoire][$pole][$commune][$mostVoted]['url'] . "\" target=\"_blank\">" . $arr[$territoire][$pole][$commune][$mostVoted]['id_poi'] . "</a> (catégorie " . $arr[$territoire][$pole][$commune][$mostVoted]['categorie'] . ")</li>\r\n";
                        }
                        $topVotedText .= "</ul></div>\r\n";
                    }
                }
            }
        }
        // echo '{"statistiques":'.json_encode($arr).'}';
        $html = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\"
   \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"><html><head><title>Observations ouvertes les plus votées, par territoire et commune</title></head><body class=\"votes\">\r\n";
        $html .= "<link rel=\"stylesheet\" type=\"text/css\" href=\"../../../resources/css/public.css?v1.7.2\" />\r\n";
        $html .= "<H1>Listing des observations les plus votées (1 vote est associé à une adresse email)";
        if ($groupByCity) {
            $html .= " classées par commune.</H1>";
            $html .= "Accéder aux observations les plus plebiscitées par <a href=\"./getJsonObsVotes.php?groupByCity=0\">territoire</a>";
        } else {
            $html .= " classées par territoire, puis commune.</H1>";
            $html .= "Accéder aux observations les plus plebiscitées par <a href=\"./getJsonObsVotes.php?groupByCity=1\">commune</a>";
        }
        echo $html;
        echo $topVotedText;
        echo "</body></html>";
        mysql_free_result($result);
        mysql_close($link);
        break;
    case 'postgresql':
        // TODO
        break;
}

?>