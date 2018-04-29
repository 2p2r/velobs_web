//composants devant être inaccessibles au compte administrateur dans l'interface de moderation d'une observation, définis dans key.js.template
//var arrayComponentsToDisable = ["StatusPOIField","RespComcomPOIField", "RespPolePOIField","TraitePolePOIField","TransmissionPolePOIField"];
var arrayComponentsToDisable = arrayComponentsToDisableRole1Admin;
for (var i = 0; i < arrayComponentsToDisable.length; i++) {
	console.log("Composant à désactiver : " + arrayComponentsToDisable[i]);
	if (Ext.getCmp(arrayComponentsToDisable[i])){
		Ext.getCmp(arrayComponentsToDisable[i]).style = {'border-color':'orange','background-color':'white','cursor':'not-allowed'};
		Ext.getCmp(arrayComponentsToDisable[i]).disable();
	}else{
		console.error("Composant non trouvé : " + arrayComponentsToDisable[i]);
	}
}
chkColumn_traiteparpolePOI.disabled = true;
var OldModo;
var OldModoCounter = 0;
PrioritePOIField.on('select', function() {
	console.info('Dans PrioritePOIField.select = ');
	if (OldModoCounter == 0) {
        OldModo = ModerationPOIField.getValue();
        OldModoCounter++;
        console.debug('OldModoCounter = ' + OldModoCounter +' et OldModo = '+OldModo);
    }
    if (this.getValue() == 1 || this.getValue() == 2) {
        ModerationPOIField.setValue(1);
        ModerationPOIField.disable();
    } else {
        ModerationPOIField.setValue(OldModo);
        ModerationPOIField.enable();
    }
});

chkColumn_displayPOI.on('click', saveThePOI);
chkColumn_fixPOI.on('click', saveThePOI);
chkColumn_moderationPOI.on('click', saveThePOI);


//CONCATENATION DES COLONNES POUR L'INTERFACE DE MODERATION DES COMMENTAIRES
var CommentsPOIColumnModel = new Ext.grid.ColumnModel(
    [{
        header: T_displayTab,
        dataIndex: 'display_commentaires',
        width: 180,
        sortable: true,
        editor: comboCommentStatusGrid
    }, textComments, photoComments, mailComments, dateCreationComments, idComments]
);
CommentsPOIColumnModel.defaultSortable = true;

var POIsColumnModel = new Ext.grid.ColumnModel(
	[identifiantPOI,{
            header: T_pole,
            dataIndex: 'lib_pole',
            width: 180,
            sortable: true,
            editor: comboPolePOI
        },{
            header: T_commune,
            dataIndex: 'lib_commune',
            width: 100,
            sortable: true,
            editor: comboCommunePOI
        },{
			header: T_titlePOI, 
			dataIndex: 'lib_poi',
			hidden: true,
			width: 200,
			sortable: true
		},{
            header: T_rueRecord,
            dataIndex: 'rue_poi',
            width: 200,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: true,
                maxLength: 200
            }),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
        },{
			header: T_numRecord, 
			dataIndex: 'num_poi', 
			width: 100,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: true,
				maxLength: 200
			}),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{
            header: T_description,
            dataIndex: 'desc_poi',
            width: 220,
            sortable: true,
            editor: new Ext.form.TextArea({
                allowBlank: true/*,
                 maxLength: 500*/
            }),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
        },{
            header: T_proposition,
            dataIndex: 'prop_poi',
            width: 220,
            sortable: true,
            editor: new Ext.form.TextArea({
                allowBlank: true/*,
                 maxLength: 500*/
            }),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
        },{
			header: T_priorite,
			dataIndex: 'lib_priorite',
			width: 100,
			sortable: true,
			editor: comboPrioritePOIGrid
		}, chkColumn_moderationPOI, photoPOI, moderatePOIButton,{
            header: T_reponseGrandToulouse,
            dataIndex: 'reponse_collectivite_poi',
            width: 220,
            sortable: true,
            css:'cursor:not-allowed;color:blue;',
            editor: new Ext.form.TextArea({
                allowBlank: true/*,
                 maxLength: 500*/
            }),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
        },{
            header: T_reponsePole,
            dataIndex: 'reponsepole_poi',
            width: 220,
            sortable: true,
            css:'cursor:not-allowed;color:blue;',
            editor: new Ext.form.TextArea({
                allowBlank: true/*,
                 maxLength: 500*/
            }),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
        },{
            header: T_commentFinal,
            dataIndex: 'commentfinal_poi',
            width: 220,
            sortable: true,
            editor: new Ext.form.TextArea({
                allowBlank: true/*,
                 maxLength: 500*/
            }),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
        },{
			header: T_obsterrain, 
			dataIndex: 'observationterrain_poi', 
			width: 220,
			sortable: true,
			editor: new Ext.form.TextArea({
				allowBlank: true/*,
				maxLength: 500*/
			}),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		}, {
            header: T_email,
            dataIndex: 'mail_poi',
            width: 100,
            sortable: true,
            editor: new Ext.form.TextField({
                allowBlank: true,
                vtype: 'email',
                maxLength: 200
            })
        }, chkColumn_displayPOI,{
            header: T_subcategory,
            dataIndex: 'lib_subcategory',
            width: 170,
            sortable: true,
            editor: comboSubCategoryPOI
        },chkColumn_transmissionPOI,chkColumn_traiteparpolePOI,{
            header: T_status,
            dataIndex: 'lib_status',
            width: 80,
			css:'cursor:not-allowed;color:blue;',
            sortable: true/*,
             editor: comboStatusPOI*/
        },{
			header: T_dateCreation, 
			dataIndex: 'datecreation_poi', 
			width: 80,
			sortable: true,
			css:'cursor:not-allowed;color:blue;',
			editor: new Ext.form.DateField({
				allowBlank: true
			})
		},{
            header: T_lastdateModif,
            dataIndex: 'lastdatemodif_poi',
            width: 120,
			css:'cursor:not-allowed;color:blue;',
            sortable: true
        }, geolocatemodePOI,{ 
			header: T_adherentRecord, 
			dataIndex: 'adherent_poi',
            hidden: true,
			width: 100,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: true,
				maxLength: 200
			})
		},{
			header: T_tel,
            hidden: true,
            dataIndex: 'tel_poi',
			width: 100,
			sortable: true,
			editor: new Ext.form.TextField({
				allowBlank: true,
				maxLength: 200
			})
		}, comments,{
			header: 'Commentaires', 
			dataIndex: 'comments', 
			width: 220,
			hidden:true,
			sortable: true,
			editor: new Ext.form.TextArea({
				allowBlank: true/*,
				maxLength: 500*/
			}),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},
	]
);
POIsColumnModel.defaultSortable = true;

