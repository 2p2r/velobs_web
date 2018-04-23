var limitPOIPerPage = 100;
var alreadyShowExpandWindowGetParameter = 0;
var idPOI; // <== need for photo
var id;


var searchObservationField = new Ext.form.TextField({
	id: 'searchObservationField',
	allowBlank: true,
	anchor : '99%',
	emptyText:'N° Observation',
	width:90
});
var searchObservationButton = new Ext.Button({ text:'Afficher',
	listeners: {
		click: function() {
			console.log('valeur obs = ' + searchObservationField.getValue());
			getMarkerByID(searchObservationField.getValue());
		}
	}});
var singleObservationIdToDisplay;
function getMarkerByID(id) {
    clearMarker();
    singleObservationIdToDisplay = id;
    var uri = 'lib/php/admin/getMarker.php?id='+id;
    OpenLayers.loadURL(uri, '', this, displayMarkerAndCenter);
}
function displayMarkerAndCenter(response) {
    var json = eval('(' + response.responseText + ')');
    if (json.markers != null) {
        var id = json.markers[0].id;
        var lonlat = new OpenLayers.LonLat(json.markers[0].lon, json.markers[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject());
        adminMap.setCenter(new OpenLayers.LonLat(json.markers[0].lon, json.markers[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), adminMap.getProjectionObject()), 15);
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
            createFeaturePublicMapAndOpen(id,lonlat.lon,lonlat.lat, json.markers[0].icon, json.markers[0].lib_subcategory, json.markers[0].lib_status, json.markers[0].desc, json.markers[0].prop, json.markers[0].iconCls, json.markers[0].id, json.markers[0].photo, json.markers[0].num, json.markers[0].rue, json.markers[0].commune, json.markers[0].repgt, json.markers[0].cmt, json.markers[0].date, json.markers[0].lastdatemodif_poi, comments);
        } else {
            createFeaturePublicMapAndOpen(id,lonlat.lon,lonlat.lat, json.markers[0].icon, json.markers[0].lib_subcategory, json.markers[0].lib_status, json.markers[0].desc, json.markers[0].prop, json.markers[0].iconCls, json.markers[0].id, json.markers[0].photo, json.markers[0].num, json.markers[0].rue, json.markers[0].commune, json.markers[0].repgt, json.markers[0].cmt, json.markers[0].date, json.markers[0].lastdatemodif_poi, null);
        }
    }else{
    	console.log('pas de retour');
    	Ext.MessageBox.show({
			title: T_error,
			msg: T_noCorrespondingObservation + singleObservationIdToDisplay,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.INFO,
			iconCls: 'silk_information'
		});
    }
}

function createFeaturePublicMapAndOpen(id,X,Y,icon,lib_subcategory,lib_status,desc,prop,iconCls,id,photo,num,rue,commune,repgt,cmt,date,lastDateModif,comments,email) {
    var point = new OpenLayers.Geometry.Point(X,Y);
    var feat = new OpenLayers.Feature.Vector(point, null, null);
    console.debug('createFeaturePublicMap - lastDateModif ' + lastDateModif);
    if (lastDateModif == '0000-00-00'){
		lastDateModif = date;
	}
    feat.attributes = {"id": id, "lib_subcategory": lib_subcategory, "lib_status": lib_status, "desc": desc, "prop": prop, "iconCls": iconCls, "photo": photo, "num": num, "rue": rue, "commune": commune, "repgt": repgt, "cmt": cmt, "date": date, "lastDateModif":lastDateModif, "comments": comments, "icon":icon,"email":email};
    vectorsAdminMap.addFeatures([feat]);
    createPopup(feat);
}
var PrioritePOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getPriorite.php',
    root: 'priorite',
    fields: [
        {name: 'id_priorite'},
        {name: 'lib_priorite'}
    ]
});
//Combobox in the moderation interface of the observation
var PrioritePOIField = new Ext.form.ComboBox({
    id:'PrioritePOIField',
    fieldLabel: T_priorite,
    store: PrioritePOIList2,
    displayField: 'lib_priorite',
    valueField: 'id_priorite',
    forceSelection: true,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: '',
    disabled: false
});

var subCategoryPOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getSubCategory.php',
    root: 'subcategory',
    fields: [
        {name: 'id_subcategory'},
        {name: 'lib_subcategory'}
    ]
});

var CommunePOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getCommune.php',
    root: 'commune',
    fields: [
        {name: 'id_commune'},
        {name: 'lib_commune'}
    ]
});

var PolePOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getPole.php',
    root: 'pole',
    fields: [
        {name: 'id_pole'},
        {name: 'lib_pole'}
    ]
});
//priority displaying (given by the moderators)
var prioritePOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getPriorite.php',
	  root: 'priorite',
	  fields: [
	    {name: 'id_priorite'},
	    {name: 'lib_priorite'}
	  ]
	});

	var comboPrioritePOIMapItemMenu = new Ext.form.ComboBox({
		fieldLabel: T_priorite,
		store: prioritePOIList,
		displayField: 'lib_priorite',
		valueField: 'id_priorite',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: 'Filter par priorité'
	});
	comboPrioritePOIMapItemMenu.on('select', function() {
		   console.log("Appel getMarker avec priorite = "+comboPrioritePOIMapItemMenu.getValue());
			getMarker(tabcheckchild,comboPrioritePOIMapItemMenu.getValue());
		});
	comboPrioritePOIMapItemMenu.on('afterrender', function(){
		  Ext.QuickTips.register({ target: comboPrioritePOIMapItemMenu.getEl(), text: 'N\'afficher que les observations avec la prorité (donnée par le modérateur de l\'association) - se cumule avec les autres filtres.' });
		});
	
	//priorite combo in the grid
	var comboPrioritePOIGrid = new Ext.form.ComboBox({
		fieldLabel: T_priorite,
		store: prioritePOIList,
		displayField: 'lib_priorite',
		valueField: 'id_priorite',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: 'Filter par priorité'
	});



//Status displaying (given by the collectivity)
var statusPOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getStatus.php',
	  root: 'status',
	  fields: [
	    {name: 'id_status'},
	    {name: 'lib_status'}
	  ]
	});
