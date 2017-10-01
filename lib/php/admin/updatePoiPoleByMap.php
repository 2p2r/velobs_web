<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once '../key.php';

	if (isset($_SESSION['user'])) {
        switch (SGBD) {
            case 'mysql':
                if (isset($_POST['text_comment']) && isset($_POST['id_poi']) && isset($_POST['traiteparpole'])) {
                    $link = mysql_connect(HOST,DB_USER,DB_PASS);
                    mysql_select_db(DB_NAME);
                    mysql_query("SET NAMES 'utf8'");

                    $text_comment = mysql_real_escape_string($_POST['text_comment']);
                    $traiteparpole = $_POST['traiteparpole'];

                    $sql = "UPDATE poi SET reponsepole_poi = '$text_comment' WHERE id_poi = ".$_POST['id_poi'];
                    $res = mysql_query($sql);

                    $sql = "UPDATE poi SET traiteparpole_poi = ".$traiteparpole." WHERE id_poi = ".$_POST['id_poi'];
                    $res = mysql_query($sql);

                    echo '1';
                } else {
                    echo '2';
                }
                break;
            case 'postgresql':
                // TODO
                break;
        }
    } else {
        echo '2';
    }




?>