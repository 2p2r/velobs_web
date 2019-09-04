Ext.apply(Ext.tree.TreeNodeUI.prototype, {
	toggleCheckNoEvent : function(value) {
		var cb = this.checkbox;
		if(cb){
			cb.checked = (value === undefined ? !cb.checked : value);
			// fix for IE6
			this.checkbox.defaultChecked = cb.checked;
			this.node.attributes.checked = cb.checked;
		}
	}
});

function osm_getTileURL(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	if (y < 0 || y >= limit) {
		return OpenLayers.Util.getImagesLocation() + "404.png";
	} else {
		x = ((x % limit) + limit) % limit;
		return this.url + z + "/" + x + "/" + y + "." + this.type;
	}
}

if (navigator.appName != "Microsoft Internet Explorer") {
	OpenLayers.ImgPath = "resources/images/ol_themes/black/";
}

var controlZoomBox = new OpenLayers.Control.ZoomBox({CLASS_NAME:'zoomIn'});
var navigation = new OpenLayers.Control.Navigation({
	'zoomWheelEnabled': true,
	'defaultDblClick': function(event) {
		adminMap.zoomIn();
		return;
	}
});
var optionsAdminMap = {
		controls: [
		           new OpenLayers.Control.PanZoom(), 
		           navigation,
		           new OpenLayers.Control.ScaleLine({geodesic: true}),
		           controlZoomBox
		           ],
		           projection: new OpenLayers.Projection("EPSG:900913"),
		           displayProjection: new OpenLayers.Projection("EPSG:4326"),
		           units: "m",
		           numZoomLevels: 18,
		           maxResolution: 156543.0339,
		           maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
};
//carte accessible sur l'interface d'admin, via l'onglet Carte
var adminMap = new OpenLayers.Map(optionsAdminMap);
for (var i = 0; i < mapLayersArray.length; i++) {
	adminMap.setBaseLayer(mapLayersArray[i][2]);
	adminMap.addLayer(mapLayersArray[i][2]);
}
adminMap.addControl(new OpenLayers.Control.Attribution());




function clearMarker() {
	vectorsAdminMap.removeAllFeatures();
	vectorsAdminMap.destroyFeatures();
	vectorsAdminMap.addFeatures([]);
	vectorsAdminMap.strategies[0].clearCache();
}

function getMarker() {
	clearMarker();
	console.info('Dans mapadmin1.js getMarker '+tabcheckchild);
	if (tabcheckchild != '') {
		document.getElementById("loader").style.display = "block";
		var uri = 'lib/php/admin/getMarker.php?listType='+tabcheckchild+'&dateLastModif='+dateLastModif+'&priority='+comboPrioritePOIMapItemMenu.getValue()+'&status='+StatusPOIFieldMapItemMenu.getValue()+'&displayObservationsToBeAnalyzedByComCom='+displayObservationsToBeAnalyzedByComCom+'&displayObservationsToBeAnalyzedByPole='+displayObservationsToBeAnalyzedByPole+'&commentToModerate='+displayObservationsWithCommentToModerate+'&nbSupportMinimum='+nbSupportMinimum;
		OpenLayers.loadURL(uri, '', this, displayMarker);
	}
}

