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
        publicMap.zoomIn();
        return;
    }
});
var optionsMap = {
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
var publicMap = new OpenLayers.Map(optionsMap);
var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "https://tile.openstreetmap.org/${z}/${x}/${y}.png",
	{
		'sphericalMercator': true, 
		isBaseLayer: true,
		'attribution': '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
	}
);
var osmcyclemap = new OpenLayers.Layer.OSM("OSM Cycle Map",
        ['https://tile.thunderforest.com/cycle/${z}/${x}/${y}.png?apikey='+ TF_key],
    {
        'sphericalMercator': true,
        isBaseLayer: true,
        'attribution': 'Maps © <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
    }
);

if (USE_TF) {
	publicMap.addLayers([osmcyclemap, mapnik]);
	publicMap.setBaseLayer(osmcyclemap);
} else {
	publicMap.addLayers([mapnik]);
}
publicMap.setBaseLayer(mapnik);
publicMap.addControl(new OpenLayers.Control.Attribution());
publicMap.addControl(new OpenLayers.Control.LayerSwitcher());

function clearMarker() {
	vectorsMap.removeAllFeatures();
}

function getMarker(listType,date,status) {
	clearMarker();
	if (listType != '') {
		var uri = 'lib/php/public/getMarker.php?listType='+listType+'&date='+date+'&status='+status+'&done='+0;
		OpenLayers.loadURL(uri, '', this, displayMarker);
	}
}

function getMarkerByID(id) {
    clearMarker();
    var uri = 'lib/php/public/getMarker.php?id='+id;
    OpenLayers.loadURL(uri, '', this, displayMarkerAndCenter);
}

