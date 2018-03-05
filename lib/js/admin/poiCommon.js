var limitPOIPerPage = 100;
var alreadyShowExpandWindowGetParameter = 0;

var PrioritePOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getPriorite.php',
    root: 'priorite',
    fields: [
        {name: 'id_priorite'},
        {name: 'lib_priorite'}
    ]
});

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

var StatusPOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getStatus.php',
    root: 'status',
    fields: [
        {name: 'id_status'},
        {name: 'lib_status'}
    ]
});

var TraitePolePOIField = new Ext.form.Checkbox({
    checked: false,
    allowBlank: true,
    name: 'traiteparpole_poi'
});

var TransmissionPolePOIField = new Ext.form.Checkbox({
    checked: false,
    allowBlank: true,
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



var StatusPOIField = new Ext.form.ComboBox({
    id:'StatusPOIField',
    fieldLabel: T_status,
    store: StatusPOIList2,
    displayField: 'lib_status',
    valueField: 'id_status',
    forceSelection: true,
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
    fieldLabel: "blabla",
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

var ObsPOIField = new Ext.form.TextField({
    id: 'ObsPOIField',
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var NumPOIField = new Ext.form.TextField({
    id: 'NumPOIField',
    fieldLabel: T_numRecord,
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: false
});

var RefPOIField = new Ext.form.TextField({
    id: 'RefPOIField',
    fieldLabel: T_reference,
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: true
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
    header: T_moderation,
    width: 80,
    sortable: true,
    dataIndex: 'moderation_poi'
});

var DisplayPOIField = new Ext.form.Checkbox({
    header: T_display,
    width: 80,
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
    anchor : '95%',
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
	

	var prioritePOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getPriorite.php',
	  root: 'priorite',
	  fields: [
	    {name: 'id_priorite'},
	    {name: 'lib_priorite'}
	  ]
	});

	var comboPrioritePOI = new Ext.form.ComboBox({
		fieldLabel: T_priorite,
		store: prioritePOIList,
		displayField: 'lib_priorite',
		valueField: 'id_priorite',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: ''
	});

	var statusPOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getStatus.php',
	  root: 'status',
	  fields: [
	    {name: 'id_status'},
	    {name: 'lib_status'}
	  ]
	});

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
			{ name: 'ref_poi', type: 'string', mapping: 'ref_poi'},
	        { name: 'lib_poi', type: 'string', mapping: 'lib_poi'},
			{ name: 'adherent_poi', type: 'string', mapping: 'adherent_poi'},
			{ name: 'adherentfirstname_poi', type: 'string', mapping: 'adherentfirstname_poi'},
	        { name: 'num_poi', type: 'string', mapping: 'num_poi'},
	        { name: 'rue_poi', type: 'string', mapping: 'rue_poi'},
	        { name: 'communename_poi', type: 'string', mapping: 'communename_poi'},
	        { name: 'tel_poi', type: 'string', mapping: 'tel_poi'},
	        { name: 'mail_poi', type: 'string', mapping: 'mail_poi'},
	        { name: 'desc_poi', type: 'string', mapping: 'desc_poi'},
	        { name: 'prop_poi', type: 'string', mapping: 'prop_poi'},
	        { name: 'observationterrain_poi', type: 'string', mapping: 'observationterrain_poi'},
	        { name: 'reponsegrandtoulouse_poi', type: 'string', mapping: 'reponsegrandtoulouse_poi'},
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
	        { name: 'traiteparpole_poi', type: 'timestamp', mapping: 'traiteparpole_poi'},
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
	                    expandWindow.setTitle(id + " " + this.getAt(indexEdit).json['lib_subcategory'] + ', '+ T_lastModificationDate + ' : ' + dateLastModif + " - " + this.getAt(indexEdit).json['ref_poi']);
	                    expandWindow.show();

	                    var commune = this.getAt(indexEdit).json['lib_commune'];
	                    var pole = this.getAt(indexEdit).json['lib_pole'];
	                    var status = this.getAt(indexEdit).json['lib_status'];
	                    var reponsecomcom = this.getAt(indexEdit).json['reponsegrandtoulouse_poi'];
	                    var reponsepole = this.getAt(indexEdit).json['reponsepole_poi'];
	                    var desc = this.getAt(indexEdit).json['desc_poi'];
	                    var prop = this.getAt(indexEdit).json['prop_poi'];
	                    var subcat = this.getAt(indexEdit).json['lib_subcategory'];
	                    var rue = this.getAt(indexEdit).json['rue_poi'];
						var num = this.getAt(indexEdit).json['num_poi'];
						var ref = this.getAt(indexEdit).json['ref_poi'];
	                    var prio = this.getAt(indexEdit).json['lib_priorite'];
	                    var obs = this.getAt(indexEdit).json['observationterrain_poi'];
	                    var comment = this.getAt(indexEdit).json['commentfinal_poi'];
	                    var modo = this.getAt(indexEdit).json['moderation_poi'];
	                    var disp = this.getAt(indexEdit).json['display_poi'];
	                    var lastDateModif = this.getAt(indexEdit).json['lastdatemodif_poi'];
	                    var  nbrComments = this.getAt(indexEdit).json['num_comments'];
	                    
	                    console.debug(id + ' est lié à '+nbrComments + ' commentaires');
	                    if (nbrComments == 0) {
	                    	buttonModerateComments.disable();
	                    } else {
	                    	buttonModerateComments.enable();
	                    }
	                    tof = this.getAt(indexEdit).json['photo_poi'];
	                    if (tof == null) {
	                        buttonPhotoPOI.setText(T_noImage);
	                        buttonPhotoPOI.disable();
	                    } else {
	                        buttonPhotoPOI.setText(T_image);
	                        buttonPhotoPOI.enable();
	                    }

	                    var lat = this.getAt(indexEdit).json['latitude_poi'];
	                    var lon = this.getAt(indexEdit).json['longitude_poi'];

	                    var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
	                    createFeature(lonlat.lon,lonlat.lat,commune,pole,status,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs,comment, modo,disp,lastDateModif);

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
	var chkColumn_moderationPOI = new Ext.grid.Column({
		header: T_moderation,
		dataIndex: 'moderation_poi',
		width: 80,
		sortable: true,
		hidden: false,
		readOnly: true,
		renderer: function(value, metaData, record, rowIndex, colIndex, store) {
		        return (record.get('moderation_poi') ? '<span class="verygood">oui</span>': '<span class="not">non</span>');
		    }
		});
	var chkColumn_transmissionPOI = new Ext.grid.CheckColumn({
		header: T_transmission,
		width: 140,
		sortable: true,
		hidden: true,
		dataIndex: 'transmission_poi'
	});
	var chkColumn_traiteparpolePOI = new Ext.grid.CheckColumn({
		header: T_traiteparpole,
		width: 140,
		sortable: true,
		hidden: false,
		dataIndex: 'traiteparpole_poi'
	});
	var chkColumn_displayComments = new Ext.grid.CheckColumn({
	    header: T_displayTab,
	    width: 80,
	    sortable: true,
	    dataIndex: 'display_commentaires'
	});
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

	var printPOIButton = new Ext.grid.Column({
		header: T_print,
		dataIndex: 'id_poi', 
		width: 80,
		sortable: false,
		renderer: function(value, metaData, record, rowIndex, colIndex, store) {
			return '<button>'+T_print+'</button>';
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
	        {name: 'display_commentaires', type: 'bool'}
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
		var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "https://tile.openstreetmap.org/${z}/${x}/${y}.png",
			{'sphericalMercator': true, isBaseLayer:true}
		);
		var osmcyclemap = new OpenLayers.Layer.OSM("OpenCycleMap",
		        ['https://tile.thunderforest.com/cycle/${z}/${x}/${y}.png?apikey='+ TF_key],
		    {
		        'sphericalMercator': true,
		        isBaseLayer: true,
		        'attribution': 'Maps © <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>, Data © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap contributors</a>'
		    }
		);
		var hikebike = new OpenLayers.Layer.OSM("OpenStreetMap Hikebike", "http://toolserver.org/tiles/hikebike/${z}/${x}/${y}.png");

		expandMap.addLayers([osmcyclemap, hikebike, mapnik]);
		expandMap.setBaseLayer(mapnik);

		var expandMapPanel = new GeoExt.MapPanel({
			map: expandMap
		});
		var latitudeField = new Ext.form.NumberField({
		    id: 'latitude',
		    name: 'latitude',
		    allowNegative: true,
		    allowDecimals: true,
		    decimalSeparator: '.',
		    decimalPrecision: 20,
		    disabled: false
		});

		latitudeField.on('change', function() {
		    var lonlat = new OpenLayers.LonLat(longitudeField.getValue(), latitudeField.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
		    expandMap.setCenter(lonlat, expandMap.getZoom());
		    vectors.removeAllFeatures();
		    createFeature(lonlat.lon,lonlat.lat);
		});

		var longitudeField = new Ext.form.NumberField({
		    id: 'longitude',
		    name: 'longitude',
		    allowNegative: true,
		    allowDecimals: true,
		    decimalSeparator: '.',
		    decimalPrecision: 20,
		    disabled: false
		});
		longitudeField.on('change', function() {
		    var lonlat = new OpenLayers.LonLat(longitudeField.getValue(), latitudeField.getValue()).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
		    expandMap.setCenter(lonlat, expandMap.getZoom());
		    vectors.removeAllFeatures();
		    createFeature(lonlat.lon,lonlat.lat);
		});
		
		var vectors = new OpenLayers.Layer.Vector(T_record,{
			visibility: true,
			displayInLayerSwitcher: true
		});
		expandMap.addLayer(vectors);
		
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
