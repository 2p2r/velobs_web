Ext.onReady(function(){
	Ext.QuickTips.init();

	var simple = new Ext.FormPanel({
		id: 'simple',
		labelWidth: 75,
		iconCls: 'fugue_plug-connect',
		frame: true,
		title: 'VelObs [Admin]',
		bodyStyle:'padding:5px 5px 0',
		width: 350,
		defaults: {width: 230},
		defaultType: 'textfield',
		items: [
			{
				fieldLabel: 'Login ',
				name: 'login',
				id: 'login',
				allowBlank: false
			},{
				fieldLabel: 'Password ',
				name: 'password',
				inputType: 'password',
				id: 'password',
				allowBlank: false
			}
		],
		buttons: [
			{
				text: 'Connexion',
				handler: function(){
					simple.getForm().submit({
						url: 'lib/php/admin/login.php',
						waitMsg: 'Loading parameters',
						waitTitle: 'Please wait',
						success: function(simple,action) {
                            if (getURLParameter('id') != null) {
                                var id = getURLParameter('id');
                                location.href = 'admin.php?id='+id;
                            } else {
                                location.href = 'admin.php';
                            }

						},
						failure: function(simple,action) {
							Ext.getCmp('simple').getComponent('password').reset();
							Ext.getCmp('simple').getComponent('login').reset();
							Ext.MessageBox.show({
								title: 'Hum ...',
								msg: action.result.msg,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
						}
					});
				}
			},{
				text: 'Annuler',
				handler: function(){
					Ext.getCmp('simple').getComponent('password').reset();
					Ext.getCmp('simple').getComponent('login').reset();
				}
		}],
		listeners: {
			afterLayout: function(){
				Ext.get('loading').hide();
			}
		},
		keys: new Ext.KeyMap(Ext.getDoc(), [{
			key: Ext.EventObject.ENTER,
	  		fn: function(){ 
					simple.getForm().submit({
						url: 'lib/php/admin/login.php',
						waitMsg: 'Loading parameters',
						waitTitle: 'Please wait',
						success: function(simple,action) {
                            if (getURLParameter('id') != null) {
                                var id = getURLParameter('id');
                                location.href = 'admin.php?id='+id;
                            } else {
                                location.href = 'admin.php';
                            }
						},
						failure: function(simple,action) {
							Ext.getCmp('simple').getComponent('password').reset();
							Ext.getCmp('simple').getComponent('login').reset();
							Ext.MessageBox.show({
								title: 'Hum ...',
								msg: action.result.msg,
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.ERROR
							});
						}
					});
				}
			}]
		)
	});

	simple.render('form_admin');

});

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}