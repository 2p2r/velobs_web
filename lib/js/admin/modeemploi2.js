var TabEmploi = new Ext.TabPanel({
	activeTab: 0,	
	region: 'center',
	margins: '5 5 5 0',
	border: false,
	tabPosition: 'bottom',
	items: [{
		title: T_modeemploiRecord,
		iconCls: 'fugue_reports',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_poi2_"+T_extensionLanguage+".html'></iframe>"
	}]
});

var leftEmploiPanel = new Ext.Panel({
	id: 'leftEmploiPanel',
	region: 'west',
	boder: false,
	layout: 'fit',
	header: false,
	split: true,
	width: 300,
	minSize: 150,
	maxSize: 300,
	autoScroll: false,
	margins: '5 0 5 5',
	cmargins: '5 5 5 5',
	collapsible: true,
	collapseMode: 'mini',
	html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_west2_"+T_extensionLanguage+".html'></iframe>"
});

var emploiPanel = new Ext.Panel({
	layout: 'border',
	split: true,
	items: [leftEmploiPanel, TabEmploi]
});