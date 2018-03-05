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

if (navigator.appName != "Microsoft Internet Explorer") {
    OpenLayers.ImgPath = "resources/images/ol_themes/black/";
}

var controlZoomBox = new OpenLayers.Control.ZoomBox({CLASS_NAME:'zoomIn'});
var navigation = new OpenLayers.Control.Navigation({
    zoomWheelEnabled: true,
    defaultDblClick: function(event) {
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
var adminMap = new OpenLayers.Map(optionsAdminMap);
var mapnik2 = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "https://tile.openstreetmap.org/${z}/${x}/${y}.png",
    {
        'sphericalMercator': true,
        isBaseLayer: true,
        'attribution': '<a href="http://www.openstreetmap.org" target="_blank">OpenStreetMap</a>'
    }
);
var osmcyclemap = new OpenLayers.Layer.OSM("OpenCycleMap",
        ['https://tile.thunderforest.com/cycle/${z}/${x}/${y}.png?apikey='+ TF_key],
    {
        'sphericalMercator': true,
        isBaseLayer: true,
        'attribution': 'Maps © <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
    }
);

if (USE_TF) {
	adminMap.addLayers([osmcyclemap, mapnik2]);
	adminMap.setBaseLayer(osmcyclemap);
} else {
	adminMap.addLayers([mapnik2]);
}
adminMap.setBaseLayer(mapnik2);
adminMap.addControl(new OpenLayers.Control.Attribution());

function clearMarker() {
    vectorsAdminMap.removeAllFeatures();
}

function getMarker(listType) {
    clearMarker();
    if (listType != '') {
        var uri = 'lib/php/admin/getMarkerPole.php?listType='+listType;
        OpenLayers.loadURL(uri, '', this, displayMarker);
    }
}

function displayMarker(response) {
    var json = eval('(' + response.responseText + ')');
    if (json.markers != null) {
        for (var i=0; i<json.markers.length; i++) {
            var lonlat = new OpenLayers.LonLat(json.markers[i].lon, json.markers[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject());
            createFeatureAdminMap(lonlat.lon,lonlat.lat, json.markers[i].icon, json.markers[i].lib, json.markers[i].desc, json.markers[i].prop, json.markers[i].iconCls, json.markers[i].id, json.markers[i].photo, json.markers[i].num, json.markers[i].rue, json.markers[i].commune, json.markers[i].repgt, json.markers[i].cmt, json.markers[i].date, json.markers[i].reppole, json.markers[i].traite);
        }
    }
}

var vectorsAdminMap = new OpenLayers.Layer.Vector("marker", { visibility: true, displayInLayerSwitcher: false});
adminMap.addLayer(vectorsAdminMap);

var selectCtrl = new OpenLayers.Control.SelectFeature(vectorsAdminMap);

var popup;
var tabPopup;
var idPoiComment;
var idPoiResponse;
var traiteBool;
function createPopup(feature) {
    idPoiComment = feature.attributes.id;
    idPoiResponse = feature.attributes.reppole;

    htmlGeneral = "";
    
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
    
    if (feature.attributes.traite == null || feature.attributes.traite == 0) {
        traiteBool = 0;
        htmlGeneral += '<br/><br/><b>'+T_traiteparpole+' :</b>&nbsp;Non';
    } else if (feature.attributes.traite == 1) {
        traiteBool = 1;
        htmlGeneral += '<br/><br/><b>'+T_traiteparpole+' :</b>&nbsp;Oui';
    }

    if (feature.attributes.reppole != '') {
        htmlGeneral += '<br/><br/><b>'+T_reponsePole+' : </b><br/>'+feature.attributes.reppole+'<br/><br/><div style="width:100%;"><button onclick="openWindowPole()">'+T_editRecord+'</button><a href="'+window.location.href.substring(0, window.location.href.lastIndexOf('/'))+'/admin.php?id='+feature.attributes.id+'"><img src="./resources/icon/silk/script_save.png" style="float:right;" /></a></div>';
    } else {
        htmlGeneral += '<br/><br/><div style="width:100%;"><button onclick="openWindowPole()">'+T_addReponsePole+'</button><a href="'+window.location.href.substring(0, window.location.href.lastIndexOf('/'))+'/admin.php?id='+feature.attributes.id+'"><img src="./resources/icon/silk/script_save.png" style="float:right;" /></a></div>';
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
        autoScroll: true,
        layout: 'fit'
    });
    popup.on({
        close: function() {
            selectCtrl.unselectAll();
        }
    });
    popup.show();
}

var Traite2PolePOIField = new Ext.form.Checkbox({
    checked: false,
    allowBlank: true,
    boxLabel: T_traiteparpole,
    name: 'traiteparpole_poi'
});

var CommentField = new Ext.form.TextArea({
    id: 'CommentField',
    fieldLabel: T_reponse,
    maxLength: 500,
    allowBlank: true,
    anchor : '95%'
});

var CommentCreateForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle: 'padding:5px',
    frame: true,
    width: 350,
    items: [{
        layout: 'column',
        border: false,
        items:[{
            columnWidth:1,
            layout: 'form',
            border: false,
            items: [CommentField, Traite2PolePOIField]
        }]
    }],
    buttons: [{
        text: T_add,
        handler: createTheComment
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
    title: T_reponsePole,
    closable: false,
    border: false,
    width: 350,
    height: 250,
    plain: true,
    layout: 'fit',
    modal: true,
    items: CommentCreateForm
});

function openWindowPole() {
    Traite2PolePOIField.setValue(traiteBool);
    CommentField.setValue(idPoiResponse);
    CommentCreateWindow.show();
}

function createTheComment() {
    Ext.Ajax.request({
        waitMsg: T_pleaseWait,
        url: 'lib/php/admin/database.php',
        params: {
        	task: "UPDATEPOI",
            id_poi: idPoiComment,
            reponsepole_poi: CommentField.getValue(),
            traiteparpole_poi: Traite2PolePOIField.getValue()
        },
        success: function(response) {
            var result = eval(response.responseText);
            switch (result) {
                case 1:
                    Ext.MessageBox.show({
                        title: T_success,
                        msg: T_addPoleResponseSuccess,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    CommentCreateWindow.hide();
                    CommentField.reset();
                    TraitePolePOIField.reset();
                    selectCtrl.unselectAll();
                    refreshTreeNode();
                    //TODO : voir si on est obligé de rechercher le datastore
                    POIsDataStore.reload();
                    popup.hide();
                    break;
                case 4:
                    Ext.MessageBox.show({
                        title: T_success,
                        msg: T_addPoleResponseSuccess,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    CommentCreateWindow.hide();
                    CommentField.reset();
                    TraitePolePOIField.reset();
                    selectCtrl.unselectAll();
                    refreshTreeNode();
                  //TODO : voir si on est obligé de rechercher le datastore
                    POIsDataStore.reload();
                    popup.hide();
                    break;
                case 2:
					Ext.MessageBox.alert(T_success,T_no_modification_on_data);
					break;
                default:
                    Ext.MessageBox.show({
                        title: T_careful,
                        msg: T_pb,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    CommentField.reset();
                    break;
            }
        },
        failure: function(response){
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

vectorsAdminMap.events.on({
    featureselected: function(e) {
        createPopup(e.feature);
    }
});
adminMap.addControl(selectCtrl);
selectCtrl.activate();

function createFeatureAdminMap(X,Y,icon,lib,desc,prop,iconCls,id,photo,num,rue,commune,repgt,cmt,date,reppole,traite) {
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
    var templib = id + " " +lib;
    feat.attributes = {"lib": templib, "desc": desc, "prop": prop, "iconCls": iconCls, "id": id, "photo": photo, "num": num, "rue": rue, "commune": commune, "repgt": repgt, "cmt": cmt, "date": date, "reppole": reppole, "traite": traite};
    vectorsAdminMap.addFeatures([feat]);
}

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
    enableDD: false,
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
    bbar: ['->', buttonRefreshTree]
});

treePanel.on('checkchange', function(n) {
	if (activateGetCheckChild==1){
		if (n.isLeaf()){

		getCheckChild(this.getChecked('id'));
	} else{
		toggleCheckChild(n,n.childNodes);
		getCheckChild(this.getChecked('id'));
	}}
		
	});
	treePanel.on('load', function(n) {
		console.info('treePanel.load'+this.getChecked('id'));
		if (this.getChecked('id')!=''){
			console.info('load getMarker for '+this.getChecked('id'));
			getMarker(this.getChecked('id'));
			activateGetCheckChild = 1;
		}
		if (!categories){
			activateGetCheckChild = 1;
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
                case 'osmcyclemap':
                    adminMap.setBaseLayer(osmcyclemap);
                    break;
            }
        }
    }
});

var mapAdminPanel = new GeoExt.MapPanel({
    id: 'mapAdminPanel',
    map: adminMap,
    region: 'center',
    margins: '5 5 5 0',
    tbar: new Ext.Toolbar({
        height: '20',
        cls: 'x-panel-header',
        items: ['<span style="color:#333; font-family:tahoma,arial,verdana,sans-serif; font-weight:normal">VelObs</span>', '->', comboALL]
    })
});

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

//au chargement des noeuds du treePanel, on selectionne les catégories qui était sélectionnées dans une session antérieure
var categories = getCookie('categories');
var activateGetCheckChild = 0;
treePanel.on('expandnode', function(node) {
	if (categories && categories.indexOf(node.id) >= 0){
		if (node.isLeaf()){
			node.getUI().toggleCheck(true);
		}
	}
});
function setCookie() {
	if (adminMap && adminMap.getCenter()){
		console.debug("setCookie");
		var d = new Date();
	    d.setTime(d.getTime() + (365*24*60*60*1000));
	    var expires = "expires="+ d.toUTCString();
		document.cookie = "mapx="+adminMap.getCenter().lon+ ";" + expires + ";path=/";
	    document.cookie = "mapy="+adminMap.getCenter().lat+ ";" + expires + ";path=/";
	    document.cookie = "mapz="+adminMap.getZoom()+ ";" + expires + ";path=/";
	    document.cookie = "categories="+treePanel.getChecked('id').join()+ ";" + expires + ";path=/";
//	    console.debug("setCookie : " + document.cookie);
	}
	
}
