/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux');

Ext.ux.Rating = Ext.extend(Ext.util.Observable, {
	// Configuration options
    starWidth: 16,
    split: 1,
    resetValue: '',
	defaultSelected: -1,	
    selected: -1,
    showTitles: true,    
    
	// Our class constructor
    constructor : function(element, config) {
        Ext.apply(this, config);
        Ext.ux.Rating.superclass.constructor.call(this);
        
        this.addEvents(
            'change',
            'reset'
        );
        
        this.el = Ext.get(element);
        this.init();
    },
    
    init : function() {
        var me = this;
        
		// Some arrays we are going to store data in
        this.values = [];
        this.titles = [];
        this.stars = [];
		
		// We create a container to put all our stars into      
        this.container = this.el.createChild({
            cls: 'ux-rating-container ux-rating-clearfix'
        });
				
        if(this.canReset) {
            this.resetEl = this.container.createChild({
                cls: 'ux-rating-reset',
                cn: [{
                    tag: 'a',
                    title: this.showTitles ? (this.resetTitle || 'Reset your vote') : '',
                    html: 'Reset'
                }]
            });
            this.resetEl.visibilityMode = Ext.Element.DISPLAY;
            
            this.resetEl.hover(function() {
                Ext.fly(this).addClass('ux-rating-reset-hover');
            }, function() {
                Ext.fly(this).removeClass('ux-rating-reset-hover');
            });
            
            this.resetEl.on('click', this.reset, this);
        }

		// We use DomQuery to select the radio buttons
		this.radioBoxes = this.el.select('input[type=radio]');
		// Then we can loop over the CompositeElement using each
        this.radioBoxes.each(this.initStar, this);
        
		// We use DomHelper to create our hidden input
		this.input = this.container.createChild({
			tag: 'input',
			type: 'hidden',
			name: this.name,
			value: this.values[this.defaultSelected] || this.resetValue
		});
		
		// Lets remove all the radio buttons from the DOM
		this.radioBoxes.remove();
		
        this.select(this.defaultSelected === undefined ? false : this.defaultSelected)

        if(this.disabled) {
            this.disable();
        } else {
			// Enable will set up our event listeners
            this.enable();
        }
    },

    initStar : function(item, all, i) {
        var sw = Math.floor(this.starWidth / this.split);
        
		// We use the name and disabled attributes of the first radio button 
		if(i == 0) {
	        this.name = item.dom.name;
	        this.disabled = item.dom.disabled;		
		}
		
		// Saving the value and title for this star
        this.values[i] = item.dom.value;
        this.titles[i] = item.dom.title;

        if(item.dom.checked) {
            this.defaultSelected = i;
        }
        
		// Now actually create the star!
        var star = this.container.createChild({
            cls: 'ux-rating-star'
        });
        
        var starLink = star.createChild({
            tag: 'a',
            html: this.values[i],
            title: this.showTitles ? this.titles[i] : ''
        });
        
        // Prepare division settings
        if(this.split) {
          var odd = (i % this.split);              
          star.setWidth(sw);
          starLink.setStyle('margin-left', '-' + (odd * sw) + 'px');
        }

		// Save the reference to this star so we can easily access it later
        this.stars.push(star.dom);
    },
    
    onStarClick : function(ev, t) {
        if(!this.disabled) {
            this.select(this.stars.indexOf(t));
        }
    },

    onStarOver : function(ev, t) {
        if(!this.disabled) {
            this.fillTo(this.stars.indexOf(t), true);
        }        
    },
    
    onStarOut : function(ev, t) {
        if(!this.disabled) {
            this.fillTo(this.selected, false);            
        }
    },
    
    reset : function(ev, t) {
        this.select(-1);
    },
    
    select : function(index) {
        if(index === false || index === -1) {
            // remove current selection in el
            this.value = this.resetValue;
            this.title = "";
			this.input.dom.value = '';    
            
            if(this.canReset) {
                this.resetEl.setOpacity(0.5);
            }
            
            this.fillNone();
            
            if(this.selected !== -1) {
                this.fireEvent('change', this, this.values[index], this.stars[index]);              
            }
            this.selected = -1;            
        }
        else if(index !== this.selected) {
			// Update some properties         
            this.selected = index;
            this.value = this.values[index];
            this.title = this.titles[index];
			
			// Set the value of our hidden input so the rating can be submitted			
			this.input.dom.value = this.value;
			
            if(this.canReset) {
                this.resetEl.setOpacity(0.99);
            }
            
			// the fillTo() method will fill the stars up until the selected one        
            this.fillTo(index, false);
            
			// Lets also not forget to fire our custom event!
            this.fireEvent('change', this, this.values[index], this.stars[index]);            
        }     
    },
    
    fillTo : function(index, hover) {
        if (index != -1) {
            var addClass = hover ? 'ux-rating-star-hover' : 'ux-rating-star-on';
            var removeClass = hover ? 'ux-rating-star-on' : 'ux-rating-star-hover';
             
			// We add a css class to each star up until the selected one   
            Ext.each(this.stars.slice(0, index+1), function() {
                Ext.fly(this).removeClass(removeClass).addClass(addClass);
            });

			// And then remove the same class from all the stars after this one
            Ext.each(this.stars.slice(index+1), function() {
                Ext.fly(this).removeClass([removeClass, addClass]);
            });
        }
        else {
            this.fillNone();
        }        
    },
    
    fillNone : function() {
        this.container.select('.ux-rating-star').removeClass(['ux-rating-star-hover', 'ux-rating-star-on']);
    },

    enable : function() {		
        if(this.canReset) {
            this.resetEl.show();
        }
        
        this.input.dom.disabled = null;
        this.disabled = false;
        
        this.container.removeClass('ux-rating-disabled');
 
		// We will be using the technique of event delegation by listening
    	// for bubbled up events on the container       
        this.container.on({
            click: this.onStarClick, 
            mouseover: this.onStarOver,
            mouseout: this.onStarOut,
            scope: this,
            delegate: 'div.ux-rating-star'
        });        
    },
	    
    disable : function() {
        if(this.canReset) {
            this.resetEl.hide();
        }
        
        this.input.dom.disabled = true;
        this.disabled = true;
        
        this.container.addClass('ux-rating-disabled');

        this.container.un({
            click: this.onStarClick, 
            mouseover: this.onStarOver,
            mouseout: this.onStarOut,
            scope: this,
            delegate: 'div.ux-rating-star'
        });        
    },
    
    getValue : function() {
        return this.values[this.selected] || this.resetValue;
    },
	
	destroy : function() {
		this.disable();
		this.container.remove();
		this.radioBoxes.appendTo(this.el);
		if(this.selected !== -1) {
			this.radioBoxes.elements[this.selected].checked = true;
		}
	}
});
