
//field added to the map menus to filter by date
var dateLastModif;
var dateNotModifiedSince;
var nbSupportMinimum = 0;
var dateFieldModifiedSince = new Ext.form.DateField(
{
    id: 'dateFieldModifiedSince',
    xtype: 'datefield',
    format: 'd/m/Y',
    editable: false,
    emptyText: T_modifiedSince,
    listeners: {
        select: function(value, date) {
        	console.log('%o',value);
        	dateLastModif = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        	dateFieldNotModifiedSince.reset();
        	dateNotModifiedSince ='2060-01-01';
        	console.log(dateLastModif);
        	clearMarker();
        	getMarker();
        }
    }
});
var CancelDateFilterItem = new Ext.Button({
	id:'CancelDateFilterItem',
	iconCls: 'silk_cancel',
	text:'',
	handler: function() {
	  dateFieldModifiedSince.reset();
	  dateLastModif ='1900-01-01';
	  clearMarker();
		getMarker();
	}
});
var dateFieldNotModifiedSince = new Ext.form.DateField(
{
    id: 'dateFieldNotModifiedSince',
    xtype: 'datefield',
    format: 'd/m/Y',
    editable: false,
    emptyText: T_NotModifiedSince,
    listeners: {
        select: function(value, date) {
        	console.log('%o',value);
        	dateNotModifiedSince = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        	dateFieldModifiedSince.reset();
        	dateLastModif ='1900-01-01';
        	console.log(dateNotModifiedSince);
        	clearMarker();
        	getMarker();
        }
    }
});

var CancelDateNotModifiedFilterItem = new Ext.Button({
	id:'CancelDateNotModifiedFilterItem',
	iconCls: 'silk_cancel',
	text:'',
	handler: function() {
	  dateFieldNotModifiedSince.reset();
	  dateNotModifiedSince ='2060-01-01';
	  clearMarker();
		getMarker();
	}
});
var numberFieldNbSupport = new Ext.form.NumberField(
		{
		    id: 'numberFieldNbSupport',
		    xtype: 'numberfield',
		    width:'100px', 
		    emptyText: "# votes minimum",
		    listeners: {
		        blur: function(field) {
		        	console.log('nbSupportMinimum = %o',field.getValue());
		        	nbSupportMinimum = field.getValue();
		        	clearMarker();
		        	getMarker();
		        },specialkey: function (field, e) {
		            if (field.getValue() != 'null') {
		                if (e.getKey() === e.ENTER || e.getKey() === e.TAB) {
		                	nbSupportMinimum = field.getValue();
		                	console.log('nbSupportMinimum = %o',field.getValue());
		                	console.log(e.getKey());
		                	clearMarker();
		                	getMarker();
		                }
		            }
		        }
		    }
		});
numberFieldNbSupport.on('afterrender', function(){
	  Ext.QuickTips.register({ target: this.getEl(), text: 'N\'afficher que les observations qui ont plus de X votes' });
	});
var CancelVoteFilterItem = new Ext.Button({
	id:'CancelVoteFilterItem',
	iconCls: 'silk_cancel',
	text:'',
	handler: function() {
		numberFieldNbSupport.reset();
		nbSupportMinimum = 0;
		clearMarker();
		getMarker();
	}
});
var GetObsVotesPage = new Ext.Button({
	id:'GetObsVotesPage',
	iconCls: '',
	text:'Voir les observations les plus plebiscitées',
	handler: function() {
	  window.open("lib/php/public/getJsonObsVotes.php")
	}
});
var searchObservationField = new Ext.form.NumberField({
	id: 'searchObservationField',
	allowBlank: true,
	anchor : '99%',
	emptyText:'N° Observation à afficher',
	width:150,
	listeners: {
        blur: function(field) {
        	
        	getMarkerByID(field.getValue());
        },specialkey: function (field, e) {
            if (field.getValue() != 'null') {
                if (e.getKey() === e.ENTER || e.getKey() === e.TAB) {
                	getMarkerByID(field.getValue()); 
                }
            }
        }
    }
});
searchObservationField.on('afterrender', function(){
	  Ext.QuickTips.register({ target: this.getEl(), text: 'N\'afficher que l\'observation ayant le numéro X' });
	});

