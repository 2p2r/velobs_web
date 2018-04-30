var TabPanelRecord = new Ext.TabPanel({
		activeTab: 0,	
		region: 'center',
		margins: '5 5 5 0',
		border: false,
		tabPosition: 'top',
		items: arrayItemsCenterPanel,
		listeners: {
			
			'tabchange': function(tabPanel, tab) {
		        console.info(tab.id);
		        if (tab.id == "BasketListingEditorGrid"){
		        	BasketsDataStore.load({params: {start: 0, limit: 100}});
		        }else if (tab.id == "StatusListingEditorGrid"){
		        	StatussDataStore.load({params: {start: 0, limit: 250}});
		        }else if (tab.id == "PrioriteListingEditorGrid"){
		        	PrioritesDataStore.load({params: {start: 0, limit: 250}});
		        }
		    }
		}
	});

var PhotoPOIModifSuppForm = new Ext.form.FormPanel({
		id: 'PhotoPOIModifSuppForm',
		fileUpload: true,
		frame: true,
		autoScroll: true,
		bodyStyle: 'padding: 5px',
		labelWidth: 50,
		defaults: {
			anchor: '95%',
			allowBlank: false,
			msgTarget: 'side'
		},
		items: arrayItemsPhotoManagement,
		buttons: arrayButtonsPhotoManagement
	});

	var PhotoPOIModifSuppWindow = new Ext.Window({
		id: 'PhotoPOIModifSuppWindow',
		iconCls: 'silk_image',
		title: T_picture,
		closable: false,
		border: false,
		width: 640,
		height: 500,
		plain: true,
		layout: 'fit',
		modal: true,
		items: PhotoPOIModifSuppForm
	});
	var PhotoPOICreateForm = new Ext.FormPanel({
	    id: 'PhotoPOICreateForm',
	    fileUpload: true,
	    frame: true,
	    bodyStyle: 'padding:5px',
	    labelWidth: 50,
	    defaults: {
	        anchor: '95%',
	        allowBlank: false,
	        msgTarget: 'side'
	    },
	    items: [hiddenIdPOI2, {
	        xtype: 'fileuploadfield',
	        id: 'form-file',
	        emptyText: T_selectPhoto,
	        fieldLabel: T_photo,
	        name: 'photo-path',
	        buttonText: '',
	        buttonCfg: {
	            iconCls: 'fugue_folder-open-document'
	        }
	    },{
	        html: "<center><span style='color:#8f5757;'>"+T_sizeOctetPhoto+"</span></center>"
	    }
	    ],
	    buttons: [
	        {
	            text: T_upload,
	            handler: function() {
	                if(PhotoPOICreateForm.getForm().isValid()){
	                    PhotoPOICreateForm.getForm().submit({
	                        url: 'lib/php/admin/uploadPhoto.php',
	                        waitMsg: T_uploadPhoto,
	                        success: function(PhotoPOICreateForm, o) {
	                            Ext.MessageBox.show({
	                                title: T_transfertOK,
	                                msg: o.result.ok,
	                                buttons: Ext.Msg.OK,
	                                icon: Ext.MessageBox.INFO,
	                                iconCls: 'silk_tick'
	                            });
	                            PhotoPOICreateWindow.hide();
	                            POIsDataStore.reload();
	                            POIListingEditorGrid.selModel.clearSelections();
	                        },
	                        failure: function(PhotoPOICreateForm, o) {
	                            Ext.MessageBox.show({
	                                title: 'Hum ...',
	                                msg: o.result.pb,
	                                buttons: Ext.Msg.OK,
	                                icon: Ext.MessageBox.ERROR,
	                                iconCls: 'fugue_cross-script'
	                            });
	                        }
	                    });
	                }
	            }
	        },{
	            text: T_reset,
	            handler: function() {
	                PhotoPOICreateForm.getForm().reset();
	            }
	        },{
	            text: T_cancel,
	            handler: function() {
	                PhotoPOICreateWindow.hide();
	                POIListingEditorGrid.selModel.clearSelections();
	            }
	        }]
	});

	var PhotoPOICreateWindow = new Ext.Window({
	    id: 'PhotoPOICreateWindow',
	    iconCls: 'silk_image_add',
	    border: false,
	    title: T_addPhoto,
	    closable: false,
	    width: 400,
	    height: 126,
	    plain: true,
	    layout: 'fit',
	    modal: true,
	    items: PhotoPOICreateForm
	});
	
	
	//DISPLAY COMMENTS FROM TABLE VIEW
	var CommentsPOIListingEditorGrid = new Ext.grid.EditorGridPanel({
	    id: 'CommentsPOIListingEditorGrid',
	    store: CommentsDataStore,
	    cm: CommentsPOIColumnModel,
	    plugins: arrayPluginsCommentForm,
	    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	    bbar: new Ext.PagingToolbar({
	        pageSize: 50,
	        store: CommentsDataStore,
	        displayInfo: true
	    })
	});
	
	
	var expandCommentsWindow = new Ext.Window({
	    title: T_comments,
	    height: 480,
	    width: 840,
	    layout: 'fit',
	    modal: true,
	    maximizable: false,
	    items: CommentsPOIListingEditorGrid,
	    iconCls: 'silk_comment',
	    closable: false,
	    buttons: [
	        {
	            text: T_close,
	            handler: function() {
	                expandCommentsWindow.hide();
	            }
	        }
	    ]
	});
	
	
	CommentsPOIListingEditorGrid.on('afteredit', editComment);

	function editComment(oGrid_event) {
	    Ext.get('update').show();
	    Ext.Ajax.request({
	        waitMsg: T_pleaseWait,
	        url: 'lib/php/admin/database.php',
	        params: {
	            task: "EDITCOMMENTS",
	            id_comment: oGrid_event.record.data.id_commentaires,
	            text_comment: oGrid_event.record.data.text_commentaires,
	            display_commentaires: oGrid_event.record.data.display_commentaires
	        },
	        success: function(response) {
	            var result = eval(response.responseText);
	            switch (result) {
	                case 1:
	                    CommentsDataStore.commitChanges();
	                    CommentsPOIListingEditorGrid.selModel.clearSelections();
	                    break;
	                case 2:
	                    Ext.MessageBox.show({
	                        title: T_careful,
	                        msg: T_cantModifyField,
	                        buttons: Ext.MessageBox.OK,
	                        icon: Ext.MessageBox.INFO
	                    });
	                    break;
	            }
	            Ext.get('update').hide();
	        },
	        failure: function(response) {
	            var result = response.responseText;
	            Ext.MessageBox.show({
	                title: T_careful,
	                msg: T_badConnect,
	                buttons: Ext.MessageBox.OK,
	                icon: Ext.MessageBox.ERROR
	            });
	            Ext.get('update').hide();
	        }
	    });
	}
	
	
	