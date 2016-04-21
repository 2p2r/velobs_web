var IconCreateForm = new Ext.FormPanel({
	id: 'IconCreateForm',
	fileUpload: true,
	frame: true,
	bodyStyle: 'padding:5px',
	labelAlign: 'top',
	labelWidth: 50,
	defaults: {
		anchor: '95%',
		allowBlank: false,
		msgTarget: 'side'
	},
	items: [{
			xtype: 'fileuploadfield',
			id: 'form-file',
			allowBlank: false,
			emptyText: T_selectIcon,
			fieldLabel: T_icon,
			name: 'photo-path',
			buttonText: '',
			buttonCfg: {
				iconCls: 'fugue_folder-open-document'
			}
		},{
			html: "<center><span style='color:#8f5757;'>"+T_sizeIcon+"</span><br/><span style='color:#8f5757;'>"+T_typeIcon+"</span><br/><span style='color:#8f5757;'>"+T_sizeOctetIcon+"</span></center><br/>"
    	}
	],
	buttons: [
		{
			text: T_upload,
			handler: function(){
				if(IconCreateForm.getForm().isValid()){
					IconCreateForm.getForm().submit({
						url: 'lib/php/admin/uploadIcon.php',
						waitMsg: T_uploadIcon,
						success: function(IconCreateForm, o){
							Ext.MessageBox.show({
								title: T_transfertDone,
								msg: o.result.ok,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.INFO,
								iconCls: 'silk_tick'
							});
							IconsDataStore.load({params: {start: 0, limit: 500}});
							IconCreateWindow.hide();
						},
						failure: function(IconCreateForm, o){
							Ext.MessageBox.show({
								title: T_pb,
								minWidth: 200,
								msg: o.result.pb,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR,
								iconCls: 'fugue_cross-script'
							});
						}
					});
				}
			}
		},{
			text: T_reset,
			handler: function(){
				IconCreateForm.getForm().reset();
			}
		},{
			text: T_cancel,
			handler: function(){
				IconCreateWindow.hide();
			}
		}
	]
});

var IconCreateWindow = new Ext.Window({
	id: 'IconCreateWindow',
	iconCls: 'silk_cog_add',
	border: false,
	title: T_addIcon,
	closable: false,
	width: 500,
	height: 180,
	plain: true,
	layout: 'fit',
	modal: true,
	items: IconCreateForm
});

var IconsDataStore = new Ext.data.Store({
	id: 'IconsDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGICO'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_icon', type: 'int', mapping: 'id_icon'},
			{ name: 'lib_icon', type: 'string', mapping: 'lib_icon'},
			{ name: 'urllib_icon', type: 'string', mapping: 'urllib_icon'},
			{ name: 'color_icon', type: 'string', mapping: 'color_icon'},
			{ name: 'img_icon', type: 'string', mapping: 'img_icon'}
	])
});

var identifiantIcon = new Ext.grid.Column({
	header: '#', 
	dataIndex: 'id_icon', 
	width: 50,
	sortable: true,
	hidden: false,
	readOnly: true
});

var imgIcon = new Ext.grid.Column({
	header: T_overview, 
	dataIndex: 'img_icon', 
	width: 70,
	hidden: false,
	readOnly: true,
	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
		return '<img src="'+value+'" />';
	}
});

var IconsColumnModel = new Ext.grid.ColumnModel(
	[identifiantIcon, imgIcon, { 
			header: T_lib, 
			dataIndex: 'lib_icon', 
			width: 180,
			sortable: true,
			hidden: false,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 100
			})
		},{
			header: T_url,
			dataIndex: 'urllib_icon',
			width: 130,
			sortable: false,
			hidden: false,
			readOnly: true
		}/*,{
			header: T_colorDominant,
			dataIndex: 'color_icon',
			width: 130,
			sortable: false,
			hidden: false,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 100
			})
		}*/]
);
IconsColumnModel.defaultSortable = true;

var IconListingEditorGrid = new Ext.grid.EditorGridPanel({
	iconCls: 'fugue_marker',
	title: T_icons,
	id: 'IconListingEditorGrid',
	store: IconsDataStore,
	cm: IconsColumnModel,
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
  	tbar: [
    	{
			text: T_addIcon,
			handler: displayFormWindowIcon,
			iconCls: 'silk_add'
		}/*, '-', {
			text: T_deleteSelection,
			handler: confirmDeleteIcons,
			iconCls: 'silk_delete'
		}*/, '-', {
			text: T_unselect,
			handler: function(){
				IconListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
		}, '->', {
			html: T_reload,
			disabled: true
		}
	],
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: IconsDataStore,
		displayInfo: true
	})
});
IconListingEditorGrid.on('afteredit', saveTheIcon);

function saveTheIcon(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEICO",
			id_icon: oGrid_event.record.data.id_icon,
			lib_icon: oGrid_event.record.data.lib_icon,
			color_icon: oGrid_event.record.data.color_icon
		},
		success: function(response){
			var result = eval(response.responseText);
			switch(result){
				case 1:
					IconsDataStore.commitChanges();
					break;
				case 2:
					Ext.MessageBox.show({
							title: T_careful,
							msg: T_badConnect,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
					Ext.get('update').hide();
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

function resetIconForm(){
}

function isIconFormValid(){
	return true;
}

function displayFormWindowIcon(){
	if (!IconCreateWindow.isVisible()){
		resetIconForm();
		IconCreateWindow.show();
	} else {
		IconCreateWindow.toFront();
	}
}

function confirmDeleteIcons(){
	if(IconListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteIcons);
	} else if(IconListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteIcons);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deleteIcons(btn){
	if (btn=='yes'){
		var selections = IconListingEditorGrid.selModel.getSelections();
		var typez = [];
		for(i = 0; i< IconListingEditorGrid.selModel.getCount(); i++){
			typez.push(selections[i].json.id_icon);
		}
		var encoded_array = Ext.encode(typez);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/database.php', 
			params: { 
				task: "DELETEICO",
				ids: encoded_array
			}, 
			success: function(response){
				var result=eval(response.responseText);
				switch(result){
					case 1:
						IconsDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_pb,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						IconListingEditorGrid.selModel.clearSelections();
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
			failure: function(response){
				var result=response.responseText;
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
		IconListingEditorGrid.selModel.clearSelections();
	}
}