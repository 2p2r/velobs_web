<?php header('Content-Type:text/xml; charset=UTF-8');
	include_once '../key.php';

	switch (SGBD) {
		case 'mysql':
			$link = mysql_connect(DB_HOST,DB_USER,DB_PASS);
			mysql_select_db(DB_NAME);
			mysql_query("SET NAMES utf8mb4");

            print '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
            print '<response>';
            //$buffer = $_POST['buffer'];
            if (!isset($_POST['moderatorKey']) || !isset($_POST['moderatorEmail'])) {
                print '<coderetour result="-1" />';
                print '</response>';
            } else {
               
                $sql = "SELECT COUNT(*)
                	FROM users 
                    WHERE mail_users = '".mysql_real_escape_string($_POST['moderatorEmail'])."' AND moderator_mobile_key = '".mysql_real_escape_string($_POST['moderatorKey'])."'";
                
                $result = mysql_query($sql);
                $numberMatchingUsers = mysql_result($result, 0);
                if (DEBUG){
                    error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - validateUserKey.php pour ".$_POST['moderatorEmail']." \n", 3, LOG_FILE);
                    error_log(date("Y-m-d H:i:s") . " " .__FUNCTION__ . " - validateUserKey.php retourne $numberMatchingUsers \n", 3, LOG_FILE);
                }
                print '<coderetour>'.$numberMatchingUsers.'</coderetour>';
                print '</response>';
                mysql_free_result($result);
                mysql_close($link); 
            }
			break;
		case 'postgresql':
			// TODO
			break;
	}

?>