function displayMarker(response) {
	console.info('Dans mapadmin1.js displayMarker');
	document.getElementById("loader").style.display = "none";
	var features = [];
	var json = eval('(' + response.responseText + ')');
	if (json.markers != null) {
		for (var i=0; i<json.markers.length; i++) {
			var lonlat = new OpenLayers.LonLat(json.markers[i].lon, json.markers[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject());

			var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
			var feat = new OpenLayers.Feature.Vector(point, null, null);

			if (json.markers[i].lastdatemodif_poi == '0000-00-00'){
				json.markers[i].lastdatemodif_poi = json.markers[i].date;
			}
			
			var comments = '';
//			if (json.markers[i]['commentaires']!=null) {
//				comments = 'Commentaires présents';
//			}
			feat.attributes = {"id": json.markers[i].id,
					"lib_subcategory": json.markers[i].lib_subcategory, 
					"desc": json.markers[i].desc, 
					"prop": json.markers[i].prop,
					"icon": json.markers[i].icon,
					"iconCls": json.markers[i].iconCls, 
					"photo": json.markers[i].photo, 
					"num": json.markers[i].num, 
					"rue": json.markers[i].rue, 
					"commune": json.markers[i].commune, 
					"repgt": json.markers[i].repgt, 
					"cmt": json.markers[i].cmt, 
					"date": json.markers[i].date,
					"lastDateModif":json.markers[i].lastdatemodif_poi, 
					"comments": json.markers[i].comments,
					"display_poi":json.markers[i].display_poi,
					"fix_poi":json.markers[i].fix_poi,
					"lib_priorite":json.markers[i].lib_priorite,
					"lib_pole":json.markers[i].lib_pole,
					"transmission_poi":json.markers[i].transmission_poi,
					"reponsepole_poi":json.markers[i].reponsepole_poi,
					"traiteparpole_poi":json.markers[i].traiteparpole_poi,
					"observationterrain_poi":json.markers[i].observationterrain_poi,
					"moderation_poi":json.markers[i].moderation_poi,
					"lib_status":json.markers[i].lib_status,
					"color_status":json.markers[i].color_status,
					"lat":json.markers[i].lat,
					"lon":json.markers[i].lon,
					"mail_poi":json.markers[i].mail_poi,
					"num_comments":json.markers[i].num_comments,
					"lastmodif_user_poi":json.markers[i].lastmodif_user_poi
			};
			features.push(feat);
		}
		vectorsAdminMap.addFeatures(features);
		showTooltipNumberOfObservations(features.length);
		features = [];
	}else{
		showTooltipNumberOfObservations(0);
	}
}

var vectorsAdminMap = new OpenLayers.Layer.Vector("marker", {styleMap: style, visibility: true, displayInLayerSwitcher: false,strategies: [clusterStrategy]});
adminMap.addLayer(vectorsAdminMap);
var layerLimitesGeographiquesCommunes = new OpenLayers.Layer.Vector("Limites communes", {reportError:true,styleMap:styleCommune, visibility: true, displayInLayerSwitcher: true,eventListeners:{
	"featureadded": function(feature) {
	}
}});
layerLimitesGeographiquesCommunes.setZIndex(5);
var layerLimitesGeographiquesPoles = new OpenLayers.Layer.Vector("Limites poles", {reportError:true,styleMap:stylePole, visibility: true, displayInLayerSwitcher: true,eventListeners:{
	"featureadded": function(feature) {
	}
}});
layerLimitesGeographiquesPoles.setZIndex(3);
adminMap.addLayer(layerLimitesGeographiquesCommunes);
adminMap.addLayer(layerLimitesGeographiquesPoles);


/* popup */
//Hover Control (Tooltip) 
var hoverCtrl = new OpenLayers.Control.SelectFeature(vectorsAdminMap, { 
    hover: true, highlightOnly: true, renderIntent: "temporary", 
    eventListeners: { featurehighlighted: showTooltip} 
    }); 
//support functions 
var tooltip = null; 

 adminMap.addControl(hoverCtrl); 
 hoverCtrl.activate(); 
 vectorsAdminMap.events.on({
		
		featureselected: function(e) {
			console.log("Click on an observation");
			createPopup(e.feature);
		},
	    featureunselected: function(e) {
	        popup.destroy(e.feature)
	    }
	});
var popup;
var tabPopup;

//called when clicking on the icon of an observation in a map
function createPopup(feature) {

	var featureToDisplay = feature;
	if (feature.cluster && feature.cluster.length == 1){
		featureToDisplay = feature.cluster[0];
	}
//	console.log("feature = %o", feature);

	htmlGeneral = "";
	var title = '';
	if (!feature.cluster){
		
		moderationInterfaceWindow.show();
		var dateLastModifWho = featureToDisplay.attributes.lastmodif_user_poi;
        if(dateLastModifWho == null){
        	dateLastModifWho = '?';
        }
		title = featureToDisplay.attributes.id + " " +featureToDisplay.attributes.lib_subcategory + ', '+ T_lastModificationDate + ' : ' + featureToDisplay.attributes.lastDateModif +', par ' + dateLastModifWho;
        ;
		if ((featureToDisplay.attributes.photo != null) && (featureToDisplay.attributes.photo != '')) {
			tof = featureToDisplay.attributes.photo;
			var tof = featureToDisplay.attributes.photo;
			Ext.getCmp('observationImagePanel').update('Cliquer sur l\'image pour l\'ouvrir en grand<br /><img style="width:200px;cursor: pointer;" onclick="window.open(\'resources/pictures/'+tof+'\')" src="resources/pictures/'+tof+'" />');
		}else {
			Ext.getCmp('observationImagePanel').update('Pas de photo associée');
		}
		if (featureToDisplay.attributes.num_comments == 0) {
	    	//TODO
			buttonModerateComments.disable();
	    }else{
	    	buttonModerateComments.enable();
	    	Ext.getCmp('observationCommentsPanel').update(featureToDisplay.attributes.comments);
	    }
		Ext.getCmp('observationCommentsPanel').update(featureToDisplay.attributes.comments);
		
		moderationInterfaceWindow.setTitle(title);
		id = featureToDisplay.attributes.id;
		CommunePOIField.setValue(featureToDisplay.attributes.commune);
		PolePOIField.setValue(featureToDisplay.attributes.lib_pole);
		StatusPOIField.setValue(featureToDisplay.attributes.lib_status);
		RespComcomPOIField.setValue(featureToDisplay.attributes.repgt);
		RespPolePOIField.setValue(featureToDisplay.attributes.reponsepole_poi);
		DescPOIField.setValue(featureToDisplay.attributes.desc);
		PropPOIField.setValue(featureToDisplay.attributes.prop);
		SubCategoryPOIField.setValue(featureToDisplay.attributes.lib_subcategory);
		RuePOIField.setValue(featureToDisplay.attributes.rue);
		NumPOIField.setValue(featureToDisplay.attributes.num);
		PrioritePOIField.setValue(featureToDisplay.attributes.lib_priorite);
		ObsPOIField.setValue(featureToDisplay.attributes.observationterrain_poi);
		CommentFinalPOIField.setValue(featureToDisplay.attributes.cmt);
		ModerationPOIField.setValue(featureToDisplay.attributes.moderation_poi);
		DisplayPOIField.setValue(featureToDisplay.attributes.display_poi);
		TransmissionPolePOIField.setValue(featureToDisplay.attributes.transmission_poi);
		TraitePolePOIField.setValue(featureToDisplay.attributes.traiteparpole_poi);
		emailPOIField.setValue(featureToDisplay.attributes.mail_poi);
		var lonlat = new OpenLayers.LonLat(featureToDisplay.attributes.lon, featureToDisplay.attributes.lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());

		var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
		feat = new OpenLayers.Feature.Vector(point, null, 
				{
			strokeColor: "#ff0000", 
			strokeOpacity: 0.8,
			fillColor : "#ff0000",
			fillOpacity: 0.4,
			pointRadius : 8
				}
		);      
		vectorsInModerationMap.addFeatures([feat]);
		console.log("latitude "+featureToDisplay.attributes.lat);
		latitudeField.setValue(featureToDisplay.attributes.lat);
		longitudeField.setValue(featureToDisplay.attributes.lon);
		expandMap.setCenter(new OpenLayers.LonLat(featureToDisplay.attributes.lon, featureToDisplay.attributes.lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 15);


//		console.log("featureToDisplay %o ",featureToDisplay);
		htmlGeneral = "";
	}else{
		title = featureToDisplay.cluster.length + ' observations proches dans ce regroupement';
		for(var countObser = 0;countObser<featureToDisplay.cluster.length;countObser++){
			htmlGeneral+= 'Observation n° <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/admin.php?id=' + featureToDisplay.cluster[countObser].attributes.id+'">'+featureToDisplay.cluster[countObser].attributes.id+'</a>, '+featureToDisplay.cluster[countObser].attributes.lib_subcategory+', '+T_lastModificationDate + ': ' + featureToDisplay.cluster[countObser].attributes.lastDateModif+'<br />'
		}
	}
	general = new Ext.Panel({
		title: T_main,
		ctCls: 'infoSupTabPanelPopup',
		iconCls: 'silk_information',
		html: htmlGeneral
	});

	tabPopup = new Ext.TabPanel({
		activeTab: 0,
		border: false
	});

	if (htmlGeneral != '') {
		tabPopup.add(general);
	}

	popup = new GeoExt.Popup({
		title:title,
		iconCls: feature.attributes.iconCls,
		location: feature,
		html: htmlGeneral,
		closable: true,
		unpinnable: false,
		collapse: false,
		collapsible: false,
		resizable: true,
		width: 800,
		height: 450,
		anchored: true,               
		autoScroll: true,
		layout: 'fit'
	});
	popup.on({
		close: function() {
			selectCtrl.unselectAll();
		}
	});
	if (feature.cluster){
		popup.show();
	}
}




/* fin popup */

function refreshTreeNode() {
	treePanel.getRootNode().reload();
	clearMarker();
}

var buttonRefreshTree = new Ext.Button({
	tooltip: T_refresh,
	iconCls: 'silk_arrow_refresh_small'
});
buttonRefreshTree.on('click', function() {
	refreshTreeNode();
});

var treeLoaderFinished = 0; //variable indiquant si le treepanel a fini de charger ses noeuds depuis le serveur

//l'arbre des couches
var treePanel = new Ext.tree.TreePanel({
	id: 'treePanel',
	region: 'west',
	//	layout: 'fit',
	header: false,
	split: true,
	width: 250,
	minSize: 150,
	maxSize: 380,
	autoScroll: true,
	rootVisible: false,
	autoScroll: true,
	collapsible: true,
	collapseMode: 'mini',
	enableDD: true,
	useArrows: true,
	margins: '5 0 5 5',
	cmargins: '5 5 5 5',
	loader: new Ext.tree.TreeLoader({


		baseAttrs : {
			expanded: true,
			checked: LOAD_ALL_OBSERVATIONS_DEFAULT
		},
		preloadChildren: true,
		dataUrl: 'lib/php/admin/getJsonTree.php',
		listeners: {
			'load': function () {
				console.debug('treeloader finished');
				treeLoaderFinished = 1;
				getCheckChild(treePanel.getChecked('id'));
			}
		}


	}),
	root: new Ext.tree.AsyncTreeNode(),
	rootVisible: false, 
	listeners: { 
		checkchange: function(n) {
			//	getMarker(this.getChecked('id'));
		},
		beforemovenode: function(tree,node,oldParent,newParent,index) {
			if (newParent == oldParent) {
				if (node.leaf) {		
					Ext.get('update').show();
					Ext.Ajax.request({
						waitMsg: T_pleaseWait,
						url: 'lib/php/admin/updateRankSubCategory.php',
						params: {
							id_node: node.id,
							newrank: index,
							category: oldParent.attributes.id_
						},
						success: function(response) {
							var result = eval(response.responseText);
							switch(result) {
							case 1:
								POIsDataStore.reload();
								refreshTreeNode();
								break;
							}
							Ext.get('update').hide();
						},
						failure: function(response) {
							var result = response.responseText;
							Ext.MessageBox.show({
								title: T_careful,
								msg: T_badConnect,
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
							Ext.get('update').hide();
						}
					});
				} else { 
					Ext.get('update').show();
					Ext.Ajax.request({
						waitMsg: T_pleaseWait,
						url: 'lib/php/admin/updateRankCategory.php',
						params: {
							id_node: node.attributes.id_,
							newrank: index
						},
						success: function(response) {
							var result = eval(response.responseText);
							switch(result) {
							case 1:
								POIsDataStore.reload();
								refreshTreeNode();
								break;
							}
							Ext.get('update').hide();
						},
						failure: function(response) {
							var result = response.responseText;
							Ext.MessageBox.show({
								title: T_careful,
								msg: T_badConnect,
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.ERROR
							});
							Ext.get('update').hide();
						}
					});
				}
			} else {
				Ext.MessageBox.show({
					title: T_careful,
					msg: T_impossible,
					buttons: Ext.MessageBox.OK,
					icon: Ext.MessageBox.INFO
				});
				setTimeout(refreshTreeNode, 1000);
			}
		}
	},
	bbar: ['->', buttonRefreshTree]
	//bbar: [configDefaultMapButton, '->', buttonRefreshTree]
});

treePanel.on('checkchange', function(n) {
	console.debug("checkchange debut activateGetCheckChild = " + activateGetCheckChild);
	if (activateGetCheckChild==1){
		if (n.isLeaf()){
			getCheckChild(this.getChecked('id'));
		} else{
			console.debug("checkchange else " + this.getChecked('id'));
			toggleCheckChild(n,n.childNodes);
			getCheckChild(this.getChecked('id'));
		}}
	console.debug("checkchange fin");	
});
treePanel.on('load', function(n) {
	console.info('treePanel.load this.getChecked = '+this.getChecked('id'));
	console.info('treePanel.load categories = '+categories);
	if (this.getChecked('id')!='' || !categories){
		activateGetCheckChild = 1;
	}
});

var previousTreeNodesChecked = ''; //variable listant les noeuds sélectionnés avant appel à getCheckChild (pour éviter un appel serveur inutile si les valeurs n'ont pas changé

function getCheckChild(tab) {
	console.debug("getCheckChild debut " + previousTreeNodesChecked +" et " + treePanel.getChecked('id').join());
	tabcheckchild = new Array();
	for (i=0; i<tab.length; i++) {
		if (tab[i].charAt(0) != 'x') {
			tabcheckchild.push(tab[i]);
		}
	}
	var currentTreeNodesChecked = treePanel.getChecked('id').join();
	console.debug("getCheckChild treeLoaderFinished = " + treeLoaderFinished );
	if (previousTreeNodesChecked!=currentTreeNodesChecked && treeLoaderFinished == 1){
		previousTreeNodesChecked = treePanel.getChecked('id').join();
		getMarker();
	}
	console.debug("getCheckChild fin");
}

function toggleCheckChild(parentnode,tabnode) {
	if (parentnode.getUI().isChecked()) {
		for (i=0; i<tabnode.length; i++) {
			if (!tabnode[i].getUI().isChecked()) {
				tabnode[i].getUI().toggleCheckNoEvent();
			}
		}
	} else {
		for (i=0; i<tabnode.length; i++) {
			if (tabnode[i].getUI().isChecked()) {
				tabnode[i].getUI().toggleCheckNoEvent();
			}
		}
	}
}

//GeoSearchCombo
var geoNameSearchCombo = new GeoExt.ux.GeoNamesSearchCombo({
	map: adminMap, zoom: 12
});

//control geoext
var maxExtent = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomToMaxExtent(),
	map: adminMap,
	iconCls: 'arrow_out',
	text: T_zoomMaxExtent,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var zoomIn = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomIn(),
	map: adminMap,
	iconCls: 'silk_magnifier_zoom_in',
	text: T_zoomIn,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var zoomOut = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomOut(),
	map: adminMap,
	iconCls: 'silk_magifier_zoom_out',
	text: T_zoomOut,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});



//mapPanel GeoExt
var mapAdminPanel = new GeoExt.MapPanel({
	id: 'mapAdminPanel',
	map: adminMap,
	region: 'center',
	margins: '5 5 5 0',
	tbar: new Ext.Toolbar({
		height: '20',
		cls: 'x-panel-header',
		items: arrayItemsMenuTopAdminMap
	}),
	bbar: new Ext.Toolbar({
		height: '20',
		cls: 'x-panel-header',
		items: arrayItemsMenuBottomAdminMap
	})
});


//le border panel
var afterLayoutVar = 0;
var mapAdminTabPanel = new Ext.Panel({
	layout: 'border',
	split: true,
	items: [treePanel, mapAdminPanel],
	listeners:
	{
		afterLayout: function() {
			if (afterLayoutVar == 0) {
				var uri = 'lib/php/admin/getDefaultConfigMap.php';
				OpenLayers.loadURL(uri,'',this,setDefaultCenterMap);
				afterLayoutVar = 1;
			}
		}
	}
});

function setDefaultCenterMap(response) {
	var json = eval('('+response.responseText+')');
	var long  = getCookie("mapx");
	var lat  = getCookie("mapy");
	var zoom  = getCookie("mapz");
	console.debug("Cookie "+document.cookie);
	//si les infos de longitude, latitude et zoom sont dans les cookies, on les utilise, sinon on récupère les infos de la base de données
	if(long != null && long != 0){
		console.debug("Configmap from cookies");
		adminMap.setCenter(new OpenLayers.LonLat(long,lat), zoom);
		adminMap.setBaseLayer(adminMap.layers[0]);
	}else if (json.configmap != null) {
		console.debug("Configmap from database");
		adminMap.setCenter(new OpenLayers.LonLat(json.configmap[0].lon, json.configmap[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject()), json.configmap[0].zoom);
		adminMap.setBaseLayer(adminMap.layers[json.configmap[0].baselayer]);
	}
}


adminMap.addControl(ctrl);
//au chargement des noeuds du treePanel, on selectionne les catégories qui était sélectionnées dans une session antérieure
var categories = getCookie('categories');
var activateGetCheckChild = 1; //TODO à quoi sert cette variable?
//au chargement des noeuds du treePanel, on sélectionne les catégories qui étaient sélectionnées dans une session antérieure
var tabcheckchild = new Array();
treePanel.on('expandnode', function(node) {
	if (categories && categories.indexOf(node.id) >= 0){
		if (node.isLeaf()){
			node.getUI().toggleCheck(true);
			tabcheckchild.push(node.id);
		}
	}
});


function setCookie() {
	console.debug("setCookie");
	if (adminMap && adminMap.getCenter()){
		console.debug("setCookie");
		var d = new Date();
		d.setTime(d.getTime() + (365*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = "mapx="+adminMap.getCenter().lon+ ";" + expires + ";path=/";
		document.cookie = "mapy="+adminMap.getCenter().lat+ ";" + expires + ";path=/";
		document.cookie = "mapz="+adminMap.getZoom()+ ";" + expires + ";path=/";
		document.cookie = "categories="+treePanel.getChecked('id').join()+ ";" + expires + ";path=/";
		console.debug("setCookie : " + document.cookie);
	}
}

var selectControl = new OpenLayers.Control.SelectFeature([vectorsAdminMap]);
adminMap.addControl(selectControl);
selectControl.activate();