function displayMarkerAndCenter(response) {
    var json = eval('(' + response.responseText + ')');
    if (json.markers != null) {
        var id = json.markers[0].id;
        var lonlat = new OpenLayers.LonLat(json.markers[0].lon, json.markers[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject());
        publicMap.setCenter(new OpenLayers.LonLat(json.markers[0].lon, json.markers[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject()), 15);
        //createFeaturePublicMapAndOpen(lonlat.lon,lonlat.lat, json.markers[0].icon, json.markers[0].lib, json.markers[0].desc, json.markers[0].prop, json.markers[0].iconCls, json.markers[0].id, json.markers[0].photo, json.markers[0].num, json.markers[0].rue, json.markers[0].commune, json.markers[0].repgt, json.markers[0].cmt, json.markers[0].date);
        console.info('displayMarkerAndCenter ' + id);
        var i = 0;
        if (json.markers[i]['commentaires']!=null) {
            var comments = '<b>Commentaires :</b>';
        	var j = 0;
            while(json.markers[i]['commentaires'][j] != null) {
            	comments += '<ul>';
            	if ( json.markers[i]['datecreation'][j] != '0000-00-00 00:00:00'){
                	comments += '<li>Ajouté le '+json.markers[i]['datecreation'][j] + ' : </li>';
                }
            	
                comments += '<li>Commentaire : '+json.markers[i]['commentaires'][j] + '</li>';
                if (json.markers[i]['photos'][j] != ""){
                	comments += '<li>Photo associée <br /><img width="400" src="./resources/pictures/'+json.markers[i]['photos'][j]+'"/></li>';
                }
                comments += '</ul><hr />';
                j++;
            }
            console.info('displayMarkerAndCenter ' + comments);
            createFeaturePublicMapAndOpen(id,lonlat.lon,lonlat.lat, json.markers[0].icon, json.markers[0].lib, json.markers[0].desc, json.markers[0].prop, json.markers[0].iconCls, json.markers[0].id, json.markers[0].photo, json.markers[0].num, json.markers[0].rue, json.markers[0].commune, json.markers[0].repgt, json.markers[0].cmt, json.markers[0].date, json.markers[0].lastdatemodif_poi, comments);
        } else {
            
            createFeaturePublicMapAndOpen(id,lonlat.lon,lonlat.lat, json.markers[0].icon, json.markers[0].lib, json.markers[0].desc, json.markers[0].prop, json.markers[0].iconCls, json.markers[0].id, json.markers[0].photo, json.markers[0].num, json.markers[0].rue, json.markers[0].commune, json.markers[0].repgt, json.markers[0].cmt, json.markers[0].date, json.markers[0].lastdatemodif_poi, null);
        }
    }
}

function displayMarker(response) {
	var json = eval('(' + response.responseText + ')');
	if (json.markers != null) {
		for (var i=0; i<json.markers.length; i++) {
            var id = json.markers[i].id;
			var lonlat = new OpenLayers.LonLat(json.markers[i].lon, json.markers[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject());
            if (json.markers[i]['commentaires']!= null) {
            	var comments = '<b>Commentaires :</b>';
            	var j = 0;
                while(json.markers[i]['commentaires'][j] != null) {
                	comments += '<ul>';
                	if ( json.markers[i]['datecreation'][j] != '0000-00-00 00:00:00'){
                    	comments += '<li>Ajouté le '+json.markers[i]['datecreation'][j] + ' : </li>';
                    }
                	
                    comments += '<li>Commentaire : '+json.markers[i]['commentaires'][j] + '</li>';
                    if (json.markers[i]['photos'][j] != ""){
                    	comments += '<li>Photo associée <br /><img width="400" src="./resources/pictures/'+json.markers[i]['photos'][j]+'"/></li>';
                    }
                    comments += '</ul><hr />';
                    j++;
                }
                //console.debug('displayMarker ' + comments);
               createFeaturePublicMap(id,lonlat.lon,lonlat.lat, json.markers[i].icon, json.markers[i].lib, json.markers[i].desc, json.markers[i].prop, json.markers[i].iconCls, json.markers[i].id, json.markers[i].photo, json.markers[i].num, json.markers[i].rue, json.markers[i].commune, json.markers[i].repgt, json.markers[i].cmt, json.markers[i].date, json.markers[i].lastdatemodif_poi, comments);
            } else {
                
                    createFeaturePublicMap(id,lonlat.lon,lonlat.lat, json.markers[i].icon, json.markers[i].lib, json.markers[i].desc, json.markers[i].prop, json.markers[i].iconCls, json.markers[i].id, json.markers[i].photo, json.markers[i].num, json.markers[i].rue, json.markers[i].commune, json.markers[i].repgt, json.markers[i].cmt, json.markers[i].date, json.markers[i].lastdatemodif_poi, null);
            }
		}
	}
}

var vectorsMap = new OpenLayers.Layer.Vector("marker", { visibility: true, displayInLayerSwitcher: false});
vectorsMap.setZIndex(23);
publicMap.addLayer(vectorsMap);


//Interface correspondant à une fiche d'une observation avec les détails et des boutons pour ajouter un nouveau commentaire ou modérer l'observaion

// create select feature control
var selectCtrl = new OpenLayers.Control.SelectFeature(vectorsMap);

var popup;
var tabPopup;

var idPoiComment;
function createPopup(feature) {
    idPoiComment = feature.attributes.id;
	htmlGeneral = "";
	htmlGeneral += "<b>"+T_dateCreation+" :</b> "+feature.attributes.date;
	if (feature.attributes.desc != '') {
		htmlGeneral += "<br/><b>"+T_description+" :</b> "+feature.attributes.desc;
	}
	if (feature.attributes.prop != '') {
		htmlGeneral += "<br/><b>"+T_proposition+" :</b> "+feature.attributes.prop;
	}
	if (feature.attributes.repgt != '') {
		htmlGeneral += "<br/><b>"+T_reponseGrandToulouse+" :</b> "+feature.attributes.repgt;
	} else {
		htmlGeneral += "<br/><b>"+T_reponseGrandToulouse+" :</b> ";
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
    if (feature.attributes.comments != null) {
        htmlGeneral += '<br/>'+feature.attributes.comments;
    }
    htmlGeneral += '<br/><div style="width:100%;"><button type="button" onclick="addComment()">Ajouter un commentaire et/ou une photo</button><a href="'+window.location.href.substring(0, window.location.href.lastIndexOf('/'))+'/admin.php?id='+feature.attributes.id+'"><img src="./resources/icon/silk/script_save.png" style="float:right;" /></a></div>';

//    if (feature.attributes.photos != null) {
//        htmlGeneral += '<br/>'+feature.attributes.photos;
//    }
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
		title: feature.attributes.id + " " +feature.attributes.lib + ', '+ T_lastModificationDate + ' : ' + feature.attributes.lastDateModif,
		iconCls: feature.attributes.iconCls,
		location: feature,
		html: htmlGeneral,
		closable: true,
		unpinnable: false,
		collapse: false,
		collapsible: false,
		resizable: true,
		width: 450,
		height: 350,
		anchored: false,               
		layout: 'fit',
		autoScroll: true,
		padding: '5 5 5 5'
	});
	popup.on({
		close: function() {
            selectCtrl.unselectAll();
		}
	});
	popup.show();
}
var CommentField = new Ext.form.TextArea({
    id: 'CommentField',
    name: 'text_comment',
    fieldLabel: T_comment,
    maxLength: 500,
    allowBlank: false,
    anchor : '95%'
});
var mailField = new Ext.form.TextField({
    id: 'mailField',
    name: 'mail_comment',
    fieldLabel: T_email,
    allowBlank: false,
    maxLength: 200,
    vtype: 'email',
	anchor : '95%',
	allowBlank : false
});
var hiddenIdPOI3 = new Ext.form.Hidden({
    id: 'hiddenIdPOI3',
    name: 'id_poi'
});
var CommentCreateForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle: 'padding:5px',
    frame: true,
    fileUpload: true,
    width: 350,
    height:550,
    autoScroll:true,
    items: [{
        layout: 'column',
        border: false,
        items:[{
            columnWidth:1,
            layout: 'form',
            border: false,
            items: [{
                xtype: 'fileuploadfield',
                id: 'form-file2',
                emptyText: T_selectPhoto,
                fieldLabel: T_photo,
                name: 'photo-path',
                buttonText: '',
                buttonCfg: {
                    iconCls: 'fugue_folder-open-document'
                }},CommentField, mailField]
        }]
    }],
    buttons: [{
        text: T_submit,
        handler: function() {
            if(CommentCreateForm.getForm().isValid()){
            	CommentCreateForm.getForm().submit({
                	waitMsg: T_pleaseWait,
                    url: 'lib/php/admin/database.php',
                    params: {
                        task: "CREATEPUBLICCOMMENTS",
                        id_poi: idPoiComment
                    },
                    success: function(CommentCreateForm, o) {
                    	console.log("CommentCreateForm success "+o.result.ok);
                    	
                    	Ext.MessageBox.show({
                            title: T_transfertOK,
                            msg: o.result.ok,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO,
                            iconCls: 'silk_tick'
                        });
                    	CommentCreateWindow.hide();
                        Ext.getCmp('form-file2').reset();
                        CommentField.reset();
                        mailField.reset();
                        popup.hide();
                    },
                    failure: function(CommentCreateForm, o) {
                    	console.log("CommentCreateForm echec "+o.result.pb);
                        Ext.MessageBox.show({
                            title: 'Hum ...',
                            msg: o.result.pb,
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.ERROR,
                            iconCls: 'fugue_cross-script'
                        });
                    }
                });
            }
        }
    },{
        text: T_cancel,
        handler: function(){
            CommentCreateWindow.hide();
        }
    }]
});

