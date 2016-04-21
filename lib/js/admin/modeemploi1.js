var TabEmploi = new Ext.TabPanel({
	activeTab: 0,	
	region: 'center',
	margins: '5 5 5 0',
	border: false,
	tabPosition: 'bottom',
	items: [{
		title: T_modeemploiRecord,
		iconCls: 'fugue_reports',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_poi_"+T_extensionLanguage+".html'></iframe>"
	},{
		title: T_cats,
		iconCls: 'fugue_node-select-all',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_cat_"+T_extensionLanguage+".html'></iframe>"
	},{
		title: T_subcategorys,
		iconCls: 'fugue_node-select-child',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_sscat_"+T_extensionLanguage+".html'></iframe>"
	},{
		title: T_configuration,
		iconCls: 'silk_cog',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_icon_"+T_extensionLanguage+".html'></iframe>"
	},{
		title: T_theMap + ' [Administration]',
		iconCls: 'fugue_map-pin',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_mapadmin_"+T_extensionLanguage+".html'></iframe>"
	},{
		title: T_theMap + ' [Publique]',
		iconCls: 'fugue_map',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_mappublic_"+T_extensionLanguage+".html'></iframe>"
	}/*,{
		title: T_android,
		iconCls: 'fugue_pda',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_android_"+T_extensionLanguage+".html'></iframe>"
	}*/,{
		title: T_credits,
		iconCls: 'fugue_information-white',
		html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/about_"+T_extensionLanguage+".html'></iframe>"
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
	html: "<iframe style='border: none; height: 100%; width: 100%' src='resources/html/modeemploi_west_fr.html'></iframe>"
});

var emploiPanel = new Ext.Panel({
	layout: 'border',
	split: true,
	items: [leftEmploiPanel, TabEmploi]
});