//checkbox affichage des limites geographiques des communes sur la carte 
var checkBoxdisplayLayerLimitesGeographiquesCommunes = new Ext.form.Checkbox({
	boxLabel: T_geographicalCommunesBounds,
	id : 'chkCommunes',
	checked: false,
	listeners: {
		'check': function () {
			switch (this.getValue()) {
			case true:
				displayLayerLimitesGeographiquesCommunes();
				Ext.getCmp("chkPoles").setValue(false);
				break;
			case false:
				hideLayerLimitesGeographiquesCommunes();
				break;
			}
		}
	}
});
//checkbox affichage des limites geographiques des poles sur la carte
var checkBoxDisplaylayerLimitesGeographiquesPoles = new Ext.form.Checkbox({
	boxLabel: T_geographicalPolesBounds,
	id : 'chkPoles',
	checked: false,
	listeners: {
		'check': function () {
			switch (this.getValue()) {
			case true:
				displayLayerLimitesGeographiquesPoles();
				Ext.getCmp("chkCommunes").setValue(false);
				break;
			case false:
				hideLayerLimitesGeographiquesPoles();
				break;
			}
		}
	}
});
var PolePOIList = new Ext.data.JsonStore({
	url: 'lib/php/public/getPole.php',
	root: 'pole',
	fields: [
	         {name: 'id_pole'},
	         {name: 'lib_pole'},
	         {name: 'geom'}
	         ],
});
var CommunePOIList = new Ext.data.JsonStore({
	url: 'lib/php/public/getCommune.php',
	root: 'commune',
	fields: [
	         {name: 'id_commune'},
	         {name: 'lib_commune'},
	         {name: 'geom'}
	         ]
});

var communesLoaded = 0;
function displayLayerLimitesGeographiquesCommunes(){
	console.log("displayLayerLimitesGeographiquesCommunes");
	document.getElementById("loader").style.display = "block";
	layerLimitesGeographiquesPoles.display(false);
	layerLimitesGeographiquesCommunes.display(true);
	if (communesLoaded == 0){
		CommunePOIList.load();
		communesLoaded=1;
	}
	document.getElementById("loader").style.display = "none";
}
function hideLayerLimitesGeographiquesCommunes(){
	console.log("hideLayerLimitesGeographiquesCommunes");
	layerLimitesGeographiquesCommunes.display(false);
}
var polesLoaded = 0;
function displayLayerLimitesGeographiquesPoles(){
	console.log("displayLayerLimitesGeographiquesPoles");
	document.getElementById("loader").style.display = "block";
	layerLimitesGeographiquesCommunes.display(false);
	layerLimitesGeographiquesPoles.display(true);
	if (polesLoaded == 0){
		PolePOIList.load();
		polesLoaded=1;
	}
	document.getElementById("loader").style.display = "none";
}
function hideLayerLimitesGeographiquesPoles(){
	console.log("hideLayerLimitesGeographiquesPoles");
	layerLimitesGeographiquesPoles.display(false);
}
function addLimitesGeographiques(coords, layer, layername){
	var start = 9;
	var length = coords.length - 11;
	if (coords.substr(0,1) == 'M') {
		start = 15;
		length = coords.length - 18;
	}	
	var polygons = coords.substr(start, length).split(')),((');
	for (var j = 0; j < polygons.length; j++) {
		var rings =  polygons[j].split('),(');
		for (var k = 0; k < rings.length; k++) {
			var polyCoords = [];
			var positions = rings[k].split(',');
			for (var i = 0; i < positions.length; i++){
				var c = positions[i].split(' ');
				var lonLat = new OpenLayers.LonLat(lon=parseFloat(c[0]),lat=parseFloat(c[1])).transform(
						new OpenLayers.Projection("EPSG:4326"),
						new OpenLayers.Projection("EPSG:900913")
				);
				polyCoords.push(new OpenLayers.Geometry.Point(lonLat.lon, lonLat.lat));						
			}
			feature_polygon = new OpenLayers.Feature.Vector( 
					new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyCoords))
					, 
					{ 
						'name':layername
					} 
			); 
			layer.addFeatures([feature_polygon]);
		}
	}
} 

