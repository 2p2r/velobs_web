var exportButton = new Ext.Button({
	iconCls: 'silk_arrow_down',
	cls: 'bold-button',
	enableToggle: true,
	text: '',
	hidden: false,
	handler: function() {
		eastPanelFormCreatePOI.collapse();
		southPanelFormExportPOI.expand();
		selectControl.activate();
		polygonControl.activate();
		treePanel.collapse();
	}
});