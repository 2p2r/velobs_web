/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
* @class Ext.ux.ProgressBarPager
* @extends Object 
* Plugin (ptype = 'tabclosemenu') for displaying a progressbar inside of a paging toolbar instead of plain text
* 
* @ptype progressbarpager 
* @constructor
* Create a new ItemSelector
* @param {Object} config Configuration options
* @xtype itemselector 
*/
Ext.ux.ProgressBarPager  = Ext.extend(Object, {
	/**
 	* @cfg {Integer} progBarWidth
 	* <p>The default progress bar width.  Default is 225.</p>
	*/
	progBarWidth   : 225,
	/**
 	* @cfg {String} defaultText
	* <p>The text to display while the store is loading.  Default is 'Loading...'</p>
 	*/
	defaultText    : 'Loading...',
    	/**
 	* @cfg {Object} defaultAnimCfg 
 	* <p>A {@link Ext.Fx Ext.Fx} configuration object.  Default is  { duration : 1, easing : 'bounceOut' }.</p>
 	*/
	defaultAnimCfg : {
		duration   : 1,
		easing     : 'bounceOut'	
	},												  
	constructor : function(config) {
		if (config) {
			Ext.apply(this, config);
		}
	},
	//public
	init : function (parent) {
		
		if(parent.displayInfo){
			this.parent = parent;
			var ind  = parent.items.indexOf(parent.displayItem);
			parent.remove(parent.displayItem, true);
			this.progressBar = new Ext.ProgressBar({
				text    : this.defaultText,
				width   : this.progBarWidth,
				animate :  this.defaultAnimCfg
			});					
		   
			parent.displayItem = this.progressBar;
			
			parent.add(parent.displayItem);	
			parent.doLayout();
			Ext.apply(parent, this.parentOverrides);		
			
			this.progressBar.on('render', function(pb) {
                pb.mon(pb.getEl().applyStyles('cursor:pointer'), 'click', this.handleProgressBarClick, this);
            }, this, {single: true});
						
		}
		  
	},
	// private
	// This method handles the click for the progress bar
	handleProgressBarClick : function(e){
		var parent = this.parent,
		    displayItem = parent.displayItem,
		    box = this.progressBar.getBox(),
		    xy = e.getXY(),
		    position = xy[0]-box.x,
		    pages = Math.ceil(parent.store.getTotalCount()/parent.pageSize),
		    newpage = Math.ceil(position/(displayItem.width/pages));
            
		parent.changePage(newpage);
	},
	
	// private, overriddes
	parentOverrides  : {
		// private
		// This method updates the information via the progress bar.
		updateInfo : function(){
			if(this.displayItem){
				var count = this.store.getCount(),
				    pgData = this.getPageData(),
				    pageNum = this.readPage(pgData),
				    msg = count == 0 ?
					this.emptyMsg :
					String.format(
						this.displayMsg,
						this.cursor+1, this.cursor+count, this.store.getTotalCount()
					);
					
				pageNum = pgData.activePage; ;	
				
				var pct	= pageNum / pgData.pages;	
				
				this.displayItem.updateProgress(pct, msg, this.animate || this.defaultAnimConfig);
			}
		}
	}
});
Ext.preg('progressbarpager', Ext.ux.ProgressBarPager);

