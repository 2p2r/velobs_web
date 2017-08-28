var creditsPublic = new Ext.Window({
	title: T_credits,
	modal: true,
	border: false,
	iconCls: 'silk_information',
	layout: 'fit',
	width: 700,
	height: 500,
	closeAction:'hide',
	plain: true,
	html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/about_fr.html'></iframe>"
});

var iconCreditButtonPublic = new Ext.Button({
	iconCls: 'silk_information',
	text: T_about,
	handler: function(){
		creditsPublic.show();
	}
});