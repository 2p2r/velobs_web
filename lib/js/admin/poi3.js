var limitPOIPerPage = 200;

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
    disabled: true
});

var subCategoryPOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getSubCategory.php',
    root: 'subcategory',
    fields: [
        {name: 'id_subcategory'},
        {name: 'lib_subcategory'}
    ]
});

var SubCategoryPOIField = new Ext.form.ComboBox({
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
    disabled: true
});

var CommunePOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getCommune.php',
    root: 'commune',
    fields: [
        {name: 'id_commune'},
        {name: 'lib_commune'}
    ]
});

var CommunePOIField = new Ext.form.ComboBox({
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
    emptyText: '',
    disabled: true
});

var PolePOIList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getPole.php',
    root: 'pole',
    fields: [
        {name: 'id_pole'},
        {name: 'lib_pole'}
    ]
});

var PolePOIField = new Ext.form.ComboBox({
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
    emptyText: '',
    disabled: true
});

var TraitePolePOIField = new Ext.form.Checkbox({
    checked: false,
    allowBlank: true,
    name: 'traiteparpole_poi'
});

var RespComcomPOIField = new Ext.form.TextArea({
    id: 'RespComcomPOIField',
    fieldLabel: T_reponseGrandToulouse,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: true
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

var DescPOIField = new Ext.form.TextArea({
    id: 'DescPOIField',
    fieldLabel: T_desc,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: true
});

var PropPOIField = new Ext.form.TextArea({
    id: 'PropPOIField',
    fieldLabel: T_proposition,
    maxLength: 500,
    height: 70,
    width: 250,
    allowBlank: true,
    anchor : '95%',
    disabled: true
});

var RuePOIField = new Ext.form.TextField({
    id: 'RuePOIField',
    fieldLabel: T_rueRecord,
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: true
});

var ObsPOIField = new Ext.form.TextField({
    id: 'ObsPOIField',
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: true
});

var NumPOIField = new Ext.form.TextField({
    id: 'NumPOIField',
    fieldLabel: T_numRecord,
    maxLength: 100,
    allowBlank: true,
    anchor : '95%',
    disabled: true
});

var alreadyShowExpandWindowGetParameter = 0;
var POIsDataStore = new Ext.data.Store({
	id: 'POIsDataStore',
    remoteSort: true,
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGPOIPOLECOM'},
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
			{ name: 'reponsegrandtoulouse_poi', type: 'string', mapping: 'reponsegrandtoulouse_poi'},
			{ name: 'reponsepole_poi', type: 'string', mapping: 'reponsepole_poi'},
			{ name: 'commentfinal_poi', type: 'string', mapping: 'commentfinal_poi'},
			{ name: 'display_poi', type: 'bool'},
			{ name: 'transmission_poi', type: 'bool'},
			{ name: 'latitude_poi', type: 'string', mapping: 'latitude_poi'},
			{ name: 'longitude_poi', type: 'string', mapping: 'longitude_poi'},
			{ name: 'geolocatemode_poi', type: 'int', mapping: 'geolocatemode_poi'},
			{ name: 'photo_poi', type: 'string', mapping: 'photo_poi'},
			{ name: 'datecreation_poi', type: 'timestamp', mapping: 'datecreation_poi'},
			{ name: 'datefix_poi', type: 'timestamp', mapping: 'datefix_poi'},
			{ name: 'fix_poi', type: 'bool'},
			{ name: 'traiteparpole_poi', type: 'bool'},
			{ name: 'moderation_poi', type: 'bool'},
			{ name: 'lib_subcategory', type: 'string', mapping: 'lib_subcategory'},
			{ name: 'lib_commune', type: 'string', mapping: 'lib_commune'},
			{ name: 'lib_pole', type: 'string', mapping: 'lib_pole'},
			{ name: 'lib_quartier', type: 'string', mapping: 'lib_quartier'},
			{ name: 'lib_priorite', type: 'string', mapping: 'lib_priorite'},
            { name: 'num_comments', type: 'int', mapping: 'num_comments'},
            { name: 'num_photos', type: 'int', mapping: 'num_photos'}
	]),
    listeners: {
        load: function() {
            if (noIdParam != -1) {
                if (idEdit != '' && idEdit != undefined && alreadyShowExpandWindowGetParameter == 0) {
                    var indexEdit = this.find('id_poi',idEdit);

                    alreadyShowExpandWindowGetParameter = 1;
                    id = idEdit;

                    expandWindow.setTitle(T_record+' n°'+id);
                    expandWindow.show();

                    var reponsecomcom = this.getAt(indexEdit).json['reponsegrandtoulouse_poi'];
                    var commune = this.getAt(indexEdit).json['lib_commune'];
                    var reponsepole = this.getAt(indexEdit).json['reponsepole_poi'];
                    var pole = this.getAt(indexEdit).json['lib_pole'];
                    var desc = this.getAt(indexEdit).json['desc_poi'];
                    var prop = this.getAt(indexEdit).json['prop_poi'];
                    var subcat = this.getAt(indexEdit).json['lib_subcategory'];
                    var rue = this.getAt(indexEdit).json['rue_poi'];
                    var num = this.getAt(indexEdit).json['num_poi'];
                    var prio = this.getAt(indexEdit).json['lib_priorite'];
                    var obs = this.getAt(indexEdit).json['observationterrain_poi'];
                    var traite = this.getAt(indexEdit).json['traiteparpole_poi'];

                    tof = this.getAt(indexEdit).json['photo_poi'];
                    if (tof == null) {
                        button.setText(T_noImage);
                        button.disable();
                    } else {
                        button.setText(T_image);
                        button.enable();
                    }

                    var lat = this.getAt(indexEdit).json['latitude_poi'];
                    var lon = this.getAt(indexEdit).json['longitude_poi'];

                    var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
                    createFeature(lonlat.lon,lonlat.lat,commune,pole,traite,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs);

                    latitudeField.setValue(this.getAt(indexEdit).json['latitude_poi']);
                    longitudeField.setValue(this.getAt(indexEdit).json['longitude_poi']);

                    expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 13);
                }
            }
        }
    }
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

var chkColumn_displayPOI = new Ext.grid.CheckColumn({
	header: T_displayTab,
	width: 80,
	sortable: true,
	dataIndex: 'display_poi'
});
chkColumn_displayPOI.on('click', saveThePOI2);

var chkColumn_fixPOI = new Ext.grid.CheckColumn({
	header: T_fix,
	width: 80,
	sortable: true,
	dataIndex: 'fix_poi'
});
chkColumn_fixPOI.on('click', saveThePOI3);

var chkColumn_moderationPOI = new Ext.grid.CheckColumn({
	header: T_moderation,
	width: 80,
	sortable: true,
	dataIndex: 'moderation_poi'
});
chkColumn_moderationPOI.on('click', saveThePOI4);

var chkColumn_transmissionPOI = new Ext.grid.CheckColumn({
	header: T_transmission,
	width: 140,
	sortable: true,
	hidden: true,
	dataIndex: 'transmission_poi'
});
chkColumn_transmissionPOI.on('click', saveThePOI5);

var chkColumn_traiteparpolePOI = new Ext.grid.CheckColumn({
	header: T_traiteparpole,
	width: 140,
	sortable: true,
	hidden: false,
	dataIndex: 'traiteparpole_poi'
});
chkColumn_traiteparpolePOI.on('click', saveThePOI6);

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
			return '<span style="color:gray">'+T_noPhoto+'</span>';
		} else {
			return '<span ext:qtip="'+T_dblClickShowPicture+'" style="color:gray">'+T_okPhoto+'</span>';
		}
	}
});
var idPOI; // <== need for photo
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
});

