var viewport;
var contentPanel;
var headerPanel;

var idEdit;
var noIdParam;

var numPage;

Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.BLANK_IMAGE_URL = 'lib/js/framework/ext-3.4.0/resources/images/default/s.gif';

    
    PolesDataStore.load({params: {start: 0, limit: 250}});
    CommunesDataStore.load({params: {start: 0, limit: 250}});

    if (getURLParameter('id') != null && isInt(getURLParameter('id'))) {
        idEdit = getURLParameter('id');
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "GETNUMPAGEIDPARAM",
                usertype: 4,
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
    //POIsDataStore.load({params: {start: 0, limit: 200}});
    BasketsDataStore.load({params: {start: 0, limit: 500}});

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
            //items: POIListingEditorGrid
            items: TabPanelRecord
        }, {
            id: 'mapadmin',
            layout: 'fit',
            title: T_theMap,
            iconCls: 'fugue_map-pin',
            tabCls: 'space-tab',
            items: mapAdminTabPanel
        }, {
            id: 'user',
            layout: 'fit',
            title: T_updateDataUser,
            iconCls: 'fugue_users',
            tabCls: 'right-tab',
            items: UserListingEditorGrid
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
            },
			'tabchange': function(tabPanel, tab) {
		        console.info(tab.id);
		        if (tab.id == "user"){
		        	UserDataStore.load();
		        }
		    }
        }
    });

    headerPanel = new Ext.Panel({
        region: 'north',
        cls: 'header',
        height: 110,
        collapseMode: 'mini',
        split: true,
        id:'header',
        html: T_header_main_admin,
		listeners:{
			afterrender: function() {
					statStore.load({
					    callback: function () {
					    	console.log("statPanel afterrender main " + statStore.getCount());
					    	var h1 = document.createElement("H1");
							var nouveauContenu = document.createTextNode("Statut des observations créées");
							h1.appendChild(nouveauContenu);
							Ext.get('statsVelobs').appendChild(h1);
					    	for(var a=0;a<statStore.getCount();a++) {
								var row = statStore.getAt(a);
								// switch/case for type
								var div = document.createElement("div");
								div.className = 'statusItem';
								var h2 = document.createElement("H2");
								h2.setAttribute("style",'color:'+row.data.color_status+';');
								var titleStatus = document.createTextNode(row.data.status);
								h2.appendChild(titleStatus);
								var span = document.createElement("span");
								span.setAttribute("style", 'color:'+row.data.color_status+';');
								var nbPoi = document.createTextNode(row.data.nb_poi);
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