//combobox in the moderation interface of the observation
var StatusPOIField = new Ext.form.ComboBox({
    id:'StatusPOIField',
    fieldLabel: T_status,
    store: statusPOIList,
    displayField: 'lib_status',
    valueField: 'id_status',
    forceSelection: true,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});
//combobox in the map filters
var StatusPOIFieldMapItemMenu = new Ext.form.ComboBox({
    id:'StatusPOIFieldMapItemMenu',
    fieldLabel: T_status,
    store: statusPOIList,
    displayField: 'lib_status',
    valueField: 'id_status',
    forceSelection: true,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: true,
    emptyText: 'Filter par statut'
});
StatusPOIFieldMapItemMenu.on('afterrender', function(){
	  Ext.QuickTips.register({ target: StatusPOIFieldMapItemMenu.getEl(), text: 'N\'afficher que les observations avec le statut (donné par la collectivité) - se cumule avec les autres filtres.' });
	});  
StatusPOIFieldMapItemMenu.on('select', function() {
	   console.log("Appel getMarker avec status = "+StatusPOIFieldMapItemMenu.getValue());
		getMarker(tabcheckchild);
	});

//combobox in the grid listing the observations
	var comboStatusPOI = new Ext.form.ComboBox({
		fieldLabel: T_status,
		store: statusPOIList,
		displayField: 'lib_status',
		valueField: 'id_status',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: ''
	});

var TraitePolePOIField = new Ext.form.Checkbox({
	id:'TraitePolePOIField',
	checked: false,
    allowBlank: true,
    width: 20,
    name: 'traiteparpole_poi'
});

var TransmissionPolePOIField = new Ext.form.Checkbox({
	id:'TransmissionPolePOIField',
	checked: false,
    allowBlank: true,
    width: 20,
    name: 'transmission_poi'
});

var SubCategoryPOIField = new Ext.form.ComboBox({
	id:'SubCategoryPOIField',
	fieldLabel: T_subcategory,
    store: subCategoryPOIList2,
    displayField: 'lib_subcategory',
    valueField: 'id_subcategory',
    forceSelection: true,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: '',
    disabled: false
});


//Composants du formulaire de modération
var CommunePOIField = new Ext.form.ComboBox({
	id:'CommunePOIField',
	fieldLabel: T_commune,
    store: CommunePOIList2,
    displayField: 'lib_commune',
    valueField: 'id_commune',
    forceSelection: true,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});

var PolePOIField = new Ext.form.ComboBox({
    id:'PolePOIField',
    fieldLabel: T_pole,
    store: PolePOIList2,
    displayField: 'lib_pole',
    valueField: 'id_pole',
    forceSelection: true,
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});