var CommentCreateWindow= new Ext.Window({
    id: 'CommentCreateWindow',
    iconCls: 'silk_comment_add',
    title: T_addComment,
    closable: false,
    border: false,
    width: 350,
    height: 400,
    plain: true,
    layout: 'fit',
    modal: true,
    items: CommentCreateForm
});

function addComment() {
    CommentCreateWindow.show();
}

vectorsMap.events.on({
	featureselected: function(e) {
		createPopup(e.feature);
	},
    featureunselected: function(e) {
        popup.destroy(e.feature)
    }
});
publicMap.addControl(selectCtrl);
selectCtrl.activate();

function createFeaturePublicMap(id,X,Y,icon,lib,desc,prop,iconCls,id,photo,num,rue,commune,repgt,cmt,date,lastDateModif,comments) {
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
	//console.debug('createFeaturePublicMap - lastDateModif ' + lastDateModif);
	if (lastDateModif == '0000-00-00'){
		lastDateModif = date;
	}
    feat.attributes = {"id": id, "lib": lib, "desc": desc, "prop": prop, "iconCls": iconCls, "photo": photo, "num": num, "rue": rue, "commune": commune, "repgt": repgt, "cmt": cmt, "date": date,"lastDateModif":lastDateModif, "comments": comments};
	vectorsMap.addFeatures([feat]);
}

function createFeaturePublicMapAndOpen(id,X,Y,icon,lib,desc,prop,iconCls,id,photo,num,rue,commune,repgt,cmt,date,lastDateModif,comments) {
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
    console.debug('createFeaturePublicMap - lastDateModif ' + lastDateModif);
    if (lastDateModif == '0000-00-00'){
		lastDateModif = date;
	}
    feat.attributes = {"id": id, "lib": lib, "desc": desc, "prop": prop, "iconCls": iconCls, "photo": photo, "num": num, "rue": rue, "commune": commune, "repgt": repgt, "cmt": cmt, "date": date, "lastDateModif":lastDateModif, "comments": comments};
    vectorsMap.addFeatures([feat]);
    createPopup(feat);
}

/* fin popup */



var treeLoaderFinished = 0; //variable indiquant si le treepanel a fini de charger ses noeuds depuis le serveur
//création de l'affichage des catégories dans le panneau de gauche
var treePanel = new Ext.tree.TreePanel({
	id: 'treePanel',
	region: 'west',
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
	enableDD: false,
	activeItem: 0,
	useArrows: true,
	margins: '5 0 5 5',
	cmargins: '5 5 5 5',
	loader: new Ext.tree.TreeLoader({
		baseAttrs : {
			expanded: true,
			checked: LOAD_ALL_OBSERVATIONS_DEFAULT
		},
		preloadChildren: true,
		dataUrl: 'lib/php/public/getJsonTree.php',
        listeners: {
            'load': function () {
                    console.debug('treeloader finished');
                    treeLoaderFinished = 1;
                    getCheckChild(treePanel.getChecked('id'));
            }
	}}),
	root: new Ext.tree.AsyncTreeNode(),
	rootVisible: false,
	tbar: [participationButton, '->', iconCreditButtonPublic]
});

