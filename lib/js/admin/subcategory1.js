var LibSubCategoryField = new Ext.form.TextField({
	id: 'LibSubCategoryField',
	fieldLabel: T_libSubCat,
	maxLength: 100,
	allowBlank: false,
	anchor : '95%'
});

var iconComboSubCategory2 = new Ext.data.JsonStore({
  url: 'lib/php/admin/getIconMarker.php?case=subcategory',
  root: 'icon',
  fields: [
    {name: 'id_icon'},
    {name: 'icon_subcategory'}
  ]
});

var iconComboSubCategoryField2 = new Ext.ux.IconCombo({
	fieldLabel: T_icon,
	store: iconComboSubCategory2,
	displayField: 'icon_subcategory',
	valueField: 'icon_subcategory',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	allowBlank: false,
	triggerAction: 'all',
	selectOnFocus: true,
	iconClsField: 'icon_subcategory',
	emptyText: ''
});

var categorySubCategoryList2 = new Ext.data.JsonStore({
  url: 'lib/php/admin/getCategory.php',
  root: 'category',
  fields: [
    {name: 'id_category'},
    {name: 'lib_category'}
  ]
});

var CategorySubCategoryField = new Ext.form.ComboBox({
	fieldLabel: T_cat,
	store: categorySubCategoryList2,
	displayField: 'lib_category',
	valueField: 'id_category',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	allowBlank: false,
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var DisplaySubCategoryField = new Ext.form.Checkbox({
	checked: false,
	boxLabel: T_display,
	name: 'display_subcategory'
});

var PropPublicSubCategoryField = new Ext.form.Checkbox({
	checked: false,
	boxLabel: T_propPublic,
	name: 'proppublic_subcategory'
});

var SubCategoryCreateForm = new Ext.FormPanel({
	labelAlign: 'top',
	bodyStyle: 'padding:5px',
	frame: true,
	width: 350,        
	items: [{
		layout: 'column',
		border: false,
		items:[{
				columnWidth:1.0,
				layout: 'form',
				border: false,
				items: [LibSubCategoryField, iconComboSubCategoryField2, CategorySubCategoryField, PropPublicSubCategoryField, DisplaySubCategoryField]
			}]
	}],
	buttons: [{
			text: T_save,
			handler: createTheSubCategory
		},{
			text: T_cancel,
			handler: function(){
				SubCategoryCreateWindow.hide();
			}
	}]
});

var SubCategoryCreateWindow= new Ext.Window({
	id: 'SubCategoryCreateWindow',
	iconCls: 'fugue_node-insert-child',
	title: T_addSubCategory,
	closable: false,
	border: false,
	width: 350,
	height: 310,
	plain: true,
	layout: 'fit',
	modal: true,
	items: SubCategoryCreateForm
});

var categorySubCategoryList = new Ext.data.JsonStore({
  url: 'lib/php/admin/getCategory.php',
  root: 'category',
  fields: [
    {name: 'id_category'},
    {name: 'lib_category'}
  ]
});

var comboCategorySubCategory = new Ext.form.ComboBox({
	fieldLabel: T_cat,
	store: categorySubCategoryList,
	displayField: 'lib_category',
	valueField: 'id_category',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	emptyText: ''
});

var SubCategorysDataStore = new Ext.data.Store({
	id: 'SubCategorysDataStore',
	proxy: new Ext.data.HttpProxy({
		url: 'lib/php/admin/database.php',
		method: 'POST'
	}),
	baseParams: {task: 'LISTINGSUBCAT'},
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id'
	},[
			{ name: 'id_subcategory', type: 'int', mapping: 'id_subcategory'},
			{ name: 'lib_subcategory', type: 'string', mapping: 'lib_subcategory'},
			{ name: 'icon_subcategory', type: 'string', mapping: 'icon_subcategory'},
			{ name: 'lib_category', type: 'string', mapping: 'lib_category'},
			{ name: 'display_subcategory', type: 'bool'},
			{ name: 'proppublic_subcategory', type: 'bool'}
	]),
	sortInfo: {field: 'lib_subcategory', direction: 'ASC'}
});

var chkColumn_displaySubCategory = new Ext.grid.CheckColumn({
	header: T_displayTab,
	width: 80,
	sortable: true,
	dataIndex: 'display_subcategory'
});
chkColumn_displaySubCategory.on('click', saveTheSubCategory2);

var chkColumn_propPublicSubCategory = new Ext.grid.CheckColumn({
	header: T_propPublicTab,
	width: 150,
	sortable: true,
	dataIndex: 'proppublic_subcategory'
});
chkColumn_propPublicSubCategory.on('click', saveTheSubCategory3);

var iconComboSubCategory = new Ext.data.JsonStore({
  url: 'lib/php/admin/getIconMarker.php?case=subcategory',
  root: 'icon',
  fields: [
    {name: 'id_icon'},
    {name: 'icon_subcategory'}
  ]
});

var iconComboSubCategoryField = new Ext.ux.IconCombo({
	fieldLabel: T_icon,
	store: iconComboSubCategory,
	displayField: 'icon_subcategory',
	valueField: 'icon_subcategory',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	allowBlank: false,
	triggerAction: 'all',
	selectOnFocus: true,
	iconClsField: 'icon_subcategory',
	emptyText: ''
});

