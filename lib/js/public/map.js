Ext.apply(Ext.tree.TreeNodeUI.prototype, {
	toggleCheckNoEvent : function(value) {
		var cb = this.checkbox;
		if(cb){
			cb.checked = (value === undefined ? !cb.checked : value);
			// fix for IE6
			this.checkbox.defaultChecked = cb.checked;
			this.node.attributes.checked = cb.checked;
		}
	}
});

function osm_getTileURL(bounds) {
	var res = this.map.getResolution();
	var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
	var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
	var z = this.map.getZoom();
	var limit = Math.pow(2, z);

	if (y < 0 || y >= limit) {
		return OpenLayers.Util.getImagesLocation() + "404.png";
	} else {
		x = ((x % limit) + limit) % limit;
		return this.url + z + "/" + x + "/" + y + "." + this.type;
	}
}

if (navigator.appName != "Microsoft Internet Explorer") {
	OpenLayers.ImgPath = "resources/images/ol_themes/black/";
}

var controlZoomBox = new OpenLayers.Control.ZoomBox({CLASS_NAME:'zoomIn'});
var navigation = new OpenLayers.Control.Navigation({
	'zoomWheelEnabled': true,
	'defaultDblClick': function(event) {
		publicMap.zoomIn();
		return;
	}
});
var optionsMap = {
		controls: [
		           new OpenLayers.Control.PanZoom(), 
		           navigation,
		           new OpenLayers.Control.ScaleLine({geodesic: true}),
		           controlZoomBox
		           ],
		           projection: new OpenLayers.Projection("EPSG:900913"),
		           displayProjection: new OpenLayers.Projection("EPSG:4326"),
		           units: "m",
		           maxZoomLevel: 19,
		           //maxResolution: 156543.0339,
		           maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34)
};

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0,
		'stopSingle': false,
		'stopDouble': false
	},

	initialize: function(options) {
		this.handlerOptions = OpenLayers.Util.extend(
				{}, this.defaultHandlerOptions
		);
		OpenLayers.Control.prototype.initialize.apply(
				this, arguments
		); 
		this.handler = new OpenLayers.Handler.Click(
				this, {
					'click': this.trigger
				}, this.handlerOptions
		);
	}, 

	trigger: function(e) {
	}

});


var publicMap = new OpenLayers.Map(optionsMap);
for (var i = 0; i < mapLayersArray.length; i++) {
	publicMap.setBaseLayer(mapLayersArray[i][2]);
	publicMap.addLayer(mapLayersArray[i][2]);
}
publicMap.addControl(new OpenLayers.Control.Attribution());
publicMap.addControl(new OpenLayers.Control.LayerSwitcher());
var click = new OpenLayers.Control.Click();
publicMap.addControl(click);


click.activate();
function clearMarker() {
	console.log("clearMarker");
	observationsVectorLayer.removeAllFeatures();
	observationsVectorLayer.destroyFeatures();
	observationsVectorLayer.addFeatures([]);
	observationsVectorLayer.strategies[0].clearCache();

}

function getMarker() {
	clearMarker();
	if (tabcheckchild != '') {
		console.log("before display block");
		document.getElementById("loader").style.display = "block";

		var uri = 'lib/php/public/getMarker.php?listType='+tabcheckchild+'&dateLastModif='+dateLastModif+'&status='+StatusPOIFieldMapItemMenu.getValue()+'&priorite='+comboPrioritePOIMapItemMenu.getValue()+'&nbSupportMinimum='+nbSupportMinimum;

		OpenLayers.loadURL(uri, '', this, displayMarker);

	}
}
var singleObservationIdToDisplay;
function getMarkerByID(id) {
	clearMarker();
	singleObservationIdToDisplay = id;
	var uri = 'lib/php/public/getMarker.php?id='+id;
	OpenLayers.loadURL(uri, '', this, displayMarkerAndCenterInPublicMap);
}

