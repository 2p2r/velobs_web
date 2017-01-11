<?php

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
                    $headers = 'From: 2p2r@le-pic.org' . "\r\n" .
                    'Reply-To: 2p2r@le-pic.org' . "\r\n" .
                    'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                    mail($to, '[VelObs 2P2R] '.$subject, $body, $headers);

	}
	
?>