CommunePOIList.on('load', function(store, records, options){ 
	var fieldValue; 
	CommunePOIList.each(function(record){
		var coords = record.get("geom");
		var commune = record.get("lib_commune");
		if(coords != ''){	
			addLimitesGeographiques(coords, layerLimitesGeographiquesCommunes, commune);					
		}
	}, this); 
}); 
PolePOIList.on('load', function(store, records, options){ 
	var fieldValue; 
	PolePOIList.each(function(record){
		var coords = record.get("geom");
		var pole = record.get("lib_pole");
		console.log("pole="+pole);
		if(coords && coords != ''){
			addLimitesGeographiques(coords, layerLimitesGeographiquesPoles, pole);		
		}
	}, this); 
	console.log("pole ");
});
var styleCommune = new OpenLayers.StyleMap({'default':new OpenLayers.Style({
	strokeColor: "#00FF00",
	strokeOpacity: 1,
	strokeWidth: 1,
	fillColor: "#FF5500",
	fillOpacity: 0.2,
	pointRadius: 6,
	pointerEvents: "visiblePainted",
	// label with \n linebreaks
	label : "${name}",
	fontColor: "#FFFFFF",
	fontSize: "12px",
	fontFamily: "Courier New, monospace",
	fontWeight: "bold",
	labelAlign: "${align}",
	labelXOffset: "${xOffset}",
	labelYOffset: "${yOffset}",
	labelOutlineColor: "white",
	labelOutlineWidth: 1
}),'selected':new OpenLayers.Style({
	strokeColor: "#FFFF00",
	strokeOpacity: 1,
	strokeWidth: 1,
	fillColor: "#FF5500",
	fillOpacity: 0.2,
	pointRadius: 6,
	pointerEvents: "visiblePainted",
	// label with \n linebreaks
	label : "name: ${name}",
	fontColor: "${favColor}",
	fontSize: "12px",
	fontFamily: "Courier New, monospace",
	fontWeight: "bold",
	labelAlign: "${align}",
	labelXOffset: "${xOffset}",
	labelYOffset: "${yOffset}",
	labelOutlineColor: "white",
	labelOutlineWidth: 3
})});
var stylePole = new OpenLayers.StyleMap({'default':new OpenLayers.Style({
	strokeColor: "#FF0000",
	strokeOpacity: 1,
	strokeWidth: 1,
	fillColor: "#FF2200",
	fillOpacity: 0.2,
	pointRadius: 6,
	pointerEvents: "visiblePainted",
	// label with \n linebreaks
	label : "${name}",
	fontColor: "#0000FF",
	fontSize: "18px",
	fontFamily: "Courier New, monospace",
	fontWeight: "bold",
	labelAlign: "${align}",
	labelXOffset: "${xOffset}",
	labelYOffset: "${yOffset}",
	labelOutlineColor: "white",
	labelOutlineWidth: 1
}),'selected':new OpenLayers.Style({
	strokeColor: "#FFFF00",
	strokeOpacity: 1,
	strokeWidth: 1,
	fillColor: "#FF5500",
	fillOpacity: 0.2,
	pointRadius: 6,
	pointerEvents: "visiblePainted",
	// label with \n linebreaks
	label : "name: ${name}",
	fontColor: "${favColor}",
	fontSize: "12px",
	fontFamily: "Courier New, monospace",
	fontWeight: "bold",
	labelAlign: "${align}",
	labelXOffset: "${xOffset}",
	labelYOffset: "${yOffset}",
	labelOutlineColor: "white",
	labelOutlineWidth: 3
})});

