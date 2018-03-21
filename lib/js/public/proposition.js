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
	// TODO (CMR) : deleteme
	//listeners: {
		// click: function() {
		// 	Ext.MessageBox.show({
		// 		title: T_howToParticipate,
		// 		msg: T_textHowToParticipate,
		// 		buttons: Ext.Msg.OK,
		// 		icon: Ext.MessageBox.INFO,
		// 		iconCls: 'silk_information'
		// 	});
		// }
	//}
});