var paging = new Ext.PagingToolbar({
    pageSize: limitPOIPerPage,
    store: POIsDataStore,
    displayInfo: true
});
var POIListingEditorGrid = new Ext.grid.EditorGridPanel({
	title: T_data,
	iconCls: 'fugue_reports',
	id: 'POIListingEditorGrid',
	store: POIsDataStore,
	cm: POIsColumnModel,
	plugins: [chkColumn_displayPOI, chkColumn_fixPOI, chkColumn_moderationPOI],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: paging,
  	tbar: [
  	{
		text: T_deleteSelection,
		handler: confirmDeletePOIs,
		iconCls: 'silk_delete'
	}, '-', {
		text: T_unselect,
		handler: function() {
			POIListingEditorGrid.selModel.clearSelections();
		},
		iconCls: 'silk_cross'
	}, '->', ' ', {
			text: T_downloadRecord,
			handler: writePOICsv,
			iconCls: 'silk_table_save'
		}
	]
});
POIListingEditorGrid.on('afteredit', saveThePOI);
POIListingEditorGrid.on('beforeedit', getCurrentRecord);
var record;
function getCurrentRecord(oGrid_event) {
	record = POIListingEditorGrid.getSelectionModel().getSelected();
	console.info("record getCurrentRecord = "+record);
}
function saveThePOI(ctrlObj, eventObj, recordObj) {
	Ext.get('update').show();
	console.info("ctrlObj " + ctrlObj);
	console.info("eventObj " + eventObj);
	console.info("recordObj " + recordObj);
	var dataGrid;
	if (recordObj != null){
		dataGrid = recordObj;
	}else if (ctrlObj != null){
		dataGrid = ctrlObj.record;
	}
	Ext.Ajax.request({
		waitMsg: T_pleaseWait,
		url: 'lib/php/admin/database.php',
		params: {
			task: "UPDATEPOI",
			id_poi: dataGrid.data.id_poi,
			lib_poi: dataGrid.data.lib_poi,
			adherent_poi: dataGrid.data.adherent_poi,
			num_poi: dataGrid.data.num_poi,
			tel_poi: dataGrid.data.tel_poi,
			mail_poi: dataGrid.data.mail_poi,
			rue_poi: dataGrid.data.rue_poi,
			commune_id_commune: dataGrid.data.lib_commune,
			pole_id_pole: dataGrid.data.lib_pole,
			quartier_id_quartier: dataGrid.data.lib_quartier,
			priorite_id_priorite: dataGrid.data.lib_priorite,
			status_id_status: dataGrid.data.lib_status,
			desc_poi: dataGrid.data.desc_poi,
			prop_poi: dataGrid.data.prop_poi,
			observationterrain_poi: dataGrid.data.observationterrain_poi,
			reponse_collectivite_poi: dataGrid.data.reponse_collectivite_poi,
            reponsepole_poi: dataGrid.data.reponsepole_poi,
			commentfinal_poi: dataGrid.data.commentfinal_poi,
			datecreation_poi: dataGrid.data.datecreation_poi,
			datefix_poi: dataGrid.data.datefix_poi,
			subcategory_id_subcategory: dataGrid.data.lib_subcategory,
			display_poi: dataGrid.data.display_poi,
			moderation_poi: dataGrid.data.moderation_poi,
			fix_poi: dataGrid.data.fix_poi
		},
		success: function(response) {
			var result = eval(response.responseText);
			switch (result) {
            case 1:
                POIsDataStore.commitChanges();
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 2:
            	Ext.MessageBox.alert(T_success,T_no_modification_on_data);
                break;
            case 4:
                var index = POIListingEditorGrid.store.indexOf(record);
                var rec = POIListingEditorGrid.store.getAt(index);
                rec.set('moderation_poi', '1');
                POIListingEditorGrid.selModel.clearSelections();
                break;
            case 10:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalComment,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            case 11:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationNeedFinalCommentTwin,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            	break;
            default:
            	Ext.MessageBox.show({
                    title: T_careful,
                    msg: T_errorUpdateObservationWIthoutExplanation,
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

drag = new OpenLayers.Control.DragFeature(vectorsInModerationMap,{
	onComplete: endDrag
}); 
expandMap.addControl(drag); 
drag.activate(); 

function endDrag(feat) {
	var geom = feat.geometry.clone();
	geom.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	latitudeField.setValue(geom.y);
	longitudeField.setValue(geom.x);
}


var arrayItemsCenterPanel = [POIListingEditorGrid,PrioriteListingEditorGrid,StatusListingEditorGrid,BasketListingEditorGrid];
var arrayItemsMenuAdminMap = ['Filtres : ',dateFieldModifiedSince,'&', StatusPOIFieldMapItemMenu,'&',comboPrioritePOIMapItemMenu,'&',checkboxDisplayObservationsWithCommentToModerate, ', ou ',searchObservationField,searchObservationButton,'->', comboALL];
var arrayItemsPhotoManagement = [hiddenIdPOI,
                         		{
	html: "<center><img id='photo' height='350' src='resources/images/logo_blank.png'/></center><br/>"
},{
	xtype: 'fileuploadfield',
	id: 'formfile',
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
];
	var arrayButtonsPhotoManagement = [
	                           		{
	                        			text: T_modif,
	                        			handler: function() {
	                        				if(PhotoPOIModifSuppForm.getForm().isValid()) {
	                        					PhotoPOIModifSuppForm.getForm().submit({
	                        						url: 'lib/php/admin/uploadPhoto.php',
	                        						waitMsg: T_uploadPhoto,
	                        						success: function(PhotoPOIModifSuppForm, o) {
	                        							Ext.MessageBox.show({
	                        								title: T_transfertOK,
	                        								msg: o.result.ok,
	                        								buttons: Ext.Msg.OK,
	                        								icon: Ext.MessageBox.INFO,
	                        								iconCls: 'silk_tick'
	                        							});
	                                                    POIsDataStore.reload();
	                        							PhotoPOIModifSuppWindow.hide();
	                        							POIListingEditorGrid.selModel.clearSelections();
	                        						},
	                        						failure: function(PhotoPOIModifSuppForm, o) {
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
	                        			text: T_deletePhoto,
	                        			handler: function() {
	                        				Ext.Msg.confirm(T_confirm, T_sureDeletePhoto, function(btn, text) {
	                        					if (btn == 'yes'){
	                        						Ext.Ajax.request({
	                        							waitMsg: T_pleaseWait,
	                        							url: 'lib/php/admin/database.php',
	                        							params: {
	                        								task: "RESETPHOTOPOI",
	                        								id_poi: idPOI
	                        							}, 
	                        							success: function(response) {            
	                        								var result = eval(response.responseText);
	                        								switch (result) {
	                        									case 1:
	                        										POIsDataStore.reload();
	                        										POIListingEditorGrid.selModel.clearSelections();
	                        										break;
	                        									default:
	                        										Ext.MessageBox.alert(T_careful,T_photoNotDelete);
	                        										break;
	                        								}        
	                        							},
	                        							failure: function(response) {
	                        								var result = response.responseText;
	                        								Ext.MessageBox.alert(T_error, T_badConnect);          
	                        							}
	                        						});
	                        						PhotoPOIModifSuppWindow.hide();
	                        					}
	                        				});
	                        			}
	                        		},{
	                        			text: T_cancel,
	                        			handler: function() {
	                        				PhotoPOIModifSuppWindow.hide();
	                        				POIListingEditorGrid.selModel.clearSelections();
	                        			}
	                        	}];
	var arrayPluginsCommentForm = [];
	//var arrayPluginsCommentForm = [chkColumn_displayComments];