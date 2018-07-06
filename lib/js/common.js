
//field added to the map menus to filter by date
var dateLastModif;
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
        	console.log(dateLastModif);
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
		getMarker();
	}
});
//field added to the map menus to filter by status
var statusPOIList = new Ext.data.JsonStore({
	  url: 'lib/php/admin/getStatus.php',
	  root: 'status',
	  fields: [
	    {name: 'id_status'},
	    {name: 'lib_status'}
	  ]
	});
  
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
  		getMarker();
  });
  var CancelStatusFilterItem = new Ext.Button({
	   id:'CancelStatusFilterItem',
	   iconCls: 'silk_cancel',
	   text:'',
	   handler: function() {
	      StatusPOIFieldMapItemMenu.reset();
		  	getMarker();
	   }
  });
  
  //field added to the map menus to filter by priority
  var prioritePOIList = new Ext.data.JsonStore({
  	  url: 'lib/php/admin/getPriorite.php',
  	  root: 'priorite',
  	  fields: [
  	    {name: 'id_priorite'},
  	    {name: 'lib_priorite'}
  	  ]
  	});
  
  	var comboPrioritePOIMapItemMenu = new Ext.form.ComboBox({
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

