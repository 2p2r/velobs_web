var viewport;
var contentPanel;
var headerPanel;

var idEdit;
var noIdParam;

var numPage;

Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL = 'lib/js/framework/ext-3.4.0/resources/images/default/s.gif';

    if (getURLParameter('id') != null && isInt(getURLParameter('id'))) {
        idEdit = getURLParameter('id');
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "GETNUMPAGEIDPARAM",
                usertype: 3,
                numRecordPerPage: limitPOIPerPage,
                idToFind: getURLParameter('id')
            },
            success: function(response) {
                numPage = response.responseText;
                if (numPage == 1) {
                    POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
                } else if (numPage == -1) {
                    alreadyShowExpandWindowGetParameter = 1;
                    POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
                    Ext.MessageBox.show({
                        title: T_recordNotFound,
                        msg: T_beCarrefulRecordNotFound,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                }
                else {
                    POIsDataStore.load({params: {start: limitPOIPerPage * (numPage - 1), limit: limitPOIPerPage}});
                }

            }
        });
    } else if (!isInt(getURLParameter('id'))) {
        noIdParam = -1;
        POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
        Ext.MessageBox.show({
            title: T_careful,
            msg: T_idNotInteger,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
    } else {
        noIdParam = -1;
        POIsDataStore.load({params: {start: 0, limit: limitPOIPerPage}});
    }
	//POIsDataStore.load({params: {start: 0, limit: 500}});

	contentPanel = new Ext.TabPanel({
		id: 'contentpanel',
		region: 'center',
		layoutOnTabChange: false,
		activeTab: 0,
		margins: '5 5 5 5',
		enableTabScroll: true,
		items: [{
			id: 'poi',
			layout: 'fit',
			title: T_records,
			iconCls: 'fugue_reports',
			items: POIListingEditorGrid
		}, {
            id: 'mapadmin',
            layout: 'fit',
            title: T_theMap,
            iconCls: 'fugue_map-pin',
            tabCls: 'space-tab',
            items: mapAdminTabPanel
        }/*, {
			id: 'modeemploi',
			layout: 'fit',
			title: 'Mode d\'emploi',
			iconCls: 'silk_information',
			tabCls: 'right-tab',
			items: emploiPanel
		}*/],
		listeners: {
			afterLayout: function(c){
				c.strip.setWidth(c.stripWrap.getWidth() - 2);
			}
		}
	});
    contentPanel.on('tabchange', function() {
        if (typeof popup != "undefined") {
            selectCtrl.unselectAll();
            popup.hide();
        }
    });

	headerPanel = new Ext.Panel({
		region: 'north',
		cls: 'header',
		height: 110,
        collapseMode: 'mini',
        split: true,
		html: ''
	});

	viewport = new Ext.Viewport({
		layout: 'border',
		title: 'VelObs',
		items: [headerPanel, contentPanel],
		listeners: {
			afterLayout: function(){
				Ext.get('loading').hide();
				PhotoPOIModifSuppWindow.show();
				PhotoPOIModifSuppWindow.hide();
			}
		}
	});

});

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function isInt(n) {
    return n % 1 === 0;
}