var PhotoPOIModifSuppForm = new Ext.form.FormPanel({
	id: 'PhotoPOIModifSuppForm',
	fileUpload: true,
	frame: true,
	autoScroll: true,
	bodyStyle: 'padding: 5px',
	labelWidth: 50,
	defaults: {
		anchor: '95%',
		allowBlank: false,
		msgTarget: 'side'
	},
	items: [hiddenIdPOI,
		{
			html: "<center><img id='photo' height='350' src='resources/images/logo_blank.png'/></center><br/>"
    	}
	],
	buttons: [
		{
			text: T_close,
			handler: function() {
				PhotoPOIModifSuppWindow.hide();
				POIListingEditorGrid.selModel.clearSelections();
			}
	}]
});

var PhotoPOIModifSuppWindow = new Ext.Window({
	id: 'PhotoPOIModifSuppWindow',
	iconCls: 'silk_image',
	title: T_image,
	closable: false,
	border: false,
	width: 640,
	height: 500,
	plain: true,
	layout: 'fit',
	modal: true,
	items: PhotoPOIModifSuppForm
});

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
        {name: 'display_commentaires', type: 'bool'}
    ])
});

var idComments = new Ext.grid.Column({
    header: '#',
    dataIndex: 'id_commentaires',
    width: 50,
    sortable: true,
    hidden: false,
    readOnly: true
});

