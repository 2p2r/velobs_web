<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
	include_once 'lib/php/key.php';
	include_once 'lib/php/commonfunction.php';
	if (DEBUG){
		error_log("Tentative de connection\n", 3, LOG_FILE);
	}
	if (isset($_SESSION['user']) && isset($_SESSION['type'])) {
		if (DEBUG){
			error_log($_SESSION['user']." est connecté, utilisateur de type ".$_SESSION['type']."\n", 3, LOG_FILE);
		}
		switch ($_SESSION['type']) {
			case '1':
?>
<!DOCTYPE >
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>VelObs [Admin]</title>
		<link rel="shortcut icon" type="image/png" href="resources/favicon/favicon.ico" />
	</head>
	<body onunload="setCookie()">
		<div id="loading"> 
			<div class="loading-indicator">
				<img alt="VelObs" src="resources/images/velobs.jpg" width="99" height="64" style="margin-right:8px;float:left;vertical-align:top;"/>VelObs - <a href="https://www.2p2r.org/" target="_blank">2P2R</a><br /><span id="loading-msg">Loading styles and images ...</span>
			</div>
			<link rel="stylesheet" type="text/css" href="resources/css/icon.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/ext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/xtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/geoext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/gxtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/popup.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/admin.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/iconmarker.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/fileuploadfield.css" />

			<!--<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Google Maps API...';</script> 
			<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>-->
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading ExtJS...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/adapter/ext/ext-base.js"></script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/ext-all.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geographic components...';</script>
			<script type="text/javascript" src="lib/js/framework/OpenLayers-2.11/OpenLayers.js"></script>
			<script type="text/javascript" src="lib/js/framework/GeoExt/script/GeoExt.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading language...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/src/locale/ext-lang-<?php echo $_SESSION['extension_language']; ?>.js"></script>
			<script type="text/javascript" src="lib/js/translation_<?php echo $_SESSION['extension_language']; ?>.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/key.js?v1.4.3"></script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading extensions...';</script>
			<script type="text/javascript" src="lib/js/framework/ux/GeoNamesSearchCombo.js"></script>
			<script type="text/javascript" src="lib/js/admin/baselayerlist.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/SearchField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/FileUploadField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/IconCombo.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/CheckColumn.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geometry...';</script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading application...';</script>
			<script type="text/javascript" src="lib/js/admin/modeemploi1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/icon1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/config1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/status1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/users1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/userUpdate.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/priorite1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/commune1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/pole1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/quartier1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/basket.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/poiCommon.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/poi1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/subcategory1.js?v1.4.3"></script>			
			<script type="text/javascript" src="lib/js/admin/category1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/mapadmin1.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/main1.js?v1.4.3"></script>
	 
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initialization...';</script> 
		</div>
		<div id="header">
			<div id="disconnect" title="<?php echo getTranslation($_SESSION['id_language'],'DISCONNECT'); ?>" onclick="self.location.href ='lib/php/admin/disconnect.php';"></div>
			<div id="gotopublicmap" title=<?php echo getTranslation($_SESSION['id_language'],'OPENPUBLICMAP'); ?> onclick="window.open('./');"></div>
			<div id="hellouser""><?php if ($_SESSION['nom'] != '') {echo "[".$_SESSION['nom']."]";} ?></div>
			<div id="update" style="display:none;"></div>
		</div>

<?php			
				break;
			case '2':
?>
<!DOCTYPE >
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>VelObs [Admin]</title>
		<link rel="shortcut icon" type="image/png" href="resources/favicon/favicon.ico" />
	</head>
	<body>
		<div id="loading"> 
			<div class="loading-indicator">
				<img alt="2P2R" src="resources/images/2p2r.png" width="99" height="64" style="margin-right:8px;float:left;vertical-align:top;"/>VelObs - <a href="https://www.2p2r.org/" target="_blank">2P2R</a><br /><span id="loading-msg">Loading styles and images ...</span>
			</div>
			<link rel="stylesheet" type="text/css" href="resources/css/icon.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/ext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/xtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/geoext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/gxtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/popup.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/admin.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/iconmarker.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/fileuploadfield.css" />

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Google Maps API...';</script> 
			<!--<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>-->
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading ExtJS...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/adapter/ext/ext-base.js"></script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/ext-all.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geographic components...';</script>
			<script type="text/javascript" src="lib/js/framework/OpenLayers-2.11/OpenLayers.js"></script>
			<script type="text/javascript" src="lib/js/framework/GeoExt/script/GeoExt.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading language...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/src/locale/ext-lang-<?php echo $_SESSION['extension_language']; ?>.js"></script>
			<script type="text/javascript" src="lib/js/translation_<?php echo $_SESSION['extension_language']; ?>.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/key.js?v1.4.3"></script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading extensions...';</script>
			<script type="text/javascript" src="lib/js/framework/ux/GeoNamesSearchCombo.js"></script>
			<script type="text/javascript" src="lib/js/admin/baselayerlist.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/SearchField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/FileUploadField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/IconCombo.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/CheckColumn.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geometry...';</script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading application...';</script>
			<script type="text/javascript" src="lib/js/admin/modeemploi2.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/userUpdate.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/poiCommon.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/poi2.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/main2.js?v1.4.3"></script>
	 
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initialization...';</script> 
		</div>
		<?php
            if ($_SESSION['header_logo'] == 1) {
                echo '<div id="headergt">';
            } else if ($_SESSION['header_logo'] == 2) {
                echo '<div id="header" style="background:url(./resources/images/logowithsico.png) no-repeat;">';
            } else if ($_SESSION['header_logo'] == 3) {
                echo '<div id="header" style="background:url(./resources/images/logowithmur.png) no-repeat;">';
            } else {
                echo '<div id="header" style="background:url(./resources/images/logo.png) no-repeat;">';
            }
        ?>
			<div id="disconnect" title="<?php echo getTranslation($_SESSION['id_language'],'DISCONNECT'); ?>" onclick="self.location.href ='lib/php/admin/disconnect.php';"></div>
			<div id="gotopublicmap" title=<?php echo getTranslation($_SESSION['id_language'],'OPENPUBLICMAP'); ?> onclick="window.open('./');"></div>
			<div id="hellouser"><?php if ($_SESSION['nom'] != '') {echo "[".$_SESSION['nom']."]";} ?></div>
			<div id="update" style="display:none;"></div>
		</div>

<?php
				break;
			case '3':
?>
<!DOCTYPE >
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>VelObs [Admin]</title>
		<link rel="shortcut icon" type="image/png" href="resources/favicon/favicon.ico" />
	</head>
	<body onunload="setCookie()">
		<div id="loading"> 
			<div class="loading-indicator">
				<img alt="2P2R" src="resources/images/2p2r.png" width="99" height="64" style="margin-right:8px;float:left;vertical-align:top;"/>VelObs - <a href="https://www.2p2r.org/" target="_blank">2P2R</a><br /><span id="loading-msg">Loading styles and images ...</span>
			</div>
			<link rel="stylesheet" type="text/css" href="resources/css/icon.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/ext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/xtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/geoext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/gxtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/popup.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/admin.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/iconmarker.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/fileuploadfield.css" />

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Google Maps API...';</script> 
			<!--<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>-->
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading ExtJS...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/adapter/ext/ext-base.js"></script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/ext-all.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geographic components...';</script>
			<script type="text/javascript" src="lib/js/framework/OpenLayers-2.11/OpenLayers.js"></script>
			<script type="text/javascript" src="lib/js/framework/GeoExt/script/GeoExt.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading language...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/src/locale/ext-lang-<?php echo $_SESSION['extension_language']; ?>.js"></script>
			<script type="text/javascript" src="lib/js/translation_<?php echo $_SESSION['extension_language']; ?>.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/key.js?v1.4.3"></script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading extensions...';</script>
			<script type="text/javascript" src="lib/js/framework/ux/GeoNamesSearchCombo.js"></script>
			<script type="text/javascript" src="lib/js/admin/baselayerlist.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/SearchField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/FileUploadField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/IconCombo.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/CheckColumn.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geometry...';</script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading application...';</script>
			<script type="text/javascript" src="lib/js/admin/userUpdate.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/modeemploi3.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/mapadmin3.js?v1.4.3"></script>
			
			<script type="text/javascript" src="lib/js/admin/poiCommon.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/admin/poi3.js?v1.4.3"></script>

			<script type="text/javascript" src="lib/js/admin/main3.js?v1.4.3"></script>
	 
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initialization...';</script> 
		</div>
        <?php
            if ($_SESSION['header_logo'] == 1) {
                echo '<div id="header" style="background:url(./resources/images/logowithgt.png) no-repeat;">';
            } else if ($_SESSION['header_logo'] == 2) {
                echo '<div id="header" style="background:url(./resources/images/logowithsico.png) no-repeat;">';
            } else if ($_SESSION['header_logo'] == 3) {
                echo '<div id="header" style="background:url(./resources/images/logowithmur.png) no-repeat;">';
            } else {
                echo '<div id="header" style="background:url(./resources/images/logo.png) no-repeat;">';
            }
        ?>
			<div id="disconnect" title="<?php echo getTranslation($_SESSION['id_language'],'DISCONNECT'); ?>" onclick="self.location.href ='lib/php/admin/disconnect.php';"></div>
			<div id="gotopublicmap" title=<?php echo getTranslation($_SESSION['id_language'],'OPENPUBLICMAP'); ?> onclick="window.open('./');"></div>
			<div id="hellouser"><?php if ($_SESSION['nom'] != '') {echo "[".$_SESSION['nom']."]";} ?></div>
			<div id="update" style="display:none;"></div>
		</div>
		
<?php
				break;
		    case '4':
?>
<!DOCTYPE >
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>VelObs [Admin]</title>
		<link rel="shortcut icon" type="image/png" href="resources/favicon/favicon.ico" />
	</head>
	<body onunload="setCookie()">
		<div id="loading">
			<div class="loading-indicator">
                <img alt="2P2R" src="resources/images/2p2r.png" width="99" height="64" style="margin-right:8px;float:left;vertical-align:top;"/>VelObs - <a href="https://www.2p2r.org/" target="_blank">2P2R</a><br /><span id="loading-msg">Loading styles and images ...</span>
            </div>
			<link rel="stylesheet" type="text/css" href="resources/css/icon.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/ext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/xtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/geoext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/gxtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/popup.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/admin.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/admin_sico.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/iconmarker.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/fileuploadfield.css" />

			<!--<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Google Maps API...';</script>
			<script src="http://maps.google.com/maps/api/js?v=3&sensor=false"></script>-->

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading ExtJS...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/adapter/ext/ext-base.js"></script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/ext-all.js"></script>

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geographic components...';</script>
			<script type="text/javascript" src="lib/js/framework/OpenLayers-2.11/OpenLayers.js"></script>
			<script type="text/javascript" src="lib/js/framework/GeoExt/script/GeoExt.js"></script>

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading language...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/src/locale/ext-lang-<?php echo $_SESSION['extension_language']; ?>.js"></script>
			<script type="text/javascript" src="lib/js/translation_<?php echo $_SESSION['extension_language']; ?>.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/key.js?v1.4.3"></script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading extensions...';</script>
			<script type="text/javascript" src="lib/js/framework/ux/GeoNamesSearchCombo.js"></script>
			<script type="text/javascript" src="lib/js/admin/baselayerlist.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/SearchField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/FileUploadField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/IconCombo.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/CheckColumn.js"></script>

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geometry...';</script>

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading application...';</script>
            <script type="text/javascript" src="lib/js/admin/modeemploi4.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/userUpdate.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/commune1.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/pole1.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/basket.js?v1.4.3"></script>
            
			<script type="text/javascript" src="lib/js/admin/poiCommon.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/poi4.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/mapadmin1.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/admin/main4.js?v1.4.3"></script>

			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initialization...';</script>
		</div>
		<?php
            if ($_SESSION['header_logo'] == 1) {
                echo '<div id="headergt">';
            } else if ($_SESSION['header_logo'] == 2) {
                echo '<div id="header" style="background:url(./resources/images/logowithsico.png) no-repeat;">';
            } else if ($_SESSION['header_logo'] == 3) {
                echo '<div id="header" style="background:url(./resources/images/logowithmur.png) no-repeat;">';
            } else {
                echo '<div id="header" style="background:url(./resources/images/logo.png) no-repeat;">';
            }
        ?>
			<div id="disconnect" title="<?php echo getTranslation($_SESSION['id_language'],'DISCONNECT'); ?>" onclick="self.location.href ='lib/php/admin/disconnect.php';"></div>
			<div id="gotopublicmap" title=<?php echo getTranslation($_SESSION['id_language'],'OPENPUBLICMAP'); ?> onclick="window.open('./');"></div>
			<div id="hellouser"><?php if ($_SESSION['nom'] != '') {echo "[".$_SESSION['nom']."]";} ?></div>
			<div id="update" style="display:none;"></div>
		</div>

<?php
		        break;
			default:
				break;
		}
		//adds custom code from lib/php/key.php
		echo INCLUDE_CODE_HTML_ADMIN;
?>		
	</body>
	</html>
<?php
	} else {
	    if (isset($_GET['id']) && $_GET['id'] != '') {
            header('Location: ./admin.html?id='.$_GET['id']);
	    } else {
	        header('Location: ./admin.html');
	    }

	}
?>