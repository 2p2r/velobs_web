var viewport;
var contentPanel;
var headerPanel;

Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'lib/js/framework/ext-3.4.0/resources/images/default/s.gif';

	headerPanel = new Ext.Panel({
		region: 'north',
		cls: 'header',
		height: 105,
		collapseMode: 'mini',
		split: true,
		autoLoad: {
			url: 'resources/html/header.tpl.html'
		} 
	});

	viewport = new Ext.Viewport({
		layout: 'border',
		title: 'VelObs [Carto]',
		items: [headerPanel,mapPanel,eastPanelFormCreatePOI],
		listeners: {
			'afterLayout': function() {
				Ext.get('loading').hide();
				participationButton.show();
				eastPanelFormCreatePOI.show();
            },
            'afterrender': function() {
                if (getURLParameter('id') != null) {
                    var id = getURLParameter('id');
                    getMarkerByID(id);
                }
			}
        }
	});
});

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}