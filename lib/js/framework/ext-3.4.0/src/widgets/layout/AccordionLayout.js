/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.layout.AccordionLayout
 * @extends Ext.layout.FitLayout
 * <p>This is a layout that manages multiple Panels in an expandable accordion style such that only
 * <b>one Panel can be expanded at any given time</b>. Each Panel has built-in support for expanding and collapsing.</p>
 * <p>Note: Only Ext.Panels <b>and all subclasses of Ext.Panel</b> may be used in an accordion layout Container.</p>
 * <p>This class is intended to be extended or created via the <tt><b>{@link Ext.Container#layout layout}</b></tt>
 * configuration property.  See <tt><b>{@link Ext.Container#layout}</b></tt> for additional details.</p>
 * <p>Example usage:</p>
 * <pre><code>
var accordion = new Ext.Panel({
    title: 'Accordion Layout',
    layout:'accordion',
    defaults: {
        // applied to each contained panel
        bodyStyle: 'padding:15px'
    },
    layoutConfig: {
        // layout-specific configs go here
        titleCollapse: false,
        animate: true,
        activeOnTop: true
    },
    items: [{
        title: 'Panel 1',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    },{
        title: 'Panel 2',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    },{
        title: 'Panel 3',
        html: '&lt;p&gt;Panel content!&lt;/p&gt;'
    }]
});
</code></pre>
 */
Ext.layout.AccordionLayout = Ext.extend(Ext.layout.FitLayout, {
    /**
     * @cfg {Boolean} fill
     * True to adjust the active item's height to fill the available space in the container, false to use the
     * item's current height, or auto height if not explicitly set (defaults to true).
     */
    fill : true,
    /**
     * @cfg {Boolean} autoWidth
     * True to set each contained item's width to 'auto', false to use the item's current width (defaults to true).
     * Note that some components, in particular the {@link Ext.grid.GridPanel grid}, will not function properly within
     * layouts if they have auto width, so in such cases this config should be set to false.
     */
    autoWidth : true,
    /**
     * @cfg {Boolean} titleCollapse
     * True to allow expand/collapse of each contained panel by clicking anywhere on the title bar, false to allow
     * expand/collapse only when the toggle tool button is clicked (defaults to true).  When set to false,
     * {@link #hideCollapseTool} should be false also.
     */
    titleCollapse : true,
    /**
     * @cfg {Boolean} hideCollapseTool
     * True to hide the contained panels' collapse/expand toggle buttons, false to display them (defaults to false).
     * When set to true, {@link #titleCollapse} should be true also.
     */
    hideCollapseTool : false,
    /**
     * @cfg {Boolean} collapseFirst
     * True to make sure the collapse/expand toggle button always renders first (to the left of) any other tools
     * in the contained panels' title bars, false to render it last (defaults to false).
     */
    collapseFirst : false,
    /**
     * @cfg {Boolean} animate
     * True to slide the contained panels open and closed during expand/collapse using animation, false to open and
     * close directly with no animation (defaults to false).  Note: to defer to the specific config setting of each
     * contained panel for this property, set this to undefined at the layout level.
     */
    animate : false,
    /**
     * @cfg {Boolean} sequence
     * <b>Experimental</b>. If animate is set to true, this will result in each animation running in sequence.
     */
    sequence : false,
    /**
     * @cfg {Boolean} activeOnTop
     * True to swap the position of each panel as it is expanded so that it becomes the first item in the container,
     * false to keep the panels in the rendered order. <b>This is NOT compatible with "animate:true"</b> (defaults to false).
     */
    activeOnTop : false,

    type: 'accordion',

    renderItem : function(c){
        if(this.animate === false){
            c.animCollapse = false;
        }
        c.collapsible = true;
        if(this.autoWidth){
            c.autoWidth = true;
        }
        if(this.titleCollapse){
            c.titleCollapse = true;
        }
        if(this.hideCollapseTool){
            c.hideCollapseTool = true;
        }
        if(this.collapseFirst !== undefined){
            c.collapseFirst = this.collapseFirst;
        }
        if(!this.activeItem && !c.collapsed){
            this.setActiveItem(c, true);
        }else if(this.activeItem && this.activeItem != c){
            c.collapsed = true;
        }
        Ext.layout.AccordionLayout.superclass.renderItem.apply(this, arguments);
        c.header.addClass('x-accordion-hd');
        c.on('beforeexpand', this.beforeExpand, this);
    },

    onRemove: function(c){
        Ext.layout.AccordionLayout.superclass.onRemove.call(this, c);
        if(c.rendered){
            c.header.removeClass('x-accordion-hd');
        }
        c.un('beforeexpand', this.beforeExpand, this);
    },

    // private
    beforeExpand : function(p, anim){
        var ai = this.activeItem;
        if(ai){
            if(this.sequence){
                delete this.activeItem;
                if (!ai.collapsed){
                    ai.collapse({callback:function(){
                        p.expand(anim || true);
                    }, scope: this});
                    return false;
                }
            }else{
                ai.collapse(this.animate);
            }
        }
        this.setActive(p);
        if(this.activeOnTop){
            p.el.dom.parentNode.insertBefore(p.el.dom, p.el.dom.parentNode.firstChild);
        }
        // Items have been hidden an possibly rearranged, we need to get the container size again.
        this.layout();
    },

    // private
    setItemSize : function(item, size){
        if(this.fill && item){
            var hh = 0, i, ct = this.getRenderedItems(this.container), len = ct.length, p;
            // Add up all the header heights
            for (i = 0; i < len; i++) {
                if((p = ct[i]) != item && !p.hidden){
                    hh += p.header.getHeight();
                }
            };
            // Subtract the header heights from the container size
            size.height -= hh;
            // Call setSize on the container to set the correct height.  For Panels, deferedHeight
            // will simply store this size for when the expansion is done.
            item.setSize(size);
        }
    },

    /**
     * Sets the active (expanded) item in the layout.
     * @param {String/Number} item The string component id or numeric index of the item to activate
     */
    setActiveItem : function(item){
        this.setActive(item, true);
    },

    // private
    setActive : function(item, expand){
        var ai = this.activeItem;
        item = this.container.getComponent(item);
        if(ai != item){
            if(item.rendered && item.collapsed && expand){
                item.expand();
            }else{
                if(ai){
                   ai.fireEvent('deactivate', ai);
                }
                this.activeItem = item;
                item.fireEvent('activate', item);
            }
        }
    }
});
Ext.Container.LAYOUTS.accordion = Ext.layout.AccordionLayout;

//backwards compat
Ext.layout.Accordion = Ext.layout.AccordionLayout;