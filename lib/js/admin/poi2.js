//composants devant être inaccessibles aux comptes communauté de communes  dans l'interface de moderation d'une observation
var arrayComponentsToDisable = ["SubCategoryPOIField", "DescPOIField", "PropPOIField", "RuePOIField", "ObsPOIField", "NumPOIField","PrioritePOIField","CommentFinalPOIField","ModerationPOIField","DisplayPOIField"];
for (var i = 0; i < arrayComponentsToDisable.length; i++) {
	console.log("Composant à désactiver : " + arrayComponentsToDisable[i]);
	if (Ext.getCmp(arrayComponentsToDisable[i])){
		Ext.getCmp(arrayComponentsToDisable[i]).style = {'border-color':'orange','background-color':'white','cursor':'not-allowed'};
		Ext.getCmp(arrayComponentsToDisable[i]).disable();
	}else{
		console.error("Composant non trouvé : " + arrayComponentsToDisable[i]);
	}
}

chkColumn_transmissionPOI.on('click', saveThePOI);
chkColumn_traiteparpolePOI.on('click', saveThePOI);

//CONCATENATION DES COLONNES POUR L'INTERFACE DE MODERATION DES COMMENTAIRES
var CommentsPOIColumnModel = new Ext.grid.ColumnModel(
    [idComments, textComments, photoComments, mailComments, dateCreationComments]
);
CommentsPOIColumnModel.defaultSortable = true;

var POIsColumnModel = new Ext.grid.ColumnModel(
	[identifiantPOI,{ 
			header: T_titlePOI, 
			dataIndex: 'lib_poi',
			hidden: true,
			width: 200,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		},{ 
			header: T_dateCreation, 
			dataIndex: 'datecreation_poi', 
			width: 150,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		},{
            header: T_lastdateModif,
            dataIndex: 'lastdatemodif_poi',
            width: 120,
            css:'cursor:not-allowed;color:blue;',
            sortable: true
        },{
			header: T_typeObs,
			dataIndex: 'lib_subcategory',
			width: 170,
			css:'cursor:not-allowed;color:blue;',
			sortable: true
		}, photoPOI, {
			header: T_commune,
			dataIndex: 'lib_commune',
			width: 170,
			sortable: true,
			editor: comboCommunePOI
		},{
			header: T_pole,
			dataIndex: 'lib_pole',
			width: 170,
			sortable: true,
			editor: comboPolePOI
		},{ 
			header: T_rueRecord, 
			dataIndex: 'rue_poi', 
			width: 100,
			sortable: true,
			css:'cursor:not-allowed;color:blue;',
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            },
            editor: new Ext.form.TextArea({
                allowBlank: true,
                readOnly: true
            })
		},{ 
			header: T_numRecord, 
			dataIndex: 'num_poi', 
			width: 100,
			css:'cursor:not-allowed;color:blue;',
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            },
            editor: new Ext.form.TextArea({
                allowBlank: true,
                readOnly: true
            })
		},moderatePOIButton,  {
			header: T_description, 
			dataIndex: 'desc_poi', 
			width: 220,
			sortable: true,
			css:'cursor:not-allowed;color:blue;',
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            },
            editor: new Ext.form.TextArea({
                allowBlank: true,
                readOnly: true,
                height: 200
            })
		},{ 
			header: T_proposition, 
			dataIndex: 'prop_poi', 
			width: 220,
			sortable: true,
			css:'cursor:not-allowed;color:blue;',
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            },
            editor: new Ext.form.TextArea({
                allowBlank: true,
                readOnly: true,
                height: 200
            })
		},{
			header: T_priorite,
			dataIndex: 'lib_priorite',
			css:'cursor:not-allowed;color:blue;',
			width: 170,
			sortable: true
		},{ 
			header: T_obsterrain, 
			dataIndex: 'observationterrain_poi', 
			width: 220,
			css:'cursor:not-allowed;color:blue;',
			sortable: true,
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},{ 
			header: T_reponseGrandToulouse, 
			dataIndex: 'reponse_collectivite_poi', 
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
			header: T_commentFinal, 
			dataIndex: 'commentfinal_poi', 
			width: 220,
			sortable: true,
			css:'cursor:not-allowed;color:blue;',
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},chkColumn_transmissionPOI,chkColumn_traiteparpolePOI,{
			header: T_status,
			dataIndex: 'lib_status',
			width: 170,
			sortable: true,
			editor: comboStatusPOI
		},{ 
			header: T_reponsePole, 
			dataIndex: 'reponsepole_poi', 
			width: 220,
			sortable: true,
			editor: new Ext.form.TextArea({
				allowBlank: true
			}),
            renderer: function(val) {
                return '<span ext:qtip="'+val.replace(/"/g,'&rdquo;')+'">'+val+'</span>';
            }
		},chkColumn_traiteparpolePOI,comments
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
	plugins: [chkColumn_displayPOI, chkColumn_fixPOI, chkColumn_moderationPOI, chkColumn_transmissionPOI,chkColumn_traiteparpolePOI],
	clicksToEdit: 2,
	selModel: new Ext.grid.RowSelectionModel({singleSelect: false}),
	bbar: paging,
  	tbar: [
  	'->', {
			text: T_downloadRecord,
			handler: writePOICsv,
			iconCls: 'silk_table_save'
		}
	]
});
POIListingEditorGrid.on('afteredit', saveThePOI);

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
			desc_poi: oGrid_event.record.data.desc_poi,
			status_id_status: oGrid_event.record.data.lib_status,
			prop_poi: oGrid_event.record.data.prop_poi,
			observationterrain_poi: oGrid_event.record.data.observationterrain_poi,
			reponse_collectivite_poi: oGrid_event.record.data.reponse_collectivite_poi,
			reponsepole_poi: oGrid_event.record.data.reponsepole_poi,
			commentfinal_poi: oGrid_event.record.data.commentfinal_poi,
			datecreation_poi: oGrid_event.record.data.datecreation_poi,
			datefix_poi: oGrid_event.record.data.datefix_poi,
			subcategory_id_subcategory: oGrid_event.record.data.lib_subcategory,
			transmission_poi: recordObj.data.transmission_poi,
			traiteparpole_poi: recordObj.data.traiteparpole_poi
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
            	POIsDataStore.commitChanges();
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



var arrayItemsCenterPanel = [POIListingEditorGrid];
var arrayItemsMenuAdminMap = [dateFieldModifiedSince,StatusPOIFieldMapItemMenu,comboPrioritePOIMapItemMenu,checkboxDisplayObservationsToBeAnalyzedByComCom, searchObservationField,searchObservationButton, '->', comboALL];
var arrayItemsPhotoManagement = [hiddenIdPOI,
	{
		html: "<center><img id='photo' height='350' src='resources/images/logo_blank.png'/></center><br/>"
	}
];
var arrayButtonsPhotoManagement = [{
			text: T_close,
			handler: function() {
				PhotoPOIModifSuppWindow.hide();
				POIListingEditorGrid.selModel.clearSelections();
			}
	    }
    ];

var arrayPluginsCommentForm = [];