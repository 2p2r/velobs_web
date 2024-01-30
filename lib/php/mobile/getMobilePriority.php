<?php header('Content-Type:text/xml; charset=UTF-8');
include_once '../key.php';

switch (SGBD) {
    case 'mysql':
        $link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
        mysql_select_db(DB_NAME);
        mysql_query("SET NAMES utf8mb4");
        
        $sql = "SELECT id_priorite, lib_priorite FROM priorite";
        $result = mysql_query($sql);
        print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
        print '<priorities>';
        while ($row = mysql_fetch_array($result)) {
            print '<priority nom="'.stripslashes($row['lib_priorite']).'" id="'.$row['id_priorite'].'"></priority>';
        }
        print '</priorities>';
        mysql_free_result($result);
        mysql_close($link);
        break;
    case 'postgresql':
        // TODO
        break;
}

?>