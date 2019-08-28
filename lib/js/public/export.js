var exportButton = new Ext.Button({
	iconCls: 'silk_arrow_down',
	cls: 'bold-button',
	enableToggle: true,
	text: '',
	hidden: false,
	handler: function() {
		//eastPanelFormCreatePOI.collapse();
		eastPanelFormExportPOI.expand();
		treePanel.collapse();
	},
	listeners: {
		click: function() {
			Ext.MessageBox.show({
				title: T_download,
				msg: T_exportHelp,
				buttons: Ext.Msg.OK,
				icon: Ext.MessageBox.INFO,
				iconCls: 'silk_information'
			});
		}
	}
});