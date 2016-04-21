var LibCommuneField = new Ext.form.TextField({
	id: 'LibCommuneField',
	fieldLabel: T_libCommune,
	maxLength: 50,
	allowBlank: false,
	anchor : '95%'
});

var IdCommuneField = new Ext.form.NumberField({
	id: 'IdCommuneField',
	fieldLabel: T_idCommune,
	maxLength: 10,
	allowBlank: false,
	anchor: '95%'
});

var CommuneCreateForm = new Ext.FormPanel({
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
				items: [LibCommuneField, IdCommuneField]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createTheCommune
		},{
			text: T_cancel,
			handler: function(){
				CommuneCreateWindow.hide();
			}
	}]
});

var CommuneCreateWindow= new Ext.Window({
	id: 'CommuneCreateWindow',
	iconCls: 'fugue_home--plus',
	title: T_addCommune,
	closable: false,
	border: false,
	width: 350,
	height: 170,
	plain: true,
	layout: 'fit',
	modal: true,
	items: CommuneCreateForm
});

var CommunesDataStore = new Ext.data.Store({
	id: 'CommunesDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGCITY'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_commune', type: 'int', mapping: 'id_commune'},
			{ name: 'lib_commune', type: 'string', mapping: 'lib_commune'}
	]),
	sortInfo: {field: 'lib_commune', direction: 'ASC'}
});

var CommunesColumnModel = new Ext.grid.ColumnModel(
	[{ 
			header: T_idCommune, 
			readOnly: true, 
			dataIndex: 'id_commune', 
			width: 100,
			sortable: true,
			hidden: false,
			editor: new Ext.form.NumberField({
				allowBlank: false,
				maxLength: 50
			})
		},{ 
			header: T_libCommune, 
			dataIndex: 'lib_commune', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 200
			})
		}]
);
CommunesColumnModel.defaultSortable = true;

var CommuneListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_communes,
	iconCls: 'fugue_home',
	id: 'CommuneListingEditorGrid',
	store: CommunesDataStore,
	cm: CommunesColumnModel,
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: CommunesDataStore,
		displayInfo: true
	}),
  tbar: [
    {
			text: T_addCommune,
			handler: displayFormWindowCommune,
			iconCls: 'silk_add'
    }, '-', {
			text: T_deleteSelection,
			handler: confirmDeleteCommunes,
			iconCls: 'silk_delete'
  	}, '-', {
			text: T_unselect,
			handler: function(){
				CommuneListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}, '->', {
			text: T_downloadListCommune,
			handler: writeCommuneCsv,
			iconCls: 'silk_table_save'
		}
	]
});
CommuneListingEditorGrid.on('afteredit', saveTheCommune);

function saveTheCommune(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATECITY",
			id_commune: oGrid_event.record.data.id_commune,
			lib_commune: oGrid_event.record.data.lib_commune
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					CommunesDataStore.commitChanges();
					CommuneListingEditorGrid.selModel.clearSelections();
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

function confirmDeleteCommunes() {
	if(CommuneListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteCommunes);
	} else if(CommuneListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteCommunes);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deleteCommunes(btn) {
	if (btn=='yes'){
		var selections = CommuneListingEditorGrid.selModel.getSelections();
		var cityz = [];
		for(i = 0; i< CommuneListingEditorGrid.selModel.getCount(); i++){
			cityz.push(selections[i].json.id_commune);
		}
		var encoded_array = Ext.encode(cityz);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETECITY",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						CommunesDataStore.reload();
						refreshTreeNode();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkCommune,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						CommuneListingEditorGrid.selModel.clearSelections();
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
		CommuneListingEditorGrid.selModel.clearSelections();
	}
}

function resetCommuneForm() {
	LibCommuneField.setValue('');
	IdCommuneField.setValue('');
}

function isCommuneFormValid() {
	return(LibCommuneField.isValid() &&
	IdCommuneField.isValid()
	);
}

function displayFormWindowCommune() {
	if (!CommuneCreateWindow.isVisible()) {
		resetCommuneForm();
		CommuneCreateWindow.show();
	} else {
		CommuneCreateWindow.toFront();
	}
}

function createTheCommune() {
	if (isCommuneFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATECITY",
				lib_commune:		LibCommuneField.getValue(),
				id_commune:			IdCommuneField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedCommuneSuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						CommunesDataStore.reload();
						CommuneCreateWindow.hide();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_pb,
							msg: T_addedCommuneFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedCommuneFailed,
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

function writeCommuneCsv() {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=commune',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvCommune+'</div></a>',
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