var textComments = new Ext.grid.Column({
    header: T_text,
    dataIndex: 'text_commentaires',
    width: 590,
    sortable: true,
    hidden: false,
    readOnly: true,
    renderer: function(val) {
        return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
    }
});

var hiddenPOIComment;
var CommentsPOIColumnModel = new Ext.grid.ColumnModel(
    [idComments, textComments]
);
CommentsPOIColumnModel.defaultSortable = true;

var CommentsPOIListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'CommentsPOIListingEditorGrid',
    store: CommentsDataStore,
    cm: CommentsPOIColumnModel,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 50,
        store: CommentsDataStore,
        displayInfo: true
    })
});

var expandCommentsWindow = new Ext.Window({
    title: T_comments,
    height: 480,
    width: 640,
    layout: 'fit',
    modal: true,
    maximizable: false,
    items: CommentsPOIListingEditorGrid,
    iconCls: 'silk_comment',
    closable: false,
    buttons: [
        {
            text: T_close,
            handler: function() {
                expandCommentsWindow.hide();
            }
        }
    ]
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
                return '<span ext:qtip="'+T_dblClickViewComment+'">'+value+' commentaire</span>';
            } else {
                return '<span ext:qtip="'+T_dblClickViewComment+'">'+value+' commentaires</span>';
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
            msg: T_noCommentsCom,
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

var PhotosDataStore = new Ext.data.Store({
    id: 'PhotosDataStore',
    proxy: new Ext.data.HttpProxy({
        url: 'lib/php/admin/database.php',
        method: 'POST'
    }),
    autoLoad: false,
    baseParams: {task: 'LISTINGPHOTOSCOM'},
    reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id_poi: 'id'
    }, [
        {name: 'id_photos', type: 'int', mapping: 'id_photos'},
        {name: 'url_photos', type: 'string', mapping: 'url_photos'}
    ])
});

var idPhotos = new Ext.grid.Column({
    header: '#',
    dataIndex: 'id_photos',
    width: 50,
    sortable: true,
    hidden: false,
    readOnly: true
});

var urlPhotos = new Ext.grid.Column({
    header: T_photo,
    dataIndex: 'url_photos',
    width: 500,
    sortable: true,
    hidden: false,
    align: 'center',
    readOnly: false,
    editor: new Ext.form.TextArea({
        allowBlank: true,
        maxLength: 500
    }),
    renderer: function(val) {
        return '<span ext:qtip=""><img height="250" src="./resources/pictures/'+val+'" onclick="window.open(\'./resources/pictures/'+val+'\',\'_blank\')"></span>';
    }
});

