var LibPoleField = new Ext.form.TextField({
	id: 'LibPoleField',
	fieldLabel: T_libPole,
	maxLength: 50,
	allowBlank: false,
	anchor : '95%'
});

var IdPoleField = new Ext.form.NumberField({
	id: 'IdPoleField',
	fieldLabel: T_idPole,
	maxLength: 10,
	allowBlank: false,
	anchor: '95%'
});

var PoleCreateForm = new Ext.FormPanel({
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
				items: [LibPoleField, IdPoleField]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createThePole
		},{
			text: T_cancel,
			handler: function(){
				PoleCreateWindow.hide();
			}
	}]
});

var PoleCreateWindow= new Ext.Window({
	id: 'PoleCreateWindow',
	iconCls: 'fugue_puzzle--plus',
	title: T_addPole,
	closable: false,
	border: false,
	width: 350,
	height: 170,
	plain: true,
	layout: 'fit',
	modal: true,
	items: PoleCreateForm
});

var PolesDataStore = new Ext.data.Store({
	id: 'PolesDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGPOLE'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_pole', type: 'int', mapping: 'id_pole'},
			{ name: 'lib_pole', type: 'string', mapping: 'lib_pole'}
	]),
	sortInfo: {field: 'lib_pole', direction: 'ASC'}
});

var PolesColumnModel = new Ext.grid.ColumnModel(
	[{ 
			header: T_idPole, 
			readOnly: true, 
			dataIndex: 'id_pole', 
			width: 100,
			sortable: true,
			hidden: false,
			editor: new Ext.form.NumberField({
				allowBlank: false,
				maxLength: 50
			})
		},{ 
			header: T_libPole, 
			dataIndex: 'lib_pole', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 200
			})
		}]
);
PolesColumnModel.defaultSortable = true;

var PoleListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_poles,
	iconCls: 'fugue_puzzle',
	id: 'PoleListingEditorGrid',
	store: PolesDataStore,
	cm: PolesColumnModel,
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: PolesDataStore,
		displayInfo: true
	}),
  tbar: [
    {
			text: T_addPole,
			handler: displayFormWindowPole,
			iconCls: 'silk_add'
    }, '-', {
			text: T_deleteSelection,
			handler: confirmDeletePoles,
			iconCls: 'silk_delete'
  	}, '-', {
			text: T_unselect,
			handler: function(){
				PoleListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}, '->', {
			text: T_downloadListPole,
			handler: writePoleCsv,
			iconCls: 'silk_table_save'
		}
	]
});
PoleListingEditorGrid.on('afteredit', saveThePole);

function saveThePole(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOLE",
			id_pole: oGrid_event.record.data.id_pole,
			lib_pole: oGrid_event.record.data.lib_pole
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					PolesDataStore.commitChanges();
					PoleListingEditorGrid.selModel.clearSelections();
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

function confirmDeletePoles() {
	if(PoleListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deletePoles);
	} else if(PoleListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deletePoles);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deletePoles(btn) {
	if (btn=='yes'){
		var selections = PoleListingEditorGrid.selModel.getSelections();
		var polez = [];
		for(i = 0; i< PoleListingEditorGrid.selModel.getCount(); i++){
			polez.push(selections[i].json.id_pole);
		}
		var encoded_array = Ext.encode(polez);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETEPOLE",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						PolesDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkPole,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						PoleListingEditorGrid.selModel.clearSelections();
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
		PoleListingEditorGrid.selModel.clearSelections();
	}
}

function resetPoleForm() {
	LibPoleField.setValue('');
	IdPoleField.setValue('');
}

function isPoleFormValid() {
	return(LibPoleField.isValid() &&
	IdPoleField.isValid()
	);
}

function displayFormWindowPole() {
	if (!PoleCreateWindow.isVisible()) {
		resetPoleForm();
		PoleCreateWindow.show();
	} else {
		PoleCreateWindow.toFront();
	}
}

function createThePole() {
	if (isPoleFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATEPOLE",
				lib_pole:			LibPoleField.getValue(),
				id_pole:			IdPoleField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedPoleSuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						PolesDataStore.reload();
						PoleCreateWindow.hide();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_pb,
							msg: T_addedPoleFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedPoleFailed,
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

function writePoleCsv() {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=pole',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvPole+'</div></a>',
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