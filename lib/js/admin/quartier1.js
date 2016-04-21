var LibQuartierField = new Ext.form.TextField({
	id: 'LibQuartierField',
	fieldLabel: T_libQuartier,
	maxLength: 50,
	allowBlank: false,
	anchor : '95%'
});

var QuartierCreateForm = new Ext.FormPanel({
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
				items: [LibQuartierField]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createTheQuartier
		},{
			text: T_cancel,
			handler: function(){
				QuartierCreateWindow.hide();
			}
	}]
});

var QuartierCreateWindow= new Ext.Window({
	id: 'QuartierCreateWindow',
	iconCls: 'fugue_script--plus',
	title: T_addQuartier,
	closable: false,
	border: false,
	width: 350,
	height: 170,
	plain: true,
	layout: 'fit',
	modal: true,
	items: QuartierCreateForm
});

var QuartiersDataStore = new Ext.data.Store({
	id: 'QuartiersDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGQUARTIER'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_quartier', type: 'int', mapping: 'id_quartier'},
			{ name: 'lib_quartier', type: 'string', mapping: 'lib_quartier'}
	]),
	sortInfo: {field: 'lib_quartier', direction: 'ASC'}
});

var identifiantQuartier = new Ext.grid.Column({
	header: '#', 
	dataIndex: 'id_quartier', 
	width: 50,
	sortable: true,
	hidden: false,
	readOnly: true
});

var QuartiersColumnModel = new Ext.grid.ColumnModel(
	[identifiantQuartier, { 
			header: T_libQuartier, 
			dataIndex: 'lib_quartier', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 200
			})
		}]
);
QuartiersColumnModel.defaultSortable = true;

var QuartierListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_quartiers,
	iconCls: 'fugue_script',
	id: 'QuartierListingEditorGrid',
	store: QuartiersDataStore,
	cm: QuartiersColumnModel,
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: QuartiersDataStore,
		displayInfo: true
	}),
  tbar: [
    {
			text: T_addQuartier,
			handler: displayFormWindowQuartier,
			iconCls: 'silk_add'
    }, '-', {
			text: T_deleteSelection,
			handler: confirmDeleteQuartiers,
			iconCls: 'silk_delete'
  	}, '-', {
			text: T_unselect,
			handler: function(){
				QuartierListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}, '->', {
			text: T_downloadListQuartier,
			handler: writeQuartierCsv,
			iconCls: 'silk_table_save'
		}
	]
});
QuartierListingEditorGrid.on('afteredit', saveTheQuartier);

function saveTheQuartier(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEQUARTIER",
			id_quartier: oGrid_event.record.data.id_quartier,
			lib_quartier: oGrid_event.record.data.lib_quartier
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					QuartiersDataStore.commitChanges();
					QuartierListingEditorGrid.selModel.clearSelections();
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

function confirmDeleteQuartiers() {
	if(QuartierListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteQuartiers);
	} else if(QuartierListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteQuartiers);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deleteQuartiers(btn) {
	if (btn=='yes'){
		var selections = QuartierListingEditorGrid.selModel.getSelections();
		var quartierz = [];
		for(i = 0; i< QuartierListingEditorGrid.selModel.getCount(); i++){
			quartierz.push(selections[i].json.id_quartier);
		}
		var encoded_array = Ext.encode(quartierz);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETEQUARTIER",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						QuartiersDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkQuartier,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						QuartierListingEditorGrid.selModel.clearSelections();
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
		QuartierListingEditorGrid.selModel.clearSelections();
	}
}

function resetQuartierForm() {
	LibQuartierField.setValue('');
}

function isQuartierFormValid() {
	return(LibQuartierField.isValid()
	);
}

function displayFormWindowQuartier() {
	if (!QuartierCreateWindow.isVisible()) {
		resetQuartierForm();
		QuartierCreateWindow.show();
	} else {
		QuartierCreateWindow.toFront();
	}
}

function createTheQuartier() {
	if (isQuartierFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATEQUARTIER",
				lib_quartier:			LibQuartierField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedQuartierSuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						QuartiersDataStore.reload();
						QuartierCreateWindow.hide();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_pb,
							msg: T_addedQuartierFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedQuartierFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.WARNING
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
		Ext.MessageBox.alert(T_careful, T_formUnvalid);
	}
}

function writeQuartierCsv() {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=quartier',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvQuartier+'</div></a>',
					buttons: Ext.Msg.CANCEL,
					icon: Ext.Msg.INFO,
					minWidth: 300
				});
			} else {
				Ext.Msg.show({
					title: 'Hum ...',
					msg: '<div style="color:#000000">'+T_pbCsv+'</div>',
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING,
					minWidth: 300
				});
			}
		},
		failure: function(response) {
			var result = response.responseText;
			Ext.MessageBox.show({
				title: T_pb,
				msg: '<div style="color:#000000">'+T_pbCsv+'</div>',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});   
		}
	});
}