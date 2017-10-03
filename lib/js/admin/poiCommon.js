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
    fieldLabel: T_priorite,
    store: PrioritePOIList2,
    displayField: 'lib_priorite',
    valueField: 'id_priorite',
    forceSelection: true,
    editable: false,
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
    editable: false,
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
    editable: false,
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
	readOnly: true
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
		editable: false,
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
	    	return '<span ext:qtip=""><img height="250" src="./resources/pictures/'+val+'" onclick="window.open(\'./resources/pictures/'+val+'\',\'_blank\')"></span>';
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
		var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap Mapnik", "http://tile.openstreetmap.org/${z}/${x}/${y}.png",
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