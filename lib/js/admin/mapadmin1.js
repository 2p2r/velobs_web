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
	'defaultDblClick': function(event) { return; }
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
var adminMap = new OpenLayers.Map(optionsAdminMap);
var mapnik2 = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "http://tile.openstreetmap.org/${z}/${x}/${y}.png",
	{
		'sphericalMercator': true, 
		isBaseLayer: true,
		'attribution': '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
	}
);
var osmcyclemap2 = new OpenLayers.Layer.OSM("OpenStreetMap Cycle Map", "http://a.tile.opencyclemap.org/cycle/${z}/${x}/${y}.png",
    {
        'sphericalMercator': true,
        isBaseLayer: true,
        'attribution': '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
    }
);
var mapquest2 = new OpenLayers.Layer.OSM("OpenStreetMap Mapquest", "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
	{
		'attribution': '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a> - <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>'
	}
);

/*var hill = new OpenLayers.Layer.TMS("Hillshading (NASA SRTM3 v2)", "http://toolserver.org/~cmarqu/hill/", {
	type: 'png',
	getURL: osm_getTileURL,
	displayOutsideMaxExtent: true, 
	isBaseLayer: false,
	transparent: true, 
	"visibility": false
});

var apiKeyBing = "AqK30LQfN2aq1VME6rfTYVsMEk3OdhBtKfKWFnOYey4PtX8i2S5CxKuln4g5r98M";
var bingroad2 = new OpenLayers.Layer.Bing({
	name: "Road",
	key: apiKeyBing,
	type: "Road"
});
var binghybrid2 = new OpenLayers.Layer.Bing({
	name: "Hybrid",
	key: apiKeyBing,
	type: "AerialWithLabels"
});
var bingaerial2 = new OpenLayers.Layer.Bing({
	name: "Aerial",
	key: apiKeyBing,
	type: "Aerial"
});*/

adminMap.addLayers([mapquest2, osmcyclemap2, mapnik2/*, bingroad2, binghybrid2, bingaerial2, hill*/]);
adminMap.setBaseLayer(osmcyclemap2);
adminMap.setBaseLayer(mapquest2);
adminMap.setBaseLayer(mapnik2);
adminMap.addControl(new OpenLayers.Control.Attribution());

/*adminMap.events.register("zoomend", adminMap, function(e) {
	if ((adminMap.getZoom() <= 13) && (adminMap.getZoom() >= 11)) {
		checkhillshading.enable();
		if (checkhillshading.getValue()) {
			hill.setVisibility(true);
		}
		else {
			hill.setVisibility(false);
		}
	}
	if (adminMap.getZoom() > 13) {
		hill.setVisibility(false);
		checkhillshading.disable();
	}
	if (adminMap.getZoom() < 11) {
		hill.setVisibility(false);
		checkhillshading.disable();
	}
});*/

function clearMarker() {
	vectorsAdminMap.removeAllFeatures();
}

function getMarker(listType) {
	clearMarker();
	if (listType != '') {
		var uri = 'lib/php/admin/getMarker.php?listType='+listType;
		OpenLayers.loadURL(uri, '', this, displayMarker);
	}
}

