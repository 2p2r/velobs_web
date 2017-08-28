var LibCategoryField = new Ext.form.TextField({
	id: 'LibCategoryField',
	fieldLabel: T_categoryName,
	maxLength: 50,
	allowBlank: false,
	anchor : '95%'
});

var iconComboCategory2 = new Ext.data.JsonStore({
  url: 'lib/php/admin/getIconMarker.php?case=category',
  root: 'icon',
  fields: [
    {name: 'id_icon'},
    {name: 'icon_category'}
  ]
});

var iconComboCategoryField2 = new Ext.ux.IconCombo({
	fieldLabel: T_icon,
	store: iconComboCategory2,
	displayField: 'icon_category',
	valueField: 'icon_category',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	allowBlank: false,
	triggerAction: 'all',
	selectOnFocus: true,
	iconClsField: 'icon_category',
	emptyText: ''
});

var DisplayCategoryField = new Ext.form.Checkbox({
	checked: false,
	boxLabel: T_display,
	name: 'display_category'
});

var CategoryCreateForm = new Ext.FormPanel({
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
				items: [LibCategoryField, iconComboCategoryField2, DisplayCategoryField]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createTheCategory
		},{
			text: T_cancel,
			handler: function(){
				CategoryCreateWindow.hide();
			}
	}]
});

var CategoryCreateWindow= new Ext.Window({
	id: 'CategoryCreateWindow',
	iconCls: 'fugue_node-insert',
	title: T_addCategory,
	closable: false,
	border: false,
	width: 350,
	height: 250,
	plain: true,
	layout: 'fit',
	modal: true,
	items: CategoryCreateForm
});

var CategorysDataStore = new Ext.data.Store({
	id: 'CategorysDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGCAT'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_category', type: 'int', mapping: 'id_category'},
			{ name: 'lib_category', type: 'string', mapping: 'lib_category'},
			{ name: 'icon_category', type: 'string', mapping: 'icon_category'},
			{ name: 'treerank_category', type: 'int', mapping: 'treerank_category'},
			{ name: 'display_category', type: 'bool'}
	]),
	sortInfo: {field: 'lib_category', direction: 'ASC'}
});

var chkColumn_display = new Ext.grid.CheckColumn({
	header: T_displayTab,
	width: 80,
	sortable: true,
	dataIndex: 'display_category'
});
chkColumn_display.on('click', saveTheCategory2);

var iconComboCategory = new Ext.data.JsonStore({
  url: 'lib/php/admin/getIconMarker.php?case=category',
  root: 'icon',
  fields: [
    {name: 'id_icon'},
    {name: 'icon_category'}
  ]
});

var iconComboCategoryField = new Ext.ux.IconCombo({
	fieldLabel: T_icon,
	store: iconComboCategory,
	displayField: 'icon_category',
	valueField: 'icon_category',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	allowBlank: false,
	triggerAction: 'all',
	selectOnFocus: true,
	iconClsField: 'icon_category',
	emptyText: ''
});

var CategorysColumnModel = new Ext.grid.ColumnModel(
	[{ 
			header: '#', 
			readOnly: true, 
			dataIndex: 'id_category', 
			width: 50,
			sortable: true,
			hidden: false
		},{ 
			header: T_libCat, 
			dataIndex: 'lib_category', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 200
			})
		},{ 
			header: T_icon, 
			dataIndex: 'icon_category', 
			width: 140,
			sortable: true,
			renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				return "<img src='resources/icon/marker/"+value+".png' style='vertical-align: middle' />";
			},
			editor: iconComboCategoryField
		}/*,{ 
			header: T_rank,
			dataIndex: 'treerank_category', 
			width: 110,
			sortable: true
		}*/, chkColumn_display]
);
CategorysColumnModel.defaultSortable = true;

var CategoryListingEditorGrid = new Ext.grid.EditorGridPanel({
	id: 'CategoryListingEditorGrid',
	store: CategorysDataStore,
	cm: CategorysColumnModel,
	plugins: [chkColumn_display],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: CategorysDataStore,
		displayInfo: true
	}),
  tbar: [
    {
			text: T_addCategory,
			handler: displayFormWindowCategory,
			iconCls: 'silk_add'
    }, '-', {
			text: T_deleteSelection,
			handler: confirmDeleteCategorys,
			iconCls: 'silk_delete'
  	}, '-', {
			text: T_unselect,
			handler: function(){
				CategoryListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}, '->', {
			text: T_downloadListCat,
			handler: writeCategoryCsv,
			iconCls: 'silk_table_save'
		}
	]
});
CategoryListingEditorGrid.on('afteredit', saveTheCategory);

function saveTheCategory(oGrid_event){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATECAT",
			id_category: oGrid_event.record.data.id_category,
			icon_category: oGrid_event.record.data.icon_category,
			lib_category: oGrid_event.record.data.lib_category
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					CategorysDataStore.commitChanges();
					CategoryListingEditorGrid.selModel.clearSelections();
					POIsDataStore.reload();
					SubCategorysDataStore.reload();
					//refreshTreeNode();
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

function saveTheCategory2(ctrlObj, eventObj, recordObj){
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATECAT",
			id_category: recordObj.data.id_category,
			display_category: recordObj.data.display_category
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					CategorysDataStore.commitChanges();
					CategoryListingEditorGrid.selModel.clearSelections();
					POIsDataStore.reload();
					SubCategorysDataStore.reload();
					refreshTreeNode();
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

function confirmDeleteCategorys() {
	if(CategoryListingEditorGrid.selModel.getCount() == 1) {
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteCategorys);
	} else if(CategoryListingEditorGrid.selModel.getCount() > 1) {
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteCategorys);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deleteCategorys(btn) {
	if (btn=='yes') {
		var selections = CategoryListingEditorGrid.selModel.getSelections();
		var catz = [];
		for(i = 0; i< CategoryListingEditorGrid.selModel.getCount(); i++) {
			catz.push(selections[i].json.id_category);
		}
		var encoded_array = Ext.encode(catz);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETECAT",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						CategorysDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkSubcategory,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						CategoryListingEditorGrid.selModel.clearSelections();
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
		CategoryListingEditorGrid.selModel.clearSelections();
	}
}

function resetCategoryForm() {
	CategoryCreateForm.getForm().reset();
}

function isCategoryFormValid() {
	return(LibCategoryField.isValid() &&
	iconComboCategoryField2.isValid() &&
	DisplayCategoryField.isValid()
	);
}

function displayFormWindowCategory() {
	if (!CategoryCreateWindow.isVisible()) {
		resetCategoryForm();
		CategoryCreateWindow.show();
	} else {
		CategoryCreateWindow.toFront();
	}
}

function createTheCategory() {
	if (isCategoryFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATECAT",
				lib_category:		LibCategoryField.getValue(),
				icon_category:		iconComboCategoryField2.getValue(),
				display_category:	DisplayCategoryField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedCategorySuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						CategorysDataStore.reload();
						CategoryCreateWindow.hide();
						categorySubCategoryList2.load();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_pb,
							msg: T_addedCategoryFailed,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedCategoryFailed,
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

function writeCategoryCsv() {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=category',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvCat+'</div></a>',
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