var PhotosPOIColumnModel = new Ext.grid.ColumnModel(
    [idPhotos, urlPhotos]
);
PhotosPOIColumnModel.defaultSortable = true;

var PhotosPOIListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'PhotosPOIListingEditorGrid',
    store: PhotosDataStore,
    cm: PhotosPOIColumnModel,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 50,
        store: PhotosDataStore,
        displayInfo: true
    })
});

var expandPhotosWindow = new Ext.Window({
    title: T_photos,
    height: 480,
    width: 640,
    layout: 'fit',
    modal: true,
    maximizable: false,
    items: PhotosPOIListingEditorGrid,
    iconCls: 'silk_photo',
    closable: false,
    buttons: [
        {
            text: T_close,
            handler: function() {
                expandPhotosWindow.hide();
            }
        }
    ]
});

var photos = new Ext.grid.Column({
    header: T_photos,
    hidden: false,
    dataIndex: 'num_photos',
    width: 90,
    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
        if (value == 0) {
            metaData.css = 'nophoto';
            return value+' photo';
        } else {
            metaData.css = 'photo';
            if (value == 1) {
                return '<span ext:qtip="'+T_dblClickEditPhoto+'">'+value+' photo</span>';
            } else {
                return '<span ext:qtip="'+T_dblClickEditPhoto+'">'+value+' photos</span>';
            }
        }
    }
});
photos.on('dblclick', function(columnIndex, grid, rowIndex, e) {
    id = grid.getStore().getAt(rowIndex).get('id_poi');
    valeur = grid.getStore().getAt(rowIndex).get('num_photos');

    hiddenPOIPhoto = id;
    if (valeur == 0) {
        Ext.MessageBox.show({
            title: T_careful,
            msg: T_noPhotos,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    } else {
        PhotosDataStore.setBaseParam('id_poi', id);
        PhotosDataStore.load();
        expandPhotosWindow.setTitle(T_photos+' [Obs. - '+id+' - '+T_simpleClickOnPhoto);
        expandPhotosWindow.show();
    }

});

var POIsColumnModel = new Ext.grid.ColumnModel(
	[identifiantPOI,{ 
			header: T_titlePOI, 
			dataIndex: 'lib_poi',
			hidden: true,
			width: 200,
			sortable: true
		},{ 
			header: T_dateCreation, 
			dataIndex: 'datecreation_poi', 
			width: 150,
			sortable: true
		},{
			header: T_typeObs,
			dataIndex: 'lib_subcategory',
			width: 170,
			sortable: true
		}, photoPOI,{
			header: T_commune,
			dataIndex: 'lib_commune',
			width: 170,
			sortable: true
		},{
			header: T_pole,
			dataIndex: 'lib_pole',
			width: 170,
			sortable: true
		},{ 
			header: T_rueRecord, 
			dataIndex: 'rue_poi', 
			width: 100,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{ 
			header: T_numRecord, 
			dataIndex: 'num_poi', 
			width: 100,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},moderatePOIButton,  {
			header: T_description, 
			dataIndex: 'desc_poi', 
			width: 220,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{ 
			header: T_proposition, 
			dataIndex: 'prop_poi', 
			width: 220,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{
			header: T_priorite,
			dataIndex: 'lib_priorite',
			width: 170,
			sortable: true
		},{ 
			header: T_obsterrain, 
			dataIndex: 'observationterrain_poi', 
			width: 220,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{
			header: T_reponseGrandToulouse, 
			dataIndex: 'reponsegrandtoulouse_poi', 
			width: 220,
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},/*{
			header: T_commentFinal, 
			dataIndex: 'commentfinal_poi', 
			width: 220,
			sortable: true
		},chkColumn_transmissionPOI,*/{ 
			header: T_reponsePole, 
			dataIndex: 'reponsepole_poi', 
			width: 220,
			sortable: true,
			editor: new Ext.form.TextArea({
				allowBlank: true
			}),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},chkColumn_traiteparpolePOI,comments,photos
	]
);
POIsColumnModel.defaultSortable = true;

var paging = new Ext.PagingToolbar({
    pageSize: limitPOIPerPage,
    store: POIsDataStore,
    displayInfo: true
});
var POIListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_data,
	iconCls: 'fugue_reports',
	id: 'POIListingEditorGrid',
	store: POIsDataStore,
	cm: POIsColumnModel,
	plugins: [chkColumn_displayPOI, chkColumn_fixPOI, chkColumn_moderationPOI, /*chkColumn_transmissionPOI,*/chkColumn_traiteparpolePOI],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: paging,
  	tbar: [
       /* {
            text: T_unselect,
            handler: function() {
                POIListingEditorGrid.selModel.clearSelections();
            },
            iconCls: 'silk_cross'
        }, */'->',{
			text: T_downloadRecord,
			handler: writePOICsv,
			iconCls: 'silk_table_save'
		}
	]
});
POIListingEditorGrid.on('afteredit', saveThePOI);

function saveThePOI(oGrid_event) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: oGrid_event.record.data.id_poi,
			lib_poi: oGrid_event.record.data.lib_poi,
			adherent_poi: oGrid_event.record.data.adherent_poi,
			num_poi: oGrid_event.record.data.num_poi,
			tel_poi: oGrid_event.record.data.tel_poi,
			mail_poi: oGrid_event.record.data.mail_poi,
			rue_poi: oGrid_event.record.data.rue_poi,
			commune_id_commune: oGrid_event.record.data.lib_commune,
			pole_id_pole: oGrid_event.record.data.lib_pole,
			quartier_id_quartier: oGrid_event.record.data.lib_quartier,
			priorite_id_priorite: oGrid_event.record.data.lib_priorite,
			desc_poi: oGrid_event.record.data.desc_poi,
			prop_poi: oGrid_event.record.data.prop_poi,
			observationterrain_poi: oGrid_event.record.data.observationterrain_poi,
			reponsegrandtoulouse_poi: oGrid_event.record.data.reponsegrandtoulouse_poi,
			reponsepole_poi: oGrid_event.record.data.reponsepole_poi,
			commentfinal_poi: oGrid_event.record.data.commentfinal_poi,
			datecreation_poi: oGrid_event.record.data.datecreation_poi,
			datefix_poi: oGrid_event.record.data.datefix_poi,
			subcategory_id_subcategory: oGrid_event.record.data.lib_subcategory,
            poleedit : 1 // ce champ est utile pour savoir que l'on édite à partir de l'admin des poles >> pour écrire un mail à toulouse métropole
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					POIsDataStore.commitChanges();
					POIListingEditorGrid.selModel.clearSelections();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
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
}

function saveThePOI2(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			display_poi: recordObj.data.display_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					POIsDataStore.commitChanges();
					POIListingEditorGrid.selModel.clearSelections();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
					});
					break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
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

function saveThePOI3(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			fix_poi: recordObj.data.fix_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					POIsDataStore.commitChanges();
					POIListingEditorGrid.selModel.clearSelections();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
					});
					break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
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

function saveThePOI4(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			moderation_poi: recordObj.data.moderation_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					POIsDataStore.commitChanges();
					POIListingEditorGrid.selModel.clearSelections();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
					});
					break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
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

