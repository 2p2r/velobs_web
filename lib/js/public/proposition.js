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
	}
});