function displayMarkerAndCenterInPublicMap(response) {
	var json = eval('(' + response.responseText + ')');
	if (json.markers != null) {
		var features = [];
		var id = json.markers[0].id;
		var lonlat = new OpenLayers.LonLat(json.markers[0].lon, json.markers[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject());
		publicMap.setCenter(new OpenLayers.LonLat(json.markers[0].lon, json.markers[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject()), 15);
		console.info('displayMarkerAndCenterInPublicMap ' + id);
		var i = 0;
		var comments = '';
		if (json.markers[i]['support']>0) {
			comments += '<b>Nombre de votes pour cette fiche </b> : ' + json.markers[i]['support'];
		}else {
			comments += '<b>Nombre de votes pour cette fiche </b> : Soyez le ou la première à voter!!';
		}
		if (json.markers[i]['commentaires']!=null) {
			comments += '<br /><b>Commentaires :</b>';
			var j = 0;

			while(json.markers[i]['commentaires'][j] != null) {
				comments += '<ul>';
				if ( json.markers[i]['datecreation'][j] != '0000-00-00 00:00:00'){
					comments += '<li>Ajouté le '+json.markers[i]['datecreation'][j] + ' : </li>';
				}

				comments += '<li><b>Commentaire</b> : '+json.markers[i]['commentaires'][j] + '</li>';
				if (json.markers[i]['photos'][j] != ""){
					comments += '<li>Photo associée <br /><img width="400" src="./resources/pictures/'+json.markers[i]['photos'][j]+'"/></li>';
				}
				comments += '</ul><hr />';
				j++;
			}
			console.info('displayMarkerAndCenterInPublicMap ' + comments);
		}
		
		createFeaturePublicMapAndOpen(id,lonlat.lon,lonlat.lat, json.markers[i].icon, json.markers[i].lib_priorite, json.markers[i].lib_status, json.markers[i].lib_subcategory, json.markers[i].desc, json.markers[i].prop, json.markers[i].iconCls, json.markers[i].id, json.markers[i].photo, json.markers[i].num, json.markers[i].rue, json.markers[i].commune, json.markers[i].repgt, json.markers[i].cmt, json.markers[i].date, json.markers[i].lastdatemodif_poi, comments);


	}else{
		console.log('pas de retour');
		Ext.MessageBox.show({
			title: T_error,
			msg: T_noCorrespondingObservation + singleObservationIdToDisplay,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.INFO,
			iconCls: 'silk_information'
		});
	}
}

var features = [];
function displayMarker(response) {
	document.getElementById("loader").style.display = "none";
	console.log("after display none");
	var json = eval('(' + response.responseText + ')');
	if (json.markers != null) {
		for (var i=0; i<json.markers.length; i++) {
			var id = json.markers[i].id;
			var lonlat = new OpenLayers.LonLat(json.markers[i].lon, json.markers[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject());
			var comments = '';
			if (json.markers[i]['support']>0) {
				comments += '<b>Nombre de votes pour cette fiche </b> : ' + json.markers[i]['support'];
			}else {
				comments += '<b>Nombre de votes pour cette fiche </b> : Soyez le ou la première à voter!!';
			}
			if (json.markers[i]['commentaires']!= null) {
				comments += '<br /><b>Commentaires :</b>';
				var j = 0;
				while(json.markers[i]['commentaires'][j] != null) {
					comments += '<ul>';
					if ( json.markers[i]['datecreation'][j] != '0000-00-00 00:00:00'){
						comments += '<li>Ajouté le '+json.markers[i]['datecreation'][j] + ' : </li>';
					}

					comments += '<li>Commentaire : '+json.markers[i]['commentaires'][j] + '</li>';
					if (json.markers[i]['photos'][j] != ""){
						comments += '<li>Photo associée <br /><img width="400" src="./resources/pictures/'+json.markers[i]['photos'][j]+'"/></li>';
					}
					comments += '</ul><hr />';
					j++;
				}
			}
			
			var point = new OpenLayers.Geometry.Point(lonlat.lon,lonlat.lat);
			var feat = new OpenLayers.Feature.Vector(point, null, null);

			if (json.markers[i].lastdatemodif_poi == '0000-00-00' || json.markers[i].lastdatemodif_poi == null ){
				json.markers[i].lastdatemodif_poi = json.markers[i].date;
			}
			feat.attributes = {"id": id, "color_status":json.markers[i].color_status,"lib_status":json.markers[i].lib_status, "lib_priorite":json.markers[i].lib_priorite, "lib_subcategory":json.markers[i].lib_subcategory, "tooltip":id, "desc": json.markers[i].desc, "prop": json.markers[i].prop, "iconCls": json.markers[i].iconCls, "photo": json.markers[i].photo, "num": json.markers[i].num, "rue": json.markers[i].rue, "commune": json.markers[i].commune, "repgt": json.markers[i].repgt, "cmt": json.markers[i].cmt, "date": json.markers[i].date,"lastDateModif":json.markers[i].lastdatemodif_poi, "comments": comments,"icon":json.markers[i].icon};
			features.push(feat);
		}
		observationsVectorLayer.addFeatures(features);
		showTooltipNumberOfObservations(features.length);
		features = [];
	}else{
		showTooltipNumberOfObservations(0);
	}
}

var observationsVectorLayer = new OpenLayers.Layer.Vector("marker", { styleMap: style, visibility: true, displayInLayerSwitcher: false,strategies: [clusterStrategy]});

observationsVectorLayer.setZIndex(23);
publicMap.addLayer(observationsVectorLayer);

//observationsVectorLayer.strategies[0].deactivate();
//observationsVectorLayer.refresh({force: true});
//Interface correspondant à une fiche d'une observation avec les détails et des boutons pour ajouter un nouveau commentaire ou modérer l'observaion

//create select feature control
//var selectCtrl = new OpenLayers.Control.SelectFeature(observationsVectorLayer,{clickout: true});
//Hover Control (Tooltip) 
var hoverCtrl = new OpenLayers.Control.SelectFeature(observationsVectorLayer, { 
	hover: true, highlightOnly: true, renderIntent: "temporary", 
	eventListeners: { featurehighlighted: showTooltip} 
}); 
//support functions 
var tooltip = null; 
function showTooltip(event){ 
	var feature = event.feature; 
	//console.log("my object: %o", event)
	//Display Tooltip 
	var html = '';
	var title = T_directLink;
	if (feature.cluster && feature.cluster.length < 10){

		for (var i = 0; i < feature.cluster.length; i++){
			html+= 'Observation n° <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/index.php?id=' + feature.cluster[i].attributes.id+'">'+feature.cluster[i].attributes.id+'</a>, Priorité donnée par le modérateur : "'+feature.cluster[i].attributes.lib_priorite+'", Statut donné par la collectivité : "'+feature.cluster[i].attributes.lib_status+'"<br />';
		}
		title = T_directLinks;
	}else if (!feature.cluster){
		html+= 'Observation n° <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/index.php?id=' + feature.attributes.id+'">'+feature.attributes.id+'</a>, Priorité donnée par le modérateur : "'+feature.attributes.lib_priorite+'", Statut donné par la collectivité : "'+feature.attributes.lib_status+'"<br />';
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
publicMap.addControl(hoverCtrl); 
hoverCtrl.activate(); 

observationsVectorLayer.events.on({
	featureselected: function(e) {
		console.debug("Here is blah: %o", e.feature);
		createPopup(e.feature);

	},
	featureunselected: function(e) {
		popup.destroy(e.feature)
	}
});
//publicMap.addControl(selectCtrl);
//selectCtrl.activate();

var popup;
var tabPopup;

var idPoiComment;
function createPopup(feature) {
	var featureToDisplay = feature;
	if (feature.cluster && feature.cluster.length == 1){
		featureToDisplay = feature.cluster[0];
	}
//	console.log("feature = %o", feature);

	htmlGeneral = "";
	var title = '';
	if (!feature.cluster){
		idPoiComment = featureToDisplay.attributes.id;
		title = featureToDisplay.attributes.id + " " +featureToDisplay.attributes.lib_subcategory + ', '+ T_lastModificationDate + ' : ' + featureToDisplay.attributes.lastDateModif;
		//htmlGeneral += "<table><tr><td>"+T_dateCreation+"</td><td> "+featureToDisplay.attributes.date+'</td></tr><tr><td>'+T_description+"</td><td> "+featureToDisplay.attributes.desc+'</td></tr></table>';
		htmlGeneral += "<b>"+T_dateCreation+" :</b> "+featureToDisplay.attributes.date;
		if (featureToDisplay.attributes.desc != '') {
			htmlGeneral += "<br/><b>"+T_description+" :</b> "+featureToDisplay.attributes.desc;
		}
		if (featureToDisplay.attributes.prop != '') {
			htmlGeneral += "<br/><b>"+T_proposition+" :</b> "+featureToDisplay.attributes.prop;
		}
		htmlGeneral += "<br/><b>Priorite association :</b> "+featureToDisplay.attributes.lib_priorite;
		htmlGeneral += "<br/><b>Statut colléctivité :</b> "+featureToDisplay.attributes.lib_status;
		if (featureToDisplay.attributes.repgt != '') {
			htmlGeneral += "<br/><b>"+T_reponseGrandToulouse+" :</b> "+feature.attributes.repgt;
		} else {
			htmlGeneral += "<br/><b>"+T_reponseGrandToulouse+" :</b> "+T_enAttente;
		}
		if (featureToDisplay.attributes.cmt != '') {
			htmlGeneral += "<br/><b>"+T_commentFinal+" :</b> "+featureToDisplay.attributes.cmt;
		}
		htmlGeneral += "<br/><b>"+T_address+" :</b> "+featureToDisplay.attributes.num+", "+featureToDisplay.attributes.rue+", "+featureToDisplay.attributes.commune;
		if ((featureToDisplay.attributes.photo != '') && (featureToDisplay.attributes.photo != null)) {
			temp = featureToDisplay.attributes.photo;
			size = temp.split('x');
			largeur = size[0];
			hauteur = size[1];
			if (largeur < 400){
				htmlGeneral += '<br/><br/><b>'+T_photo+' :</b><br/><a href="./resources/pictures/'+featureToDisplay.attributes.photo+'" target="_blank"><span ext:qtip="'+T_clickToOpenInNewTab+'"><img src="./resources/pictures/'+featureToDisplay.attributes.photo+'"/></span></a>';
			} else {
				htmlGeneral += '<br/><br/><b>'+T_photo+' :</b><br/><a href="./resources/pictures/'+featureToDisplay.attributes.photo+'" target="_blank"><span ext:qtip="'+T_clickToOpenInNewTab+'"><img width="400" src="./resources/pictures/'+featureToDisplay.attributes.photo+'"/></span></a>';
			}
		} else {
			htmlGeneral += '<br/><br/><b>'+T_photo+' :</b> '+T_noPhoto+'<br/>';
		}
		if (featureToDisplay.attributes.comments != null) {
			htmlGeneral += '<br/>'+featureToDisplay.attributes.comments;
		}
		htmlGeneral += '<br/><div style="width:100%;"><button type="button" onclick="addComment()">Ajouter un commentaire</button> <button type="button" onclick="addSupport()">'+T_addVote+'</button><span style="float:right";><a href="'+window.location.href.replace(/[^/]*$/, '') + '/lib/php/public/exportPDF.php?id_poi=' + featureToDisplay.attributes.id+'" target="_blank"><img src="./resources/icon/silk/printer.png" /></a> <a href="'+window.location.href.substring(0, window.location.href.lastIndexOf('/'))+'/admin.php?id='+featureToDisplay.attributes.id+'"><img src="./resources/icon/silk/script_save.png" /></a></span></div>';
		htmlGeneral += '<br/>Lien direct vers cette observation : <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/index.php?id=' + featureToDisplay.attributes.id+'">'+featureToDisplay.attributes.id+'</a>';
		
	}else{
		title = featureToDisplay.cluster.length + ' observations proches dans ce regroupement';
		for(var countObser = 0;countObser<featureToDisplay.cluster.length;countObser++){
			htmlGeneral+= 'Observation n° <a href="' + window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) +'/index.php?id=' + featureToDisplay.cluster[countObser].attributes.id+'">'+featureToDisplay.cluster[countObser].attributes.id+'</a>, '+featureToDisplay.cluster[countObser].attributes.lib_priorite+', '+T_lastModificationDate + ': ' + featureToDisplay.cluster[countObser].attributes.lastDateModif+'<br />'
		}
	}
//	if (feature.attributes.photos != null) {
//	htmlGeneral += '<br/>'+feature.attributes.photos;
//	}
	general = new Ext.Panel({
		title: T_main,
		ctCls: 'infoSupTabPanelPopup',
		iconCls: 'silk_information',
		html: htmlGeneral
	});

	tabPopup = new Ext.TabPanel({
		activeTab: 0,
		border: false
	});

	if (htmlGeneral != '') {
		tabPopup.add(general);
	}

	popup = new GeoExt.Popup({
		title: title,
		iconCls: featureToDisplay.attributes.iconCls,
		location: feature,
		html: htmlGeneral,
		closable: true,
		unpinnable: false,
		collapse: false,
		collapsible: false,
		resizable: true,
		width: 600,
		height: 350,
		anchored: true,               
		layout: 'fit',
		autoScroll: true,
		padding: '5 5 5 5'
	});
	popup.on({
		close: function() {
			//selectCtrl.unselectAll();
		}
	});
	popup.show();

}
var CommentField = new Ext.form.TextArea({
	id: 'CommentField',
	name: 'text_comment',
	fieldLabel: T_comment,
	maxLength: 500,
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
var hiddenIdPOI3 = new Ext.form.Hidden({
	id: 'hiddenIdPOI3',
	name: 'id_poi'
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

var SupportObservationForm = new Ext.FormPanel({
	labelAlign: 'top',
	bodyStyle: 'padding:5px',
	frame: true,
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
			items: [ mailSupportField, beInformedSupportField,{
					xtype: 'panel',
					id: 'helpSupport',
					html: "<p style=\"color:#555555\">Pour voter pour cette observation, renseignez votre adresse e-mail. Celle-ci est nécessaire pour limiter les abus. Cette information ne sera communiquée en aucun cas à une tierce personne. " +
							"Le nombre de personnes qui supporte cette observation est affiché et pourra permettre de prioriser les demandes d'aménagements</p>" +
							"<p style=\"color:#555555\">Si vous souhaitez être informé(e) par e-mail des nouveautés (nouveaux commentaires modérés, nouveaux ajouts de l'association et retours de la collectivité) concernant cette observation, cochez la case du bas du formulaire.</p>",
					fieldLabel: T_helpComment,
					name: 'help'}
		] 
	}]}],
	buttons: [{
		text: T_submit,
		handler: function() {
			if(SupportObservationForm.getForm().isValid()){
				SupportObservationForm.getForm().submit({
					waitMsg: T_pleaseWait,
					url: 'lib/php/admin/database.php',
					params: {
						task: "CREATESUPPORT",
						id_poi: idPoiComment
					},
					success: function(SupportObservationForm, o) {
						console.log("SupportObservationForm success "+o.result.ok);

						Ext.MessageBox.show({
							title: T_transfertOK,
							msg: o.result.ok,
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.INFO,
							iconCls: 'silk_tick'
						});
						SupportObservationWindow.hide();
						mailSupportField.reset();
						popup.hide();
					},
					failure: function(SupportObservationForm, o) {
						console.log("SupportObservationForm echec "+o.result.pb);
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
			SupportObservationWindow.hide();
		}
	}]
});

var SupportObservationWindow= new Ext.Window({
	id: 'SupportObservationWindow',
	iconCls: 'silk_comment_add',
	title: T_addVote,
	closable: false,
	border: false,
	width: 450,
	height: 400,
	plain: true,
	layout: 'fit',
	modal: true,
	items: SupportObservationForm
});

function addSupport() {
	SupportObservationWindow.show();
}
function createFeaturePublicMapAndOpen(id,X,Y,icon,lib_priorite,lib_status,lib_subcategory,desc,prop,iconCls,id,photo,num,rue,commune,repgt,cmt,date,lastDateModif,comments) {
	var point = new OpenLayers.Geometry.Point(X,Y);
	var feat = new OpenLayers.Feature.Vector(point, null, null);

	console.debug('createFeaturePublicMapAndOpen - lastDateModif ' + lastDateModif);
	if (lastDateModif == '0000-00-00'){
		lastDateModif = date;
	}
	feat.attributes = {"id": id, "lib_status": lib_status, "lib_priorite": lib_priorite,"lib_subcategory": lib_subcategory, "desc": desc, "prop": prop, "iconCls": iconCls, "photo": photo, "num": num, "rue": rue, "commune": commune, "repgt": repgt, "cmt": cmt, "date": date, "lastDateModif":lastDateModif, "comments": comments, "icon":icon};
	observationsVectorLayer.addFeatures([feat]);
	console.debug("createFeaturePublicMapAndOpen: %o", feat);
	createPopup(feat);
}

/* fin popup */



var treeLoaderFinished = 0; //variable indiquant si le treepanel a fini de charger ses noeuds depuis le serveur
//création de l'affichage des catégories dans le panneau de gauche
var treePanel = new Ext.tree.TreePanel({
	id: 'treePanel',
	region: 'west',
	header: false,
	split: true,
	width: 250,
	minSize: 150,
	maxSize: 380,
	autoScroll: true,
	rootVisible: false,
	autoScroll: true,
	collapsible: true,
	collapseMode: 'mini',
	enableDD: false,
	activeItem: 0,
	useArrows: true,
	margins: '5 0 5 5',
	cmargins: '5 5 5 5',
	loader: new Ext.tree.TreeLoader({
		baseAttrs : {
			expanded: true,
			checked: LOAD_ALL_OBSERVATIONS_DEFAULT
		},
		preloadChildren: true,
		dataUrl: 'lib/php/public/getJsonTree.php',
		listeners: {
			'load': function () {
				console.debug('treeloader finished');
				treeLoaderFinished = 1;
				getCheckChild(treePanel.getChecked('id'));
			}
		}}),
		root: new Ext.tree.AsyncTreeNode(),
		rootVisible: false,
		tbar: [participationButton, '->', iconCreditButtonPublic,'->', exportButton]
});





//au chargement des noeuds du treePanel, on sélectionne les catégories qui étaient sélectionnées dans une session antérieure
var categories = getCookie('categories');
var activateGetCheckChild = 0; //TODO a quoi sert cette variable
var tabcheckchild = new Array();
//coche la checkbox au chargement du treenode si elle était cochée lors d'une précédente session, sinon ne fait rien
treePanel.on('expandnode', function(node) {
	if (categories && categories.indexOf(node.id) >= 0){
		if (node.isLeaf()){
			node.getUI().toggleCheck(true);
			tabcheckchild.push(node.id);
		}
	}
});
//recharge les observations si une catégorie a été cochée ou décochée
treePanel.on('checkchange', function(n) {
	if (activateGetCheckChild==1){
		if (n.isLeaf()){
			getCheckChild(this.getChecked('id'));
		} else{
			toggleCheckChild(n,n.childNodes);
			getCheckChild(this.getChecked('id'));
		}
	}
});
treePanel.on('load', function(n) {
	console.info('treePanel.load '+this.getChecked('id'));
	if (this.getChecked('id')!='' || !categories){
		activateGetCheckChild = 1;
	}
});
var previousTreeNodesChecked = ''; //variable listant les noeuds sélectionnés avant appel à getCheckChild (pour éviter un appel serveur inutile si les valeurs n'ont pas changé
function getCheckChild(tab) {
	tabcheckchild = new Array();
	for (i=0; i<tab.length; i++) {
		if (tab[i].charAt(0) != 'x') {
			tabcheckchild.push(tab[i]);
		}
	} 
	var currentTreeNodesChecked = treePanel.getChecked('id').join();
	if (previousTreeNodesChecked!=currentTreeNodesChecked && treeLoaderFinished == 1){
		previousTreeNodesChecked = treePanel.getChecked('id').join();
		getMarker();
	}
}

function toggleCheckChild(parentnode,tabnode) {
	if (parentnode.getUI().isChecked()) {
		for (i=0; i<tabnode.length; i++) {
			if (!tabnode[i].getUI().isChecked()) {
				tabnode[i].getUI().toggleCheckNoEvent();
			}
		}
	} else {
		for (i=0; i<tabnode.length; i++) {
			if (tabnode[i].getUI().isChecked()) {
				tabnode[i].getUI().toggleCheckNoEvent();
			}
		}
	}
}


//création de la carte centrale avec ses selecteurs permettant de filtrer l'affichage
//GeoSearchCombo
var geoNameSearchCombo = new GeoExt.ux.GeoNamesSearchCombo({
	map: publicMap, zoom: 12
});

//baselayers combo
var storeALL = new Ext.data.ArrayStore({
	fields: ['abbr', 'layername', 'nick'],
	data : Ext.baselayer.ALL
});
var comboboxSelectMapLayer = new Ext.form.ComboBox({
	store: storeALL,
	displayField: 'layername',
	typeAhead: true,
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	emptyText: T_baselayer,
	selectOnFocus: true,
	valueField: 'abbr',
	listeners: {
		'select': function () {
			publicMap.setBaseLayer(mapLayersArray[this.getValue()][2]);
		}
	}
});

////checkbox affichage des limites geographiques des communes sur la carte
//var checkBoxdisplayLayerLimitesGeographiquesCommunes = new Ext.form.Checkbox({
//	boxLabel: T_geographicalCommunesBounds,
//	id : 'chkCommunes',
//	checked: false,
//	listeners: {
//		'check': function () {
//			switch (this.getValue()) {
//			case true:
//				displayLayerLimitesGeographiquesCommunes();
//				Ext.getCmp("chkPoles").setValue(false);
//				break;
//			case false:
//				hideLayerLimitesGeographiquesCommunes();
//				break;
//			}
//		}
//	}
//});
////checkbox affichage des limites geographiques des poles sur la carte
//var checkBoxDisplaylayerLimitesGeographiquesPoles = new Ext.form.Checkbox({
//	boxLabel: T_geographicalPolesBounds,
//	id : 'chkPoles',
//	checked: false,
//	listeners: {
//		'check': function () {
//			switch (this.getValue()) {
//			case true:
//				displayLayerLimitesGeographiquesPoles();
//				Ext.getCmp("chkCommunes").setValue(false);
//				break;
//			case false:
//				hideLayerLimitesGeographiquesPoles();
//				break;
//			}
//		}
//	}
//});

//control geoext
var maxExtent = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomToMaxExtent(),
	map: publicMap,
	iconCls: 'arrow_out',
	text: T_zoomMaxExtent,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var zoomIn = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomIn(),
	map: publicMap,
	iconCls: 'silk_magnifier_zoom_in',
	text: T_zoomIn,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var zoomOut = new GeoExt.Action({
	control: new OpenLayers.Control.ZoomOut(),
	map: publicMap,
	iconCls: 'silk_magifier_zoom_out',
	text: T_zoomOut,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var ctrl = new OpenLayers.Control.NavigationHistory();
publicMap.addControl(ctrl);

var previous = new GeoExt.Action({
	iconCls: 'silk_arrow_left',
	text: T_previousView,
	control: ctrl.previous,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var next = new GeoExt.Action({
	iconCls: 'silk_arrow_right',
	text: T_nextView,
	control: ctrl.next,
	handler: function() {
		if (zoomboxButton.pressed) {			
			zoomboxButton.toggle(false);
			panButton.toggle(true);
		}
	}
});

var panButton = new Ext.Button({
	text: T_nav,
	iconCls: 'arrow_pan',
	enableToggle: true,
	toggleGroup: "zoom_pan_toggle",
	pressed: true,
	allowDepress: false
});

var zoomboxButton = new Ext.Button({
	text: T_zoomBox,
	iconCls: 'magnifier_zoom_box',
	enableToggle: true,
	toggleGroup: "zoom_pan_toggle",
	allowDepress: false,
	toggleHandler: function(button, pressed) {
		if (pressed) {
			publicMap.events.register('mouseover',publicMap,controlBox);
			deactivateAllMapsNavigation();
		}
		else {
			publicMap.events.unregister('mouseover',publicMap,controlBox);
			activateAllMapsNavigation();
		}
	}
});
OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
	defaultHandlerOptions: {
		'single': true,
		'double': false,
		'pixelTolerance': 0,
		'stopSingle': false,
		'stopDouble': false
	},

	initialize: function(options) {
		this.handlerOptions = OpenLayers.Util.extend(
				{}, this.defaultHandlerOptions
		);
		OpenLayers.Control.prototype.initialize.apply(
				this, arguments
		); 
		this.handler = new OpenLayers.Handler.Click(
				this, {
					'click': this.trigger
				}, this.handlerOptions
		);
	}, 

	trigger: function(e) {
		console.log('dans click trigger');
		var lonlat = publicMap.getLonLatFromPixel(e.xy);
		createFeatureAdd(lonlat.lon,lonlat.lat)
	}

});
var click = new OpenLayers.Control.Click();
publicMap.addControl(click);
click.activate();






//publicMap.events.register('click',publicMap, function(e) {
//var position = publicMap.getLonLatFromPixel(e.xy);
////  alert(position.lon);
//createFeatureAdd(position.lon,position.lat);

//});
function activateAllMapsNavigation() {
	navigation.activate();
}

function deactivateAllMapsNavigation() {
	navigation.deactivate();
}

function controlBox() {
	controlZoomBox.activate();
}

var mapGeoExtPanel = new GeoExt.MapPanel({
	id: 'mapPanel',
	map: publicMap,
	region: 'center',
	margins: '5 5 5 0',
	tbar: new Ext.Toolbar({
		height: '20',
		cls: 'x-panel-header',

		items: [dateFieldModifiedSince,CancelDateFilterItem,'&',StatusPOIFieldMapItemMenu,CancelStatusFilterItem, '&',comboPrioritePOIMapItemMenu,CancelPrioriteFilterItem,'&', numberFieldNbSupport,CancelVoteFilterItem]
	}),
	bbar: new Ext.Toolbar({
	height: '20',
	cls: 'x-panel-header',
	items: [searchObservationField, ' ', checkBoxdisplayLayerLimitesGeographiquesCommunes,' ',checkBoxDisplaylayerLimitesGeographiquesPoles,'->' ,comboboxSelectMapLayer]
})

});

//le border panel
var afterLayoutVar = 0;
var mapPanel = new Ext.Panel({
	layout: 'border',
	split: true,
	region: 'center',
	items: [treePanel, mapGeoExtPanel],
	listeners:
	{
		afterLayout: function() {
			if (afterLayoutVar == 0) {
				var uri = 'lib/php/public/getDefaultConfigMap.php';
				OpenLayers.loadURL(uri,'',this,setDefaultCenterMap);
				afterLayoutVar = 1;
			}
		}
	}
});

function setDefaultCenterMap(response) {
	var json = eval('('+response.responseText+')');
	var long  = getCookie("mapx");
	var lat  = getCookie("mapy");
	var zoom  = getCookie("mapz");
	console.debug("Cookie "+document.cookie);
	//si les infos de longitude, latitude et zoom sont dans les cookies, on les utilise, sinon on récupère les infos de la base de données
	if(long != null && long != 0){
		console.debug("Configmap from cookies");
		publicMap.setCenter(new OpenLayers.LonLat(long,lat), zoom);
		publicMap.setBaseLayer(publicMap.layers[0]);
	}else if (json.configmap != null) {
		console.debug("Configmap from database");
		publicMap.setCenter(new OpenLayers.LonLat(json.configmap[0].lon, json.configmap[0].lat).transform(new OpenLayers.Projection("EPSG:4326"), publicMap.getProjectionObject()), json.configmap[0].zoom);
		publicMap.setBaseLayer(publicMap.layers[json.configmap[0].baselayer]);
	}
}




/* gestion de l'ajout d'une observation */

var layerNewObservation = new OpenLayers.Layer.Vector("Propositions", { visibility: true, displayInLayerSwitcher: false});
layerNewObservation.setZIndex(11);
var layerLimitesGeographiquesCommunes = new OpenLayers.Layer.Vector("Limites communes", {reportError:true,styleMap:styleCommune, visibility: true, displayInLayerSwitcher: true,eventListeners:{
	"featureadded": function(feature) {
	}
}});
layerLimitesGeographiquesCommunes.setZIndex(5);
var layerLimitesGeographiquesPoles = new OpenLayers.Layer.Vector("Limites poles", {reportError:true,styleMap:stylePole, visibility: true, displayInLayerSwitcher: true,eventListeners:{
	"featureadded": function(feature) {
	}
}});
var polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer", {
    projection: "EPSG:900913"
});
layerNewObservation.setZIndex(12);
layerLimitesGeographiquesPoles.setZIndex(3);
publicMap.addLayer(layerNewObservation);
publicMap.addLayer(layerLimitesGeographiquesCommunes);
publicMap.addLayer(layerLimitesGeographiquesPoles);
publicMap.addLayer(polygonLayer);
var exportPolygonFeature;
//detect polygon events 
function newPolygonAdded (evt) {
	exportPolygonFeature = evt.feature;    
	console.log('Polygon completed');
        var in_options = {
        		internalProjection: new OpenLayers.Projection(publicMap.getProjectionObject()),
        		externalProjection: new OpenLayers.Projection('EPSG:4326')
        		};
        var wkt = new OpenLayers.Format.WKT(in_options);

        // write out the feature's geometry in WKT format
        var out = wkt.write(exportPolygonFeature);
        CustomPolygonField.setValue(out);
        polygonControl.deactivate(); //stops the drawing
    }  
var selectControl = new OpenLayers.Control.SelectFeature([observationsVectorLayer,layerNewObservation]);
var polygonControl = new OpenLayers.Control.DrawFeature(polygonLayer,OpenLayers.Handler.Polygon, 
        {eventListeners:{"featureadded": newPolygonAdded}});
var selectControl = new OpenLayers.Control.SelectFeature([observationsVectorLayer,layerNewObservation,]);
publicMap.addControl(selectControl);
publicMap.addControl(polygonControl);
selectControl.activate();

drag = new OpenLayers.Control.DragFeature(layerNewObservation,{
	onComplete: endDrag
}); 
publicMap.addControl(drag); 
drag.activate();


function endDrag(feat) {
	var geom = feat.geometry.clone();
	geom.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
	latitudeField.setValue(geom.y);
	longitudeField.setValue(geom.x);
}

var feat = null;
var point = null;
function createFeatureAdd(X,Y) {
	console.log('eastPanelFormCreatePOI is collapsed?' + eastPanelFormCreatePOI.collapsed);
	//we do not create the new observation feature on the map if the form to create it is not displayed
	if (!eastPanelFormCreatePOI.collapsed){
		layerNewObservation.removeAllFeatures();
		point = new OpenLayers.Geometry.Point(X,Y);
		console.log('feat not yet defined');
		feat = new OpenLayers.Feature.Vector(point, null, 
				{
			strokeColor: "#ff0000", 
			strokeOpacity: 0.8,
			fillColor : "#ff0000",
			fillOpacity: 0.4,
			pointRadius : 8
				}
		);


		layerNewObservation.addFeatures([feat]);
		var geom = feat.geometry.clone();
		geom.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
		latitudeField.setValue(geom.y);
		longitudeField.setValue(geom.x);
		console.log('feat not yet defined ' + latitudeField.getValue() + ' ' + longitudeField.getValue());
		if (activateReverseGeocoding){
		PublicAddRueField.disable();
		Ext.Ajax.request({
			waitMsg: T_pleaseWait,
			url: 'lib/php/public/getAdresse.php',
			params: {
				lon: longitudeField.getValue(),
				lat: latitudeField.getValue()
			},
			success: function(response) {
				console.log('address found = '+response.responseText);
				PublicAddRueField.setValue(response.responseText);
				PublicAddRueField.enable();
			},
			failure: function(response){
				var result = response.responseText;
				console.log('error getting address = '+response.responseText);
				PublicAddRueField.enable();
			}
		});
		
	}
	}else{
		console.log('Reverse geocoding is deactivated, look at key.js.template to enable it');
	}
}

//creation de l'interface pour ajouter une nouvelle observation (formulaire de droite sur interface frontend)
var PublicAddTextDescField = new Ext.form.TextArea({
	id: 'PublicAddTextDescField',
	fieldLabel: T_descPb,
	maxLength: 500,
	allowBlank: false,
	height: 100,
	anchor : '99%'
});

var PublicAddTextPropField = new Ext.form.TextArea({
	id: 'PublicAddTextPropField',
	fieldLabel: T_propositionAmelioration,
	maxLength: 500,
	allowBlank: false,
	height: 100,
	anchor : '99%'
});

var PublicAddEmailField = new Ext.form.TextField({
	id: 'PublicAddEmailField',
	fieldLabel: T_email,
	maxLength: 50,
	allowBlank: false,
	vtype: 'email',
	anchor : '99%'
});

var PublicAddAdherentField = new Ext.form.TextField({
	id: 'PublicAddAdherentField',
	fieldLabel: T_adherentRecord,
	maxLength: 100,
	allowBlank: true,
	anchor : '95%'
});

var PublicAddTelField = new Ext.form.TextField({
	id: 'PublicAddTelField',
	fieldLabel: T_tel,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%'
});

var PublicAddNumField = new Ext.form.TextField({
	id: 'PublicAddNumField',
	fieldLabel: T_numRecord,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%'
});

var PublicAddRueField = new Ext.form.TextField({
	id: 'PublicAddRueField',
	fieldLabel: T_rueRecord,
	maxLength: 50,
	allowBlank: true,
	anchor : '99%'
});

var latitudeField = new Ext.form.NumberField({
	id: 'latitude',
	name: 'latitude',
	fieldLabel: T_latitude,
	allowNegative: true,
	allowDecimals: true,
	decimalSeparator: '.',
	decimalPrecision: 20,
	disabled: false,
	hidden: true
});

var longitudeField = new Ext.form.NumberField({
	id: 'longitude',
	name: 'longitude',
	fieldLabel: T_longitude,
	allowNegative: true,
	allowDecimals: true,
	decimalSeparator: '.',
	decimalPrecision: 20,
	disabled: false,
	hidden: true
});



var PolePOIField = new Ext.form.ComboBox({
	fieldLabel: T_pole,
	store: PolePOIList,
	anchor: '99%',
	displayField: 'lib_pole',
	valueField: 'id_pole',
	forceSelection: false,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	emptyText: ''
});

var CommunePOIField = new Ext.form.ComboBox({
	fieldLabel: T_commune,
	anyMatch: true,
	store: CommunePOIList,
	anchor: '99%',
	displayField: 'lib_commune',
	valueField: 'id_commune',
	forceSelection: false,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	emptyText: ''
});

var subCategoryPOIList = new Ext.data.JsonStore({
	url: 'lib/php/public/getSubCategory.php',
	root: 'subcategory',
	fields: [
	         {name: 'id_subcategory'},
	         {name: 'lib_subcategory'}
	         ]
});

var SubCategoryPOIField = new Ext.form.ComboBox({
	fieldLabel: T_pbType,
	store: subCategoryPOIList,
	anchor: '99%',
	displayField: 'lib_subcategory',
	valueField: 'id_subcategory',
	forceSelection: true,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: false,
	emptyText: ''
});

var hiddenIdPOI = new Ext.form.Hidden({
	id: 'hiddenIdPOI',
	name: 'id_POI'
});

var eastPanelFormCreatePOI = new Ext.form.FormPanel({
	id: 'eastPanelFormCreatePOI',
	fileUpload: true,
	hidden: true,
	baseCls: 'x-plain',
	region: 'east',
	header: false,
	title: T_howToParticipate,
	iconCls: 'silk_help',
	split: true,
	width: 290,
	minSize: 150,
	maxSize: 290,
	autoScroll: true,
	rootVisible: false,
	autoScroll: true,
	collapsible: false,
	collapseMode: 'mini',
	collapsed: true,
	labelAlign: 'top',
	items: [{
		xtype: 'fieldset',
		collapsible: false,
		title: T_obs,
		items: [hiddenIdPOI, SubCategoryPOIField, PublicAddNumField, PublicAddRueField, PublicAddTextDescField, PublicAddTextPropField, latitudeField, longitudeField,{
			xtype: 'fileuploadfield',
			id: 'form-file',
			anchor: '99%',
			emptyText: T_selectPhoto,
			fieldLabel: T_photo,
			name: 'photo-path',
			buttonText: '',
			buttonCfg: {
				iconCls: 'fugue_folder-open-document'
			}
		},{
			html: "<center><span style='color:#8f5757;'>"+T_sizeOctetPhoto+"</span></center>"
		}]
	}, {
		xtype: 'fieldset',
		collapsible: true,
		collapsed: false,
		title: T_yourDetails,
		items: [PublicAddAdherentField, PublicAddEmailField, PublicAddTelField]
	}
	],
	buttonAlign: 'center',
	buttons: [{
		text: T_submit,
		handler: createPublicPOI,
		iconCls: 'silk_add'
	},{
		text: T_cancel,
		iconCls: 'silk_delete',
		handler: function() {
			treePanel.expand();
			eastPanelFormCreatePOI.collapse();
			participationButton.toggle();
			participationButton.enable();
			resetPOIForm();
			feat.destroy();
			feat = null;
		}
	}]
});

var communePOIList = new Ext.data.JsonStore({
	url: 'lib/php/public/getCommune.php',
	root: 'commune',
	fields: [
	         {name: 'id_commune'},
	         {name: 'lib_commune'}
	         ]
});
var territoiresPOIList = new Ext.data.JsonStore({
	url: 'lib/php/public/getTerritoire.php',
	root: 'territoire',
	fields: [
	         {name: 'id_territoire'},
	         {name: 'lib_territoire'}
	         ]
});
//var CommuneyPOIField = new Ext.form.ComboBox({
//	fieldLabel: T_pbType,
//	store: communePOIList,
//	anchor: '99%',
//	displayField: 'lib_commune',
//	valueField: 'id_commune',
//	forceSelection: true,
//	editable: false,
//	mode: 'remote',
//	triggerAction: 'all',
//	selectOnFocus: true,
//	allowBlank: false,
//	emptyText: ''
//});
var TerritoireField = new Ext.form.ComboBox({
	fieldLabel: T_territoire,
	store: territoiresPOIList,
	anchor: '99%',
	displayField: 'lib_territoire',
	valueField: 'id_territoire',
	forceSelection: false,
	editable: false,
	mode: 'remote',
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	emptyText: ''
});

var CustomPolygonField = new Ext.form.TextArea({
	id: 'CustomPolygonField',
	fieldLabel: T_custom_polygone,
	maxLength: 1000,
	allowBlank: true,
	height: 50,
	anchor : '99%'
});
var southPanelFormExportPOI = new Ext.form.FormPanel({
	id: 'southPanelFormExportPOI',
	hidden: true,
	baseCls: 'x-plain',
	region: 'south',
	header: false,
	title: T_howToParticipate, //TODO replace
	iconCls: 'silk_help',
	split: true,
	width: 290,
	minSize: 150,
	maxSize: 290,
	autoScroll: true,
	rootVisible: false,
	autoScroll: true,
	collapsible: false,
	collapseMode: 'mini',
	collapsed: true,
	labelAlign: 'top',
	items: [{
		xtype: 'fieldset',
		collapsible: false,
		title: T_exportChoice,
		items: [{
			html: "<span style=\"font-weight:bold\">"+T_exportHelp+"</span>"
		},TerritoireField, PolePOIField, CommunePOIField, CustomPolygonField]
	}
	],
	buttonAlign: 'center',
	buttons: [{
		text: T_submit,
		handler: exportPublicPOI, //createPublicPOI
		iconCls: 'silk_add'
	},{
		text: T_cancel,
		iconCls: 'silk_delete',
		handler: function() {
			treePanel.expand();
			southPanelFormExportPOI.collapse();
			exportButton.toggle();
			exportButton.enable();
			resetPOIForm();
			exportPolygonFeature.destroy();
			exportPolygonFeature = null;
		}
	}]
});


function resetPOIForm() {
	eastPanelFormCreatePOI.getForm().reset();
	southPanelFormExportPOI.getForm().reset();
}

function isPOIFormValid() {
	return(SubCategoryPOIField.isValid() &&
			PublicAddNumField.isValid() &&
			PublicAddRueField.isValid() &&
			PublicAddTextDescField.isValid() &&
			PublicAddTextPropField.isValid() &&
			PublicAddAdherentField.isValid() &&
			PublicAddTelField.isValid() &&
			PublicAddEmailField.isValid() && 
			feat != null
	);
}

function createPublicPOI() {
	console.log('feat' + feat);
	//if the new observation marker is not created on the map, do not allow to create the observation
	if (feat == null){
		Ext.MessageBox.show({
			title: T_error,
			msg: T_noMarkerForNewObservation,
			buttons: Ext.Msg.OK,
			icon: Ext.MessageBox.ERROR,
			iconCls: 'silk_information'
		});
	}else if (isPOIFormValid()) {
		eastPanelFormCreatePOI.getForm().submit({
			waitMsg: T_pleaseWait,
			url: 'lib/php/admin/database.php',
			params: {
				task: "CREATEPUBLICPOI",
				id_poi: idPoiComment,
				latitude_poi: latitudeField.getValue(),
				longitude_poi: longitudeField.getValue(),
				desc_poi: PublicAddTextDescField.getValue(),
				prop_poi: PublicAddTextPropField.getValue(),
				mail_poi: PublicAddEmailField.getValue(),
				tel_poi: PublicAddTelField.getValue(),
				num_poi: PublicAddNumField.getValue(),
				rue_poi: PublicAddRueField.getValue(),
				adherent_poi: PublicAddAdherentField.getValue(),
				subcategory_id_subcategory:	SubCategoryPOIField.getValue()
			},
			success: function(eastPanelFormCreatePOI, o) {
				console.log("eastPanelFormCreatePOI success "+o.result.ok);
				Ext.MessageBox.show({
					title: T_propSent,
					msg: o.result.ok,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO,
					iconCls: 'silk_tick'
				});
				Ext.getCmp('eastPanelFormCreatePOI').collapse();
				treePanel.expand();
				participationButton.toggle();
				participationButton.enable();
				resetPOIForm();
				feat.destroy();
				feat = null;
			},
			failure: function(eastPanelFormCreatePOI, o) {
				console.log("eastPanelFormCreatePOI echec "+o.result.pb);
				Ext.MessageBox.show({
					title: T_transfertKO,
					msg: o.result.pb,
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.ERROR,
					iconCls: 'fugue_cross-script'
				});
			}
		});
	}
}	
//only one field can be filled
function isExportPOIFormValid() {
	$numberOfFilledFields = 0;
	if (CommunePOIField.getValue() != ''){
		$numberOfFilledFields++;
	}
	if (TerritoireField.getValue() != ''){
		$numberOfFilledFields++;
	}
	if (CustomPolygonField.getValue() != ''){
		$numberOfFilledFields++;
	}
	if (PolePOIField.getValue() != ''){
		$numberOfFilledFields++;
	}
	if ($numberOfFilledFields > 1 || $numberOfFilledFields == 0){
		PolePOIField.clearValue();
		CommunePOIField.clearValue();
		TerritoireField.clearValue();
		CustomPolygonField.setValue("");
		return false;
	}
	return true;
}
//TODO
function exportPublicPOI() {
	if (isExportPOIFormValid()) {
	Ext.Ajax.request({
		url: 'lib/php/admin/writeCsv.php?type=poi',
		method: 'GET', 
		params: {
			commune_poi: CommunePOIField.getValue(),
			pole_poi: PolePOIField.getValue(),
			territoire_poi: TerritoireField.getValue(), 
			customPolygon_poi: CustomPolygonField.getValue()
		},
		success: function (response) {
			//console.log(response.responseText);
			var res = Ext.util.JSON.decode(response.responseText);
			if (res.success == true) {
				Ext.Msg.buttonText.cancel = T_close;
				southPanelFormExportPOI.collapse();
				treePanel.expand();
				exportButton.toggle();
				exportButton.enable();
				if(exportPolygonFeature){
					exportPolygonFeature.destroy();
					exportPolygonFeature = null;
				}
				
				Ext.Msg.show({
					title: T_download,
					msg: '<a href="resources/csv/'+res.file+'"><div style="text-decoration:underline;color:#000000">'+T_downloadCsvPOI+'</div></a>',
					buttons: Ext.Msg.CANCEL,
					icon: Ext.Msg.INFO,
					minWidth: 300
				});
			} else {
				if(exportPolygonFeature){
					exportPolygonFeature.destroy();
					exportPolygonFeature = null;
				}
				polygonControl.activate();
				Ext.Msg.show({
					title: 'Hum ...',
					msg: '<div style="color:#000000">'+T_pbCsv+ ": " + res.message+'</div>',
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING,
					minWidth: 300
				});
			}
		},
		failure: function(response) {
			var result = response.responseText;
			if(exportPolygonFeature){
				exportPolygonFeature.destroy();
				exportPolygonFeature = null;
			}
			polygonControl.activate();
			Ext.MessageBox.show({
				title: T_pb,
				msg: '<div style="color:#000000">'+T_pbCsv+'</div>',
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.ERROR
			});   
		}
	});
}else{
	Ext.MessageBox.show({
		title: T_download,
		msg: T_exportFormValidation,
		buttons: Ext.Msg.OK,
		icon: Ext.MessageBox.INFO,
		iconCls: 'silk_tick'
	});
}

}	
Ext.util.Observable.capture( eastPanelFormCreatePOI, function(event) {                                                                                                        
//	console.log("treePanel = "+event);
});

function setCookie() {
//	console.debug("setCookie");
	if (publicMap && publicMap.getCenter()){
		var d = new Date();
		d.setTime(d.getTime() + (365*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = "mapx="+publicMap.getCenter().lon+ ";" + expires + ";path=/";
		document.cookie = "mapy="+publicMap.getCenter().lat+ ";" + expires + ";path=/";
		document.cookie = "mapz="+publicMap.getZoom()+ ";" + expires + ";path=/";
		document.cookie = "categories="+treePanel.getChecked('id').join()+ ";" + expires + ";path=/";
//		console.debug("setCookie : " + document.cookie);
	}
}