var statStore = new Ext.data.JsonStore({
	  url: 'lib/php/public/getJsonStats.php',
	  root: 'statistiques',
	  autoLoad: true,
	  storeId : 'statStore',
	  fields: [
	    {name: 'status'},
	    {name: 'nb_poi'}
	  ]
	});



//au chargement des noeuds du treePanel, on sélectionne les catégories qui étaient sélectionnées dans une session antérieure
var categories = getCookie('categories');
var activateGetCheckChild = 0;
var tabcheckchild = new Array();
//coche la checkbox au chargement du treenode si elle était cochée lors d'une précédente session, sinon ne fait rien
treePanel.on('expandnode', function(node) {
	if (categories && categories.indexOf(node.id) >= 0){
		if (node.isLeaf()){
			node.getUI().toggleCheck(true);
			tabcheckchild.push(node.id);
		}
	}
});
//recharge les observations si une catégorie a été cochée ou décochée
treePanel.on('checkchange', function(n) {
	if (activateGetCheckChild==1){
		if (n.isLeaf()){
			getCheckChild(this.getChecked('id'));
		} else{
			toggleCheckChild(n,n.childNodes);
			getCheckChild(this.getChecked('id'));
		}
	}
});
treePanel.on('load', function(n) {
	console.info('treePanel.load'+this.getChecked('id'));
	if (this.getChecked('id')!='' || !categories){
		activateGetCheckChild = 1;
	}
});
var previousTreeNodesChecked = ''; //variable listant les noeuds sélectionnés avant appel à getCheckChild (pour éviter un appel serveur inutile si les valeurs n'ont pas changé
function getCheckChild(tab) {
	tabcheckchild = new Array();
	for (i=0; i<tab.length; i++) {
		if (tab[i].charAt(0) != 'x') {
			tabcheckchild.push(tab[i]);
		}
	} 
	var currentTreeNodesChecked = treePanel.getChecked('id').join();
    if (previousTreeNodesChecked!=currentTreeNodesChecked && treeLoaderFinished == 1){
        previousTreeNodesChecked = treePanel.getChecked('id').join();
        getMarker(tabcheckchild,comboboxFilterObservationsByDate.getValue(),comboboxFilterObservationsByStatus.getValue());
    }
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


//création de la carte centrale avec ses selecteurs permettant de filtrer l'affichage
// GeoSearchCombo
var geoNameSearchCombo = new GeoExt.ux.GeoNamesSearchCombo({
	map: publicMap, zoom: 12
});

// date combo
var dateALL = new Ext.data.ArrayStore({
	fields: ['abbr', 'datename'],
	data : Ext.poidisplaydate.ALL
});

var comboboxFilterObservationsByDate = new Ext.form.ComboBox({
	store: dateALL,
	displayField: 'datename',
	typeAhead: true,
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	emptyText: T_chooseDate,
	selectOnFocus: true,
	valueField: 'abbr',
	listeners: {
		'select': function () { 
			getMarker(tabcheckchild,this.getValue(),comboboxFilterObservationsByStatus.getValue());
		}
	}
});

// status combo

var statusPOIList = new Ext.data.JsonStore({
          url: 'lib/php/admin/getStatus.php',
          root: 'status',
          fields: [
            {name: 'id_status'},
            {name: 'lib_status'}
          ]
        });
var comboboxFilterObservationsByStatus = new Ext.form.ComboBox({
    store: statusPOIList,
    displayField: 'lib_status',
    typeAhead: true,
    mode: 'remote',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: T_chooseStatus,
    selectOnFocus: true,
    valueField: 'id_status',
    listeners: {
        'select': function () {
            getMarker(tabcheckchild, comboboxFilterObservationsByDate.getValue(),this.getValue());
        }
    }
});

// baselayers combo
var storeALL = new Ext.data.ArrayStore({
	fields: ['abbr', 'layername', 'nick'],
	data : Ext.baselayer.ALL
});
var comboboxSelectMapLayer = new Ext.form.ComboBox({
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
					publicMap.setBaseLayer(mapnik);
					break;
                case 'osmcyclemap':
                    publicMap.setBaseLayer(osmcyclemap);
                    break;
			}
		}
	}
});

