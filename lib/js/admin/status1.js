var LibStatusField = new Ext.form.TextField({
	id: 'LibStatusField',
	fieldLabel: T_status,
	maxLength: 50,
	allowBlank: false,
	anchor : '95%'
});

//colors defined in key.js.template
var colorStatusStore = new Ext.data.ArrayStore({
    // store configs
    autoDestroy: true,
    storeId: 'colorStatusStore',
    // reader configs
    idIndex: 0,  
    fields: [
             {name: 'color_status_display'},
             {name: 'color_status'}
    ],data:predefinedColorsForStatus
});

var colorStatusCombo = new Ext.form.ComboBox({
	fieldLabel: T_color_status,
    store: colorStatusStore,
    displayField: 'color_status_display',
    valueField: 'color_status',
    forceSelection: true,
    editable: false,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    emptyText: ''
});
var colorStatusComboGrid = new Ext.form.ComboBox({
	fieldLabel: T_color_status,
    store: colorStatusStore,
    displayField: 'color_status_display',
    valueField: 'color_status',
    forceSelection: true,
    editable: false,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    emptyText: ''
});

var StatusCreateForm = new Ext.FormPanel({
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
				items: [LibStatusField,colorStatusCombo]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createTheStatus
		},{
			text: T_cancel,
			handler: function(){
				StatusCreateWindow.hide();
			}
	}]
});

var StatusCreateWindow= new Ext.Window({
	id: 'StatusCreateWindow',
	iconCls: 'fugue_color--plus',
	title: T_addStatus,
	closable: false,
	border: false,
	width: 350,
	height: 170,
	plain: true,
	layout: 'fit',
	modal: true,
	items: StatusCreateForm
});

var StatussDataStore = new Ext.data.Store({
	id: 'StatussDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGSTATUS'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_status', type: 'int', mapping: 'id_status'},
			{ name: 'lib_status', type: 'string', mapping: 'lib_status'},
			{ name: 'color_status', type: 'string', mapping: 'color_status'},
			{ name: 'is_active_status', type: 'bool', mapping: 'is_active_status'}
	]),
	sortInfo: {field: 'lib_status', direction: 'ASC'}
});

var identifiantStatus = new Ext.grid.Column({
	header: '#', 
	dataIndex: 'id_status', 
	width: 50,
	sortable: true,
	hidden: false,
	readOnly: true
});
var chkColumn_deactivate_status = new Ext.grid.CheckColumn({
	header: T_active,
	width: 80,
	sortable: true,
	dataIndex: 'is_active_status'
});
var StatussColumnModel = new Ext.grid.ColumnModel(
	[identifiantStatus, { 
			header: T_status, 
			dataIndex: 'lib_status', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 200
			})
		},{
            header: T_color_status,
            dataIndex: 'color_status',
            width: 150,
            sortable: true,
            editor: colorStatusComboGrid
        }, chkColumn_deactivate_status
		]
);
StatussColumnModel.defaultSortable = true;

var StatusListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_statuss,
	iconCls: 'silk_rainbow',
	id: 'StatusListingEditorGrid',
	store: StatussDataStore,
	plugins: [chkColumn_deactivate_status],
	cm: StatussColumnModel,
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: StatussDataStore,
		displayInfo: true
	}),
  tbar: [
    {
			text: T_addStatus,
			handler: displayFormWindowStatus,
			iconCls: 'silk_add'
    },/* '-', {
			text: T_deleteSelection,
			handler: confirmDeleteStatuss,
			iconCls: 'silk_delete'
  	}, '-', */{
			text: T_unselect,
			handler: function(){
				StatusListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}/*, '->', {
			text: T_downloadListStatus,
			handler: writeStatusCsv,
			iconCls: 'silk_table_save'
		}*/
	]
});
StatusListingEditorGrid.on('afteredit', saveTheStatus);
chkColumn_deactivate_status.on('click', saveTheStatusActive)
function saveTheStatus(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATESTATUS",
			id_status: oGrid_event.record.data.id_status,
			lib_status: oGrid_event.record.data.lib_status,
			color_status: oGrid_event.record.data.color_status
		},
		success: function(response) {
			var result = response.responseText;
            var res = result.split(":");
            console.log(result);
            switch (Number(res[0])) {
				case 1:
					StatussDataStore.commitChanges();
					StatusListingEditorGrid.selModel.clearSelections();
					POIsDataStore.reload();
					break;
				case 2:
					Ext.MessageBox.show({
						title: T_careful,
						msg: T_cantModifyField + res[1],
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
function saveTheStatusActive(ctrlObj, eventObj, recordObj){
    Ext.get('update').show();
    Ext.Ajax.request({
        waitMsg: T_pleaseWait,
        url: 'lib/php/admin/database.php',
        params: {
            task: "UPDATESTATUS",
            id_status: recordObj.data.id_status,
            is_active_status: recordObj.data.is_active_status
        },
        success: function(response) {
        	var result = response.responseText;
            var res = result.split(":");
            console.log(result);
            switch (Number(res[0])) {
                case 1:
                    UsersDataStore.commitChanges();
                    UsersListingEditorGrid.selModel.clearSelections();
                    POIsDataStore.reload();
                    break;
                case 2:
                    Ext.MessageBox.show({
                        title: T_careful,
                        msg: T_cantModifyField + res[1],
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
function confirmDeleteStatuss() {
	if(StatusListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteStatuss);
	} else if(StatusListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteStatuss);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deleteStatuss(btn) {
	if (btn=='yes'){
		var selections = StatusListingEditorGrid.selModel.getSelections();
		var statusz = [];
		for(i = 0; i< StatusListingEditorGrid.selModel.getCount(); i++){
			statusz.push(selections[i].json.id_status);
		}
		var encoded_array = Ext.encode(statusz);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETESTATUS",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						StatussDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkStatus,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						StatusListingEditorGrid.selModel.clearSelections();
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
		StatusListingEditorGrid.selModel.clearSelections();
	}
}

function resetStatusForm() {
	LibStatusField.setValue('');
	colorStatusCombo.setValue('');
}

function isStatusFormValid() {
	return(LibStatusField.isValid() && colorStatusCombo.isValid()
	);
}

function displayFormWindowStatus() {
	if (!StatusCreateWindow.isVisible()) {
		resetStatusForm();
		StatusCreateWindow.show();
	} else {
		StatusCreateWindow.toFront();
	}
}

function createTheStatus() {
	if (isStatusFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATESTATUS",
				lib_status:			LibStatusField.getValue(),
				color_status:			colorStatusCombo.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedStatusSuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						StatussDataStore.reload();
						StatusCreateWindow.hide();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_pb,
							msg: T_addedStatusFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedStatusFailed,
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

function writeStatusCsv() {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=status',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvStatus+'</div></a>',
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