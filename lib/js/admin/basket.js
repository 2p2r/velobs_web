var BasketsDataStore = new Ext.data.Store({
	id: 'BasketsDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGPOI',
    	basket:1},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id_poi'
	},[
			{ name: 'id_poi', type: 'int', mapping: 'id_poi'},
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
			{ name: 'delete_poi', type: 'bool'}
	])
});

var identifiantPOIBasket = new Ext.grid.Column({
	header: '#', 
	dataIndex: 'id_poi', 
	width: 50,
	sortable: true,
	hidden: false,
	readOnly: true/*,
	renderer: function(val) {
		return '<span ext:qtip="'+T_displayRecordOnMap+'">'+val+'</span>';
	}*/
});

var subCategoryPOIListBasket = new Ext.data.JsonStore({
  url: 'lib/php/admin/getSubCategory.php',
  root: 'subcategory',
  fields: [
    {name: 'id_subcategory'},
    {name: 'lib_subcategory'}
  ]
});

var comboSubCategoryPOIBasket = new Ext.form.ComboBox({
	fieldLabel: T_subcategory,
	store: subCategoryPOIListBasket,
	displayField: 'lib_subcategory',
	valueField: 'id_subcategory',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var communePOIListBasket = new Ext.data.JsonStore({
  url: 'lib/php/admin/getCommune.php',
  root: 'commune',
  fields: [
    {name: 'id_commune'},
    {name: 'lib_commune'}
  ]
});

var comboCommunePOIBasket = new Ext.form.ComboBox({
	fieldLabel: T_commune,
	store: communePOIListBasket,
	displayField: 'lib_commune',
	valueField: 'id_commune',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var polePOIListBasket = new Ext.data.JsonStore({
  url: 'lib/php/admin/getPole.php',
  root: 'pole',
  fields: [
    {name: 'id_pole'},
    {name: 'lib_pole'}
  ]
});

var comboPolePOIBasket = new Ext.form.ComboBox({
	fieldLabel: T_pole,
	store: polePOIListBasket,
	displayField: 'lib_pole',
	valueField: 'id_pole',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var quartierPOIListBasket = new Ext.data.JsonStore({
  url: 'lib/php/admin/getQuartier.php',
  root: 'quartier',
  fields: [
    {name: 'id_quartier'},
    {name: 'lib_quartier'}
  ]
});

var comboQuartierPOIBasket = new Ext.form.ComboBox({
	fieldLabel: T_quartier,
	store: quartierPOIListBasket,
	displayField: 'lib_quartier',
	valueField: 'id_quartier',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var prioritePOIListBasket = new Ext.data.JsonStore({
  url: 'lib/php/admin/getPriorite.php',
  root: 'priorite',
  fields: [
    {name: 'id_priorite'},
    {name: 'lib_priorite'}
  ]
});

var comboPrioritePOIBasket = new Ext.form.ComboBox({
	fieldLabel: T_priorite,
	store: prioritePOIListBasket,
	displayField: 'lib_priorite',
	valueField: 'id_priorite',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var statusPOIListBasket = new Ext.data.JsonStore({
  url: 'lib/php/admin/getStatus.php',
  root: 'status',
  fields: [
    {name: 'id_status'},
    {name: 'lib_status'}
  ]
});

var comboStatusPOIBasket = new Ext.form.ComboBox({
	fieldLabel: T_status,
	store: statusPOIListBasket,
	displayField: 'lib_status',
	valueField: 'id_status',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var triPOIStoreBasket = new Ext.data.ArrayStore({
	fields: ['triname', 'displayname'],
	data: [
		['id', T_id],
		['lib', T_lib],
		['subcategory', T_subcategory]
	]
});

var comboTriPOIBasket = new Ext.form.ComboBox({
	store: triPOIStoreBasket,
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
					BasketsDataStore.lastOptions.params.asc = 'id';
					BasketsDataStore.setBaseParam('asc', 'id');
					BasketsDataStore.reload();
					break;
				case 'lib':
					BasketsDataStore.lastOptions.params.asc = 'lib';
					BasketsDataStore.setBaseParam('asc', 'lib');
					BasketsDataStore.reload();
					break;
				case 'subcategory':
					BasketsDataStore.lastOptions.params.asc = 'subcategory';
					BasketsDataStore.setBaseParam('asc', 'subcategory');
					BasketsDataStore.reload();
					break;
			}
		}
	}
});

var chkColumn_deletePOIBasket = new Ext.grid.CheckColumn({
	header: T_basket,
	width: 80,
	sortable: true,
	dataIndex: 'delete_poi'
});
chkColumn_deletePOIBasket.on('click', saveThePOIBasket);

var chkColumn_displayPOIBasket = new Ext.grid.CheckColumn({
	header: T_displayTab,
	width: 80,
	sortable: true,
	dataIndex: 'display_poi'
});
//chkColumn_displayPOIBasket.on('click', saveThePOI2);

var chkColumn_fixPOIBasket = new Ext.grid.CheckColumn({
	header: T_fix,
	width: 80,
	sortable: true,
	dataIndex: 'fix_poi'
});
//chkColumn_fixPOIBasket.on('click', saveThePOI3);

var chkColumn_moderationPOIBasket = new Ext.grid.CheckColumn({
	header: T_moderation,
	width: 80,
	sortable: true,
	dataIndex: 'moderation_poi'
});
//chkColumn_moderationPOIBasket.on('click', saveThePOI4);

var latitudePOIBasket = new Ext.grid.Column({
	header: T_latitude, 
	dataIndex: 'latitude_poi', 
	width: 120,
	sortable: false,
	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
		if (value == '') {
			metaData.css = 'not';
			return '<span ext:qtip="'+T_dblClickPos+'" style="color:gray">'+T_toDefine+'</span>';
		} else {
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
			}
			return '<span style="color:gray">'+value+'</span>';
		}
	}
});

var longitudePOIBasket = new Ext.grid.Column({
	header: T_longitude, 
	dataIndex: 'longitude_poi', 
	width: 120,
	sortable: false,
	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
		if (value == '') {
			metaData.css = 'not';
			return '<span ext:qtip="'+T_dblClickPos+'" style="color:gray">'+T_toDefine+'</span>';
		} else {
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
			}
			return '<span style="color:gray">'+value+'</span>';
		}
	}
});

var geolocatemodePOIBasket = new Ext.grid.Column({
	header: T_modeGeoloc, 
	dataIndex: 'geolocatemode_poi', 
	width: 150,
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

var BasketsColumnModel = new Ext.grid.ColumnModel(
	[identifiantPOIBasket,chkColumn_deletePOIBasket,{ 
			header: T_titlePOI, 
			dataIndex: 'lib_poi',
			hidden: true,
			width: 200,
			sortable: true
		},{ 
			header: T_numRecord, 
			dataIndex: 'num_poi', 
			width: 100,
			sortable: true
		},{ 
			header: T_rueRecord, 
			dataIndex: 'rue_poi', 
			width: 200,
			sortable: true
		},{
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
			header: T_priorite,
			dataIndex: 'lib_priorite',
			width: 170,
			sortable: true
		},{ 
			header: T_description, 
			dataIndex: 'desc_poi', 
			width: 220,
			sortable: true
		},{ 
			header: T_proposition, 
			dataIndex: 'prop_poi', 
			width: 220,
			sortable: true
		},{ 
			header: 'basket'+T_obsterrain, 
			dataIndex: 'observationterrain_poi', 
			width: 220,
			sortable: true
		},{
			header: T_subcategory,
			dataIndex: 'lib_subcategory',
			width: 170,
			sortable: true
		}, latitudePOIBasket, longitudePOIBasket,{ 
			header: T_dateCreation, 
			dataIndex: 'datecreation_poi', 
			width: 150,
			sortable: true
		}, geolocatemodePOIBasket,{ 
			header: T_adherentRecord, 
			dataIndex: 'adherent_poi', 
			width: 100,
			sortable: true
		}, { 
			header: T_email, 
			dataIndex: 'mail_poi', 
			width: 100,
			sortable: true
		},{ 
			header: T_tel, 
			dataIndex: 'tel_poi', 
			width: 100,
			sortable: true
		},{ 
			header: T_reponseGrandToulouse, 
			dataIndex: 'reponsegrandtoulouse_poi', 
			width: 220,
			sortable: true
		},{
            header: T_reponsePole,
            dataIndex: 'reponsepole_poi',
            width: 220,
            sortable: true
        },{
			header: T_commentFinal, 
			dataIndex: 'commentfinal_poi', 
			width: 220,
			sortable: true
		},{
			header: T_status,
			dataIndex: 'lib_status',
			width: 170,
			sortable: true
		}
	]
);
BasketsColumnModel.defaultSortable = true;

var BasketListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_basket,
	iconCls: 'silk_basket',
	id: 'BasketListingEditorGrid',
	store: BasketsDataStore,
	cm: BasketsColumnModel,
	plugins: [chkColumn_deletePOIBasket],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: BasketsDataStore,
		displayInfo: true
	}),
  	tbar: [
	  	{
			text: T_unselect,
			handler: function() {
				BasketListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
		}
	]
});

function saveThePOIBasket(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: recordObj.data.id_poi,
			delete_poi: recordObj.data.delete_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					BasketsDataStore.commitChanges();
					BasketListingEditorGrid.selModel.clearSelections();
					BasketsDataStore.reload();
					POIsDataStore.reload();
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