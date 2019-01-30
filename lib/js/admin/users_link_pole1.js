var UserList = new Ext.data.JsonStore({
    url: 'lib/php/admin/getModeratorUsers.php',
    root: 'users',
    fields: [
        {name: 'id_users'},
        {name: 'lib_users'}
    ]
});

var ModeratorUsersField = new Ext.form.ComboBox({
    fieldLabel: T_user,
    store: UserList,
    displayField: 'lib_users',
    valueField: 'id_users',
    forceSelection: true,
    anchor : '95%',
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});
var PoleUserList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getPoleUser.php',
    root: 'userpole',
    fields: [
        {name: 'id_userpole'},
        {name: 'lib_userpole'}
    ]
});

var PoleUserField = new Ext.form.ComboBox({
    fieldLabel: T_pole,
    store: PoleUserList2,
    displayField: 'lib_userpole',
    valueField: 'id_userpole',
    forceSelection: true,
    anchor : '95%',
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});

//var TerritoireUserList2 = new Ext.data.JsonStore({
//    url: 'lib/php/admin/getTerritoire.php',
//    root: 'userterritoire',
//    fields: [
//        {name: 'id_territoire'},
//        {name: 'lib_territoire'}
//    ]
//});
//
//var TerritoireUserField = new Ext.form.ComboBox({
//    fieldLabel: T_territoire,
//    store: TerritoireUserList2,
//    displayField: 'lib_territoire',
//    valueField: 'id_territoire',
//    anchor : '95%',
//    forceSelection: true,
//    editable: false,
//    mode: 'remote',
//    triggerAction: 'all',
//    selectOnFocus: true,
//    allowBlank: false,
//    emptyText: ''
//});


var LinkUserPoleCreateForm = new Ext.FormPanel({
    labelAlign: 'top',
    bodyStyle: 'padding:5px',
    frame: true,
    width: 400,
    items: [{
        layout: 'column',
        border: false,
        items:[{
            columnWidth:1,
            layout: 'form',
            border: false,
            items: [ModeratorUsersField,PoleUserField]
        }]
    }],
    buttons: [{
        text: T_save,
        handler: createLinkUserPole
    },{
        text: T_cancel,
        handler: function(){
        	LinkUserPoleCreateWindow.hide();
        }
    }]
});

var LinkUserPoleCreateWindow= new Ext.Window({
    id: 'UsersCreateWindow',
    iconCls: 'silk_user_add',
    title: T_addUsers,
    closable: false,
    border: false,
    width: 350,
    height: 220,
    plain: true,
    layout: 'fit',
    modal: true,
    items: LinkUserPoleCreateForm
});

var LinksDataStore = new Ext.data.Store({
    id: 'LinksDataStore',
    proxy: new Ext.data.HttpProxy({
        url: 'lib/php/admin/database.php',
        method: 'POST'
    }),
    baseParams: {task: 'LISTINGLINKUSERPOLE'},
    reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'id'
    },[
    	{ name: 'user_link_pole_id', type: 'int', mapping: 'user_link_pole_id'},
    	{ name: 'id_users', type: 'int', mapping: 'id_users'},
        { name: 'lib_users', type: 'string', mapping: 'lib_users'},
        { name: 'lib_pole', type: 'string', mapping: 'lib_pole'},
        { name: 'lib_territoire', type: 'string', mapping: 'lib_territoire'}]),
    sortInfo: {field: 'id_users', direction: 'ASC'}
});

var identifiantUser = new Ext.grid.Column({
    header: '#',
    dataIndex: 'user_link_pole_id',
    width: 30,
    sortable: true,
    hidden: false,
    readOnly: true
});
var libUser = new Ext.grid.Column({
    header: 'Lib',
    dataIndex: 'lib_users',
    width: 70,
    sortable: true,
    hidden: false,
    readOnly: true
});


var identifiantLinkUserPole = new Ext.grid.Column({
    header: '#',
    dataIndex: 'id_users',
    width: 30,
    sortable: true,
    hidden: false,
    readOnly: true
});

var poleUserList = new Ext.data.JsonStore({
    url: 'lib/php/admin/getPoleUser.php',
    root: 'userpole',
    fields: [
        {name: 'id_userpole'},
        {name: 'lib_userpole'}
    ]
});

var comboPoleUser = new Ext.form.ComboBox({
    fieldLabel: T_pole,
    store: poleUserList,
    displayField: 'lib_userpole',
    valueField: 'id_userpole',
    forceSelection: true,
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    emptyText: ''
});

var territoireUserList = new Ext.data.JsonStore({
    url: 'lib/php/admin/getTerritoire.php',
    root: 'userterritoire',
    fields: [
        {name: 'id_territoire'},
        {name: 'lib_territoire'}
    ]
});

var comboTerritoireUser = new Ext.form.ComboBox({
    fieldLabel: T_territoire,
    store: territoireUserList,
    displayField: 'lib_territoire',
    valueField: 'id_territoire',
    forceSelection: true,
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    emptyText: ''
});

//var chkColumn_deactivate = new Ext.grid.CheckColumn({
//	header: T_active_status_user,
//	width: 80,
//	sortable: true,
//	dataIndex: 'is_active_user'
//});

var LinksUserPoleColumnModel = new Ext.grid.ColumnModel(
    [{
            header: T_nomusers,
            dataIndex: 'lib_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200
            })
        },{
            header: T_pole,
            dataIndex: 'lib_pole',
            width: 150,
            sortable: true,
            editor: comboPoleUser
        },{
            header: T_territoire,
            dataIndex: 'lib_territoire',
            width: 150,
            sortable: true,
            editor: comboTerritoireUser
        }