var RespComcomPOIField = new Ext.form.TextArea({
    id: 'RespComcomPOIField',
    fieldLabel: T_reponseGrandToulouse,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var RespPolePOIField = new Ext.form.TextArea({
    id: 'RespPolePOIField',
    fieldLabel: T_reponsePole,
    maxLength: 500,
    height: 70,
    width: 125,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var DescPOIField = new Ext.form.TextArea({
    id: 'DescPOIField',
    fieldLabel: T_description,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var PropPOIField = new Ext.form.TextArea({
    id: 'PropPOIField',
    fieldLabel: T_proposition,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var RuePOIField = new Ext.form.TextField({
    id: 'RuePOIField',
    fieldLabel: T_rueRecord,
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var ObsPOIField = new Ext.form.TextArea({
    id: 'ObsPOIField',
    maxLength: 500,
    allowBlank: true,
    anchor : '95%',
    disabled: false,
    height: 70,
    width: 250
});

var NumPOIField = new Ext.form.TextField({
    id: 'NumPOIField',
    fieldLabel: T_numRecord,
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var CommentFinalPOIField = new Ext.form.TextArea({
    id: 'CommentFinalPOIField',
    fieldLabel: T_commentFinal,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var ModerationPOIField = new Ext.form.Checkbox({
	id: 'ModerationPOIField',
	header: T_moderation,
    width: 20,
    sortable: true,
    dataIndex: 'moderation_poi'
});

var DisplayPOIField = new Ext.form.Checkbox({
	id: 'DisplayPOIField',
	header: T_display,
    width: 20,
    sortable: true,
    dataIndex: 'display_poi'
});
var RespComcomPOIField = new Ext.form.TextArea({
    id: 'RespComcomPOIField',
    fieldLabel: T_reponseGrandToulouse,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%'
});

var RespPolePOIField = new Ext.form.TextArea({
    id: 'RespPolePOIField',
    fieldLabel: T_reponsePole,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%'
});
var emailPOIField = new Ext.form.TextField({
    id: 'emailPOIField',
    fieldLabel: T_email,
    anchor : '95%',
    disabled: true
});
var hiddenIdPOI = new Ext.form.Hidden({
	id: 'hiddenIdPOI',
	name: 'id_POI'
}); // <== idPOI for picture, need the both

var hiddenIdPOI2 = new Ext.form.Hidden({
	id: 'hiddenIdPOI2',
	name: 'id_POI'
}); // <== idPOI for picture, need the both





var identifiantPOI = new Ext.grid.Column({
	header: '#', 
	dataIndex: 'id_poi', 
	width: 50,
	sortable: true,
	hidden: false,
	readOnly: true,
	css:'cursor:not-allowed;;color:blue;'
});

var subCategoryPOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getSubCategory.php',
	  root: 'subcategory',
	  fields: [
	    {name: 'id_subcategory'},
	    {name: 'lib_subcategory'}
	  ]
	});

	var comboSubCategoryPOI = new Ext.form.ComboBox({
		fieldLabel: T_subcategory,
		store: subCategoryPOIList,
		displayField: 'lib_subcategory',
		valueField: 'id_subcategory',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: ''
	});


var communePOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getCommune.php',
	  root: 'commune',
	  fields: [
	    {name: 'id_commune'},
	    {name: 'lib_commune'}
	  ]
	});

	var comboCommunePOI = new Ext.form.ComboBox({
		fieldLabel: T_commune,
		store: communePOIList,
		displayField: 'lib_commune',
		valueField: 'id_commune',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: ''
	});

	var polePOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getPole.php',
	  root: 'pole',
	  fields: [
	    {name: 'id_pole'},
	    {name: 'lib_pole'}
	  ]
	});

	var comboPolePOI = new Ext.form.ComboBox({
		fieldLabel: T_pole,
		store: polePOIList,
		displayField: 'lib_pole',
		valueField: 'id_pole',
		forceSelection: true,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: ''
	});
	


	
	//Button on the moderation UI of the observation
	var buttonModerateComments = new Ext.Button({
		iconCls: 'silk_pencil',
		text: T_comments
		
	});
	buttonModerateComments.on('click', function(columnIndex, grid, rowIndex, e) {
		console.info("buttonModerateComments.on('click')" + id);
	    
	    CommentsDataStore.setBaseParam('id_poi', id);
	    CommentsDataStore.load();
	    expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
	    expandCommentsWindow.show();

	});
	
	// checkbox Commentaires en attente de modération pour n'afficher que ces observations
	var displayObservationsWithCommentToModerate = 0;
	var checkboxDisplayObservationsWithCommentToModerate = new Ext.form.Checkbox({
	    boxLabel: T_CommentsToManage,
	    checked: false,
	    listeners: {
	        'check': function () {
	        	console.log("checkboxDisplayObservationsWithCommentToModerate = "+this.getValue());
	            switch (this.getValue()) {
	            
	                case true:
	                	console.log("checkboxDisplayObservationsWithCommentToModerate = true");
	                	displayObservationsWithCommentToModerate = 1;
	                    getMarker(tabcheckchild,comboPrioritePOIMapItemMenu.getValue());
	                    console.log("checkboxDisplayObservationsWithCommentToModerate, apres getMarker");
	                    break;
	                case false:
	                	console.log("checkboxDisplayObservationsWithCommentToModerate = false");
	                	displayObservationsWithCommentToModerate = 0;
	                    getMarker(tabcheckchild,comboPrioritePOIMapItemMenu.getValue());
	                    break;
	            }
	        }
	    }
	});

	checkboxDisplayObservationsWithCommentToModerate.on('afterrender', function(){
		  Ext.QuickTips.register({ target: checkboxDisplayObservationsWithCommentToModerate.getEl(), text: 'N\'afficher que les observations qui ont des observations en attente de modération - se cumule avec les autres filtres.' });
		});  
	var ctrl = new OpenLayers.Control.NavigationHistory();
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
				adminMap.setBaseLayer(mapLayersArray[this.getValue()][2]);
			}
		}
	});

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
	

	var POIsDataStore = new Ext.data.Store({
	    id: 'POIsDataStore',
	    remoteSort: true,
	    proxy: new Ext.data.HttpProxy({
	        url: 'lib/php/admin/database.php',
	        method: 'POST'
	    }),
	    baseParams: {task: 'LISTINGPOI'},
	    reader: new Ext.data.JsonReader({
	        root: 'results',
	        totalProperty: 'total',
	        id: 'id_poi'
	    },[
	        { name: 'id_poi', type: 'int', mapping: 'id_poi'},
	        { name: 'lib_poi', type: 'string', mapping: 'lib_poi'},
	        { name: 'adherent_poi', type: 'string', mapping: 'adherent_poi'},
	        { name: 'num_poi', type: 'string', mapping: 'num_poi'},
	        { name: 'rue_poi', type: 'string', mapping: 'rue_poi'},
	        { name: 'tel_poi', type: 'string', mapping: 'tel_poi'},
	        { name: 'mail_poi', type: 'string', mapping: 'mail_poi'},
	        { name: 'desc_poi', type: 'string', mapping: 'desc_poi'},
	        { name: 'prop_poi', type: 'string', mapping: 'prop_poi'},
	        { name: 'observationterrain_poi', type: 'string', mapping: 'observationterrain_poi'},
	        { name: 'reponse_collectivite_poi', type: 'string', mapping: 'reponse_collectivite_poi'},
	        { name: 'reponsepole_poi', type: 'string', mapping: 'reponsepole_poi'},
	        { name: 'commentfinal_poi', type: 'string', mapping: 'commentfinal_poi'},
	        { name: 'display_poi', type: 'bool'},
	        { name: 'latitude_poi', type: 'string', mapping: 'latitude_poi'},
	        { name: 'longitude_poi', type: 'string', mapping: 'longitude_poi'},
	        { name: 'geolocatemode_poi', type: 'int', mapping: 'geolocatemode_poi'},
	        { name: 'photo_poi', type: 'string', mapping: 'photo_poi'},
	        { name: 'datecreation_poi', type: 'timestamp', mapping: 'datecreation_poi'},
	        { name: 'datefix_poi', type: 'timestamp', mapping: 'datefix_poi'},
	        { name: 'fix_poi', type: 'bool'},
	        { name: 'moderation_poi', type: 'bool'},
	        { name: 'transmission_poi', type: 'bool'},
	        { name: 'lib_subcategory', type: 'string', mapping: 'lib_subcategory'},
	        { name: 'lib_commune', type: 'string', mapping: 'lib_commune'},
	        { name: 'lib_pole', type: 'string', mapping: 'lib_pole'},
	        { name: 'lib_quartier', type: 'string', mapping: 'lib_quartier'},
	        { name: 'lib_priorite', type: 'string', mapping: 'lib_priorite'},
	        { name: 'lib_status', type: 'string', mapping: 'lib_status'},
	        { name: 'lastdatemodif_poi', type: 'timestamp', mapping: 'lastdatemodif_poi'},
	        { name: 'traiteparpole_poi', type: 'bool', mapping: 'traiteparpole_poi'},
	        { name: 'num_comments', type: 'int', mapping: 'num_comments'}
	    ]),
	    listeners: {
	        load: function() {
	            if (noIdParam != -1) {
	                if (idEdit != '' && idEdit != undefined && alreadyShowExpandWindowGetParameter == 0) {
	                    var indexEdit = this.find('id_poi',idEdit);

	                    alreadyShowExpandWindowGetParameter = 1;
	                    id = idEdit;
	                    var dateLastModif = this.getAt(indexEdit).json['lastdatemodif_poi'];
	                    if (this.getAt(indexEdit).json['lastdatemodif_poi'] == '0000-00-00'){
	                		dateLastModif = this.getAt(indexEdit).json['datecreation_poi'];
	                	}
	                    expandWindow.setTitle(id + " " +this.getAt(indexEdit).json['lib_subcategory'] + ', '+ T_lastModificationDate + ' : ' + dateLastModif);
	                    expandWindow.show();

	                    var commune = this.getAt(indexEdit).json['lib_commune'];
	                    var pole = this.getAt(indexEdit).json['lib_pole'];
	                    var status = this.getAt(indexEdit).json['lib_status'];
	                    console.log("Ligne 693 " + status);
	                    var reponsecomcom = this.getAt(indexEdit).json['reponse_collectivite_poi'];
	                    var reponsepole = this.getAt(indexEdit).json['reponsepole_poi'];
	                    var desc = this.getAt(indexEdit).json['desc_poi'];
	                    var prop = this.getAt(indexEdit).json['prop_poi'];
	                    var subcat = this.getAt(indexEdit).json['lib_subcategory'];
	                    var rue = this.getAt(indexEdit).json['rue_poi'];
	                    var num = this.getAt(indexEdit).json['num_poi'];
	                    var prio = this.getAt(indexEdit).json['lib_priorite'];
	                    var obs = this.getAt(indexEdit).json['observationterrain_poi'];
	                    var commentfinal_poi = this.getAt(indexEdit).json['commentfinal_poi'];
	                    var modo = this.getAt(indexEdit).json['moderation_poi'];
	                    var disp = this.getAt(indexEdit).json['display_poi'];
	                    var lastDateModif = this.getAt(indexEdit).json['lastdatemodif_poi'];
	                    var  nbrComments = this.getAt(indexEdit).json['num_comments'];
	                    var traiteparpole_poi = this.getAt(indexEdit).json['traiteparpole_poi'];
	                    var  transmission_poi = this.getAt(indexEdit).json['transmission_poi'];
	                    var  email = this.getAt(indexEdit).json['mail_poi'];
	                    console.debug(id + ' est lié à '+nbrComments + ' commentaires');
	                    if (nbrComments == 0) {
	                    	buttonModerateComments.disable();
	                    } else {
	                    	buttonModerateComments.enable();
	                    }
	                    tof = this.getAt(indexEdit).json['photo_poi'];
	                    if (tof != null) {
	                        Ext.getCmp('observationImagePanel').update('<img style="height:100%;cursor: pointer;" onclick="window.open(\'resources/pictures/'+tof+'\')" src="resources/pictures/'+tof+'" />');
	                    }else {
	                    	Ext.getCmp('observationImagePanel').update('Pas de photo associée');
	                    }

	                    var lat = this.getAt(indexEdit).json['latitude_poi'];
	                    var lon = this.getAt(indexEdit).json['longitude_poi'];

	                    var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
	                    createFeature(lonlat.lon,lonlat.lat,commune,pole,status,traiteparpole_poi,transmission_poi,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs,commentfinal_poi, modo,disp,lastDateModif,email);

	                    latitudeField.setValue(this.getAt(indexEdit).json['latitude_poi']);
	                    longitudeField.setValue(this.getAt(indexEdit).json['longitude_poi']);

	                    expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 13);
	                }
	            }
	        }
	    }
	});
	
	
	var chkColumn_displayPOI = new Ext.grid.CheckColumn({
		header: T_displayTab,
		width: 80,
		sortable: true,
		dataIndex: 'display_poi'
	});
	var chkColumn_fixPOI = new Ext.grid.CheckColumn({
		header: T_fix,
		width: 80,
		sortable: true,
		dataIndex: 'fix_poi'
	});
	var chkColumn_moderationPOI = new Ext.grid.CheckColumn({
		header: T_moderation,
		width: 80,
		sortable: true,
		dataIndex: 'moderation_poi'
	});
	var chkColumn_transmissionPOI = new Ext.grid.CheckColumn({
		header: T_transmission,
		width: 140,
		sortable: true,
		disabled:true,
		enabled:false,
		hidden: false,
		disabledCls:'disabled',
		dataIndex: 'transmission_poi'
	});
	var chkColumn_traiteparpolePOI = new Ext.grid.CheckColumn({
		id:'chkColumn_traiteparpolePOI',
		header: T_traiteparpole,
		width: 140,
		sortable: true,
		hidden: false,
		disabled:true,
		enabled:false,
		hidden: false,
		disabledCls:'disabled',
		dataIndex: 'traiteparpole_poi'
	});
	
	
	var comments = new Ext.grid.Column({
	    header: T_comments,
	    hidden: false,
	    dataIndex: 'num_comments',
	    width: 90,
	    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
	        if (value == 0) {
	            metaData.css = 'nophoto';
	            return value+' commentaire';
	        } else {
	            metaData.css = 'photo';
	            if (value == 1) {
	                return '<span ext:qtip="'+T_dblClickEditComment+'">'+value+' commentaire</span>';
	            } else {
	                return '<span ext:qtip="'+T_dblClickEditComment+'">'+value+' commentaires</span>';
	            }
	        }
	    }
	});
	comments.on('dblclick', function(columnIndex, grid, rowIndex, e) {
	    id = grid.getStore().getAt(rowIndex).get('id_poi');
	    valeur = grid.getStore().getAt(rowIndex).get('num_comments');

	    hiddenPOIComment = id;
	    if (valeur == 0) {
	        Ext.MessageBox.show({
	            title: T_careful,
	            msg: T_noComments,
	            buttons: Ext.MessageBox.OK,
	            icon: Ext.MessageBox.INFO
	        });
	    } else {
	        CommentsDataStore.setBaseParam('id_poi', id);
	        CommentsDataStore.load();
	        expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
	        expandCommentsWindow.show();
	    }

	});
	var commentStatusStore = new Ext.data.ArrayStore({
		fields: ['lib_comment_status'],
		data: [
			['Non modéré'],
			['Modéré accepté'],
			['Modéré refusé']
		]
	});
	
	var comboCommentStatusGrid = new Ext.form.ComboBox({
		fieldLabel: T_displayTab,
		store: commentStatusStore,
		displayField: 'lib_comment_status',
		valueField: 'lib_comment_status',
		forceSelection: true,
		mode: 'local',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: '',
		dataIndex: 'display_commentaires'
	});
//	var chkColumn_displayComments = new Ext.grid.CheckColumn({
//	    header: T_displayTab,
//	    width: 80,
//	    sortable: true,
//	    dataIndex: 'display_commentaires'
//	});
	
	
	
	var triPOIStore = new Ext.data.ArrayStore({
		fields: ['triname', 'displayname'],
		data: [
			['id', T_id],
			['lib', T_lib],
			['subcategory', T_subcategory]
		]
	});

	var comboTriPOI = new Ext.form.ComboBox({
		store: triPOIStore,
		displayField: 'displayname',
		typeAhead: true,
		mode: 'local',
		forceSelection: true,
		triggerAction: 'all',
		emptyText: T_sortBy,
		selectOnFocus: true,
		valueField: 'triname',
		listeners: {
			'select': function () {
				switch (this.getValue()) {
					case 'id':
						POIsDataStore.lastOptions.params.asc = 'id';
						POIsDataStore.setBaseParam('asc', 'id');
						POIsDataStore.reload();
						break;
					case 'lib':
						POIsDataStore.lastOptions.params.asc = 'lib';
						POIsDataStore.setBaseParam('asc', 'lib');
						POIsDataStore.reload();
						break;
					case 'subcategory':
						POIsDataStore.lastOptions.params.asc = 'subcategory';
						POIsDataStore.setBaseParam('asc', 'subcategory');
						POIsDataStore.reload();
						break;
				}
			}
		}
	});
	
	var moderatePOIButton = new Ext.grid.Column({
		header: T_moderate,
		dataIndex: 'latitude_poi', 
		width: 80,
		sortable: false,
		renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				switch (record.get('geolocatemode_poi')) {
					case 1:
						metaData.css = 'verygood';
						break;
					case 2:
						metaData.css = 'good';
						break;
					case 3:
						metaData.css = 'mid';
						break;
					case 4:
						metaData.css = 'bad';
						break;
					case 5:
						metaData.css = 'not';
						break;
					case 6:
						metaData.css = 'publicpoi';
						break;
					default:
						metaData.css = 'not';
				}
	            return '<button>'+T_moderate+'</button>';
			}
	});
	
	
	
	moderatePOIButton.on('click', function(columnIndex, grid, rowIndex, e) {
		expandWindow.show();
		id = grid.getStore().getAt(rowIndex).get('id_poi');
		var lastDateModif = grid.getStore().getAt(rowIndex).get('lastdatemodif_poi');
		if (grid.getStore().getAt(rowIndex).get('lastdatemodif_poi') == '0000-00-00'){
			lastDateModif = grid.getStore().getAt(rowIndex).get('datecreation_poi');
		}
	    expandWindow.setTitle(T_record+' n°'+id +', '+ T_lastModificationDate + ' : ' + lastDateModif);
		var lat = grid.getStore().getAt(rowIndex).get('latitude_poi');
		var lon = grid.getStore().getAt(rowIndex).get('longitude_poi');

	    var commune = grid.getStore().getAt(rowIndex).get('lib_commune');
	    var pole = grid.getStore().getAt(rowIndex).get('lib_pole');
	    var status = grid.getStore().getAt(rowIndex).get('lib_status');
	    var traiteparpole_poi = grid.getStore().getAt(rowIndex).get('traiteparpole_poi');
	    var transmission_poi = grid.getStore().getAt(rowIndex).get('transmission_poi');
	    var reponsecomcom = grid.getStore().getAt(rowIndex).get('reponse_collectivite_poi');
	    var reponsepole = grid.getStore().getAt(rowIndex).get('reponsepole_poi');
	    var obs = grid.getStore().getAt(rowIndex).get('observationterrain_poi');
	    var desc = grid.getStore().getAt(rowIndex).get('desc_poi');
	    var prop = grid.getStore().getAt(rowIndex).get('prop_poi');
	    var subcat = grid.getStore().getAt(rowIndex).get('lib_subcategory');
	    var rue = grid.getStore().getAt(rowIndex).get('rue_poi');
	    var num = grid.getStore().getAt(rowIndex).get('num_poi');
	    var prio = grid.getStore().getAt(rowIndex).get('lib_priorite');
	    var  nbrComments = grid.getStore().getAt(rowIndex).get('num_comments');
	    var modo = grid.getStore().getAt(rowIndex).get('moderation_poi');
        var disp = grid.getStore().getAt(rowIndex).get('display_poi');
        var commentfinal_poi = grid.getStore().getAt(rowIndex).get('commentfinal_poi');
        var email = grid.getStore().getAt(rowIndex).get('mail_poi');
	    if (nbrComments == 0) {
	    	buttonModerateComments.disable();
	    } else {
	    	buttonModerateComments.enable();
	    }
	    tof = grid.getStore().getAt(rowIndex).get('photo_poi');
	    if (tof == '') {
	        Ext.getCmp('observationImagePanel').update('Pas de photo associée');
	        
	    } else {
	        Ext.getCmp('observationImagePanel').update('<img style="height:100%;cursor: pointer;" onclick="window.open(\'resources/pictures/'+tof+'\')" src="resources/pictures/'+tof+'" />');
	        
	    }

		if ((lat == '') && (lon == '')) {
	        var uri = 'lib/php/admin/getDefaultConfigMap.php';
	        OpenLayers.loadURL(uri,'',this,setLatLonZoomDefault);
		} else {
			var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());

	        createFeature(lonlat.lon,lonlat.lat,commune,pole,status,traiteparpole_poi,transmission_poi,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs,commentfinal_poi, modo,disp,lastDateModif, email);
	        var lonlatwgs = lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
			latitudeField.setValue(lat);
			longitudeField.setValue(lon);
			expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 13);
		}
	});
	
	
	
	var geolocatemodePOI = new Ext.grid.Column({
	    header: T_modeGeoloc,
	    dataIndex: 'geolocatemode_poi',
	    width: 100,
	    hidden: true,
	    sortable: true,
	    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
	        switch (record.get('geolocatemode_poi')) {
	            case 1:
	                metaData.css = 'verygood';
	                return '<span style="color:gray">'+T_manual+'</span>';
	                break;
	            case 2:
	                metaData.css = 'good';
	                return '<span style="color:gray">'+T_GPS+'</span>';
	                break;
	            case 3:
	                metaData.css = 'bad';
	                return '<span style="color:gray">'+T_3G+'</span>';
	                break;
	        }
	        //return '<span ext:qtip="'+T_dblClickPos+'" style="color:gray">'+T_3G+'</span>';
	    }
	});

	
	//GESTION DES COMMENTAIRES ET PHOTOS SUPPLEMENTAIRES
	var CommentsDataStore = new Ext.data.Store({
	    id: 'CommentsDataStore',
	    proxy: new Ext.data.HttpProxy({
	        url: 'lib/php/admin/database.php',
	        method: 'POST'
	    }),
	    autoLoad: false,
	    baseParams: {task: 'LISTINGCOMMENTS'},
	    reader: new Ext.data.JsonReader({
	        root: 'results',
	        totalProperty: 'total',
	        id_poi: 'id'
	    }, [
	        {name: 'id_commentaires', type: 'int', mapping: 'id_commentaires'},
	        {name: 'text_commentaires', type: 'string', mapping: 'text_commentaires'},
	        {name: 'url_photo', type: 'string', mapping: 'url_photo'},
	        {name: 'mail_commentaires', type: 'string', mapping: 'mail_commentaires'},
	        {name: 'datecreation', type: 'string', mapping: 'datecreation'},
	        {name: 'display_commentaires', type: 'string'}
	    ])
	});
	//DEFINITION DES COLONNES POUR AFFICHAGE DANS FENETRE DE MODERATION DE COMMENTAIRES
	var idComments = new Ext.grid.Column({
	    header: '#',
	    dataIndex: 'id_commentaires',
	    width: 30,
	    sortable: true,
	    hidden: false,
	    readOnly: true
	});

	var textComments = new Ext.grid.Column({
	    header: T_text,
	    dataIndex: 'text_commentaires',
	    width: 200,
	    sortable: true,
	    hidden: false,
	    readOnly: false,
	    editor: new Ext.form.TextArea({
	        allowBlank: true,
	         maxLength: 500
	    }),
	    renderer: function(val) {
	        return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
	    }
	});
	var mailComments = new Ext.grid.Column({
	    header: T_email,
	    dataIndex: 'mail_commentaires',
	    width: 100,
	    sortable: true,
	    hidden: false,
	    readOnly: false,
	    editor: new Ext.form.TextField({
	        allowBlank: true,
	        maxLength: 200
	    }),
	    renderer: function(val) {
	        return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
	    }
	});

	var dateCreationComments = new Ext.grid.Column({
	    header: T_dateCreation,
	    dataIndex: 'datecreation',
	    width: 100,
	    sortable: true,
	    hidden: false,
	    readOnly: false,
	    editor: new Ext.form.TextField({
	        allowBlank: true,
	        maxLength: 200
	    }),
	    renderer: function(val) {
	        return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
	    }
	});
	var photoComments = new Ext.grid.Column({
	    header: T_photos,
	    dataIndex: 'url_photo',
	    width: 300,
	    sortable: true,
	    hidden: false,
	    readOnly: false,
	    editor: new Ext.form.TextArea({
	      allowBlank: true,
	      maxLength: 500
	  }),
	    renderer: function(val) {
	    	console.debug('photoComments val = ' + val)
	    	if (val != ''){
	    		return '<span ext:qtip=""><img height="250" src="./resources/pictures/'+val+'" onclick="window.open(\'./resources/pictures/'+val+'\',\'_blank\')"></span>';
	        }
	    	return ''
	    }
	});
	var hiddenPOIComment;
	
	var optionsExpandMap = {
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
			maxResolution: 156543.0339,
			maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
		};
		var expandMap = new OpenLayers.Map(optionsExpandMap);

			expandMap.setBaseLayer(adminMapForPoi);
			expandMap.addLayer(adminMapForPoi);


		var expandMapPanel = new GeoExt.MapPanel({
			id:'expandMapPanel',
			width:700,
			map: expandMap
		});
		var latitudeField = new Ext.form.NumberField({
		    id: 'latitude',
		    name: 'latitude',
		    allowNegative: true,
		    allowDecimals: true,
		    decimalSeparator: '.',
		    decimalPrecision: 20,
		    disabled: false,
		    width:60
		});

		latitudeField.on('change', function() {
		    var lonlat = new OpenLayers.LonLat(longitudeField.getValue(), latitudeField.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
		    expandMap.setCenter(lonlat, expandMap.getZoom());
		    vectorsInModerationMap.removeAllFeatures();
		    createFeature(lonlat.lon,lonlat.lat);
		});

		var longitudeField = new Ext.form.NumberField({
		    id: 'longitude',
		    name: 'longitude',
		    allowNegative: true,
		    allowDecimals: true,
		    decimalSeparator: '.',
		    decimalPrecision: 20,
		    disabled: false,
		    width:60
		});
		longitudeField.on('change', function() {
		    var lonlat = new OpenLayers.LonLat(longitudeField.getValue(), latitudeField.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
		    expandMap.setCenter(lonlat, expandMap.getZoom());
		    vectorsInModerationMap.removeAllFeatures();
		    createFeature(lonlat.lon,lonlat.lat);
		});
		
		var vectorsInModerationMap = new OpenLayers.Layer.Vector(T_record,{
			visibility: true,
			displayInLayerSwitcher: true
		});
		expandMap.addLayer(vectorsInModerationMap);
		
		function setLatLonZoomDefault(response) {
		    var json = eval('('+response.responseText+')');
		    var lat = json.configmap[0].lat;
		    var lon = json.configmap[0].lon;
		    var zoom = json.configmap[0].zoom;
		    var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
		    createFeature(lonlat.lon,lonlat.lat);
		    var lonlatwgs = lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		    latitudeField.setValue(lat);
		    longitudeField.setValue(lon);
		    expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), zoom);
		}
		
		function writePOICsv(){
		    Ext.Ajax.request({
		        url: 'lib/php/admin/writeCsv.php?type=poi',
		        success: function (response) {
		            var res = Ext.util.JSON.decode(response.responseText);
		            if (res.success == true){
		                Ext.Msg.buttonText.cancel = T_close;
		                Ext.Msg.show({
		                    title: T_download,
		                    msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvPOI+'</div></a>',
		                    buttons: Ext.Msg.CANCEL,
		                    icon: Ext.Msg.INFO,
		                    minWidth: 300
		                });
		            } else {
		                Ext.Msg.show({
		                    title: T_pb,
		                    msg: '<div style="color:#000000">'+T_pbCsv+'</div>',
		                    buttons: Ext.Msg.OK,
		                    icon: Ext.Msg.WARNING,
		                    minWidth: 300
		                });
		            }
		        }
		    });
		}
		
		//moderation window used in poix.js
		var observationImagePanel = new Ext.Panel({
			id:"observationImagePanel",
			html: T_noPhoto
				});
		
		