function displayMarker(response) {
	var json = eval('(' + response.responseText + ')');
	if (json.markers != null) {
		for (var i=0; i<json.markers.length; i++) {
			var lonlat = new OpenLayers.LonLat(json.markers[i].lon, json.markers[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject());
			createFeatureAdminMap(lonlat.lon,lonlat.lat, json.markers[i].icon, json.markers[i].lib, json.markers[i].desc, json.markers[i].prop, json.markers[i].iconCls, json.markers[i].id, json.markers[i].photo, json.markers[i].num, json.markers[i].rue, json.markers[i].commune, json.markers[i].repgt, json.markers[i].cmt, json.markers[i].date);
		}
	}
}

var vectorsAdminMap = new OpenLayers.Layer.Vector("marker", { visibility: true, displayInLayerSwitcher: false});
adminMap.addLayer(vectorsAdminMap);


/* popup */

// create select feature control
var selectCtrl = new OpenLayers.Control.SelectFeature(vectorsAdminMap);

var popup;
var tabPopup;

function createPopup(feature) {
	htmlGeneral = "";
	//htmlGeneral += "<br/><b>"+T_lib+" :</b> "+feature.attributes.lib;
	htmlGeneral += "<br/><b>"+T_dateCreation+" :</b> "+feature.attributes.date;
	if (feature.attributes.desc != '') {
		htmlGeneral += "<br/><b>"+T_description+" :</b> "+feature.attributes.desc;
	}
	if (feature.attributes.prop != '') {
		htmlGeneral += "<br/><b>"+T_proposition+" :</b> "+feature.attributes.prop;
	}
	if (feature.attributes.repgt != '') {
		htmlGeneral += "<br/><b>"+T_reponseGrandToulouse+" :</b> "+feature.attributes.repgt;
	} else {
		htmlGeneral += "<br/><b>"+T_reponseGrandToulouse+" :</b> "+T_enAttente;
	}
	if (feature.attributes.cmt != '') {
		htmlGeneral += "<br/><b>"+T_commentFinal+" :</b> "+feature.attributes.cmt;
	}
	htmlGeneral += "<br/><b>"+T_address+" :</b> "+feature.attributes.num+", "+feature.attributes.rue+", "+feature.attributes.commune;
	if ((feature.attributes.photo != '') && (feature.attributes.photo != null)) {
		temp = feature.attributes.photo;
		size = temp.split('x');
		largeur = size[0];
		hauteur = size[1];
		if (largeur < 400){
			htmlGeneral += '<br/><br/><b>'+T_photo+' :</b><br/><a href="./resources/pictures/'+feature.attributes.photo+'" target="_blank"><span ext:qtip="'+T_clickToOpenInNewTab+'"><img src="./resources/pictures/'+feature.attributes.photo+'"/></span></a>';
		} else {
			htmlGeneral += '<br/><br/><b>'+T_photo+' :</b><br/><a href="./resources/pictures/'+feature.attributes.photo+'" target="_blank"><span ext:qtip="'+T_clickToOpenInNewTab+'"><img width="400" src="./resources/pictures/'+feature.attributes.photo+'"/></span></a>';
		}
	} else {
		htmlGeneral += '<br/><br/><b>'+T_photo+' :</b> '+T_noPhoto+'<br/>';
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
		title: feature.attributes.lib,
		iconCls: feature.attributes.iconCls,
		location: feature,
		html: htmlGeneral,
		closable: true,
		unpinnable: false,
		collapse: false,
		collapsible: false,
		resizable: true,
		width: 450,
		height: 450,
		anchored: true,               
		layout: 'fit'
	});
	popup.on({
		close: function() {
            selectCtrl.unselectAll();
		}
	});
	popup.show();
}

vectorsAdminMap.events.on({
	featureselected: function(e) {
		createPopup(e.feature);
	}
});
adminMap.addControl(selectCtrl);
selectCtrl.activate();

function createFeatureAdminMap(X,Y,icon,lib,desc,prop,iconCls,id,photo,num,rue,commune,repgt,cmt,date) {
	var point = new OpenLayers.Geometry.Point(X,Y);
	var feat = new OpenLayers.Feature.Vector(point, null, null);

	feat.style = { 
		externalGraphic: icon,
		backgroundGraphic: "./resources/icon/shadow.png",
		backgroundXOffset: -10,
		backgroundYOffset: -37,
		graphicXOffset: -32/2,
		graphicYOffset: -37,
		graphicWidth: 32,
		graphicHeight: 37,
		pointRadius:0
	};

	feat.attributes = {"lib": lib, "desc": desc, "prop": prop, "iconCls": iconCls, "id": id, "photo": photo, "num": num, "rue": rue, "commune": commune, "repgt": repgt, "cmt": cmt, "date": date};
	vectorsAdminMap.addFeatures([feat]);
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

var configDefaultMapButton = new Ext.Button({
	tooltip: T_setPreferencesMap,
	iconCls: 'silk_cog'
});
configDefaultMapButton.on('click', function() {
	expandWindow2.show();
});

// l'arbre des couches
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
			checked: false
		},
		preloadChildren: true,
		dataUrl: 'lib/php/admin/getJsonTree.php'
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
	bbar: [configDefaultMapButton, '->', buttonRefreshTree]
});

treePanel.on('checkchange', function(n) {
	if (n.isLeaf()){
		getCheckChild(this.getChecked('id'));
	} else{
		toggleCheckChild(n,n.childNodes);
		getCheckChild(this.getChecked('id'));
	}
});

