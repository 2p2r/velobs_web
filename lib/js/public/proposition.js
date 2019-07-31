var participationButton = new Ext.Button({
	iconCls: 'silk_exclamation',
	cls: 'bold-button',
	enableToggle: true,
	text: T_submitProp,
	hidden: true,
	handler: function() {
		eastPanelFormCreatePOI.expand();
		treePanel.collapse();
		addPoi();
	},
	listeners: {
		click: function() {
		 	Ext.MessageBox.show({
		 		title: "C'est l'été !",
		 		msg: T_messageVacances,
		 		buttons: Ext.Msg.OK,
		 		icon: Ext.MessageBox.INFO,
		 		iconCls: 'silk_information'
		 	});
		}
	}
});