function createFeature(X,Y,com,pole,status,traite,transmission,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs,commentfinal_poi, modo,disp,lastDateModif,email) {
	console.log("Status " + status);    
	CommunePOIField.setValue(com);
	    PolePOIField.setValue(pole);
	    StatusPOIField.setValue(status);
	    TraitePolePOIField.setValue(traite);
	    TransmissionPolePOIField.setValue(transmission);
	    RespComcomPOIField.setValue(reponsecomcom);
	    RespPolePOIField.setValue(reponsepole);
	    DescPOIField.setValue(desc);
	    PropPOIField.setValue(prop);
	    SubCategoryPOIField.setValue(subcat);
	    RuePOIField.setValue(rue);
	    NumPOIField.setValue(num);
	    PrioritePOIField.setValue(prio);
	    ObsPOIField.setValue(obs);
	    ModerationPOIField.setValue(modo);
	    DisplayPOIField.setValue(disp);
	    emailPOIField.setValue(email);
	    
		var point = new OpenLayers.Geometry.Point(X,Y);  
		var feat = new OpenLayers.Feature.Vector(point, null, 
			{
				strokeColor: "#ff0000", 
	            strokeOpacity: 0.8,
	            fillColor : "#ff0000",
	            fillOpacity: 0.4,
	            pointRadius : 8
			}
		);
		vectorsInModerationMap.addFeatures([feat]);
	}
		
		var validButton = new Ext.Button({
			iconCls: 'silk_tick',
			text: T_save,
			handler: function() {
				console.log('validButton.clicked for id = ' + id);
				Ext.Ajax.request({   
					waitMsg: T_pleaseWait,
					url: 'lib/php/admin/database.php',
					params: {
						task: "UPDATEPOI",
		                id_poi: id,
		                latitude_poi: latitudeField.getValue(),
		                longitude_poi: longitudeField.getValue(),
		                reponse_collectivite_poi: RespComcomPOIField.getValue(),
		                reponsepole_poi: RespPolePOIField.getValue(),
		                commune_id_commune: CommunePOIField.getValue(),
		                pole_id_pole: PolePOIField.getValue(),
		                status_id_status: StatusPOIField.getValue(),
		                desc_poi: DescPOIField.getValue(),
		                prop_poi: PropPOIField.getValue(),
		                rue_poi: RuePOIField.getValue(),
		                num_poi: NumPOIField.getValue(),
		                priorite_id_priorite: PrioritePOIField.getValue(),
		                observationterrain_poi: ObsPOIField.getValue(),
		                subcategory_id_subcategory: SubCategoryPOIField.getValue(),
		                commentfinal_poi: CommentFinalPOIField.getValue(),
		                moderation_poi: ModerationPOIField.getValue(),
		                display_poi: DisplayPOIField.getValue(),
		                reponsepole_poi: RespPolePOIField.getValue(),
		                traiteparpole_poi: TraitePolePOIField.getValue(),
		                transmission_poi : TransmissionPolePOIField.getValue()
					}, 
					success: function(response) {            
						var result = eval(response.responseText);
						console.log('validButton.clicked success with result = ' + result);
						switch(result){
		                case 1:
		                	POIsDataStore.reload();
		                    expandWindow.hide();
		                    POIListingEditorGrid.selModel.clearSelections();
		                    break;
		                case 2:
		                	Ext.MessageBox.alert(T_success,T_no_modification_on_data);
		                	expandWindow.hide();
		                    break;
		                case 4:
		                	POIsDataStore.reload();
		                    expandWindow.hide();
		                    POIListingEditorGrid.selModel.clearSelections();
		                    break;
		                case 10:
		                	Ext.MessageBox.show({
		                        title: T_careful,
		                        msg: T_errorUpdateObservationNeedFinalComment,
		                        buttons: Ext.MessageBox.OK,
		                        icon: Ext.MessageBox.INFO
		                    });
		                	break;
		                case 11:
		                	Ext.MessageBox.show({
		                        title: T_careful,
		                        msg: T_errorUpdateObservationNeedFinalCommentTwin,
		                        buttons: Ext.MessageBox.OK,
		                        icon: Ext.MessageBox.INFO
		                    });
		                	break;
		                default:
		                	Ext.MessageBox.show({
		                        title: T_careful,
		                        msg: T_errorUpdateObservationWIthoutExplanation,
		                        buttons: Ext.MessageBox.OK,
		                        icon: Ext.MessageBox.INFO
		                    });
		                	break;
		                		
		            }        
					},
					failure: function(response) {
						
						idEdit = '';
						var result = response.responseText;
						console.log('validButton.clicked failure with result = ' + result);
						Ext.MessageBox.alert(T_error, T_badConnect);          
					}
				});
			}
		});


		var resetButton = new Ext.Button({
			iconCls: 'silk_cancel',
			text: T_cancel,
			handler: function() {
		        idEdit = '';
				expandWindow.hide();
			}
		});
		var sendMailButton = new Ext.Button({
			iconCls: 'silk_email',
			text: '',
			handler: function() {
				var subject = '['+T_applicationName+'] Precisions observation ' + id;
				var body = 'Bonjour, Vous avez enregistre l\'observation numero ';
				body += window.location.href.substring(0,window.location.href.lastIndexOf('/')) +'/index.php?id=' + id+'';
				
				window.location = 'mailto:'+emailPOIField.getValue()+'?subject='+subject+'&body='+body;
			}
		});
		var expandWindow = new Ext.Window({
		    title: T_record,
		    height: 600,
		    width: 975,
		    layout:'table',
		    layoutConfig: {columns:2},
		    defaults: {frame:true, height: 400},
		    modal: true,
		    maximizable: true,
		    items: [expandMapPanel,observationImagePanel],
		    iconCls: 'silk_map',
		    closeAction: 'hide',
		    bbar : {
		        xtype : 'container',
		        layout : {
		            type : 'vbox',
		            pack  : 'start',
		            align : 'stretch'
		        },
		        height : 225,
		        defaults : { flex : 1 },
		        items : [
		            new Ext.Toolbar({
		                height: 25,
		                items : ['Rue:',RuePOIField,'Repère:',NumPOIField,'Priorité:',PrioritePOIField,'Catégorie:',SubCategoryPOIField]
		            }),
		            new Ext.Toolbar({
		                height: 75,
		                items : [' Observation terrain:',ObsPOIField,'Description:',DescPOIField,'Proposition:',PropPOIField]
		            }),
		            new Ext.Toolbar({
		                height: 75,
		                items : ['Réponse de la collectivité:',RespComcomPOIField,'Réponse du pôle:',RespPolePOIField,'Commentaire final:',CommentFinalPOIField]
		            }),
		            new Ext.Toolbar({
		                height: 25,
		                items : ['Commune:',CommunePOIField,'Pole:',PolePOIField,'Statut:',StatusPOIField,buttonModerateComments]
		            }),
		            new Ext.Toolbar({
		                height: 25,
		                items : ['Lat :', latitudeField, ' ', 'Long :', longitudeField,' ', 'Modération :', ModerationPOIField, 'Affichage :', DisplayPOIField,'Traité par pole:',TraitePolePOIField,'Transmission au pole', TransmissionPolePOIField,'->', emailPOIField,sendMailButton,' ',validButton, ' ', resetButton]
		            })
		        ]
		    }
		});
		expandWindow.on('hide', function() {
		    vectorsInModerationMap.removeAllFeatures();
		});
		var photoPOI = new Ext.grid.Column({
			header: T_picture, 
			dataIndex: 'photo_poi', 
			width: 150,
			hidden: false,
			readOnly: true,
			renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				if (value != '') {
					metaData.css = 'photo';
				} else {
					metaData.css = 'nophoto';
				}
				if (value == '') {
					return '<span ext:qtip="'+T_dblClickAddPicture+'" style="color:gray">'+T_noPhoto+'</span>';
				} else {
					return '<span ext:qtip="'+T_dblClickShowPicture+'" style="color:gray">'+T_okPhoto+'</span>';
				}
			}
		});

		photoPOI.on('dblclick', function(columnIndex, grid, rowIndex, e, record){
			e.preventDefault();
			idPOI = grid.getStore().getAt(rowIndex).get('id_poi');

			if (grid.getStore().getAt(rowIndex).get('photo_poi') != ''){

				hiddenIdPOI.setValue(idPOI);
				var srcimg = 'resources/pictures/'+grid.getStore().getAt(rowIndex).get('photo_poi');
				var el = Ext.get('photo');

				var img = new Image();
				img.src = 'resources/pictures/'+grid.getStore().getAt(rowIndex).get('photo_poi');

				if (img.height == 0) {
					var temp = grid.getStore().getAt(rowIndex).get('photo_poi');
					var size = temp.split('x');
					var largeur = size[0];
					var hauteur = size[1];
					img.height = hauteur;
				}

				if (img.height > 350) { 
					el.set({height: 350});
					PhotoPOIModifSuppWindow.setHeight(500);
				} else {
					el.set({height: img.height});
					var ht = img.height+140;
					PhotoPOIModifSuppWindow.setHeight(ht);
				}
				el.set({src: srcimg});

				if (!PhotoPOIModifSuppWindow.isVisible()) { 
					PhotoPOIModifSuppWindow.show();
				} else { 
					PhotoPOIModifSuppWindow.toFront();
				}
			}
//			else {
//		        hiddenIdPOI2.setValue(idPOI);
//		        if (!PhotoPOICreateWindow.isVisible()) {
//		            PhotoPOICreateWindow.show();
//		        } else {
//		            PhotoPOICreateWindow.toFront();
//		        }
//		    }
		});
		
		function confirmDeletePOIs() {
		    if(POIListingEditorGrid.selModel.getCount() == 1){
		        Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deletePOIs);
		    } else if(POIListingEditorGrid.selModel.getCount() > 1){
		        Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deletePOIs);
		    } else {
		        Ext.MessageBox.show({
		            title: 'Uh oh...',
		            msg: T_cannotDeleteNothing,
		            buttons: Ext.MessageBox.OK,
		            icon: Ext.MessageBox.INFO
		        });
		    }
		}

		function deletePOIs(btn) {
		    if (btn == 'yes') {
		        var selections = POIListingEditorGrid.selModel.getSelections();
		        var poiz = [];
		        for (i = 0; i< POIListingEditorGrid.selModel.getCount(); i++) {
		            poiz.push(selections[i].json.id_poi);
		        }
		        var encoded_array = Ext.encode(poiz);
		        Ext.get('update').show();
		        Ext.Ajax.request({
		            waitMsg: T_pleaseWait,
		            url: 'lib/php/admin/database.php',
		            params: {
		                task: "DELETEPOI",
		                ids: encoded_array
		            },
		            success: function(response) {
		                var result = eval(response.responseText);
		                switch(result){
		                    case 1:
		                        POIsDataStore.reload();
		                        BasketsDataStore.reload();
		                        //refreshTreeNode();
		                        break;
		                    case 2:
		                        Ext.MessageBox.show({
		                            title: T_careful,
		                            msg: T_cannotDeleteSelection,
		                            buttons: Ext.MessageBox.OK,
		                            icon: Ext.MessageBox.ERROR
		                        });
		                        POIListingEditorGrid.selModel.clearSelections();
		                        break;
		                    default:
		                        Ext.MessageBox.show({
		                            title: T_careful,
		                            msg: T_cannotDeleteSelection,
		                            buttons: Ext.MessageBox.OK,
		                            icon: Ext.MessageBox.ERROR
		                        });
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
		        POIListingEditorGrid.selModel.clearSelections();
		    }
		}

		function resetPOIForm() {
		    POICreateForm.getForm().reset();
		    subCategoryPOIList2.load();
		}