var SubCategorysColumnModel = new Ext.grid.ColumnModel(
	[{ 
			header: '#', 
			readOnly: true, 
			dataIndex: 'id_subcategory', 
			width: 50,
			sortable: true,
			hidden: false
		},{ 
			header: T_libSubCat, 
			dataIndex: 'lib_subcategory', 
			width: 200,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: false,
				maxLength: 100
			})
		},{
			header: T_cat,
			dataIndex: 'lib_category',
			width: 130,
			sortable: true,
			editor: comboCategorySubCategory
		},{ 
			header: T_icon, 
			dataIndex: 'icon_subcategory', 
			width: 140,
			sortable: true,
			renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				return "<img src='resources/icon/marker/"+value+".png' style='vertical-align: middle' />";
			},
			editor: iconComboSubCategoryField
		}, chkColumn_displaySubCategory, chkColumn_propPublicSubCategory]
);
SubCategorysColumnModel.defaultSortable = true;

var SubCategoryListingEditorGrid = new Ext.grid.EditorGridPanel({
	id: 'SubCategoryListingEditorGrid',
	store: SubCategorysDataStore,
	cm: SubCategorysColumnModel,
	plugins: [chkColumn_displaySubCategory, chkColumn_propPublicSubCategory],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: new Ext.PagingToolbar({
		pageSize: 500,
		store: SubCategorysDataStore,
		displayInfo: true
	}),
  tbar: [
    {
			text: T_addSubCategory,
			handler: displayFormWindowSubCategory,
			iconCls: 'silk_add'
    }, '-', {
			text: T_deleteSelection,
			handler: confirmDeleteSubCategorys,
			iconCls: 'silk_delete'
  	}, '-', {
			text: T_unselect,
			handler: function(){
				SubCategoryListingEditorGrid.selModel.clearSelections();
			},
			iconCls: 'silk_cross'
  	}, '->', {
			text: T_downloadListSubCat,
			handler: writeSubCategoryCsv,
			iconCls: 'silk_table_save'
		}
	]
});
SubCategoryListingEditorGrid.on('afteredit', saveTheSubCategory);

function saveTheSubCategory(oGrid_event) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: 'Please wait...',
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATESUBCAT",
			id_subcategory: oGrid_event.record.data.id_subcategory,
			lib_subcategory: oGrid_event.record.data.lib_subcategory,
			icon_subcategory: oGrid_event.record.data.icon_subcategory,
			category_id_category: oGrid_event.record.data.lib_category
		},
		success: function(response){
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					SubCategorysDataStore.commitChanges();
					SubCategoryListingEditorGrid.selModel.clearSelections();
					POIsDataStore.reload();
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

function saveTheSubCategory2(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATESUBCAT",
			id_subcategory: recordObj.data.id_subcategory,
			display_subcategory: recordObj.data.display_subcategory
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					SubCategorysDataStore.commitChanges();
					SubCategoryListingEditorGrid.selModel.clearSelections();
					POIsDataStore.reload();
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

function saveTheSubCategory3(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATESUBCAT",
			id_subcategory: recordObj.data.id_subcategory,
			proppublic_subcategory: recordObj.data.proppublic_subcategory
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
				case 1:
					SubCategorysDataStore.commitChanges();
					SubCategoryListingEditorGrid.selModel.clearSelections();
					POIsDataStore.reload();
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

function confirmDeleteSubCategorys() {
	if(SubCategoryListingEditorGrid.selModel.getCount() == 1) {
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteSubCategorys);
	} else if(SubCategoryListingEditorGrid.selModel.getCount() > 1) {
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteSubCategorys);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deleteSubCategorys(btn) {
	if (btn=='yes'){
		var selections = SubCategoryListingEditorGrid.selModel.getSelections();
		var subcategoryz = [];
		for(i = 0; i< SubCategoryListingEditorGrid.selModel.getCount(); i++) {
			subcategoryz.push(selections[i].json.id_subcategory);
		}
		var encoded_array = Ext.encode(subcategoryz);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETESUBCAT",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						SubCategorysDataStore.reload();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_linkPOI,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						SubCategoryListingEditorGrid.selModel.clearSelections();
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
		SubCategoryListingEditorGrid.selModel.clearSelections();
	}
}

function resetSubCategoryForm() {
	SubCategoryCreateForm.getForm().reset();
	categorySubCategoryList2.load();
}

function isSubCategoryFormValid() {
	return(LibSubCategoryField.isValid() && 
	iconComboSubCategoryField2.isValid() &&
	CategorySubCategoryField.isValid() &&
	DisplaySubCategoryField.isValid() &&
	PropPublicSubCategoryField.isValid()
	);
}

function displayFormWindowSubCategory() {
	if (!SubCategoryCreateWindow.isVisible()) {
		resetSubCategoryForm();
		SubCategoryCreateWindow.show();
	} else {
		SubCategoryCreateWindow.toFront();
	}
}

function createTheSubCategory(){
	if (isSubCategoryFormValid()) {
		Ext.get('update').show();
		Ext.Ajax.request({   
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATESUBCAT",
				lib_subcategory:			LibSubCategoryField.getValue(),
				icon_subcategory:			iconComboSubCategoryField2.getValue(),
				category_id_category:		CategorySubCategoryField.getValue(),
				display_subcategory:		DisplaySubCategoryField.getValue(),
				proppublic_subcategory:		PropPublicSubCategoryField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch (result) {
					case 1:
						Ext.MessageBox.show({
							title: T_success,
							msg: T_addedSubCategorySuccess,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.INFO
						});
						SubCategorysDataStore.reload();
						SubCategoryCreateWindow.hide();
						subCategoryPOIList2.load();
						refreshTreeNode();
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_addedSubCategoryFailed,
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

function writeSubCategoryCsv(){
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=subcategory',
		success: function (response) {
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true){
				Ext.Msg.buttonText.cancel = T_close;
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvSubCat+'</div></a>',
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