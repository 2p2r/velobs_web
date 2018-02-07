var viewport;
var contentPanel;
var headerPanel;

Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'lib/js/framework/ext-3.4.0/resources/images/default/s.gif';

	headerPanel = new Ext.Panel({
		region: 'north',
		cls: 'header',
		id:'header',
		height: 105	,
		collapseMode: 'mini',
		split: true,
		html: T_header_main,
		listeners:{
			afterrender: function() {
					statStore.load({
					    callback: function () {
					    	console.log("statPanel afterrender main " + statStore.getCount());
					    	var h1 = document.createElement("H1");
							const nouveauContenu = document.createTextNode("Statut des observations créées");
							h1.appendChild(nouveauContenu);
							Ext.get('statsVelobs').appendChild(h1);
					    	for(var a=0;a<statStore.getCount();a++) {
								var row = statStore.getAt(a);
								// switch/case for type
								var div = document.createElement("div");
								div.className = 'statusItem';
								var h2 = document.createElement("H2");
								const titleStatus = document.createTextNode(row.data.status);
								h2.appendChild(titleStatus);
								var span = document.createElement("span");
								const nbPoi = document.createTextNode(row.data.nb_poi);
								span.appendChild(nbPoi);
								div.appendChild(span);
								div.appendChild(h2);
								
								Ext.get('statsVelobs').appendChild(div);
							}
					     }
					 });
					
				}
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