function saveThePOI5(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			transmission_poi: recordObj.data.transmission_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					POIsDataStore.commitChanges();
					POIListingEditorGrid.selModel.clearSelections();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
					});
					break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
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

function saveThePOI6(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			traiteparpole_poi: recordObj.data.traiteparpole_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					POIsDataStore.commitChanges();
					POIListingEditorGrid.selModel.clearSelections();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField,
						buttons: Ext.MessageBox.OK,
						icon: Ext.MessageBox.INFO
					});
					break;
			}
			Ext.get('update').hide();
		},
		failure: function(response){
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

OpenLayers.ImgPath = "resources/images/ol_themes/black/";

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
var osmarender = new OpenLayers.Layer.OSM("OpenStreetMap Osmarender", "http://tah.openstreetmap.org/Tiles/tile/${z}/${x}/${y}.png",
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
//var mapquest = new OpenLayers.Layer.OSM("OpenStrretMap Mapquest", "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png");

/*var apiKeyBing = "AqK30LQfN2aq1VME6rfTYVsMEk3OdhBtKfKWFnOYey4PtX8i2S5CxKuln4g5r98M";
var bingroad = new OpenLayers.Layer.Bing({
	name: "Road",
	key: apiKeyBing,
	type: "Road"
});
var binghybrid = new OpenLayers.Layer.Bing({
	name: "Hybrid",
	key: apiKeyBing,
	type: "AerialWithLabels"
});
var bingaerial = new OpenLayers.Layer.Bing({
	name: "Aerial",
	key: apiKeyBing,
	type: "Aerial"
});*/


//expandMap.addLayers([mapquest, cyclemap, hikebike, mapnik, bingroad, binghybrid, bingaerial]);
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


var id;
var validButton = new Ext.Button({
    iconCls: 'silk_tick',
    text: T_save,
    handler: function() {
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "UPDATEPOIPOLETECHCARTO",
                id_poi: id,
                reponsepole_poi: RespPolePOIField.getValue(),
                traiteparpole_poi: TraitePolePOIField.getValue()
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch(result){
                    case 1:
                        POIsDataStore.reload();
                        expandWindow.hide();
                        POIListingEditorGrid.selModel.clearSelections();
                        break;
                    case 2:
						Ext.MessageBox.alert(T_success,T_no_modification_on_data);
						break;
                    default:
                        Ext.MessageBox.alert(T_careful,T_pb);
                        break;
                }
            },
            failure: function(response) {
                var result = response.responseText;
                Ext.MessageBox.alert(T_error, T_badConnect);
            }
        });
    }
});
var moderatePhotos = new Ext.Button({
	iconCls: 'silk_photos',
	text: T_photos
	
});
moderatePhotos.on('click', function(columnIndex, grid, rowIndex, e) {
	console.info("moderatePhotos.on('click')" + id);
//    id = 2135;

    hiddenPOIPhoto = id;
    
        PhotosDataStore.setBaseParam('id_poi', id);
        PhotosDataStore.load();
        expandPhotosWindow.setTitle(T_photos+' [Obs. - '+id+' - '+T_simpleClickOnPhoto);
        expandPhotosWindow.show();

});
var moderateComments = new Ext.Button({
	iconCls: 'silk_pencil',
	text: T_comments
	
});
moderateComments.on('click', function(columnIndex, grid, rowIndex, e) {
	console.info("moderateComments.on('click')" + id);
//    id = 2135;

    hiddenPOIPhoto = id;
    
    CommentsDataStore.setBaseParam('id_poi', id);
    CommentsDataStore.load();
    expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
    expandCommentsWindow.show();

});
var resetButton = new Ext.Button({
	iconCls: 'silk_cancel',
	text: T_reset,
	handler: function() {
		expandWindow.hide();
	}
});

