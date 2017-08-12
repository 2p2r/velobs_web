/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.BoxComponent
 * @extends Ext.Component
 * <p>Base class for any {@link Ext.Component Component} that is to be sized as a box, using width and height.</p>
 * <p>BoxComponent provides automatic box model adjustments for sizing and positioning and will work correctly
 * within the Component rendering model.</p>
 * <p>A BoxComponent may be created as a custom Component which encapsulates any HTML element, either a pre-existing
 * element, or one that is created to your specifications at render time. Usually, to participate in layouts,
 * a Component will need to be a <b>Box</b>Component in order to have its width and height managed.</p>
 * <p>To use a pre-existing element as a BoxComponent, configure it so that you preset the <b>el</b> property to the
 * element to reference:<pre><code>
var pageHeader = new Ext.BoxComponent({
    el: 'my-header-div'
});</code></pre>
 * This may then be {@link Ext.Container#add added} to a {@link Ext.Container Container} as a child item.</p>
 * <p>To create a BoxComponent based around a HTML element to be created at render time, use the
 * {@link Ext.Component#autoEl autoEl} config option which takes the form of a
 * {@link Ext.DomHelper DomHelper} specification:<pre><code>
var myImage = new Ext.BoxComponent({
    autoEl: {
        tag: 'img',
        src: '/images/my-image.jpg'
    }
});</code></pre></p>
 * @constructor
 * @param {Ext.Element/String/Object} config The configuration options.
 * @xtype box
 */
Ext.BoxComponent = Ext.extend(Ext.Component, {

    // Configs below are used for all Components when rendered by BoxLayout.
    /**
     * @cfg {Number} flex
     * <p><b>Note</b>: this config is only used when this Component is rendered
     * by a Container which has been configured to use a <b>{@link Ext.layout.BoxLayout BoxLayout}.</b>
     * Each child Component with a <code>flex</code> property will be flexed either vertically (by a VBoxLayout)
     * or horizontally (by an HBoxLayout) according to the item's <b>relative</b> <code>flex</code> value
     * compared to the sum of all Components with <code>flex</flex> value specified. Any child items that have
     * either a <code>flex = 0</code> or <code>flex = undefined</code> will not be 'flexed' (the initial size will not be changed).
     */
    // Configs below are used for all Components when rendered by AnchorLayout.
    /**
     * @cfg {String} anchor <p><b>Note</b>: this config is only used when this Component is rendered
     * by a Container which has been configured to use an <b>{@link Ext.layout.AnchorLayout AnchorLayout} (or subclass thereof).</b>
     * based layout manager, for example:<div class="mdetail-params"><ul>
     * <li>{@link Ext.form.FormPanel}</li>
     * <li>specifying <code>layout: 'anchor' // or 'form', or 'absolute'</code></li>
     * </ul></div></p>
     * <p>See {@link Ext.layout.AnchorLayout}.{@link Ext.layout.AnchorLayout#anchor anchor} also.</p>
     */
    // tabTip config is used when a BoxComponent is a child of a TabPanel
    /**
     * @cfg {String} tabTip
     * <p><b>Note</b>: this config is only used when this BoxComponent is a child item of a TabPanel.</p>
     * A string to be used as innerHTML (html tags are accepted) to show in a tooltip when mousing over
     * the associated tab selector element. {@link Ext.QuickTips}.init()
     * must be called in order for the tips to render.
     */
    // Configs below are used for all Components when rendered by BorderLayout.
    /**
     * @cfg {String} region <p><b>Note</b>: this config is only used when this BoxComponent is rendered
     * by a Container which has been configured to use the <b>{@link Ext.layout.BorderLayout BorderLayout}</b>
     * layout manager (e.g. specifying <tt>layout:'border'</tt>).</p><br>
     * <p>See {@link Ext.layout.BorderLayout} also.</p>
     */
    // margins config is used when a BoxComponent is rendered by BorderLayout or BoxLayout.
    /**
     * @cfg {Object} margins <p><b>Note</b>: this config is only used when this BoxComponent is rendered
     * by a Container which has been configured to use the <b>{@link Ext.layout.BorderLayout BorderLayout}</b>
     * or one of the two <b>{@link Ext.layout.BoxLayout BoxLayout} subclasses.</b></p>
     * <p>An object containing margins to apply to this BoxComponent in the
     * format:</p><pre><code>
{
    top: (top margin),
    right: (right margin),
    bottom: (bottom margin),
    left: (left margin)
}</code></pre>
     * <p>May also be a string containing space-separated, numeric margin values. The order of the
     * sides associated with each value matches the way CSS processes margin values:</p>
     * <p><div class="mdetail-params"><ul>
     * <li>If there is only one value, it applies to all sides.</li>
     * <li>If there are two values, the top and bottom borders are set to the first value and the
     * right and left are set to the second.</li>
     * <li>If there are three values, the top is set to the first value, the left and right are set
     * to the second, and the bottom is set to the third.</li>
     * <li>If there are four values, they apply to the top, right, bottom, and left, respectively.</li>
     * </ul></div></p>
     * <p>Defaults to:</p><pre><code>
     * {top:0, right:0, bottom:0, left:0}
     * </code></pre>
     */
    /**
     * @cfg {Number} x
     * The local x (left) coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} y
     * The local y (top) coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} pageX
     * The page level x coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} pageY
     * The page level y coordinate for this component if contained within a positioning container.
     */
    /**
     * @cfg {Number} height
     * The height of this component in pixels (defaults to auto).
     * <b>Note</b> to express this dimension as a percentage or offset see {@link Ext.Component#anchor}.
     */
    /**
     * @cfg {Number} width
     * The width of this component in pixels (defaults to auto).
     * <b>Note</b> to express this dimension as a percentage or offset see {@link Ext.Component#anchor}.
     */
    /**
     * @cfg {Number} boxMinHeight
     * <p>The minimum value in pixels which this BoxComponent will set its height to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Number} boxMinWidth
     * <p>The minimum value in pixels which this BoxComponent will set its width to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Number} boxMaxHeight
     * <p>The maximum value in pixels which this BoxComponent will set its height to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Number} boxMaxWidth
     * <p>The maximum value in pixels which this BoxComponent will set its width to.</p>
     * <p><b>Warning:</b> This will override any size management applied by layout managers.</p>
     */
    /**
     * @cfg {Boolean} autoHeight
     * <p>True to use height:'auto', false to use fixed height (or allow it to be managed by its parent
     * Container's {@link Ext.Container#layout layout manager}. Defaults to false.</p>
     * <p><b>Note</b>: Although many components inherit this config option, not all will
     * function as expected with a height of 'auto'. Setting autoHeight:true means that the
     * browser will manage height based on the element's contents, and that Ext will not manage it at all.</p>
     * <p>If the <i>browser</i> is managing the height, be aware that resizes performed by the browser in response
     * to changes within the structure of the Component cannot be detected. Therefore changes to the height might
     * result in elements needing to be synchronized with the new height. Example:</p><pre><code>
var w = new Ext.Window({
    title: 'Window',
    width: 600,
    autoHeight: true,
    items: {
        title: 'Collapse Me',
        height: 400,
        collapsible: true,
        border: false,
        listeners: {
            beforecollapse: function() {
                w.el.shadow.hide();
            },
            beforeexpand: function() {
                w.el.shadow.hide();
            },
            collapse: function() {
                w.syncShadow();
            },
            expand: function() {
                w.syncShadow();
            }
        }
    }
}).show();
</code></pre>
     */
    /**
     * @cfg {Boolean} autoWidth
     * <p>True to use width:'auto', false to use fixed width (or allow it to be managed by its parent
     * Container's {@link Ext.Container#layout layout manager}. Defaults to false.</p>
     * <p><b>Note</b>: Although many components  inherit this config option, not all will
     * function as expected with a width of 'auto'. Setting autoWidth:true means that the
     * browser will manage width based on the element's contents, and that Ext will not manage it at all.</p>
     * <p>If the <i>browser</i> is managing the width, be aware that resizes performed by the browser in response
     * to changes within the structure of the Component cannot be detected. Therefore changes to the width might
     * result in elements needing to be synchronized with the new width. For example, where the target element is:</p><pre><code>
&lt;div id='grid-container' style='margin-left:25%;width:50%'>&lt;/div>
</code></pre>
     * A Panel rendered into that target element must listen for browser window resize in order to relay its
      * child items when the browser changes its width:<pre><code>
var myPanel = new Ext.Panel({
    renderTo: 'grid-container',
    monitorResize: true, // relay on browser resize
    title: 'Panel',
    height: 400,
    autoWidth: true,
    layout: 'hbox',
    layoutConfig: {
        align: 'stretch'
    },
    defaults: {
        flex: 1
    },
    items: [{
        title: 'Box 1',
    }, {
        title: 'Box 2'
    }, {
        title: 'Box 3'
    }],
});
</code></pre>
     */
    /**
     * @cfg {Boolean} autoScroll
     * <code>true</code> to use overflow:'auto' on the components layout element and show scroll bars automatically when
     * necessary, <code>false</code> to clip any overflowing content (defaults to <code>false</code>).
     */

    /* // private internal config
     * {Boolean} deferHeight
     * True to defer height calculations to an external component, false to allow this component to set its own
     * height (defaults to false).
     */

    // private
    initComponent : function(){
        Ext.BoxComponent.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event resize
             * Fires after the component is resized.
             * @param {Ext.Component} this
             * @param {Number} adjWidth The box-adjusted width that was set
             * @param {Number} adjHeight The box-adjusted height that was set
             * @param {Number} rawWidth The width that was originally specified
             * @param {Number} rawHeight The height that was originally specified
             */
            'resize',
            /**
             * @event move
             * Fires after the component is moved.
             * @param {Ext.Component} this
             * @param {Number} x The new x position
             * @param {Number} y The new y position
             */
            'move'
        );
    },

    // private, set in afterRender to signify that the component has been rendered
    boxReady : false,
    // private, used to defer height settings to subclasses
    deferHeight: false,

    /**
     * Sets the width and height of this BoxComponent. This method fires the {@link #resize} event. This method can accept
     * either width and height as separate arguments, or you can pass a size object like <code>{width:10, height:20}</code>.
     * @param {Mixed} width The new width to set. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new width in the {@link #getEl Element}'s {@link Ext.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS width style.</li>
     * <li>A size object in the format <code>{width: widthValue, height: heightValue}</code>.</li>
     * <li><code>undefined</code> to leave the width unchanged.</li>
     * </ul></div>
     * @param {Mixed} height The new height to set (not required if a size object is passed as the first arg).
     * This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new height in the {@link #getEl Element}'s {@link Ext.Element#defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS height style. Animation may <b>not</b> be used.</li>
     * <li><code>undefined</code> to leave the height unchanged.</li>
     * </ul></div>
     * @return {Ext.BoxComponent} this
     */
    setSize : function(w, h){

        // support for standard size objects
        if(typeof w == 'object'){
            h = w.height;
            w = w.width;
        }
        if (Ext.isDefined(w) && Ext.isDefined(this.boxMinWidth) && (w < this.boxMinWidth)) {
            w = this.boxMinWidth;
        }
        if (Ext.isDefined(h) && Ext.isDefined(this.boxMinHeight) && (h < this.boxMinHeight)) {
            h = this.boxMinHeight;
        }
        if (Ext.isDefined(w) && Ext.isDefined(this.boxMaxWidth) && (w > this.boxMaxWidth)) {
            w = this.boxMaxWidth;
        }
        if (Ext.isDefined(h) && Ext.isDefined(this.boxMaxHeight) && (h > this.boxMaxHeight)) {
            h = this.boxMaxHeight;
        }
        // not rendered
        if(!this.boxReady){
            this.width  = w;
            this.height = h;
            return this;
        }

        // prevent recalcs when not needed
        if(this.cacheSizes !== false && this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return this;
        }
        this.lastSize = {width: w, height: h};
        var adj = this.adjustSize(w, h),
            aw = adj.width,
            ah = adj.height,
            rz;
        if(aw !== undefined || ah !== undefined){ // this code is nasty but performs better with floaters
            rz = this.getResizeEl();
            if(!this.deferHeight && aw !== undefined && ah !== undefined){
                rz.setSize(aw, ah);
            }else if(!this.deferHeight && ah !== undefined){
                rz.setHeight(ah);
            }else if(aw !== undefined){
                rz.setWidth(aw);
            }
            this.onResize(aw, ah, w, h);
            this.fireEvent('resize', this, aw, ah, w, h);
        }
        return this;
    },

    /**
     * Sets the width of the component.  This method fires the {@link #resize} event.
     * @param {Mixed} width The new width to set. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new width in the {@link #getEl Element}'s {@link Ext.Element#defaultUnit defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS width style.</li>
     * </ul></div>
     * @return {Ext.BoxComponent} this
     */
    setWidth : function(width){
        return this.setSize(width);
    },

    /**
     * Sets the height of the component.  This method fires the {@link #resize} event.
     * @param {Mixed} height The new height to set. This may be one of:<div class="mdetail-params"><ul>
     * <li>A Number specifying the new height in the {@link #getEl Element}'s {@link Ext.Element#defaultUnit defaultUnit}s (by default, pixels).</li>
     * <li>A String used to set the CSS height style.</li>
     * <li><i>undefined</i> to leave the height unchanged.</li>
     * </ul></div>
     * @return {Ext.BoxComponent} this
     */
    setHeight : function(height){
        return this.setSize(undefined, height);
    },

    /**
     * Gets the current size of the component's underlying element.
     * @return {Object} An object containing the element's size {width: (element width), height: (element height)}
     */
    getSize : function(){
        return this.getResizeEl().getSize();
    },

    /**
     * Gets the current width of the component's underlying element.
     * @return {Number}
     */
    getWidth : function(){
        return this.getResizeEl().getWidth();
    },

    /**
     * Gets the current height of the component's underlying element.
     * @return {Number}
     */
    getHeight : function(){
        return this.getResizeEl().getHeight();
    },

    /**
     * Gets the current size of the component's underlying element, including space taken by its margins.
     * @return {Object} An object containing the element's size {width: (element width + left/right margins), height: (element height + top/bottom margins)}
     */
    getOuterSize : function(){
        var el = this.getResizeEl();
        return {width: el.getWidth() + el.getMargins('lr'),
                height: el.getHeight() + el.getMargins('tb')};
    },

    /**
     * Gets the current XY position of the component's underlying element.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Array} The XY position of the element (e.g., [100, 200])
     */
    getPosition : function(local){
        var el = this.getPositionEl();
        if(local === true){
            return [el.getLeft(true), el.getTop(true)];
        }
        return this.xy || el.getXY();
    },

    /**
     * Gets the current box measurements of the component's underlying element.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Object} box An object in the format {x, y, width, height}
     */
    getBox : function(local){
        var pos = this.getPosition(local);
        var s = this.getSize();
        s.x = pos[0];
        s.y = pos[1];
        return s;
    },

    /**
     * Sets the current box measurements of the component's underlying element.
     * @param {Object} box An object in the format {x, y, width, height}
     * @return {Ext.BoxComponent} this
     */
    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
        return this;
    },

    /**
     * <p>Returns the outermost Element of this Component which defines the Components overall size.</p>
     * <p><i>Usually</i> this will return the same Element as <code>{@link #getEl}</code>,
     * but in some cases, a Component may have some more wrapping Elements around its main
     * active Element.</p>
     * <p>An example is a ComboBox. It is encased in a <i>wrapping</i> Element which
     * contains both the <code>&lt;input></code> Element (which is what would be returned
     * by its <code>{@link #getEl}</code> method, <i>and</i> the trigger button Element.
     * This Element is returned as the <code>resizeEl</code>.
     * @return {Ext.Element} The Element which is to be resized by size managing layouts.
     */
    getResizeEl : function(){
        return this.resizeEl || this.el;
    },

    /**
     * Sets the overflow on the content element of the component.
     * @param {Boolean} scroll True to allow the Component to auto scroll.
     * @return {Ext.BoxComponent} this
     */
    setAutoScroll : function(scroll){
        if(this.rendered){
            this.getContentTarget().setOverflow(scroll ? 'auto' : '');
        }
        this.autoScroll = scroll;
        return this;
    },

    /**
     * Sets the left and top of the component.  To set the page XY position instead, use {@link #setPagePosition}.
     * This method fires the {@link #move} event.
     * @param {Number} left The new left
     * @param {Number} top The new top
     * @return {Ext.BoxComponent} this
     */
    setPosition : function(x, y){
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
        this.x = x;
        this.y = y;
        if(!this.boxReady){
            return this;
        }
        var adj = this.adjustPosition(x, y);
        var ax = adj.x, ay = adj.y;

        var el = this.getPositionEl();
        if(ax !== undefined || ay !== undefined){
            if(ax !== undefined && ay !== undefined){
                el.setLeftTop(ax, ay);
            }else if(ax !== undefined){
                el.setLeft(ax);
            }else if(ay !== undefined){
                el.setTop(ay);
            }
            this.onPosition(ax, ay);
            this.fireEvent('move', this, ax, ay);
        }
        return this;
    },

    /**
     * Sets the page XY position of the component.  To set the left and top instead, use {@link #setPosition}.
     * This method fires the {@link #move} event.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     * @return {Ext.BoxComponent} this
     */
    setPagePosition : function(x, y){
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
        this.pageX = x;
        this.pageY = y;
        if(!this.boxReady){
            return;
        }
        if(x === undefined || y === undefined){ // cannot translate undefined points
            return;
        }
        var p = this.getPositionEl().translatePoints(x, y);
        this.setPosition(p.left, p.top);
        return this;
    },

    // private
    afterRender : function(){
        Ext.BoxComponent.superclass.afterRender.call(this);
        if(this.resizeEl){
            this.resizeEl = Ext.get(this.resizeEl);
        }
        if(this.positionEl){
            this.positionEl = Ext.get(this.positionEl);
        }
        this.boxReady = true;
        Ext.isDefined(this.autoScroll) && this.setAutoScroll(this.autoScroll);
        this.setSize(this.width, this.height);
        if(this.x || this.y){
            this.setPosition(this.x, this.y);
        }else if(this.pageX || this.pageY){
            this.setPagePosition(this.pageX, this.pageY);
        }
    },

    /**
     * Force the component's size to recalculate based on the underlying element's current height and width.
     * @return {Ext.BoxComponent} this
     */
    syncSize : function(){
        delete this.lastSize;
        this.setSize(this.autoWidth ? undefined : this.getResizeEl().getWidth(), this.autoHeight ? undefined : this.getResizeEl().getHeight());
        return this;
    },

    /* // protected
     * Called after the component is resized, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a resize occurs.
     * @param {Number} adjWidth The box-adjusted width that was set
     * @param {Number} adjHeight The box-adjusted height that was set
     * @param {Number} rawWidth The width that was originally specified
     * @param {Number} rawHeight The height that was originally specified
     */
    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){
    },

    /* // protected
     * Called after the component is moved, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a move occurs.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     */
    onPosition : function(x, y){

    },

    // private
    adjustSize : function(w, h){
        if(this.autoWidth){
            w = 'auto';
        }
        if(this.autoHeight){
            h = 'auto';
        }
        return {width : w, height: h};
    },

    // private
    adjustPosition : function(x, y){
        return {x : x, y: y};
    }
});
Ext.reg('box', Ext.BoxComponent);


/**
 * @class Ext.Spacer
 * @extends Ext.BoxComponent
 * <p>Used to provide a sizable space in a layout.</p>
 * @constructor
 * @param {Object} config
 */
Ext.Spacer = Ext.extend(Ext.BoxComponent, {
    autoEl:'div'
});
Ext.reg('spacer', Ext.Spacer);