var id_users = '';
var LoginUserUpdateField = new Ext.form.TextField({
    id: 'LoginUserUpdateField',
    fieldLabel: T_loginusers,
    maxLength: 50,
    allowBlank: false,
    anchor : '95%'
});

var PasswordUserUpdateField = new Ext.form.TextField({
    id: 'PasswordUserUpdateField',
    fieldLabel: T_newPassword,
    maxLength: 50,
    allowBlank: true,
    anchor : '95%'
});

var NameUserUpdateField = new Ext.form.TextField({
    id: 'NameUserUpdateField',
    fieldLabel: T_username,
    maxLength: 50,
    allowBlank: true,
    anchor : '95%'
});

var EmailUserUpdateField = new Ext.form.TextField({
    id: 'EmailUserUpdateField',
    fieldLabel: T_mailusers,
    maxLength: 50,
    allowBlank: true,
    anchor : '95%',
    vtype: 'email'
});

var UserDataStore = new Ext.data.Store({
    id: 'UserDataStore',
    proxy: new Ext.data.HttpProxy({
        url: 'lib/php/admin/database.php',
        method: 'POST'
    }),
    baseParams: {task: 'GETUSER'},
    reader: new Ext.data.JsonReader({
        root: 'results',
        totalProperty: 'total',
        id: 'id'
    },[
        { name: 'id_users', type: 'int', mapping: 'id_users'},
        { name: 'nom_users', type: 'string', mapping: 'nom_users'},
        { name: 'mail_users', type: 'email', mapping: 'mail_users'},
        { name: 'lib_users', type: 'string', mapping: 'lib_users'},
        { name: 'lib_usertype', type: 'string', mapping: 'lib_usertype'},
    ]),
    sortInfo: {field: 'id_users', direction: 'ASC'}
});

UserDataStore.on('load', function(){
	console.log('UserDataStore.on '+UserDataStore.getAt(0).get('lib_users')+ " "+UserDataStore.getAt(0).get('nom_users'));
	LoginUserUpdateField.setValue(UserDataStore.getAt(0).get('lib_users'));
	NameUserUpdateField.setValue(UserDataStore.getAt(0).get('nom_users'));
	EmailUserUpdateField.setValue(UserDataStore.getAt(0).get('mail_users'));
	id_users = UserDataStore.getAt(0).get('id_users')
	
});

var UsersModifForm = new Ext.FormPanel({
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
            items: [NameUserUpdateField, EmailUserUpdateField, LoginUserUpdateField, PasswordUserUpdateField]
        }]
    }],
    buttons: [{
        text: T_save,
        handler: updateTheUser
    },{
        text: T_cancel,
        handler: function(){
            UsersUpdateWindow.hide();
        }
    }]
});

var UsersUpdateWindow= new Ext.Window({
    id: 'UsersUpdateWindow',
    iconCls: 'silk_user_add',
    title: T_modifyUser,
    closable: false,
    border: false,
    width: 350,
    height: 320,
    plain: true,
    layout: 'fit',
    modal: true,
    items: UsersModifForm
});

var identifiantUser = new Ext.grid.Column({
    header: '#',
    dataIndex: 'id_users',
    width: 50,
    sortable: true,
    hidden: false,
    readOnly: true
});

var comboUsertypeUser = new Ext.form.TextField({
    fieldLabel: T_role,
    displayField: 'lib_usertype',
    valueField: 'id_usertype',
    editable: false,
    readOnly: true,
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
            }),
            readOnly: true
        }, {
            header: T_mailusers,
            dataIndex: 'mail_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200,
                vtype: 'email'
            }),
            readOnly: true
        },{
            header: T_loginusers,
            dataIndex: 'lib_users',
            width: 150,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: false,
                maxLength: 200
            }),
            readOnly: true
        },
            
        {
            header: T_role,
            dataIndex: 'lib_usertype',
            width: 150,
            sortable: true,
            editor: comboUsertypeUser,
            readOnly: true
        }
    ]
);
UsersColumnModel.defaultSortable = true;

var UserListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'UserListingEditorGrid',
    store: UserDataStore,
    cm: UsersColumnModel,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 500,
        store: UserDataStore,
        displayInfo: true
    }),
    tbar: [
        {
            text: T_modifyUser,
            handler: displayFormWindowUser,
            iconCls: 'silk_add'
        }
    ]
});
//UserListingEditorGrid.on('afteredit', saveTheUser);


function resetUserForm() {
    
}

function isUserUpdateFormValid() {
    return(LoginUserUpdateField.isValid() && PasswordUserUpdateField.isValid() && NameUserUpdateField.isValid() && EmailUserUpdateField.isValid());
}

function displayFormWindowUser() {
    if (!UsersUpdateWindow.isVisible()) {
        resetUserForm();
        UsersUpdateWindow.show();
    } else {
        UsersUpdateWindow.toFront();
    }
}

function updateTheUser() {
    if (isUserUpdateFormValid()) {
        Ext.get('update').show();
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "UPDATEUSER",
                lib_users: LoginUserUpdateField.getValue(),
                pass_users: PasswordUserUpdateField.getValue(),
                nom_users: NameUserUpdateField.getValue(),
                mail_users: EmailUserUpdateField.getValue(),
                id_users:id_users
            },
            success: function(response) {
                var result = eval(response.responseText);
                switch (result) {
                    case 1:
                        Ext.MessageBox.show({
                            title: T_success,
                            msg: T_modifyUserSucceeded,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        UserDataStore.reload();
                        UsersUpdateWindow.hide();
                        UsersModifForm.getForm().reset();
                        break;
                    case 2:
                        Ext.MessageBox.show({
                            title: T_pb,
                            msg: T_modifyUserFailed,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        break;
                    default:
                        Ext.MessageBox.show({
                            title: T_careful,
                            msg: T_modifyUserFailed,
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