//priority displaying (given by the moderators)
var prioritePOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getPriorite.php',
	  root: 'priorite',
	  fields: [
	    {name: 'id_priorite'},
	    {name: 'lib_priorite'}
	  ]
	});

	var comboPrioritePOIMapItemMenu = new Ext.form.ComboBox({
		id: 'comboPrioritePOIMapItemMenu',
		fieldLabel: T_priorite,
		store: prioritePOIList,
		displayField: 'lib_priorite',
		valueField: 'id_priorite',
		forceSelection: true,
		editable: false,
		mode: 'remote',
		triggerAction: 'all',
		selectOnFocus: true,
		emptyText: 'Filtrer par priorité'
	});
	comboPrioritePOIMapItemMenu.on('select', function() {
		   console.log("Appel getMarker avec priorite = "+comboPrioritePOIMapItemMenu.getValue());
		   clearMarker();
			getMarker();
		});
	comboPrioritePOIMapItemMenu.on('afterrender', function(){
		  Ext.QuickTips.register({ target: comboPrioritePOIMapItemMenu.getEl(), text: 'N\'afficher que les observations avec la prorité (donnée par le modérateur de l\'association) - se cumule avec les autres filtres.' });
		});
	var CancelPrioriteFilterItem = new Ext.Button({
      	id:'CancelPrioriteFilterItem',
      	iconCls: 'silk_cancel',
      	text:'',
      	handler: function() {
      		comboPrioritePOIMapItemMenu.reset();
      		clearMarker();
      		getMarker();
      	}

      });	
	//Status displaying (given by the collectivity)
	var statusPOIList = new Ext.data.JsonStore({
		  url: 'lib/php/admin/getStatus.php',
		  root: 'status',
		  fields: [
		    {name: 'id_status'},
		    {name: 'lib_status'}
		  ]
		});
	//combobox in the map filters
	var StatusPOIFieldMapItemMenu = new Ext.form.ComboBox({
	    id:'StatusPOIFieldMapItemMenu',
	    fieldLabel: T_status,
	    store: statusPOIList,
	    displayField: 'lib_status',
	    valueField: 'id_status',
	    forceSelection: true,
	    mode: 'remote',
	    triggerAction: 'all',
	    selectOnFocus: true,
	    allowBlank: false,
	    editable:false,
	    emptyText: 'Filtrer par statut'
	});
	StatusPOIFieldMapItemMenu.on('afterrender', function(){
		  Ext.QuickTips.register({ target: StatusPOIFieldMapItemMenu.getEl(), text: 'N\'afficher que les observations avec le statut (donné par la collectivité) - se cumule avec les autres filtres.' });
		});  
	StatusPOIFieldMapItemMenu.on('select', function() {
		   console.log("Appel getMarker avec status = "+StatusPOIFieldMapItemMenu.getValue());
		   clearMarker();
			getMarker();
		});
	var CancelStatusFilterItem = new Ext.Button({
		   id:'CancelStatusFilterItem',
		   iconCls: 'silk_cancel',
		   text:'',
		   handler: function() {
		      StatusPOIFieldMapItemMenu.reset();
		      clearMarker();
			  	getMarker();
		   }
	});

function showTooltip(event){ 
	var feature = event.feature; 
	//Display Tooltip 
	var html = '';
	var title = T_directLink;
	if (feature.cluster && feature.cluster.length < 10){
		
		for (var i = 0; i < feature.cluster.length; i++){
			html+= 'Observation n° <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/admin.php?id=' + feature.cluster[i].attributes.id+'">'+feature.cluster[i].attributes.id+'</a>, Priorité donnée par le modérateur : "'+feature.cluster[i].attributes.lib_priorite+'", statut donné par la collectivité : "'+feature.cluster[i].attributes.lib_status+'"<br />';
		}
		title = T_directLinks;
	}else if (!feature.cluster){
		html+= 'Observation n° <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/admin.php?id=' + feature.attributes.id+'">'+feature.attributes.id+'</a>, Priorité donnée par le modérateur : "'+feature.attributes.lib_priorite+'", Statut donné par la collectivité : "'+feature.attributes.lib_status+'"<br />';
	}
	if (html!=''){
		tooltip = new Ext.ToolTip({ 
			html: html, 
			title:title,
			closable: true,
			dismissDelay: 10000,
			width:600
		}); 
		tooltip.targetXY = [event.clientX,event.clientY]; 
		
		tooltip.show();
	}
		
} 

