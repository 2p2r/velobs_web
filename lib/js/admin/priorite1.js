var LibPrioriteField = new Ext.form.TextField({
	id: 'LibPrioriteField',
	fieldLabel: T_priorite,
	maxLength: 50,
	allowBlank: false,
	anchor : '95%'
});

var PrioriteCreateForm = new Ext.FormPanel({
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
				items: [LibPrioriteField]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createThePriorite
		},{
			text: T_cancel,
			handler: function(){
				PrioriteCreateWindow.hide();
			}
	}]
});

var PrioriteCreateWindow= new Ext.Window({
	id: 'PrioriteCreateWindow',
	iconCls: 'fugue_color--plus',
	title: T_addPriorite,
	closable: false,
	border: false,
	width: 350,
	height: 170,
	plain: true,
	layout: 'fit',
	modal: true,
	items: PrioriteCreateForm
});

var PrioritesDataStore = new Ext.data.Store({
	id: 'PrioritesDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGPRIORITE'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_priorite', type: 'int', mapping: 'id_priorite'},
			{ name: 'lib_priorite', type: 'string', mapping: 'lib_priorite'}
	]),
	sortInfo: {field: 'lib_priorite', direction: 'ASC'}
});

var identifiantPriorite = new Ext.grid.Column({
	header: '#', 
	dataIndex: 'id_priorite', 
	width: 50,
	sortable: true,
	hidden: false,
	readOnly: true
});

var PrioritesColumnModel = new Ext.grid.ColumnModel(
	[identifiantPriorite, { 
			header: T_priorite, 
			dataIndex: 'lib_priorite', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 200
			})
		}]
);
PrioritesColumnModel.defaultSortable = true;

var PrioriteListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_priorites,
	iconCls: 'fugue_color',
	id: 'PrioriteListingEditorGrid',
	store: PrioritesDataStore,
	cm: PrioritesColumnModel,
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: PrioritesDataStore,
		displayInfo: true
	}),
  tbar: [
    /*{
			text: T_addPriorite,
			handler: displayFormWindowPriorite,
			iconCls: 'silk_add'
    }, '-', {
			text: T_deleteSelection,
			handler: confirmDeletePriorites,
			iconCls: 'silk_delete'
  	}, '-', */{
			text: T_unselect,
			handler: function(){
				PrioriteListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}/*, '->', {
			text: T_downloadListPriorite,
			handler: writePrioriteCsv,
			iconCls: 'silk_table_save'
		}*/
	]
});
PrioriteListingEditorGrid.on('afteredit', saveThePriorite);

function saveThePriorite(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPRIORITE",
			id_priorite: oGrid_event.record.data.id_priorite,
			lib_priorite: oGrid_event.record.data.lib_priorite
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					PrioritesDataStore.commitChanges();
					PrioriteListingEditorGrid.selModel.clearSelections();
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

function confirmDeletePriorites() {
	if(PrioriteListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deletePriorites);
	} else if(PrioriteListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deletePriorites);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deletePriorites(btn) {
	if (btn=='yes'){
		var selections = PrioriteListingEditorGrid.selModel.getSelections();
		var prioritez = [];
		for(i = 0; i< PrioriteListingEditorGrid.selModel.getCount(); i++){
			prioritez.push(selections[i].json.id_priorite);
		}
		var encoded_array = Ext.encode(prioritez);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETEPRIORITE",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						PrioritesDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkPriorite,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						PrioriteListingEditorGrid.selModel.clearSelections();
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
		PrioriteListingEditorGrid.selModel.clearSelections();
	}
}

function resetPrioriteForm() {
	LibPrioriteField.setValue('');
}

function isPrioriteFormValid() {
	return(LibPrioriteField.isValid());
}

function displayFormWindowPriorite() {
	if (!PrioriteCreateWindow.isVisible()) {
		resetPrioriteForm();
		PrioriteCreateWindow.show();
	} else {
		PrioriteCreateWindow.toFront();
	}
}

function createThePriorite() {
	if (isPrioriteFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATEPRIORITE",
				lib_priorite:			LibPrioriteField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedPrioriteSuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						PrioritesDataStore.reload();
						PrioriteCreateWindow.hide();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_pb,
							msg: T_addedPrioriteFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedPrioriteFailed,
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

function writePrioriteCsv() {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=priorite',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvPriorite+'</div></a>',
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