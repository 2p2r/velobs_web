var UsertypeUserList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getUserType.php',
    root: 'usertype',
    fields: [
        {name: 'id_usertype'},
        {name: 'lib_usertype'}
    ]
});

var UsertypeUserField = new Ext.form.ComboBox({
    fieldLabel: T_role,
    store: UsertypeUserList2,
    displayField: 'lib_usertype',
    valueField: 'id_usertype',
    forceSelection: true,
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
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});

var TerritoireUserList2 = new Ext.data.JsonStore({
    url: 'lib/php/admin/getTerritoire.php',
    root: 'userterritoire',
    fields: [
        {name: 'id_territoire'},
        {name: 'lib_territoire'}
    ]
});

var TerritoireUserField = new Ext.form.ComboBox({
    fieldLabel: T_territoire,
    store: TerritoireUserList2,
    displayField: 'lib_territoire',
    valueField: 'id_territoire',
    forceSelection: true,
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    allowBlank: false,
    emptyText: ''
});

var LoginUsersField = new Ext.form.TextField({
    id: 'LoginUsersField',
    fieldLabel: T_loginusers,
    maxLength: 50,
    allowBlank: false,
    anchor : '95%'
});

var PasswordUsersField = new Ext.form.TextField({
    id: 'PasswordUsersField',
    fieldLabel: T_passusers,
    maxLength: 50,
    allowBlank: false,
    anchor : '95%'
});

var NameUsersField = new Ext.form.TextField({
    id: 'NameUsersField',
    fieldLabel: T_username,
    maxLength: 50,
    allowBlank: true,
    anchor : '95%'
});

var EmailUsersField = new Ext.form.TextField({
    id: 'EmailUsersField',
    fieldLabel: T_mailusers,
    maxLength: 50,
    allowBlank: true,
    anchor : '95%',
    vtype: 'email'
});

var UsersCreateForm = new Ext.FormPanel({
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
            items: [NameUsersField, EmailUsersField, LoginUsersField, PasswordUsersField, UsertypeUserField, PoleUserField, TerritoireUserField]
        }]
    }],
    buttons: [{
        text: T_save,
        handler: createTheUser
    },{
        text: T_cancel,
        handler: function(){
            UsersCreateWindow.hide();
        }
    }]
});

var UsersCreateWindow= new Ext.Window({
    id: 'UsersCreateWindow',
    iconCls: 'silk_user_add',
    title: T_addUsers,
    closable: false,
    border: false,
    width: 350,
    height: 420,
    plain: true,
    layout: 'fit',
    modal: true,
    items: UsersCreateForm
});

var UsersDataStore = new Ext.data.Store({
    id: 'UsersDataStore',
    proxy: new Ext.data.HttpProxy({
        url: 'lib/php/admin/database.php',
        method: 'POST'
    }),
    baseParams: {task: 'LISTINGUSER'},
    reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'id'
    },[
        { name: 'id_users', type: 'int', mapping: 'id_users'},
        { name: 'nom_users', type: 'string', mapping: 'nom_users'},
        { name: 'mail_users', type: 'email', mapping: 'mail_users'},
        { name: 'lib_users', type: 'string', mapping: 'lib_users'},
        { name: 'pass_users', type: 'string', mapping: 'pass_users'},
        { name: 'lib_usertype', type: 'string', mapping: 'lib_usertype'},
        { name: 'lib_userpole', type: 'string', mapping: 'lib_userpole'},
        { name: 'lib_territoire', type: 'string', mapping: 'lib_territoire'}
    ]),
    sortInfo: {field: 'id_users', direction: 'ASC'}
});

var identifiantUser = new Ext.grid.Column({
    header: '#',
    dataIndex: 'id_users',
    width: 50,
    sortable: true,
    hidden: false,
    readOnly: true
});

var usertypeUserList = new Ext.data.JsonStore({
    url: 'lib/php/admin/getUserType.php',
    root: 'usertype',
    fields: [
        {name: 'id_usertype'},
        {name: 'lib_usertype'}
    ]
});

var comboUsertypeUser = new Ext.form.ComboBox({
    fieldLabel: T_role,
    store: usertypeUserList,
    displayField: 'lib_usertype',
    valueField: 'id_usertype',
    forceSelection: true,
    editable: false,
    mode: 'remote',
    triggerAction: 'all',
    selectOnFocus: true,
    emptyText: ''
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

var UsersColumnModel = new Ext.grid.ColumnModel(
    [identifiantUser, {
            header: T_nomusers,
            dataIndex: 'nom_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200
            })
        }, {
            header: T_mailusers,
            dataIndex: 'mail_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200,
                vtype: 'email'
            })
        },{
            header: T_loginusers,
            dataIndex: 'lib_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200
            })
        },{
            header: T_passusers,
            dataIndex: 'pass_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200
            }),
            renderer: function(val) {
                return '<span>********</span>';
            }
        },{
            header: T_role,
            dataIndex: 'lib_usertype',
            width: 150,
            sortable: true,
            editor: comboUsertypeUser
        },{
            header: T_pole,
            dataIndex: 'lib_userpole',
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
    ]
);
UsersColumnModel.defaultSortable = true;

var UserListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'UserListingEditorGrid',
    store: UsersDataStore,
    cm: UsersColumnModel,
    clicksToEdit: 2,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 500,
        store: UsersDataStore,
        displayInfo: true
    }),
    tbar: [
        {
            text: T_addUsers,
            handler: displayFormWindowUser,
            iconCls: 'silk_add'
        }, '-', {
            text: T_deleteSelection,
            handler: confirmDeleteUsers,
            iconCls: 'silk_delete'
        }, '-', {
            text: T_unselect,
            handler: function(){
                UserListingEditorGrid.selModel.clearSelections();
            },
            iconCls: 'silk_cross'
        }
    ]
});
UserListingEditorGrid.on('afteredit', saveTheUser);

function saveTheUser(oGrid_event){
    Ext.get('update').show();
    Ext.Ajax.request({
        waitMsg: T_pleaseWait,
        url: 'lib/php/admin/database.php',
        params: {
            task: "UPDATEUSER",
            id_users: oGrid_event.record.data.id_users,
            lib_users: oGrid_event.record.data.lib_users,
            pass_users: oGrid_event.record.data.pass_users,
            nom_users: oGrid_event.record.data.nom_users,
            mail_users: oGrid_event.record.data.mail_users,
            num_pole: oGrid_event.record.data.lib_userpole,
            territoire_id_territoire: oGrid_event.record.data.lib_territoire,
            usertype_id_usertype: oGrid_event.record.data.lib_usertype
        },
        success: function(response) {
            var result = eval(response.responseText);
            switch (result) {
                case 1:
                    UsersDataStore.commitChanges();
                    UserListingEditorGrid.selModel.clearSelections();
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

function confirmDeleteUsers() {
    if(UserListingEditorGrid.selModel.getCount() == 1){
        Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deleteUsers);
    } else if(UserListingEditorGrid.selModel.getCount() > 1){
        Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deleteUsers);
    } else {
        Ext.MessageBox.show({
            title: 'Uh oh...',
            msg: T_cannotDeleteNothing,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    }
}

function deleteUsers(btn) {
    if (btn=='yes'){
        var selections = UserListingEditorGrid.selModel.getSelections();
        var userz = [];
        for(i = 0; i< UserListingEditorGrid.selModel.getCount(); i++){
            userz.push(selections[i].json.id_users);
        }
        var encoded_array = Ext.encode(userz);
        Ext.get('update').show();
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "DELETEUSER",
                ids: encoded_array
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        UsersDataStore.reload();
                        break;
                    case 2:
                        Ext.MessageBox.show({
                            title: T_careful,
                            msg: T_pb,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                        UserListingEditorGrid.selModel.clearSelections();
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
        UserListingEditorGrid.selModel.clearSelections();
    }
}

function resetUserForm() {
    LoginUsersField.setValue('');
}

function isUserFormValid() {
    return(LoginUsersField.isValid() && PasswordUsersField.isValid() && NameUsersField.isValid() && EmailUsersField.isValid() && PoleUserField.isValid() && TerritoireUserField.isValid() && UsertypeUserField.isValid());
}

function displayFormWindowUser() {
    if (!UsersCreateWindow.isVisible()) {
        resetUserForm();
        UsersCreateWindow.show();
    } else {
        UsersCreateWindow.toFront();
    }
}

function createTheUser() {
    if (isUserFormValid()) {
        Ext.get('update').show();
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "CREATEUSER",
                lib_users: LoginUsersField.getValue(),
                pass_users: PasswordUsersField.getValue(),
                nom_users: NameUsersField.getValue(),
                mail_users: EmailUsersField.getValue(),
                num_pole: PoleUserField.getValue(),
                territoire_id_territoire: TerritoireUserField.getValue(),
                usertype_id_usertype: UsertypeUserField.getValue()
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        Ext.MessageBox.show({
                            title: T_success,
                            msg: T_addedUserSuccess,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        UsersDataStore.reload();
                        UsersCreateWindow.hide();
                        UsersCreateForm.getForm().reset();
                        break;
                    case 2:
                        Ext.MessageBox.show({
                            title: T_pb,
                            msg: T_addedUserFailed,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        break;
                    default:
                        Ext.MessageBox.show({
                            title: T_careful,
                            msg: T_addedUserFailed,
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