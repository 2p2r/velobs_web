<?php header('Content-Type: text/html; charset=UTF-8');
	session_start();
    include_once 'lib/php/key.php';
    include_once 'lib/php/commonfunction.php';
?>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<title><?php echo PAGE_TITLE ?> v1.7.2</title>
		<link rel="shortcut icon" type="image/png" href="resources/favicon/favicon.ico" />
	</head>
	<body onunload="setCookie()">
		<div id="loader"></div>
		<div id="loading">
			<div class="loading-indicator">
                <img alt="VelObs" src="resources/images/velobs.jpg" width="99" height="64" style="margin-right:8px;float:left;vertical-align:top;"/><?php echo INCLUDE_CODE_HTML_LOADING ?><br /><span id="loading-msg">Loading styles and images ...</span>
			</div>
			<link rel="stylesheet" type="text/css" href="resources/css/icon.css?v1.7.2" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/ext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/ext-3.4.0/resources/css/xtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/geoext-all.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/gxtheme-gray.css" />
			<link rel="stylesheet" type="text/css" href="lib/js/framework/GeoExt/resources/css/popup.css" />
			<link rel="stylesheet" type="text/css" href="resources/css/public.css?v1.7.2" />
			<link rel="stylesheet" type="text/css" href="resources/css/iconmarker.css?v1.7.2" />
			<link rel="stylesheet" type="text/css" href="resources/css/fileuploadfield.css" />
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading ExtJS...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/adapter/ext/ext-base.js"></script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/ext-all.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geographic components...';</script>
			<script type="text/javascript" src="lib/js/framework/OpenLayers-2.11/OpenLayers.js"></script>
			<script type="text/javascript" src="lib/js/framework/GeoExt/script/GeoExt.js"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading language...';</script>
			<script type="text/javascript" src="lib/js/framework/ext-3.4.0/src/locale/ext-lang-fr.js"></script>
			<script type="text/javascript" src="lib/js/translation_fr.js?v1.7.2"></script>
            <script type="text/javascript" src="lib/js/key.js.template?v1.7.2"></script>
            <script type="text/javascript" src="lib/js/key.js?v1.7.2"></script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading extensions...';</script>
			<script type="text/javascript" src="lib/js/framework/ux/GeoNamesSearchCombo.js?v1.7.2"></script>
            <script type="text/javascript" src="lib/js/public/poidisplaystatus.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/public/baselayerlist.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/framework/ux/FileUploadField.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/framework/ux/IconCombo.js?v1.7.2"></script>
	
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading geometry...';</script>
			
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading application...';</script>
			<script type="text/javascript" src="lib/js/public/credits.js"></script>
			<script type="text/javascript" src="lib/js/framework/AnimatedCluster.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/common.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/public/proposition.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/public/export.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/public/map.js?v1.7.2"></script>
			<script type="text/javascript" src="lib/js/public/main.js?v1.7.2"></script>
	 
			<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initialization...';</script> 
		</div>
		
		<div id="header">
			<?php 
		if (isset($_SESSION['user'])){ 
?><div id="disconnect" title="<?php echo getTranslation($_SESSION['id_language'],'DISCONNECT'); ?>" onclick="self.location.href ='lib/php/admin/disconnect.php';"></div>
<?php } ?>
			<div id="gotopublicmap" title="<?php if (isset($_SESSION['id_language'])){echo getTranslation($_SESSION['id_language'],'OPENPUBLICMAP');} ?>" onclick="self.location.href='<?php echo URL."/admin.php" ?>';"></div>
			<div id="hellouser""><?php if (isset($_SESSION['nom']) && $_SESSION['nom'] != '') {echo "[".$_SESSION['nom']."]";} ?></div>
			<div id="update" style="display:none;"></div>
		</div>
<?php 
//add custom code from lib/php/key.php
echo INCLUDE_CODE_HTML_PUBLIC;
?>
	</body>
</html>