function getCheckChild(tab) {
	var tabcheckchild = new Array();
	for (i=0; i<tab.length; i++) {
		if (tab[i].charAt(0) != 'x') {
			tabcheckchild.push(tab[i]);
		}
	}
	getMarker(tabcheckchild);
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

// GeoSearchCombo
var geoNameSearchCombo = new GeoExt.ux.GeoNamesSearchCombo({
	map: adminMap, zoom: 12
});

// baselayers combo
var storeALL = new Ext.data.ArrayStore({
	fields: ['abbr', 'layername', 'nick'],
	data : Ext.baselayer.ALL
});
var comboALL = new Ext.form.ComboBox({
	store: storeALL,
	displayField: 'layername',
	typeAhead: true,
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	emptyText: T_baselayer,
	selectOnFocus: true,
	valueField: 'abbr',
	listeners: {
		'select': function () {
			switch (this.getValue()) {
				case 'mapnik':
					adminMap.setBaseLayer(mapnik2);
					break;
				case 'mapquest':
					adminMap.setBaseLayer(mapquest2);
					break;
                case 'osmcyclemap':
                    adminMap.setBaseLayer(osmcyclemap2);
                    break;/*
				case 'bingroad':
					adminMap.setBaseLayer(bingroad2);
					break;
				case 'binghybrid':
					adminMap.setBaseLayer(binghybrid2);
					break;
				case 'bingaerial':
					adminMap.setBaseLayer(bingaerial2);
					break;*/
			}
		}
	}
});

// checkbox hillshading
/*var checkhillshading = new Ext.form.Checkbox({
	boxLabel: T_shading,
	checked: false,
	ctCls: 'checkhillshading',
	listeners: {
		'check': function () {
			switch (this.getValue()) {
				case true: 
					hill.setVisibility(true);
					break;
				case false:
					hill.setVisibility(false);
					break;
			}
		}
	}
});*/

// control geoext
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

var ctrl = new OpenLayers.Control.NavigationHistory();
adminMap.addControl(ctrl);

var previous = new GeoExt.Action({
	iconCls: 'silk_arrow_left',
	text: T_previousView,
	control: ctrl.previous,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var next = new GeoExt.Action({
	iconCls: 'silk_arrow_right',
	text: T_nextView,
	control: ctrl.next,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var panButton = new Ext.Button({
	text: T_nav,
	iconCls: 'arrow_pan',
	enableToggle: true,
	toggleGroup: "zoom_pan_toggle",
	pressed: true,
	allowDepress: false
});

var zoomboxButton = new Ext.Button({
	text: T_zoomBox,
	iconCls: 'magnifier_zoom_box',
	enableToggle: true,
	toggleGroup: "zoom_pan_toggle",
	allowDepress: false,
	toggleHandler: function(button, pressed) {
		if (pressed) {
			adminMap.events.register('mouseover',adminMap,controlBox);
			deactivateAllMapsNavigation();
		}
		else {
			adminMap.events.unregister('mouseover',adminMap,controlBox);
			activateAllMapsNavigation();
		}
	}
});

function activateAllMapsNavigation() {
	navigation.activate();
}
function deactivateAllMapsNavigation() {
	navigation.deactivate();
}
function controlBox() {
	controlZoomBox.activate();
}


// mapPanel GeoExt
var mapAdminPanel = new GeoExt.MapPanel({
	id: 'mapAdminPanel',
	map: adminMap,
	region: 'center',
	margins: '5 5 5 0',
	tbar: new Ext.Toolbar({
		height: '20',
		cls: 'x-panel-header',
		items: ['<span style="color:#333; font-family:tahoma,arial,verdana,sans-serif; font-weight:normal">'+T_applicationName+'</span>', '->', previous, '  ', '  ', next, /*' ', '  ', panButton, '  ', ' ', zoomboxButton, ' ', ' ', ' ', ' ', ' ', */' ', ' ', /*checkhillshading, ' ', geoNameSearchCombo,*/comboALL]
	})
});


// le border panel
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
	if (json.configmap != null) {
		adminMap.setCenter(new OpenLayers.LonLat(json.configmap[0].lon, json.configmap[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject()), json.configmap[0].zoom);
		adminMap.setBaseLayer(adminMap.layers[json.configmap[0].baselayer]);
	}
}

// config map
var optionsExpandMap2 = {
	controls: [
		new OpenLayers.Control.LayerSwitcher({'roundedCornerColor':'black'}), 
		new OpenLayers.Control.PanZoom(), 
		new OpenLayers.Control.Navigation({
			'zoomWheelEnabled': true
		})
	],
	projection: new OpenLayers.Projection("EPSG:900913"),
	displayProjection: new OpenLayers.Projection("EPSG:4326"),
	units: "m",
	numZoomLevels: 18,
	maxResolution: 156543.0339
};
var expandMap2 = new OpenLayers.Map(optionsExpandMap2);
var mapnik3 = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "http://tile.openstreetmap.org/${z}/${x}/${y}.png",
	{'sphericalMercator': true, isBaseLayer:true}
);
var mapquest3 = new OpenLayers.Layer.OSM("OpenStrretMap Mapquest", "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png");

expandMap2.addLayers([mapquest3, mapnik3]);
expandMap2.setBaseLayer(mapquest3);
expandMap2.setBaseLayer(mapnik3);

var expandMapPanel2 = new GeoExt.MapPanel({
	map: expandMap2,
	listeners: {
		afterLayout: function() {
		var uri = 'lib/php/admin/getDefaultConfigMap.php';
		OpenLayers.loadURL(uri,'',this,setDefaultConfigMap);
		}
	}
});

var latitudeField2 = new Ext.form.NumberField({
	id: 'latitude',
	name: 'latitude',
	allowNegative: true,
	allowDecimals: true,
	decimalSeparator: '.',
	decimalPrecision: 20,
	disabled: false
});
latitudeField2.on('change', function() {
	var lonlat = new OpenLayers.LonLat(longitudeField2.getValue(), latitudeField2.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap2.getProjectionObject());
	expandMap2.setCenter(lonlat, expandMap2.getZoom());
});

var longitudeField2 = new Ext.form.NumberField({
	id: 'longitude',
	name: 'longitude',
	allowNegative: true,
	allowDecimals: true,
	decimalSeparator: '.',
	decimalPrecision: 20,
	disabled: false
});
longitudeField2.on('change', function() {
	var lonlat = new OpenLayers.LonLat(longitudeField2.getValue(), latitudeField2.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap2.getProjectionObject());
	expandMap2.setCenter(lonlat, expandMap2.getZoom());
});

var zoomField2 = new Ext.form.NumberField({
	id: 'zoom',
	name: 'zoom',
 	allowNegative: false,
	allowDecimals: false,
	disabled: false
});
zoomField2.on('change', function() {
	var lonlat = new OpenLayers.LonLat(longitudeField2.getValue(), latitudeField2.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap2.getProjectionObject());
	expandMap2.setCenter(lonlat, zoomField2.getValue());
});


var id;
var validButton2 = new Ext.Button({
	iconCls: 'silk_tick',
	text: T_save,
	handler: function() {
		Ext.Ajax.request({   
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "UPDATEGEODEFAULTMAP",
				lat: latitudeField2.getValue(),
				lon: longitudeField2.getValue(),
				zoom: zoomField2.getValue(),
				baselayer : expandMap2.getLayerIndex(expandMap2.baseLayer)
			},
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						var uri = 'lib/php/admin/getDefaultConfigMap.php';
						OpenLayers.loadURL(uri,'',this,setDefaultCenterMap);
						expandWindow2.hide();
						break;
					default:
						Ext.MessageBox.alert(T_careful,T_coordNotModify);
						break;
				}        
			},
			failure: function(response) {
				var result = response.responseText;
				Ext.MessageBox.alert(T_error, result);          
			}
		});
	}
});

var resetButton2 = new Ext.Button({
	iconCls: 'silk_cancel',
	text: T_cancel,
	handler: function() {
		expandWindow2.hide();
	}
});

var expandWindow2 = new Ext.Window({
	title: T_configDefaultMap,
	height: 480, 
	width: 750, 
	layout: "fit",
	border: false,
	modal: true,
	maximizable: true,
	items: [expandMapPanel2],
	iconCls: 'silk_map_edit',
	closeAction: 'hide',
	bbar: ['Lat :', latitudeField2, ' ', 'Long :', longitudeField2, ' ', 'Zoom :', zoomField2, '->', validButton2, ' ', resetButton2]
});

expandMap2.events.register('moveend', expandMap2, setCoordDefaultValue);

function setDefaultConfigMap(response) {
	var json = eval('('+response.responseText+')');
	if (json.configmap != null) {
		expandMap2.setCenter(new OpenLayers.LonLat(json.configmap[0].lon, json.configmap[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject()), json.configmap[0].zoom);
		expandMap2.setBaseLayer(expandMap2.layers[json.configmap[0].baselayer]);
	}
}

function setCoordDefaultValue(event) {
	var lat = expandMap2.getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")).lat;
	var lon = expandMap2.getCenter().transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")).lon;
	var zoom = expandMap2.getZoom();
	latitudeField2.setValue(lat);
	longitudeField2.setValue(lon);
	zoomField2.setValue(zoom);
}