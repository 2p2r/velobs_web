//composants devant être inaccessibles aux comptes des modérateurs associatifs  dans l'interface de moderation d'une observation
var arrayComponentsToDisable = ["StatusPOIField","RespComcomPOIField","RespPolePOIField","TraitePolePOIField","TransmissionPolePOIField"];
for (var i = 0; i < arrayComponentsToDisable.length; i++) {
	Ext.getCmp(arrayComponentsToDisable[i]).style = {'border-color':'orange','background-color':'white','cursor':'not-allowed'};
	Ext.getCmp(arrayComponentsToDisable[i]).disable();
}
chkColumn_traiteparpolePOI.disabled = true;
chkColumn_traiteparpolePOI.style={'border-color':'orange','background-color':'white','cursor':'not-allowed'};
console.log('chkColumn_traiteparpolePOI = %o',chkColumn_traiteparpolePOI)
var OldModo;
var OldModoCounter = 0;
PrioritePOIField.on('select', function() {
    if (OldModoCounter == 0) {
        OldModo = ModerationPOIField.getValue();
        OldModoCounter++;
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
chkColumn_displayComments.on('click', displayComment);
////BASCULE AFFICHAGE OU NON d'UN COMMENTAIRE
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
    [chkColumn_displayComments, textComments, photoComments, mailComments, dateCreationComments, idComments]
);
CommentsPOIColumnModel.defaultSortable = true;


var POIsColumnModel = new Ext.grid.ColumnModel(
    [identifiantPOI,{
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
            allowBlank: true
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
            allowBlank: true
        }),
        renderer: function(val) {
            return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
        }
    },{
        header: T_priorite,
        dataIndex: 'lib_priorite',
        width: 100,
        sortable: true,
        editor: comboPrioritePOIMapItemMenu
    }, chkColumn_moderationPOI, photoPOI, moderatePOIButton,{
        header: T_reponseGrandToulouse,
        dataIndex: 'reponse_collectivite_poi',
        width: 220,

        css:'cursor:not-allowed;color:blue;',
        sortable: true,
        renderer: function(val) {
            return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
        }
    },{
        header: T_reponsePole,
        dataIndex: 'reponsepole_poi',
        width: 220,
        css:'cursor:not-allowed;color:blue;',
        sortable: true,
        renderer: function(val) {
            return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
        }
    },{
        header: T_commentFinal,
        dataIndex: 'commentfinal_poi',
        width: 220,
        sortable: true,
        editor: new Ext.form.TextArea({
            allowBlank: true
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
            allowBlank: true
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
        sortable: true
    },{
        header: T_dateCreation,
        dataIndex: 'datecreation_poi',
        width: 80,
        css:'cursor:not-allowed;color:blue;',
        sortable: true,
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

var POIListingEditorGrid = new Ext.grid.EditorGridPanel({
    title: T_data,
    iconCls: 'fugue_reports',
    id: 'POIListingEditorGrid',
    store: POIsDataStore,
    cm: POIsColumnModel,
    plugins: [chkColumn_displayPOI, chkColumn_fixPOI, chkColumn_moderationPOI/*, chkColumn_transmissionPOI*/],
    clicksToEdit: 2,
    selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
    bbar: new Ext.PagingToolbar({
        pageSize: 200,
        store: POIsDataStore,
        displayInfo: true
    }),
    tbar: [
        /*{
         text: T_addRecord,
         handler: displayFormWindowPOI,
         iconCls: 'silk_add'
         }, '-', */{
            text: T_deleteSelection,
            handler: confirmDeletePOIs,
            iconCls: 'silk_delete'
        }, '-', {
            text: T_unselect,
            handler: function() {
                POIListingEditorGrid.selModel.clearSelections();
            },
            iconCls: 'silk_cross'
        }, '->', /*comboTriPOI, ' ',
         new Ext.ux.form.SearchField({
         store: POIsDataStore,
         width: 320
         }),*/ ' ', {
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
}
function saveThePOI(oGrid_event) {
    Ext.get('update').show();
    Ext.Ajax.request({
        waitMsg: T_pleaseWait,
        url: 'lib/php/admin/database.php',
        params: {
            task: "UPDATEPOI",
            id_poi: oGrid_event.record.data.id_poi,
            lib_poi: oGrid_event.record.data.lib_poi,
            adherent_poi: oGrid_event.record.data.adherent_poi,
            num_poi: oGrid_event.record.data.num_poi,
            tel_poi: oGrid_event.record.data.tel_poi,
            mail_poi: oGrid_event.record.data.mail_poi,
            rue_poi: oGrid_event.record.data.rue_poi,
            commune_id_commune: oGrid_event.record.data.lib_commune,
            pole_id_pole: oGrid_event.record.data.lib_pole,
            quartier_id_quartier: oGrid_event.record.data.lib_quartier,
            priorite_id_priorite: oGrid_event.record.data.lib_priorite,
            status_id_status: oGrid_event.record.data.lib_status,
            desc_poi: oGrid_event.record.data.desc_poi,
            prop_poi: oGrid_event.record.data.prop_poi,
            observationterrain_poi: oGrid_event.record.data.observationterrain_poi,
            reponse_collectivite_poi: oGrid_event.record.data.reponse_collectivite_poi,
            reponsepole_poi: oGrid_event.record.data.reponsepole_poi,
            commentfinal_poi: oGrid_event.record.data.commentfinal_poi,
            datecreation_poi: oGrid_event.record.data.datecreation_poi,
            datefix_poi: oGrid_event.record.data.datefix_poi,
            subcategory_id_subcategory: oGrid_event.record.data.lib_subcategory,
            display_poi: recordObj.data.display_poi,
            fix_poi: recordObj.data.fix_poi,
            moderation_poi: recordObj.data.moderation_poi
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

var arrayItemsCenterPanel = [POIListingEditorGrid,BasketListingEditorGrid];
var arrayItemsMenuAdminMap = ['<span style="color:#333; font-family:tahoma,arial,verdana,sans-serif; font-weight:normal">'+T_applicationName+'</span>', comboPrioritePOIMapItemMenu,checkboxDisplayObservationsWithCommentToModerate, ' ',searchObservationField,searchObservationButton,'->', previous, '  ', '  ', next, comboALL];
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
                                                       POIsDataStore.load();
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
var arrayPluginsCommentForm = [chkColumn_displayComments];