function showTooltipNumberOfObservations(gg){ 
	//Display Tooltip 
	var html = gg + ' observation(s) affichée(s)';
	var title = "Statistiques";
		tooltip = new Ext.ToolTip({ 
			html: html, 
			title:title,
			closable: true,
			dismissDelay: 5000,
			width:300
		}); 
		tooltip.targetXY = [0,0]; 
		
		tooltip.show();
		
} 

//Define three colors that will be used to style the cluster features
//depending on the number of features they contain.
var colors = {
 low: "rgb(20, 226, 13)", 
 middle: "rgb(241, 211, 87)", 
 high: "rgb(253, 156, 115)"
};
//Define three rules to style the cluster features.
var singleRule = new OpenLayers.Rule({
	elseFilter: true,
    symbolizer: {
    	externalGraphic: '${icon}',
    	backgroundGraphic: "./resources/icon/shadowHover_${color_status}.png",
    	backgroundXOffset: -10,
    	backgroundYOffset: -37,
    	graphicXOffset: -32/2,
    	graphicYOffset: -37,
    	graphicWidth: 32,
    	graphicHeight: 37,
    	pointRadius:0,
    	graphicOpacity:0.7
    }
});
var lowRule = new OpenLayers.Rule({
    filter: new OpenLayers.Filter.Comparison({
    	type: OpenLayers.Filter.Comparison.BETWEEN,
        property: "count",
        lowerBoundary: 2,
        upperBoundary: 15
    }),
    symbolizer: {
        fillColor: colors.low,
        fillOpacity: 0.9, 
        strokeColor: colors.low,
        strokeOpacity: 0.5,
        strokeWidth: 12,
        pointRadius: 10,
        label: "${count}",
        labelOutlineWidth: 1,
        fontColor: "#ffffff",
        fontOpacity: 0.8,
        fontSize: "12px"
    }
});
var middleRule = new OpenLayers.Rule({
    filter: new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.BETWEEN,
        property: "count",
        lowerBoundary: 15,
        upperBoundary: 50
    }),
    symbolizer: {
        fillColor: colors.middle,
        fillOpacity: 0.9, 
        strokeColor: colors.middle,
        strokeOpacity: 0.5,
        strokeWidth: 12,
        pointRadius: 15,
        label: "${count}",
        labelOutlineWidth: 1,
        fontColor: "#ffffff",
        fontOpacity: 0.8,
        fontSize: "12px"
    }
});
var highRule = new OpenLayers.Rule({
    filter: new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.GREATER_THAN,
        property: "count",
        value: 50
    }),
    symbolizer: {
        fillColor: colors.high,
        fillOpacity: 0.9, 
        strokeColor: colors.high,
        strokeOpacity: 0.5,
        strokeWidth: 12,
        pointRadius: 20,
        label: "${count}",
        labelOutlineWidth: 1,
        fontColor: "#ffffff",
        fontOpacity: 0.8,
        fontSize: "12px"
    }
});

// Create a Style that uses the three previous rules
var style = new OpenLayers.Style(null, {
    rules: [ lowRule, middleRule, highRule,singleRule],
    context:{
        icon: function(feature){
        	//return "./resources/icon/marker/iconmarker2.png";
        	if(feature.cluster && feature.cluster.length == 1)
        		return feature.cluster[0].attributes.icon;
        	else if(!feature.cluster)
        		return feature.attributes.icon;
        }
     }
}); 
var statStore = new Ext.data.JsonStore({
	  url: 'lib/php/public/getJsonStats.php',
	  root: 'statistiques',
	  autoLoad: true,
	  storeId : 'statStore',
	  fields: [
	    {name: 'status'},
	    {name: 'nb_poi'},
	    {name: 'color_status'}
	  ]
	});

