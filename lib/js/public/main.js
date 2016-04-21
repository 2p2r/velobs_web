var viewport;
var contentPanel;
var headerPanel;

Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'lib/js/framework/ext-3.4.0/resources/images/default/s.gif';

	headerPanel = new Ext.Panel({
		region: 'north',
		cls: 'header',
		height: 105	,
		collapseMode: 'mini',
		split: true,
		html: '<img class="pointerimg" style="margin-left:50px;" title="Association Deux Pieds Deux Roues" height="100" src="./resources/images/2p2r.png" onclick="window.open(\'http://www.2p2r.org\');"/><img class="pointerimg" style="margin-left:50px;" title="Toulouse Métropole" src="./resources/images/tmheader.png" onclick="window.open(\'http://www.toulouse-metropole.fr/\');"/><div style="float:right;margin-right:50px;margin-top:30px;font-size:1.3em;letter-spacing:0.02em;">Informations gérées par l\'Association 2 Pieds 2 Roues<br>et traitées par Toulouse Métropole<br><a href="http://www.2p2r.org/articles-divers/page-sommaire/Velobs" target="_blank">Plus d\'informations sur le site de l\'Association :)</a></div>'
	});

	viewport = new Ext.Viewport({
		layout: 'border',
		title: 'VelObs 2 Pieds 2 Roues [Carto]',
		items: [headerPanel,mapPanel,eastPanel],
		listeners: {
			'afterLayout': function() {
				Ext.get('loading').hide();
				participationButton.show();
				eastPanel.show();
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