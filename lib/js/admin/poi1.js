//composants devant être inaccessibles au compte administrateur
var arrayComponentsToDisable = ["StatusPOIField","RespComcomPOIField"];
for (var i = 0; i < arrayComponentsToDisable.length; i++) {
	Ext.getCmp(arrayComponentsToDisable[i]).style = {'border-color':'orange','background-color':'white','cursor':'not-allowed'};
	Ext.getCmp(arrayComponentsToDisable[i]).disable();
}
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
//chkColumn_moderationPOI.on('click', saveThePOI);
chkColumn_displayComments.on('click', displayComment);
//BASCULE AFFICHAGE OU NON d'UN COMMENTAIRE
function displayComment(ctrlObj, eventObj, recordObj) {
    Ext.get('update').show();
    Ext.Ajax.request({
        waitMsg: T_pleaseWait,
        url: 'lib/php/admin/database.php',
        params: {
            task: "UPDATECOMMENTS",
            //id_poi: hiddenPOIComment,
            id_comment: recordObj.data.id_commentaires,
            display_comment: recordObj.data.display_commentaires
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
        failure: function(response){
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
//CONCATENATION DES COLONNES POUR L'INTERFACE DE MODERATION DES COMMENTAIRES
var CommentsPOIColumnModel = new Ext.grid.ColumnModel(
    [idComments, textComments, photoComments, mailComments, dateCreationComments, chkColumn_displayComments]
);
CommentsPOIColumnModel.defaultSortable = true;

var CommentsPOIListingEditorGrid = new Ext.grid.EditorGridPanel({
    id: 'CommentsPOIListingEditorGrid',
    store: CommentsDataStore,
    cm: CommentsPOIColumnModel,
    plugins: [chkColumn_displayComments],
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 50,
        store: CommentsDataStore,
        displayInfo: true
    })
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
            text_comment: oGrid_event.record.data.text_commentaires
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

var expandCommentsWindow = new Ext.Window({
    title: T_comments,
    height: 480,
    width: 640,
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
//DEFINITION COLONNE DE LA DATATABLE
var comments = new Ext.grid.Column({
    header: T_comments,
    hidden: false,
    dataIndex: 'num_comments',
    width: 90,
    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
        if (value == 0) {
            metaData.css = 'nophoto';
            return value+' commentaire';
        } else {
            metaData.css = 'photo';
            if (value == 1) {
                return '<span ext:qtip="'+T_dblClickEditComment+'">'+value+' commentaire/photo</span>';
            } else {
                return '<span ext:qtip="'+T_dblClickEditComment+'">'+value+' commentaires/photos</span>';
            }
        }
    }
});
comments.on('dblclick', function(columnIndex, grid, rowIndex, e) {
    id = grid.getStore().getAt(rowIndex).get('id_poi');
    valeur = grid.getStore().getAt(rowIndex).get('num_comments');

    hiddenPOIComment = id;
    if (valeur == 0) {
        Ext.MessageBox.show({
            title: T_careful,
            msg: T_noComments,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
        });
    } else {
        CommentsDataStore.setBaseParam('id_poi', id);
        CommentsDataStore.load();
        expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
        expandCommentsWindow.show();
    }

});


var hiddenPOIPhoto;

var hiddenIdPOI3 = new Ext.form.Hidden({
    id: 'hiddenIdPOI3',
    name: 'id_POI'
});

var photoPOI = new Ext.grid.Column({
	header: T_picture, 
	dataIndex: 'photo_poi', 
	width: 100,
	hidden: false,
	readOnly: true,
	renderer: function(value, metaData, record, rowIndex, colIndex, store) {
		if (value != '') {
			metaData.css = 'photo';
		} else {
			metaData.css = 'nophoto';
		}
		if (value == '') {
			return '<span ext:qtip="'+T_dblClickAddPicture+'" style="color:gray">'+T_noPhoto+'</span>';
		} else {
			return '<span ext:qtip="'+T_dblClickModifPicture+'" style="color:gray">'+T_okPhoto+'</span>';
		}
	}
});
var idPOI; // <== need for photo
photoPOI.on('dblclick', function(columnIndex, grid, rowIndex, e, record){
	e.preventDefault();
	idPOI = grid.getStore().getAt(rowIndex).get('id_poi');

	if (grid.getStore().getAt(rowIndex).get('photo_poi') != ''){

		hiddenIdPOI.setValue(idPOI);
		var srcimg = 'resources/pictures/'+grid.getStore().getAt(rowIndex).get('photo_poi');
		var el = Ext.get('photo');

		var img = new Image();
		img.src = 'resources/pictures/'+grid.getStore().getAt(rowIndex).get('photo_poi');

		if (img.height == 0) {
			var temp = grid.getStore().getAt(rowIndex).get('photo_poi');
			var size = temp.split('x');
			var largeur = size[0];
			var hauteur = size[1];
			img.height = hauteur;
		}

		if (img.height > 350) { 
			el.set({height: 350});
			PhotoPOIModifSuppWindow.setHeight(500);
		} else {
			el.set({height: img.height});
			var ht = img.height+140;
			PhotoPOIModifSuppWindow.setHeight(ht);
		}
		el.set({src: srcimg});

		if (!PhotoPOIModifSuppWindow.isVisible()) { 
			PhotoPOIModifSuppWindow.show();
		} else { 
			PhotoPOIModifSuppWindow.toFront();
		}
	} else {
		hiddenIdPOI2.setValue(idPOI);
		PhotoPOIModifSuppWindow.show();
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
	items: [hiddenIdPOI,
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
	],
	buttons: [
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
	}]
});

var PhotoPOIModifSuppWindow = new Ext.Window({
	id: 'PhotoPOIModifSuppWindow',
	iconCls: 'silk_image_edit',
	title: T_modifSuppImage,
	closable: false,
	border: false,
	width: 640,
	height: 500,
	plain: true,
	layout: 'fit',
	modal: true,
	items: PhotoPOIModifSuppForm
});

var POIsColumnModel = new Ext.grid.ColumnModel(
	[identifiantPOI,{
            header: T_pole,
            dataIndex: 'lib_pole',
            width: 180,
            sortable: true,
            editor: comboPolePOI
        },{
            header: T_reference,
            dataIndex: 'ref_poi',
            width: 70,
            sortable: true
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
        }, printPOIButton,{
			header: T_print,
			dataIndex: 'id_poi',
			width: 100,
			sortable: true
		}, chkColumn_moderationPOI, photoPOI, moderatePOIButton,{
            header: T_reponseGrandToulouse,
            dataIndex: 'reponsegrandtoulouse_poi',
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
        },{
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
		}, comments
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
	plugins: [chkColumn_displayPOI, chkColumn_fixPOI],
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
            adherentfirstname_poi: dataGrid.data.adherentfirstname_poi,
			num_poi: dataGrid.data.num_poi,
			tel_poi: dataGrid.data.tel_poi,
			mail_poi: dataGrid.data.mail_poi,
			rue_poi: dataGrid.data.rue_poi,
			communename_poi: dataGrid.data.communename_poi,
			commune_id_commune: dataGrid.data.lib_commune,
			pole_id_pole: dataGrid.data.lib_pole,
			quartier_id_quartier: dataGrid.data.lib_quartier,
			priorite_id_priorite: dataGrid.data.lib_priorite,
			status_id_status: dataGrid.data.lib_status,
			desc_poi: dataGrid.data.desc_poi,
			prop_poi: dataGrid.data.prop_poi,
			observationterrain_poi: dataGrid.data.observationterrain_poi,
			reponsegrandtoulouse_poi: dataGrid.data.reponsegrandtoulouse_poi,
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



function confirmDeletePOIs() {
	if(POIListingEditorGrid.selModel.getCount() == 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecord, deletePOIs);
	} else if(POIListingEditorGrid.selModel.getCount() > 1){
		Ext.MessageBox.confirm(T_confirm,T_deleteRecords, deletePOIs);
	} else {
		Ext.MessageBox.show({
			title: 'Uh oh...',
			msg: T_cannotDeleteNothing,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});
	}
}

function deletePOIs(btn) {
	if (btn == 'yes') {
		var selections = POIListingEditorGrid.selModel.getSelections();
		var poiz = [];
		for (i = 0; i< POIListingEditorGrid.selModel.getCount(); i++) {
			poiz.push(selections[i].json.id_poi);
		}
		var encoded_array = Ext.encode(poiz);
		Ext.get('update').show();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php', 
			params: { 
				task: "DELETEPOI",
				ids: encoded_array
			}, 
			success: function(response) {
				var result = eval(response.responseText);
				switch(result){
					case 1:
						POIsDataStore.reload();
						BasketsDataStore.reload();
						//refreshTreeNode();
						break;
					case 2:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_cannotDeleteSelection,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
						});
						POIListingEditorGrid.selModel.clearSelections();
						break;
					default:
						Ext.MessageBox.show({
							title: T_careful,
							msg: T_cannotDeleteSelection,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR
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
	} else {
		POIListingEditorGrid.selModel.clearSelections();
	}
}


var id;
var validButton = new Ext.Button({
	iconCls: 'silk_tick',
	text: T_save,
	handler: function() {
		Ext.Ajax.request({   
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "UPDATEPOI",
                id_poi: id,
                latitude_poi: latitudeField.getValue(),
                longitude_poi: longitudeField.getValue(),
                reponsegrandtoulouse_poi: RespComcomPOIField.getValue(),
                reponsepole_poi: RespPolePOIField.getValue(),
                commune_id_commune: CommunePOIField.getValue(),
                pole_id_pole: PolePOIField.getValue(),
                status_id_status: StatusPOIField.getValue(),
                desc_poi: DescPOIField.getValue(),
                prop_poi: PropPOIField.getValue(),
                rue_poi: RuePOIField.getValue(),
                num_poi: NumPOIField.getValue(),
                priorite_id_priorite: PrioritePOIField.getValue(),
                observationterrain_poi: ObsPOIField.getValue(),
                subcategory_id_subcategory: SubCategoryPOIField.getValue(),
                commentfinal_poi: CommentFinalPOIField.getValue(),
                moderation_poi: ModerationPOIField.getValue(),
                display_poi: DisplayPOIField.getValue()
			}, 
			success: function(response) {            
				var result = eval(response.responseText);
				switch(result){
                case 1:
                	POIsDataStore.reload();
                    expandWindow.hide();
                    POIListingEditorGrid.selModel.clearSelections();
                    break;
                case 2:
                	Ext.MessageBox.alert(T_success,T_no_modification_on_data);
                	expandWindow.hide();
                    break;
                case 4:
                	POIsDataStore.reload();
                    expandWindow.hide();
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
			},
			failure: function(response) {
                idEdit = '';
				var result = response.responseText;
				Ext.MessageBox.alert(T_error, T_badConnect);          
			}
		});
	}
});

var buttonModerateComments = new Ext.Button({
	iconCls: 'silk_pencil',
	text: T_comments
	
});
buttonModerateComments.on('click', function(columnIndex, grid, rowIndex, e) {
	console.info("buttonModerateComments.on('click')" + id);
//    id = 2135;

    hiddenPOIPhoto = id;
    
    CommentsDataStore.setBaseParam('id_poi', id);
    CommentsDataStore.load();
    expandCommentsWindow.setTitle(T_comments+' [Obs. - '+id+']');
    expandCommentsWindow.show();

});
var resetButton = new Ext.Button({
	iconCls: 'silk_cancel',
	text: T_cancel,
	handler: function() {
        idEdit = '';
		expandWindow.hide();
	}
});

var buttonPhotoPOI = new Ext.Button({
	iconCls: 'silk_photos',
	text: T_image
});
buttonPhotoPOI.on('click', function() {
    if (tof != '') {
        hiddenIdPOI.setValue(id);
        var srcimg = 'resources/pictures/'+tof;
        var el = Ext.get('photo');

        var img = new Image();
        img.src = 'resources/pictures/'+tof;

        if (img.height == 0) {
            var temp = tof;
            var size = temp.split('x');
            var largeur = size[0];
            var hauteur = size[1];
            img.height = hauteur;
        }

        if (img.height > 350) {
            el.set({height: 350});
            PhotoPOIModifSuppWindow.setHeight(500);
        } else {
            el.set({height: img.height});
            var ht = img.height+140;
            PhotoPOIModifSuppWindow.setHeight(ht);
        }
        el.set({src: srcimg});

        if (!PhotoPOIModifSuppWindow.isVisible()) {
            PhotoPOIModifSuppWindow.show();
        } else {
            PhotoPOIModifSuppWindow.toFront();
        }
    }
});

var expandWindow = new Ext.Window({
    title: T_record,
    height: 600,
    width: 1200,
    layout: 'fit',
    modal: true,
    maximizable: true,
    items: [expandMapPanel],
    iconCls: 'silk_map',
    closeAction: 'hide',
    bbar : {
        xtype : 'container',
        layout : {
            type : 'vbox',
            pack  : 'start',
            align : 'stretch'
        },
        height : 225,
        defaults : { flex : 1 },
        items : [
            new Ext.Toolbar({
                height: 25,
                items : ['Rue:',RuePOIField,'Repère:',NumPOIField,'Priorité:',PrioritePOIField,'[Privé] Commentaire Vélo-Cité:',ObsPOIField]
            }),
            new Ext.Toolbar({
                height: 75,
                items : [SubCategoryPOIField,'Description:',DescPOIField,'Proposition:',PropPOIField]
            }),
            new Ext.Toolbar({
                height: 75,
                items : ['[Public]<br/> Réponse de la collectivité:',RespComcomPOIField,'[Privé]<br/> Réponse de la collectivité:',RespPolePOIField,'[Public]<br/> Commentaire Vélo-Cité:',CommentFinalPOIField]
            }),
            new Ext.Toolbar({
                height: 25,
                items : ['Commune:',CommunePOIField,'Pole:',PolePOIField,'Statut:',StatusPOIField,'Photo:',buttonPhotoPOI]
            }),
            new Ext.Toolbar({
                height: 25,
                items : ['Lat :', latitudeField, ' ', 'Long :', longitudeField,' ', 'Modération :', ModerationPOIField, 'Affichage :', DisplayPOIField,'->', buttonModerateComments, ' ',validButton, ' ', resetButton]
            })
        ]
    }
});
expandWindow.on('hide', function() {
	vectors.removeAllFeatures();
});



function createFeature(X,Y,com,pole,status,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs,comment,modo,disp,ref) {
    CommunePOIField.setValue(com);
    PolePOIField.setValue(pole);
    StatusPOIField.setValue(status);
    RespComcomPOIField.setValue(reponsecomcom);
    RespPolePOIField.setValue(reponsepole);
    DescPOIField.setValue(desc);
    PropPOIField.setValue(prop);
    SubCategoryPOIField.setValue(subcat);
    RuePOIField.setValue(rue);
    NumPOIField.setValue(num);
    PrioritePOIField.setValue(prio);
    ObsPOIField.setValue(obs);
    CommentFinalPOIField.setValue(comment);
    ModerationPOIField.setValue(modo);
    DisplayPOIField.setValue(disp);
    RefPOIField.setValue(disp);


	var point = new OpenLayers.Geometry.Point(X,Y);
	feat = new OpenLayers.Feature.Vector(point, null, 
		{
			strokeColor: "#ff0000", 
            strokeOpacity: 0.8,
            fillColor : "#ff0000",
            fillOpacity: 0.4,
            pointRadius : 8
		}
	);      
	//var feat = new OpenLayers.Feature.Vector(point,null,null);
	vectors.addFeatures([feat]);
}

drag = new OpenLayers.Control.DragFeature(vectors,{
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
printPOIButton.on('click', function(columnIndex, grid, rowIndex, e) {
    id = grid.getStore().getAt(rowIndex).get('id_poi');
    window.open('/lib/php/admin/print.php?id_poi=' + id);
});
moderatePOIButton.on('click', function(columnIndex, grid, rowIndex, e) {
	expandWindow.show();
    id = grid.getStore().getAt(rowIndex).get('id_poi');
    ref = grid.getStore().getAt(rowIndex).get('ref_poi');
	var dateLastModif = grid.getStore().getAt(rowIndex).get('lastdatemodif_poi');
	if (grid.getStore().getAt(rowIndex).get('lastdatemodif_poi') == '0000-00-00'){
		dateLastModif = grid.getStore().getAt(rowIndex).get('datecreation_poi');
	}
    expandWindow.setTitle(T_record+' n°'+id +', '+ T_lastModificationDate + ' : ' + dateLastModif + " - " + ref);
	var lat = grid.getStore().getAt(rowIndex).get('latitude_poi');
	var lon = grid.getStore().getAt(rowIndex).get('longitude_poi');

    var commune = grid.getStore().getAt(rowIndex).get('lib_commune');
    var pole = grid.getStore().getAt(rowIndex).get('lib_pole');
    var status = grid.getStore().getAt(rowIndex).get('lib_status');
    var reponsecomcom = grid.getStore().getAt(rowIndex).get('reponsegrandtoulouse_poi');
    var reponsepole = grid.getStore().getAt(rowIndex).get('reponsepole_poi');
    var obs = grid.getStore().getAt(rowIndex).get('observationterrain_poi');
    var desc = grid.getStore().getAt(rowIndex).get('desc_poi');
    var prop = grid.getStore().getAt(rowIndex).get('prop_poi');
    var subcat = grid.getStore().getAt(rowIndex).get('lib_subcategory');
    var rue = grid.getStore().getAt(rowIndex).get('rue_poi');
    var num = grid.getStore().getAt(rowIndex).get('num_poi');
    var prio = grid.getStore().getAt(rowIndex).get('lib_priorite');
    var comment = grid.getStore().getAt(rowIndex).get('commentfinal_poi');
    var modo = grid.getStore().getAt(rowIndex).get('moderation_poi');
    var disp = grid.getStore().getAt(rowIndex).get('display_poi');
    var  nbrComments = grid.getStore().getAt(rowIndex).get('num_comments');
    
    console.debug(id + ' est lié à '+nbrComments + ' commentaires');
    if (nbrComments == 0) {
    	buttonModerateComments.disable();
    } else {
    	buttonModerateComments.enable();
    }
    tof = grid.getStore().getAt(rowIndex).get('photo_poi');
    if (tof == '') {
        buttonPhotoPOI.setText(T_noImage);
        buttonPhotoPOI.disable();
    } else {
        buttonPhotoPOI.setText(T_image);
        buttonPhotoPOI.enable();
    }

	if ((lat == '') && (lon == '')) {
			var uri = 'lib/php/admin/getDefaultConfigMap.php';
			OpenLayers.loadURL(uri,'',this,setLatLonZoomDefault);
	} else {
		var lonlat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject());
        createFeature(lonlat.lon,lonlat.lat,commune,pole,status,reponsecomcom,reponsepole,desc,prop,subcat,rue,num,prio,obs,comment,modo,disp,ref);
		var lonlatwgs = lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		latitudeField.setValue(lat);
		longitudeField.setValue(lon);
		expandMap.setCenter(new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), expandMap.getProjectionObject()), 13);
	}
});


var TabPanelRecord = new Ext.TabPanel({
	activeTab: 0,	
	region: 'center',
	margins: '5 5 5 0',
	border: false,
	tabPosition: 'top',
	items: [
		POIListingEditorGrid, 
		PrioriteListingEditorGrid,
		StatusListingEditorGrid,
		BasketListingEditorGrid
	],
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
