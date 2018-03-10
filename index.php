<?php
    include_once 'lib/php/key.php';
?>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title>VelObs</title>
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
			<link rel="stylesheet" type="text/css" href="resources/css/public.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/iconmarker.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/fileuploadfield.css" />
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading ExtJS...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/adapter/ext/ext-base.js"></script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/ext-all.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geographic components...';</script>
			<script type="text/javascript" src="lib/js/framework/OpenLayers-2.11/OpenLayers.js"></script>
			<script type="text/javascript" src="lib/js/framework/GeoExt/script/GeoExt.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading language...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/src/locale/ext-lang-fr.js"></script>
			<script type="text/javascript" src="lib/js/translation_fr.js?v1.4.3"></script>
            <script type="text/javascript" src="lib/js/key.js?v1.4.3"></script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading extensions...';</script>
			<script type="text/javascript" src="lib/js/framework/ux/GeoNamesSearchCombo.js"></script>
            <script type="text/javascript" src="lib/js/public/poidisplaystatus.js"></script>
			<script type="text/javascript" src="lib/js/public/poidisplaydate.js"></script>
			<script type="text/javascript" src="lib/js/public/baselayerlist.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/framework/ux/FileUploadField.js"></script>
			<script type="text/javascript" src="lib/js/framework/ux/IconCombo.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geometry...';</script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading application...';</script>
			<script type="text/javascript" src="lib/js/public/credits.js"></script>
			<script type="text/javascript" src="lib/js/public/proposition.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/public/map.js?v1.4.3"></script>
			<script type="text/javascript" src="lib/js/public/main.js?v1.4.3"></script>
	 
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initialization...';</script> 
		</div>
<?php
//add custom code from lib/php/key.php
echo INCLUDE_CODE_HTML_PUBLIC;
?>
	</body>
</html>
