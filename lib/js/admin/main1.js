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
//the user wants to load an observation with a direct link e.g. URL/velobs/admin.php?id=2840
//so load the page of the grid listing the observations containing the wanted observation
    if (getURLParameter('id') != null && isInt(getURLParameter('id'))) {
        console.info('Dans main1.js onReady getURLParameter(id) != null ' + getURLParameter('id'));
    	idEdit = getURLParameter('id');
        Ext.Ajax.request({
            waitMsg: T_pleaseWait,
            url: 'lib/php/admin/database.php',
            params: {
                task: "GETNUMPAGEIDPARAM",
                usertype: 1,
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

	contentPanel = new Ext.TabPanel({
		id: 'contentpanel',
		region: 'center',
		layoutOnTabChange: false,
		activeTab: 3,
		margins: '5 5 5 5',
		enableTabScroll: true,
		items: [{
			id: 'category',
			layout: 'fit',
			title: T_cats,
			iconCls: 'fugue_node-select-all',
			items: CategoryListingEditorGrid
		},{
			id: 'subcategory',
			layout: 'fit',
			title: T_subcategorys,
			iconCls: 'fugue_node-select-child',
			items: SubCategoryListingEditorGrid
		}, {
			id: 'poi',
			layout: 'fit',
			title: T_records,
			iconCls: 'fugue_reports',
			items: TabPanelRecord
		}, {
			id: 'mapadmin',
			layout: 'fit',
			title: T_theMap,
			iconCls: 'fugue_map-pin',
			tabCls: 'space-tab',
			items: mapAdminTabPanel
		}
		, {
			id: 'config',
			layout: 'fit',
			title: T_configuration,
			iconCls: 'silk_cog',
			tabCls: 'right-tab',
			items: TabPanelConfig
		}, {
            id: 'user',
            layout: 'fit',
            title: T_updateDataUser,
            iconCls: 'fugue_users',
            tabCls: 'right-tab',
            items: UserListingEditorGrid
        }, {
            id: 'users',
            layout: 'fit',
            title: T_users,
            iconCls: 'fugue_users',
            tabCls: 'right-tab',
            items: UsersListingEditorGrid
        }, {
            id: 'users_link_pole',
            layout: 'fit',
            title: T_users_link_pole,
            iconCls: 'fugue_users',
            tabCls: 'right-tab',
            items: UsersLinkListingEditorGrid
        }
        ],
		listeners: {
			afterLayout: function(c){
				c.strip.setWidth(c.stripWrap.getWidth() - 2);
			},
			'tabchange': function(tabPanel, tab) {
		        console.info(tab.id);
		        if (tab.id == "users"){
		        	UsersDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "user"){
		        	UserDataStore.load();
		        }else if (tab.id == "category"){
		        	CategorysDataStore.load({params: {start: 0, limit: 250}});
		        	IconsDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "subcategory"){
		        	SubCategorysDataStore.load({params: {start: 0, limit: 250}});
		        	IconsDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "users_link_pole"){
		        	LinksDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "config"){
		        	IconsDataStore.load({params: {start: 0, limit: 250}});
		        }
		    }
		}
	});

	headerPanel = new Ext.Panel({
		region: 'north',
		cls: 'header',
		id:'header',
		height: 110,
        collapseMode: 'mini',
        split: true,
		html: T_header_main_admin,
		listeners:{
			afterrender: function() {
					statStore.load({
					    callback: function () {
					    	console.log("statPanel afterrender main " + statStore.getCount());
					    	var h1 = document.createElement("H1");
							var nouveauContenu = document.createTextNode("Statut des observations créées sur votre zone");
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
        items : [headerPanel, contentPanel],
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