var button = new Ext.Button({
	iconCls: 'silk_photos',
	text: T_image
});
button.on('click', function() {
    if (tof != '') {
        hiddenIdPOI.setValue(id);
        var srcimg = 'resources/pictures/'+tof;
        var el = Ext.get('photo');

        var img = new Image();
        img.src = 'resources/pictures/'+tof;

        if (img.height == 0) {
            var temp = tof;
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
});

var expandWindow = new Ext.Window({
    title: T_record,
    height: 650,
    width: 850,
    layout: 'fit',
    modal: true,
    maximizable: true,
    items: [expandMapPanel],
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
                items : ['Rue:',RuePOIField,'Repère:',NumPOIField,'Priorité:',PrioritePOIField,' Observation terrain:',ObsPOIField]
            }),
            new Ext.Toolbar({
                height: 75,
                items : [SubCategoryPOIField,'Description:',DescPOIField,'Proposition:',PropPOIField]
            }),
            new Ext.Toolbar({
                height: 75,
                items : ['Réponse de la collectivité:',RespComcomPOIField,'Réponse du pôle:',RespPolePOIField]
            }),
            new Ext.Toolbar({
                height: 25,
                items : ['Commune:',CommunePOIField,'Pole:',PolePOIField,'Photo:',button]
            }),
            new Ext.Toolbar({
                height: 25,
                items : ['Traité par pole:',TraitePolePOIField,'->', moderatePhotos, ' ', moderateComments, ' ', validButton, ' ', resetButton]
            })
        ]
    }
});
expandWindow.on('hide', function() {
	vectors.removeAllFeatures();
});