// control geoext
var maxExtent = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomToMaxExtent(),
	map: publicMap,
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
	map: publicMap,
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
	map: publicMap,
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
publicMap.addControl(ctrl);

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
			publicMap.events.register('mouseover',publicMap,controlBox);
			deactivateAllMapsNavigation();
		}
		else {
			publicMap.events.unregister('mouseover',publicMap,controlBox);
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

var mapGeoExtPanel = new GeoExt.MapPanel({
	id: 'mapPanel',
	map: publicMap,
	region: 'center',
	margins: '5 5 5 0',
	tbar: new Ext.Toolbar({
		height: '20',
		cls: 'x-panel-header',
		items: [comboboxFilterObservationsByDate, ' ',comboboxFilterObservationsByStatus, '->' ,comboboxSelectMapLayer]
	})
});

// le border panel
var afterLayoutVar = 0;
var mapPanel = new Ext.Panel({
	layout: 'border',
	split: true,
	region: 'center',
	items: [treePanel, mapGeoExtPanel],
	listeners:
		{
			afterLayout: function() {
				if (afterLayoutVar == 0) {
					var uri = 'lib/php/public/getDefaultConfigMap.php';
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
		publicMap.setCenter(new OpenLayers.LonLat(long,lat), zoom);
		publicMap.setBaseLayer(publicMap.layers[0]);
	}else if (json.configmap != null) {
		console.debug("Configmap from database");
		publicMap.setCenter(new OpenLayers.LonLat(json.configmap[0].lon, json.configmap[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject()), json.configmap[0].zoom);
		publicMap.setBaseLayer(publicMap.layers[json.configmap[0].baselayer]);
	}
}




/* gestion de l'ajout d'une observation */
var styleCommune = new OpenLayers.StyleMap({'default':new OpenLayers.Style({
    strokeColor: "#00FF00",
    strokeOpacity: 1,
    strokeWidth: 1,
    fillColor: "#FF5500",
    fillOpacity: 0.2,
    pointRadius: 6,
    pointerEvents: "visiblePainted",
    // label with \n linebreaks
    label : "${name}",
    fontColor: "#FFFFFF",
    fontSize: "12px",
    fontFamily: "Courier New, monospace",
    fontWeight: "bold",
    labelAlign: "${align}",
    labelXOffset: "${xOffset}",
    labelYOffset: "${yOffset}",
    labelOutlineColor: "white",
    labelOutlineWidth: 1
 }),'selected':new OpenLayers.Style({
	    strokeColor: "#FFFF00",
	    strokeOpacity: 1,
	    strokeWidth: 1,
	    fillColor: "#FF5500",
	    fillOpacity: 0.2,
	    pointRadius: 6,
	    pointerEvents: "visiblePainted",
	    // label with \n linebreaks
	    label : "name: ${name}",
	    fontColor: "${favColor}",
	    fontSize: "12px",
	    fontFamily: "Courier New, monospace",
	    fontWeight: "bold",
	    labelAlign: "${align}",
	    labelXOffset: "${xOffset}",
	    labelYOffset: "${yOffset}",
	    labelOutlineColor: "white",
	    labelOutlineWidth: 3
	 })});
var stylePole = new OpenLayers.StyleMap({'default':new OpenLayers.Style({
    strokeColor: "#FF0000",
    strokeOpacity: 1,
    strokeWidth: 1,
    fillColor: "#FF2200",
    fillOpacity: 0.2,
    pointRadius: 6,
    pointerEvents: "visiblePainted",
    // label with \n linebreaks
    label : "${name}",
    fontColor: "#0000FF",
    fontSize: "18px",
    fontFamily: "Courier New, monospace",
    fontWeight: "bold",
    labelAlign: "${align}",
    labelXOffset: "${xOffset}",
    labelYOffset: "${yOffset}",
    labelOutlineColor: "white",
    labelOutlineWidth: 1
 }),'selected':new OpenLayers.Style({
	    strokeColor: "#FFFF00",
	    strokeOpacity: 1,
	    strokeWidth: 1,
	    fillColor: "#FF5500",
	    fillOpacity: 0.2,
	    pointRadius: 6,
	    pointerEvents: "visiblePainted",
	    // label with \n linebreaks
	    label : "name: ${name}",
	    fontColor: "${favColor}",
	    fontSize: "12px",
	    fontFamily: "Courier New, monospace",
	    fontWeight: "bold",
	    labelAlign: "${align}",
	    labelXOffset: "${xOffset}",
	    labelYOffset: "${yOffset}",
	    labelOutlineColor: "white",
	    labelOutlineWidth: 3
	 })});
var layerNewObservation = new OpenLayers.Layer.Vector("Propositions", { visibility: true, displayInLayerSwitcher: false});
layerNewObservation.setZIndex(11);
var layerLimitesGeographiquesCommunes = new OpenLayers.Layer.Vector("Limites communes", {reportError:true,styleMap:styleCommune, visibility: true, displayInLayerSwitcher: true,eventListeners:{
	 "featureadded": function(feature) {
		   console.log(feature);
		  }
		}});
layerLimitesGeographiquesCommunes.setZIndex(5);
var layerLimitesGeographiquesPoles = new OpenLayers.Layer.Vector("Limites poles", {reportError:true,styleMap:stylePole, visibility: true, displayInLayerSwitcher: true,eventListeners:{
	 "featureadded": function(feature) {
		   console.log(feature);
		  }
		}});
layerLimitesGeographiquesPoles.setZIndex(3);
publicMap.addLayer(layerNewObservation);
publicMap.addLayer(layerLimitesGeographiquesCommunes);
publicMap.addLayer(layerLimitesGeographiquesPoles);

var selectControl = new OpenLayers.Control.SelectFeature([vectorsMap,layerNewObservation]);
publicMap.addControl(selectControl);
selectControl.activate();

drag = new OpenLayers.Control.DragFeature(layerNewObservation,{
	onComplete: endDrag
 }); 
publicMap.addControl(drag); 
drag.activate();


function endDrag(feat) {
	var geom = feat.geometry.clone();
	geom.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	latitudeField.setValue(geom.y);
	longitudeField.setValue(geom.x);
}

var feat;

function createFeatureAdd(X,Y) {
	var point = new OpenLayers.Geometry.Point(X,Y);
	feat = new OpenLayers.Feature.Vector(point, null, 
		{
			strokeColor: "#ff0000", 
            strokeOpacity: 0.8,
            fillColor : "#ff0000",
            fillOpacity: 0.4,
            pointRadius : 8
		}
	);
	//feat = new OpenLayers.Feature.Vector(point, null, null);
	
	layerNewObservation.addFeatures([feat]);
}

function addPoi() {
	var lonlat = publicMap.getCenter();
	createFeatureAdd(lonlat.lon,lonlat.lat);
	var lonlatwgs = lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	latitudeField.setValue(lonlatwgs.lat);
	longitudeField.setValue(lonlatwgs.lon);
}



//creation de l'interface pour ajouter une nouvelle observation (formulaire de droite sur interface frontend)
var PublicAddTextDescField = new Ext.form.TextArea({
	id: 'PublicAddTextDescField',
	fieldLabel: T_descPb,
	maxLength: 500,
	allowBlank: false,
	height: 100,
	anchor : '99%',
	allowBlank : false
});

// TODO (CMR) : deleteme
var PublicAddTextPropField = new Ext.form.TextArea({
	id: 'PublicAddTextPropField',
	fieldLabel: T_propositionAmelioration,
	maxLength: 500,
	//allowBlank: false,
	height: 100,
	anchor : '99%',
	hidden : true
});

var PublicAddEmailField = new Ext.form.TextField({
	id: 'PublicAddEmailField',
	fieldLabel: T_email,
	maxLength: 50,
	allowBlank: false,
	vtype: 'email',
	anchor : '99%'
});

var PublicAddAdherentNameField = new Ext.form.TextField({
	id: 'PublicAddAdherentNameField',
	fieldLabel: T_adherentRecord,
	maxLength: 100,
	allowBlank: true,
	anchor : '95%',
	allowBlank : false
});

var PublicAddAdherentFirstnameField = new Ext.form.TextField({
	id: 'PublicAddAdherentFirstnameField',
	fieldLabel: T_adherentFirstname,
	maxLength: 100,
	allowBlank: true,
	anchor : '95%',
	allowBlank : false
});

var PublicAddTelField = new Ext.form.TextField({
	id: 'PublicAddTelField',
	fieldLabel: T_tel,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%'
});

var PublicAddNumField = new Ext.form.TextField({
	id: 'PublicAddNumField',
	fieldLabel: T_numRecord,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%',
	emptyText : T_numRecord_placeholder
});

var PublicAddRueField = new Ext.form.TextField({
	id: 'PublicAddRueField',
	fieldLabel: T_rueRecord,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%',
	emptyText : T_rueRecord_placeholder,
	allowBlank : false
});

var PublicCommuneNameField = new Ext.form.TextField({
	id: 'PublicCommuneNameField',
	fieldLabel: T_communeName,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%',
	emptyText : T_communeName_placeholder,
	allowBlank : false
});

var latitudeField = new Ext.form.NumberField({
	id: 'latitude',
	name: 'latitude',
	fieldLabel: T_latitude,
	allowNegative: true,
	allowDecimals: true,
	decimalSeparator: '.',
	decimalPrecision: 20,
	disabled: false,
	hidden: true
});

var longitudeField = new Ext.form.NumberField({
	id: 'longitude',
	name: 'longitude',
	fieldLabel: T_longitude,
	allowNegative: true,
	allowDecimals: true,
	decimalSeparator: '.',
	decimalPrecision: 20,
	disabled: false,
	hidden: true
});

// TODO (CMR) : faire fonctionner ce msgBeforeSending car il ne s'affiche pas
var messageBeforeSendingField = new Ext.Component({
	xtype : 'component',
	items : [
		{
			html : T_messageBeforeSending
		}
	]
});

var PolePOIList = new Ext.data.JsonStore({
  url: 'lib/php/public/getPole.php',
  root: 'pole',
  fields: [
    {name: 'id_pole'},
    {name: 'lib_pole'},
    {name: 'geom'}
  ]
});

var PolePOIField = new Ext.form.ComboBox({
	fieldLabel: T_pole,
	store: PolePOIList,
	anchor: '99%',
	displayField: 'lib_pole',
	valueField: 'id_pole',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	emptyText: ''
});

var CommunePOIList = new Ext.data.JsonStore({
  url: 'lib/php/public/getCommune.php',
  root: 'commune',
  fields: [
    {name: 'id_commune'},
    {name: 'lib_commune'},
    {name: 'geom'}
  ]
});

var CommunePOIField = new Ext.form.ComboBox({
	fieldLabel: T_commune,
	store: CommunePOIList,
	anchor: '99%',
	displayField: 'lib_commune',
	valueField: 'id_commune',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	emptyText: ''
});

var subCategoryPOIList = new Ext.data.JsonStore({
  url: 'lib/php/public/getSubCategory.php',
  root: 'subcategory',
  fields: [
    {name: 'id_subcategory'},
    {name: 'lib_subcategory'}
  ]
});

var SubCategoryPOIField = new Ext.form.ComboBox({
	fieldLabel: T_pbType,
	store: subCategoryPOIList,
	anchor: '99%',
	displayField: 'lib_subcategory',
	valueField: 'id_subcategory',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: false,
	emptyText: ''
});

var hiddenIdPOI = new Ext.form.Hidden({
	id: 'hiddenIdPOI',
	name: 'id_POI'
});

var eastPanelFormCreatePOI = new Ext.form.FormPanel({
	id: 'eastPanelFormCreatePOI',
	fileUpload: true,
	hidden: true,
	baseCls: 'x-plain',
	region: 'east',
	header: false,
	title: T_howToParticipate,
	iconCls: 'silk_help',
	split: true,
	width: 290,
	minSize: 150,
	maxSize: 290,
	autoScroll: true,
	rootVisible: false,
	autoScroll: true,
	collapsible: false,
	collapseMode: 'mini',
	collapsed: true,
	labelAlign: 'top',
	items: [{
			xtype: 'fieldset',
			collapsible: false,
			title: T_obs,
			items: [hiddenIdPOI, SubCategoryPOIField, PublicAddNumField, PublicAddRueField, PublicCommuneNameField, PublicAddTextDescField, PublicAddTextPropField /* TODO (CMR) deleteme*/, latitudeField, longitudeField, messageBeforeSendingField, {
				xtype: 'fileuploadfield',
				id: 'form-file',
				anchor: '99%',
				emptyText: T_selectPhoto,
				fieldLabel: T_photo,
				name: 'photo-path',
				buttonText: '',
				buttonCfg: {
					iconCls: 'fugue_folder-open-document'
				}
			},{
				html: "<center><span style='color:#8f5757;'>"+T_sizeOctetPhoto+"</span></center>"
    }]
		}, {
			xtype: 'fieldset',
			collapsible: true,
			collapsed: false,
			title: T_yourDetails,
			items: [PublicAddAdherentNameField, PublicAddAdherentFirstnameField, PublicAddEmailField, PublicAddTelField]
		}
	],
	buttonAlign: 'center',
	buttons: [{
			text: T_submit,
			handler: createPublicPOI,
			iconCls: 'silk_add'
		},{
			text: T_cancel,
			iconCls: 'silk_delete',
			handler: function() {
				treePanel.expand();
				eastPanelFormCreatePOI.collapse();
				participationButton.toggle();
				participationButton.enable();
				resetPOIForm();
				feat.destroy();
			}
	}],
	html: "<p class='messageBeforeSending'>" + T_messageBeforeSending + "</p>"
});

function resetPOIForm() {
	eastPanelFormCreatePOI.getForm().reset();
}

function isPOIFormValid() {
	return(SubCategoryPOIField.isValid() &&
		PublicAddNumField.isValid() &&
		PublicAddRueField.isValid() &&
		PublicCommuneNameField.isValid() &&
		PublicAddTextDescField.isValid() &&
		PublicAddTextPropField.isValid() && // TODO (CMR) deleteme
		PublicAddAdherentNameField.isValid() &&
		PublicAddAdherentFirstnameField.isValid() &&
		PublicAddTelField.isValid() &&
		PublicAddEmailField.isValid()
	);
}


function createPublicPOI() {
	if (isPOIFormValid()) {
	    	eastPanelFormCreatePOI.getForm().submit({
	        	waitMsg: T_pleaseWait,
	            url: 'lib/php/admin/database.php',
	            params: {
	                task: "CREATEPUBLICPOI",
	                id_poi: idPoiComment,
	                latitude_poi: latitudeField.getValue(),
					longitude_poi: longitudeField.getValue(),
					desc_poi: PublicAddTextDescField.getValue(),
					prop_poi: PublicAddTextPropField.getValue(), // TODO (CMR) deleteme
					mail_poi: PublicAddEmailField.getValue(),
					tel_poi: PublicAddTelField.getValue(),
					num_poi: PublicAddNumField.getValue(),
					rue_poi: PublicAddRueField.getValue(),
					communename_poi: PublicCommuneNameField.getValue(),
					adherent_poi: PublicAddAdherentNameField.getValue(),
					adherentfirstname_poi: PublicAddAdherentFirstnameField.getValue(),
					subcategory_id_subcategory:	SubCategoryPOIField.getValue()
	            },
	            success: function(eastPanelFormCreatePOI, o) {
	            	console.log("eastPanelFormCreatePOI success "+o.result.ok);
	                Ext.MessageBox.show({
	                    title: T_propSent,
	                    msg: o.result.ok,
	                    buttons: Ext.Msg.OK,
	                    icon: Ext.MessageBox.INFO,
	                    iconCls: 'silk_tick'
	                });
	                Ext.getCmp('eastPanelFormCreatePOI').collapse();
	                treePanel.expand();
	                participationButton.toggle();
	                participationButton.enable();
	                resetPOIForm();
	                feat.destroy();
	            },
	            failure: function(eastPanelFormCreatePOI, o) {
	            	console.log("eastPanelFormCreatePOI echec "+o.result.pb);
	                Ext.MessageBox.show({
	                    title: T_transfertKO,
	                    msg: o.result.pb,
	                    buttons: Ext.Msg.OK,
	                    icon: Ext.MessageBox.ERROR,
	                    iconCls: 'fugue_cross-script'
	                });
	            }
	        });
	    }
	}	
Ext.util.Observable.capture( eastPanelFormCreatePOI, function(event) {                                                                                                        
//    console.log("treePanel = "+event);
    });

function setCookie() {
//	console.debug("setCookie");
	if (publicMap && publicMap.getCenter()){
		var d = new Date();
		d.setTime(d.getTime() + (365*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = "mapx="+publicMap.getCenter().lon+ ";" + expires + ";path=/";
		document.cookie = "mapy="+publicMap.getCenter().lat+ ";" + expires + ";path=/";
		document.cookie = "mapz="+publicMap.getZoom()+ ";" + expires + ";path=/";
		document.cookie = "categories="+treePanel.getChecked('id').join()+ ";" + expires + ";path=/";
//		console.debug("setCookie : " + document.cookie);
	}
}

var communesLoaded = 0;
function displayLayerLimitesGeographiquesCommunes(){
	console.log("displayLayerLimitesGeographiquesCommunes");
	layerLimitesGeographiquesPoles.display(false);
	layerLimitesGeographiquesCommunes.display(true);
	if (communesLoaded == 0){
		CommunePOIList.load();
		communesLoaded=1;
	}
}
function hideLayerLimitesGeographiquesCommunes(){
	console.log("hideLayerLimitesGeographiquesCommunes");
	layerLimitesGeographiquesCommunes.display(false);
}
var polesLoaded = 0;
function displayLayerLimitesGeographiquesPoles(){
	console.log("displayLayerLimitesGeographiquesPoles");
	layerLimitesGeographiquesCommunes.display(false);
	layerLimitesGeographiquesPoles.display(true);
	if (polesLoaded == 0){
		PolePOIList.load();
		polesLoaded=1;
	}
}
function hideLayerLimitesGeographiquesPoles(){
	console.log("hideLayerLimitesGeographiquesPoles");
	layerLimitesGeographiquesPoles.display(false);
}
function addLimitesGeographiques(coords, layer, layername){
	var start = 9;
	var length = coords.length - 11;
	if (coords.substr(0,1) == 'M') {
		start = 15;
		length = coords.length - 18;
	}	
	var polygons = coords.substr(start, length).split(')),((');
	for (var j = 0; j < polygons.length; j++) {
		var rings =  polygons[j].split('),(');
		for (var k = 0; k < rings.length; k++) {
			var polyCoords = [];
			var positions = rings[k].split(',');
			for (var i = 0; i < positions.length; i++){
				var c = positions[i].split(' ');
				var lonLat = new OpenLayers.LonLat(lon=parseFloat(c[0]),lat=parseFloat(c[1])).transform(
					new OpenLayers.Projection("EPSG:4326"),
					new OpenLayers.Projection("EPSG:900913")
				);
				polyCoords.push(new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat));						
			}
			feature_polygon = new OpenLayers.Feature.Vector( 
				new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyCoords))
				, 
				{ 
					'name':layername
				} 
			); 
			layer.addFeatures([feature_polygon]);
		}
  }
} 

CommunePOIList.on('load', function(store, records, options){ 
	var fieldValue; 
	CommunePOIList.each(function(record){
		var coords = record.get("geom");
		var commune = record.get("lib_commune");
		console.log("commune="+commune);
		if(coords != ''){	
			addLimitesGeographiques(coords, layerLimitesGeographiquesCommunes, commune);					
		}
	}, this); 
	console.log("commune ");
//	publicMap.addLayer(layerLimitesGeographiquesCommunes);
}); 
PolePOIList.on('load', function(store, records, options){ 
	var fieldValue; 
	PolePOIList.each(function(record){
		var coords = record.get("geom");
		var pole = record.get("lib_pole");
		console.log("pole="+coords);
		if(coords && coords != ''){
			addLimitesGeographiques(coords, layerLimitesGeographiquesPoles, pole);		
    }
	}, this); 
	console.log("pole ");
});