//        ,chkColumn_deactivate
    ]
);

LinksUserPoleColumnModel.defaultSortable = true;

var UsersLinkListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'UsersLinkListingEditorGrid',
    store: LinksDataStore,
    cm: LinksUserPoleColumnModel,
    //plugins: [chkColumn_deactivate],
    clicksToEdit: 2,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 500,
        store: LinksDataStore,
        displayInfo: true
    }),
    tbar: [
        {
            text: T_addLinkUserPole,
            handler: displayFormWindowLinkUserPole,
            iconCls: 'silk_add'
        }, '-', {
            text: T_deleteSelection,
            handler: confirmDeleteLinkUserPole,
            iconCls: 'silk_delete'
        }, '-', {
            text: T_unselect,
            handler: function(){
            	UsersLinkListingEditorGrid.selModel.clearSelections();
            },
            iconCls: 'silk_cross'
        }
    ]
});
UsersLinkListingEditorGrid.on('afteredit', saveTheUser);
//chkColumn_deactivate.on('click', saveTheUserActive)
function saveTheUser(oGrid_event){
    Ext.get('update').show();
    Ext.Ajax.request({
        waitMsg: T_pleaseWait,
        url: 'lib/php/admin/database.php',
        params: {
            task: "UPDATEUSER",
            id_users: oGrid_event.record.data.id_users,
            lib_users: oGrid_event.record.data.lib_users,
            num_pole: oGrid_event.record.data.lib_userpole,
            territoire_id_territoire: oGrid_event.record.data.lib_territoire,
        },
        success: function(response) {
            var result = eval(response.responseText);
            switch (result) {
                case 1:
                	LinksDataStore.commitChanges();
                    UsersListingEditorGrid.selModel.clearSelections();
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

//function saveTheUserActive(ctrlObj, eventObj, recordObj){
//    Ext.get('update').show();
//    Ext.Ajax.request({
//        waitMsg: T_pleaseWait,
//        url: 'lib/php/admin/database.php',
//        params: {
//            task: "UPDATEUSER",
//            id_users: recordObj.data.id_users,
//            is_active_user: recordObj.data.is_active_user
//        },
//        success: function(response) {
//            var result = eval(response.responseText);
//            switch (result) {
//                case 1:
//                    UsersDataStore.commitChanges();
//                    UsersLinkListingEditorGrid.selModel.clearSelections();
//                    POIsDataStore.reload();
//                    break;
//                case 2:
//                    Ext.MessageBox.show({
//                        title: T_careful,
//                        msg: T_cantModifyField,
//                        buttons: Ext.MessageBox.OK,
//                        icon: Ext.MessageBox.INFO
//                    });
//                    break;
//            }
//            Ext.get('update').hide();
//        },
//        failure: function(response){
//            var result = response.responseText;
//            Ext.MessageBox.show({
//                title: T_careful,
//                msg: T_badConnect,
//                buttons: Ext.MessageBox.OK,
//                icon: Ext.MessageBox.ERROR
//            });
//            Ext.get('update').hide();
//        }
//    });
//}

function confirmDeleteLinkUserPole() {
    if(UsersLinkListingEditorGrid.selModel.getCount() == 1){
        Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteLinkUserPole);
    } else if(UsersLinkListingEditorGrid.selModel.getCount() > 1){
        Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteLinkUserPole);
    } else {
        Ext.MessageBox.show({
            title: 'Uh oh...',
            msg: T_cannotDeleteNothing,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    }
}

function deleteLinkUserPole(btn) {
    if (btn=='yes'){
        var selections = UsersLinkListingEditorGrid.selModel.getSelections();
        var userz = [];
        for(i = 0; i< UsersLinkListingEditorGrid.selModel.getCount(); i++){
            userz.push(selections[i].json.user_link_pole_id);
        }
        var encoded_array = Ext.encode(userz);
        Ext.get('update').show();
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "DELETELINKUSERPOLE",
                ids: encoded_array
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                    	LinksDataStore.reload();
                        break;
                    case 2:
                        Ext.MessageBox.show({
                            title: T_careful,
                            msg: T_pb,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                        UsersLinkListingEditorGrid.selModel.clearSelections();
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
    	UsersLinkListingEditorGrid.selModel.clearSelections();
    }
}

function resetLinkUserPoleForm() {
	ModeratorUsersField.setValue('');
	PoleUserField.setValue('');
}

function isLinkUserPoleFormValid() {
    return(PoleUserField.isValid() && ModeratorUsersField.isValid() );
}

function displayFormWindowLinkUserPole() {
    if (!LinkUserPoleCreateWindow.isVisible()) {
        resetLinkUserPoleForm();
        LinkUserPoleCreateWindow.show();
    } else {
    	LinkUserPoleCreateWindow.toFront();
    }
}

function createLinkUserPole() {
	if (isLinkUserPoleFormValid()) {
        Ext.get('update').show();
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "CREATELINKUSERPOLE",
                id_user: ModeratorUsersField.getValue(),
                num_pole: PoleUserField.getValue(),
                //territoire_id_territoire: TerritoireUserField.getValue(),
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        Ext.MessageBox.show({
                            title: T_success,
                            msg: T_addedLinkUserPoleSucceeded,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        LinksDataStore.reload();
                        LinkUserPoleCreateWindow.hide();
                        LinkUserPoleCreateWindow.getForm().reset();
                        break;
                    case 2:
                        Ext.MessageBox.show({
                            title: T_pb,
                            msg: T_addedLinkUserPoleFailed,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        break;
                    default:
                        Ext.MessageBox.show({
                            title: T_careful,
                            msg: T_addedLinkUserPoleFailed,
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