var vectors = new OpenLayers.Layer.Vector(T_record,{
	visibility: true,
	displayInLayerSwitcher: true
});
expandMap.addLayer(vectors);

function createFeature(X,Y,com,pole,traite,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs) {
    CommunePOIField.setValue(com);
    PolePOIField.setValue(pole);
    TraitePolePOIField.setValue(traite);
    RespComcomPOIField.setValue(reponsecomcom);
    RespPolePOIField.setValue(reponsepole);
    DescPOIField.setValue(desc);
    PropPOIField.setValue(prop);
    SubCategoryPOIField.setValue(subcat);
    RuePOIField.setValue(rue);
    NumPOIField.setValue(num);
    PrioritePOIField.setValue(prio);
    ObsPOIField.setValue(obs);

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
	vectors.addFeatures([feat]);
}

var tof;
moderatePOIButton.on('click', function(columnIndex, grid, rowIndex, e) {
	expandWindow.show();
	id = grid.getStore().getAt(rowIndex).get('id_poi');
    expandWindow.setTitle(T_record+' n°'+id);
	var lat = grid.getStore().getAt(rowIndex).get('latitude_poi');
	var lon = grid.getStore().getAt(rowIndex).get('longitude_poi');

    var commune = grid.getStore().getAt(rowIndex).get('lib_commune');
    var pole = grid.getStore().getAt(rowIndex).get('lib_pole');
    var traite = grid.getStore().getAt(rowIndex).get('traiteparpole_poi');
    var reponsecomcom = grid.getStore().getAt(rowIndex).get('reponsegrandtoulouse_poi');
    var reponsepole = grid.getStore().getAt(rowIndex).get('reponsepole_poi');
    var obs = grid.getStore().getAt(rowIndex).get('observationterrain_poi');
    var desc = grid.getStore().getAt(rowIndex).get('desc_poi');
    var prop = grid.getStore().getAt(rowIndex).get('prop_poi');
    var subcat = grid.getStore().getAt(rowIndex).get('lib_subcategory');
    var rue = grid.getStore().getAt(rowIndex).get('rue_poi');
    var num = grid.getStore().getAt(rowIndex).get('num_poi');
    var prio = grid.getStore().getAt(rowIndex).get('lib_priorite');

    tof = grid.getStore().getAt(rowIndex).get('photo_poi');
    if (tof == '') {
        button.setText(T_noImage);
        button.disable();
    } else {
        button.setText(T_image);
        button.enable();
    }

	if ((lat == '') && (lon == '')) {
			var uri = 'lib/php/admin/getDefaultConfigMap.php';
			OpenLayers.loadURL(uri,'',this,setLatLonZoomDefault);
	} else {
		var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
        createFeature(lonlat.lon,lonlat.lat,commune,pole,traite,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs);
		var lonlatwgs = lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		latitudeField.setValue(lat);
		longitudeField.setValue(lon);
		expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 13);
	}
});


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
var TabPanelRecord = new Ext.TabPanel({
	activeTab: 0,	
	region: 'center',
	margins: '5 5 5 0',
	border: false,
	tabPosition: 'bottom',
	items: [
		POIListingEditorGrid
	]
});