var clusterStrategy = new OpenLayers.Strategy.AnimatedCluster({
    distance: ClusterStrategyDistance,
    animationMethod: OpenLayers.Easing.Expo.easeOut,
    animationDuration: 20,
    threshold:ClusterStrategyNumberOfGroupedObservations
});


var idPoiComment;

var CommentField = new Ext.form.TextArea({
	id: 'CommentField',
	name: 'text_comment',
	fieldLabel: T_comment,
	maxLength: 2000,
	allowBlank: false,
	anchor : '95%'
});
var mailField = new Ext.form.TextField({
	id: 'mailField',
	name: 'mail_comment',
	fieldLabel: T_email,
	allowBlank: false,
	maxLength: 200,
	vtype: 'email',
	anchor : '95%'
});
var mailSupportField = new Ext.form.TextField({
	id: 'mailSupportField',
	name: 'mailSupportField',
	fieldLabel: T_email,
	allowBlank: false,
	maxLength: 200,
	vtype: 'email',
	anchor : '95%'
});
var beInformedField = new Ext.form.Checkbox({
	id: 'beInformedField',
	name: 'beInformedField',
	fieldLabel: T_beInformed,
});
var beInformedSupportField = new Ext.form.Checkbox({
	id: 'beInformedSupportField',
	name: 'beInformedSupportField',
	fieldLabel: T_beInformed,
});
var CommentCreateForm = new Ext.FormPanel({
	labelAlign: 'top',
	bodyStyle: 'padding:5px',
	frame: true,
	fileUpload: true,
	width: 450,
	height:550,
	autoScroll:true,
	items: [{
		layout: 'column',
		border: false,
		items:[{
			columnWidth:1,
			layout: 'form',
			border: false,
			items: [ {
						xtype: 'fileuploadfield',
						id: 'form-file2',
						anchor : '95%',
						emptyText: T_selectPhoto,
						fieldLabel: T_photo,
						name: 'photo-path',
						buttonText: '',
						buttonCfg: {
							iconCls: 'fugue_folder-open-document'
						}},CommentField, mailField, beInformedField,{
					xtype: 'panel',
					id: 'help',
					html: "<p style=\"color:#555555\">Utilisez cette fonctionnalité pour apporter une information à cette observation (mise à jour, précision...). Une photo peut-être ajoutée pour illustrer le commentaire (et peut parler d'elle-même;))</p>" +
					"<p style=\"color:#555555\">Si vous souhaitez être informé(e) par e-mail des nouveautés (nouveaux commentaires modérés, nouveaux ajouts de l'association et retours de la collectivité) concernant cette observation, cochez la case du bas du formulaire.</p>",
					fieldLabel: T_helpComment,
					name: 'help'}]
		}]
	}],
	buttons: [{
		text: T_submit,
		handler: function() {
			if(CommentCreateForm.getForm().isValid()){
				CommentCreateForm.getForm().submit({
					waitMsg: T_pleaseWait,
					url: 'lib/php/admin/database.php',
					params: {
						task: "CREATEPUBLICCOMMENTS",
						id_poi: idPoiComment
					},
					success: function(CommentCreateForm, o) {
						console.log("CommentCreateForm success "+o.result.ok);

						Ext.MessageBox.show({
							title: T_transfertOK,
							msg: o.result.ok,
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.INFO,
							iconCls: 'silk_tick'
						});
						CommentCreateWindow.hide();
						Ext.getCmp('form-file2').reset();
						CommentField.reset();
						mailField.reset();
						popup.hide();
					},
					failure: function(CommentCreateForm, o) {
						console.log("CommentCreateForm echec "+o.result.pb);
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
		text: T_cancel,
		handler: function(){
			CommentCreateWindow.hide();
		}
	}]
});
var CommentCreateWindow= new Ext.Window({
	id: 'CommentCreateWindow',
	iconCls: 'silk_comment_add',
	title: T_addComment,
	closable: false,
	border: false,
	width: 450,
	height: 400,
	plain: true,
	layout: 'fit',
	modal: true,
	items: CommentCreateForm
});
function addComment() {

	CommentCreateWindow.show();
}

