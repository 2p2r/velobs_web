<?php
	include 'key.php';
	/* 	Function name 	: getTranslation
	 * 	Input			: language id, string
	 * 	Output			: string translation
	 * 	Object			: translate
	 * 	Date			: Jan. 18, 2012
	 */
	function getTranslation($language,$value) {
		switch (SGBD) {
			case 'mysql':
				$link = mysql_connect(HOST,DB_USER,DB_PASS);
				mysql_select_db(DB_NAME);
				
				mysql_query("SET NAMES UTF8");
				$sql = "SELECT lib_translation FROM translation WHERE language_id_language = ".$language." AND code_translation = '".$value."'";
				$result = mysql_query($sql);
				return mysql_result($result, 0);
				
				mysql_close($link);			
				break;
			case 'postgresql':
				// TODO
				break;
		}
	}

	function sendMail ($to, $subject, $body){
                    $headers = 'From: '. MAIL_FROM . "\r\n" .
                    'Reply-To: ' . MAIL_REPLY_TO ."\r\n" .
                    'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();
                    if (DEBUG){
                    	error_log("Mail avec comme sujet = ".MAIL_SUBJECT_PREFIX . ' '.$subject ." et envoyé à " . $to ."\n", 3, LOG_FILE);
                    }
                    
                    mail($to, MAIL_SUBJECT_PREFIX . ' '.$subject, $body, $headers);

	}
	
?>
