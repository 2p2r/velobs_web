/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.layout.BorderLayout
 * @extends Ext.layout.ContainerLayout
 * <p>This is a multi-pane, application-oriented UI layout style that supports multiple
 * nested panels, automatic {@link Ext.layout.BorderLayout.Region#split split} bars between
 * {@link Ext.layout.BorderLayout.Region#BorderLayout.Region regions} and built-in
 * {@link Ext.layout.BorderLayout.Region#collapsible expanding and collapsing} of regions.</p>
 * <p>This class is intended to be extended or created via the <tt>layout:'border'</tt>
 * {@link Ext.Container#layout} config, and should generally not need to be created directly
 * via the new keyword.</p>
 * <p>BorderLayout does not have any direct config options (other than inherited ones).
 * All configuration options available for customizing the BorderLayout are at the
 * {@link Ext.layout.BorderLayout.Region} and {@link Ext.layout.BorderLayout.SplitRegion}
 * levels.</p>
 * <p>Example usage:</p>
 * <pre><code>
var myBorderPanel = new Ext.Panel({
    {@link Ext.Component#renderTo renderTo}: document.body,
    {@link Ext.BoxComponent#width width}: 700,
    {@link Ext.BoxComponent#height height}: 500,
    {@link Ext.Panel#title title}: 'Border Layout',
    {@link Ext.Container#layout layout}: 'border',
    {@link Ext.Container#items items}: [{
        {@link Ext.Panel#title title}: 'South Region is resizable',
        {@link Ext.layout.BorderLayout.Region#BorderLayout.Region region}: 'south',     // position for region
        {@link Ext.BoxComponent#height height}: 100,
        {@link Ext.layout.BorderLayout.Region#split split}: true,         // enable resizing
        {@link Ext.SplitBar#minSize minSize}: 75,         // defaults to {@link Ext.layout.BorderLayout.Region#minHeight 50}
        {@link Ext.SplitBar#maxSize maxSize}: 150,
        {@link Ext.layout.BorderLayout.Region#margins margins}: '0 5 5 5'
    },{
        // xtype: 'panel' implied by default
        {@link Ext.Panel#title title}: 'West Region is collapsible',
        {@link Ext.layout.BorderLayout.Region#BorderLayout.Region region}:'west',
        {@link Ext.layout.BorderLayout.Region#margins margins}: '5 0 0 5',
        {@link Ext.BoxComponent#width width}: 200,
        {@link Ext.layout.BorderLayout.Region#collapsible collapsible}: true,   // make collapsible
        {@link Ext.layout.BorderLayout.Region#cmargins cmargins}: '5 5 0 5', // adjust top margin when collapsed
        {@link Ext.Component#id id}: 'west-region-container',
        {@link Ext.Container#layout layout}: 'fit',
        {@link Ext.Panel#unstyled unstyled}: true
    },{
        {@link Ext.Panel#title title}: 'Center Region',
        {@link Ext.layout.BorderLayout.Region#BorderLayout.Region region}: 'center',     // center region is required, no width/height specified
        {@link Ext.Component#xtype xtype}: 'container',
        {@link Ext.Container#layout layout}: 'fit',
        {@link Ext.layout.BorderLayout.Region#margins margins}: '5 5 0 0'
    }]
});
</code></pre>
 * <p><b><u>Notes</u></b>:</p><div class="mdetail-params"><ul>
 * <li>Any container using the BorderLayout <b>must</b> have a child item with <tt>region:'center'</tt>.
 * The child item in the center region will always be resized to fill the remaining space not used by
 * the other regions in the layout.</li>
 * <li>Any child items with a region of <tt>west</tt> or <tt>east</tt> must have <tt>width</tt> defined
 * (an integer representing the number of pixels that the region should take up).</li>
 * <li>Any child items with a region of <tt>north</tt> or <tt>south</tt> must have <tt>height</tt> defined.</li>
 * <li>The regions of a BorderLayout are <b>fixed at render time</b> and thereafter, its child Components may not be removed or added</b>.  To add/remove
 * Components within a BorderLayout, have them wrapped by an additional Container which is directly
 * managed by the BorderLayout.  If the region is to be collapsible, the Container used directly
 * by the BorderLayout manager should be a Panel.  In the following example a Container (an Ext.Panel)
 * is added to the west region:
 * <div style="margin-left:16px"><pre><code>
wrc = {@link Ext#getCmp Ext.getCmp}('west-region-container');
wrc.{@link Ext.Panel#removeAll removeAll}();
wrc.{@link Ext.Container#add add}({
    title: 'Added Panel',
    html: 'Some content'
});
wrc.{@link Ext.Container#doLayout doLayout}();
 * </code></pre></div>
 * </li>
 * <li> To reference a {@link Ext.layout.BorderLayout.Region Region}:
 * <div style="margin-left:16px"><pre><code>
wr = myBorderPanel.layout.west;
 * </code></pre></div>
 * </li>
 * </ul></div>
 */
Ext.layout.BorderLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,
    // private
    rendered : false,

    type: 'border',

    targetCls: 'x-border-layout-ct',

    getLayoutTargetSize : function() {
        var target = this.container.getLayoutTarget();
        return target ? target.getViewSize() : {};
    },

    // private
    onLayout : function(ct, target){
        var collapsed, i, c, pos, items = ct.items.items, len = items.length;
        if(!this.rendered){
            collapsed = [];
            for(i = 0; i < len; i++) {
                c = items[i];
                pos = c.region;
                if(c.collapsed){
                    collapsed.push(c);
                }
                c.collapsed = false;
                if(!c.rendered){
                    c.render(target, i);
                    c.getPositionEl().addClass('x-border-panel');
                }
                this[pos] = pos != 'center' && c.split ?
                    new Ext.layout.BorderLayout.SplitRegion(this, c.initialConfig, pos) :
                    new Ext.layout.BorderLayout.Region(this, c.initialConfig, pos);
                this[pos].render(target, c);
            }
            this.rendered = true;
        }

        var size = this.getLayoutTargetSize();
        if(size.width < 20 || size.height < 20){ // display none?
            if(collapsed){
                this.restoreCollapsed = collapsed;
            }
            return;
        }else if(this.restoreCollapsed){
            collapsed = this.restoreCollapsed;
            delete this.restoreCollapsed;
        }

        var w = size.width, h = size.height,
            centerW = w, centerH = h, centerY = 0, centerX = 0,
            n = this.north, s = this.south, west = this.west, e = this.east, c = this.center,
            b, m, totalWidth, totalHeight;
        if(!c && Ext.layout.BorderLayout.WARN !== false){
            throw 'No center region defined in BorderLayout ' + ct.id;
        }

        if(n && n.isVisible()){
            b = n.getSize();
            m = n.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            b.y = m.top;
            centerY = b.height + b.y + m.bottom;
            centerH -= centerY;
            n.applyLayout(b);
        }
        if(s && s.isVisible()){
            b = s.getSize();
            m = s.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            totalHeight = (b.height + m.top + m.bottom);
            b.y = h - totalHeight + m.top;
            centerH -= totalHeight;
            s.applyLayout(b);
        }
        if(west && west.isVisible()){
            b = west.getSize();
            m = west.getMargins();
            b.height = centerH - (m.top+m.bottom);
            b.x = m.left;
            b.y = centerY + m.top;
            totalWidth = (b.width + m.left + m.right);
            centerX += totalWidth;
            centerW -= totalWidth;
            west.applyLayout(b);
        }
        if(e && e.isVisible()){
            b = e.getSize();
            m = e.getMargins();
            b.height = centerH - (m.top+m.bottom);
            totalWidth = (b.width + m.left + m.right);
            b.x = w - totalWidth + m.left;
            b.y = centerY + m.top;
            centerW -= totalWidth;
            e.applyLayout(b);
        }
        if(c){
            m = c.getMargins();
            var centerBox = {
                x: centerX + m.left,
                y: centerY + m.top,
                width: centerW - (m.left+m.right),
                height: centerH - (m.top+m.bottom)
            };
            c.applyLayout(centerBox);
        }
        if(collapsed){
            for(i = 0, len = collapsed.length; i < len; i++){
                collapsed[i].collapse(false);
            }
        }
        if(Ext.isIE && Ext.isStrict){ // workaround IE strict repainting issue
            target.repaint();
        }
        // Putting a border layout into an overflowed container is NOT correct and will make a second layout pass necessary.
        if (i = target.getStyle('overflow') && i != 'hidden' && !this.adjustmentPass) {
            var ts = this.getLayoutTargetSize();
            if (ts.width != size.width || ts.height != size.height){
                this.adjustmentPass = true;
                this.onLayout(ct, target);
            }
        }
        delete this.adjustmentPass;
    },

    destroy: function() {
        var r = ['north', 'south', 'east', 'west'], i, region;
        for (i = 0; i < r.length; i++) {
            region = this[r[i]];
            if(region){
                if(region.destroy){
                    region.destroy();
                }else if (region.split){
                    region.split.destroy(true);
                }
            }
        }
        Ext.layout.BorderLayout.superclass.destroy.call(this);
    }

    /**
     * @property activeItem
     * @hide
     */
});

/**
 * @class Ext.layout.BorderLayout.Region
 * <p>This is a region of a {@link Ext.layout.BorderLayout BorderLayout} that acts as a subcontainer
 * within the layout.  Each region has its own {@link Ext.layout.ContainerLayout layout} that is
 * independent of other regions and the containing BorderLayout, and can be any of the
 * {@link Ext.layout.ContainerLayout valid Ext layout types}.</p>
 * <p>Region size is managed automatically and cannot be changed by the user -- for
 * {@link #split resizable regions}, see {@link Ext.layout.BorderLayout.SplitRegion}.</p>
 * @constructor
 * Create a new Region.
 * @param {Layout} layout The {@link Ext.layout.BorderLayout BorderLayout} instance that is managing this Region.
 * @param {Object} config The configuration options
 * @param {String} position The region position.  Valid values are: <tt>north</tt>, <tt>south</tt>,
 * <tt>east</tt>, <tt>west</tt> and <tt>center</tt>.  Every {@link Ext.layout.BorderLayout BorderLayout}
 * <b>must have a center region</b> for the primary content -- all other regions are optional.
 */
Ext.layout.BorderLayout.Region = function(layout, config, pos){
    Ext.apply(this, config);
    this.layout = layout;
    this.position = pos;
    this.state = {};
    if(typeof this.margins == 'string'){
        this.margins = this.layout.parseMargins(this.margins);
    }
    this.margins = Ext.applyIf(this.margins || {}, this.defaultMargins);
    if(this.collapsible){
        if(typeof this.cmargins == 'string'){
            this.cmargins = this.layout.parseMargins(this.cmargins);
        }
        if(this.collapseMode == 'mini' && !this.cmargins){
            this.cmargins = {left:0,top:0,right:0,bottom:0};
        }else{
            this.cmargins = Ext.applyIf(this.cmargins || {},
                pos == 'north' || pos == 'south' ? this.defaultNSCMargins : this.defaultEWCMargins);
        }
    }
};

Ext.layout.BorderLayout.Region.prototype = {
    /**
     * @cfg {Boolean} animFloat
     * When a collapsed region's bar is clicked, the region's panel will be displayed as a floated
     * panel that will close again once the user mouses out of that panel (or clicks out if
     * <tt>{@link #autoHide} = false</tt>).  Setting <tt>{@link #animFloat} = false</tt> will
     * prevent the open and close of these floated panels from being animated (defaults to <tt>true</tt>).
     */
    /**
     * @cfg {Boolean} autoHide
     * When a collapsed region's bar is clicked, the region's panel will be displayed as a floated
     * panel.  If <tt>autoHide = true</tt>, the panel will automatically hide after the user mouses
     * out of the panel.  If <tt>autoHide = false</tt>, the panel will continue to display until the
     * user clicks outside of the panel (defaults to <tt>true</tt>).
     */
    /**
     * @cfg {String} collapseMode
     * <tt>collapseMode</tt> supports two configuration values:<div class="mdetail-params"><ul>
     * <li><b><tt>undefined</tt></b> (default)<div class="sub-desc">By default, {@link #collapsible}
     * regions are collapsed by clicking the expand/collapse tool button that renders into the region's
     * title bar.</div></li>
     * <li><b><tt>'mini'</tt></b><div class="sub-desc">Optionally, when <tt>collapseMode</tt> is set to
     * <tt>'mini'</tt> the region's split bar will also display a small collapse button in the center of
     * the bar. In <tt>'mini'</tt> mode the region will collapse to a thinner bar than in normal mode.
     * </div></li>
     * </ul></div></p>
     * <p><b>Note</b>: if a collapsible region does not have a title bar, then set <tt>collapseMode =
     * 'mini'</tt> and <tt>{@link #split} = true</tt> in order for the region to be {@link #collapsible}
     * by the user as the expand/collapse tool button (that would go in the title bar) will not be rendered.</p>
     * <p>See also <tt>{@link #cmargins}</tt>.</p>
     */
    /**
     * @cfg {Object} margins
     * An object containing margins to apply to the region when in the expanded state in the
     * format:<pre><code>
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
     * @cfg {Object} cmargins
     * An object containing margins to apply to the region when in the collapsed state in the
     * format:<pre><code>
{
    top: (top margin),
    right: (right margin),
    bottom: (bottom margin),
    left: (left margin)
}</code></pre>
     * <p>May also be a string containing space-separated, numeric margin values. The order of the
     * sides associated with each value matches the way CSS processes margin values.</p>
     * <p><ul>
     * <li>If there is only one value, it applies to all sides.</li>
     * <li>If there are two values, the top and bottom borders are set to the first value and the
     * right and left are set to the second.</li>
     * <li>If there are three values, the top is set to the first value, the left and right are set
     * to the second, and the bottom is set to the third.</li>
     * <li>If there are four values, they apply to the top, right, bottom, and left, respectively.</li>
     * </ul></p>
     */
    /**
     * @cfg {Boolean} collapsible
     * <p><tt>true</tt> to allow the user to collapse this region (defaults to <tt>false</tt>).  If
     * <tt>true</tt>, an expand/collapse tool button will automatically be rendered into the title
     * bar of the region, otherwise the button will not be shown.</p>
     * <p><b>Note</b>: that a title bar is required to display the collapse/expand toggle button -- if
     * no <tt>title</tt> is specified for the region's panel, the region will only be collapsible if
     * <tt>{@link #collapseMode} = 'mini'</tt> and <tt>{@link #split} = true</tt>.
     */
    collapsible : false,
    /**
     * @cfg {Boolean} split
     * <p><tt>true</tt> to create a {@link Ext.layout.BorderLayout.SplitRegion SplitRegion} and
     * display a 5px wide {@link Ext.SplitBar} between this region and its neighbor, allowing the user to
     * resize the regions dynamically.  Defaults to <tt>false</tt> creating a
     * {@link Ext.layout.BorderLayout.Region Region}.</p><br>
     * <p><b>Notes</b>:</p><div class="mdetail-params"><ul>
     * <li>this configuration option is ignored if <tt>region='center'</tt></li>
     * <li>when <tt>split == true</tt>, it is common to specify a
     * <tt>{@link Ext.SplitBar#minSize minSize}</tt> and <tt>{@link Ext.SplitBar#maxSize maxSize}</tt>
     * for the {@link Ext.BoxComponent BoxComponent} representing the region. These are not native
     * configs of {@link Ext.BoxComponent BoxComponent}, and are used only by this class.</li>
     * <li>if <tt>{@link #collapseMode} = 'mini'</tt> requires <tt>split = true</tt> to reserve space
     * for the collapse tool</tt></li>
     * </ul></div>
     */
    split:false,
    /**
     * @cfg {Boolean} floatable
     * <tt>true</tt> to allow clicking a collapsed region's bar to display the region's panel floated
     * above the layout, <tt>false</tt> to force the user to fully expand a collapsed region by
     * clicking the expand button to see it again (defaults to <tt>true</tt>).
     */
    floatable: true,
    /**
     * @cfg {Number} minWidth
     * <p>The minimum allowable width in pixels for this region (defaults to <tt>50</tt>).
     * <tt>maxWidth</tt> may also be specified.</p><br>
     * <p><b>Note</b>: setting the <tt>{@link Ext.SplitBar#minSize minSize}</tt> /
     * <tt>{@link Ext.SplitBar#maxSize maxSize}</tt> supersedes any specified
     * <tt>minWidth</tt> / <tt>maxWidth</tt>.</p>
     */
    minWidth:50,
    /**
     * @cfg {Number} minHeight
     * The minimum allowable height in pixels for this region (defaults to <tt>50</tt>)
     * <tt>maxHeight</tt> may also be specified.</p><br>
     * <p><b>Note</b>: setting the <tt>{@link Ext.SplitBar#minSize minSize}</tt> /
     * <tt>{@link Ext.SplitBar#maxSize maxSize}</tt> supersedes any specified
     * <tt>minHeight</tt> / <tt>maxHeight</tt>.</p>
     */
    minHeight:50,

    // private
    defaultMargins : {left:0,top:0,right:0,bottom:0},
    // private
    defaultNSCMargins : {left:5,top:5,right:5,bottom:5},
    // private
    defaultEWCMargins : {left:5,top:0,right:5,bottom:0},
    floatingZIndex: 100,

    /**
     * True if this region is collapsed. Read-only.
     * @type Boolean
     * @property
     */
    isCollapsed : false,

    /**
     * This region's panel.  Read-only.
     * @type Ext.Panel
     * @property panel
     */
    /**
     * This region's layout.  Read-only.
     * @type Layout
     * @property layout
     */
    /**
     * This region's layout position (north, south, east, west or center).  Read-only.
     * @type String
     * @property position
     */

    // private
    render : function(ct, p){
        this.panel = p;
        p.el.enableDisplayMode();
        this.targetEl = ct;
        this.el = p.el;

        var gs = p.getState, ps = this.position;
        p.getState = function(){
            return Ext.apply(gs.call(p) || {}, this.state);
        }.createDelegate(this);

        if(ps != 'center'){
            p.allowQueuedExpand = false;
            p.on({
                beforecollapse: this.beforeCollapse,
                collapse: this.onCollapse,
                beforeexpand: this.beforeExpand,
                expand: this.onExpand,
                hide: this.onHide,
                show: this.onShow,
                scope: this
            });
            if(this.collapsible || this.floatable){
                p.collapseEl = 'el';
                p.slideAnchor = this.getSlideAnchor();
            }
            if(p.tools && p.tools.toggle){
                p.tools.toggle.addClass('x-tool-collapse-'+ps);
                p.tools.toggle.addClassOnOver('x-tool-collapse-'+ps+'-over');
            }
        }
    },

    // private
    getCollapsedEl : function(){
        if(!this.collapsedEl){
            if(!this.toolTemplate){
                var tt = new Ext.Template(
                     '<div class="x-tool x-tool-{id}">&#160;</div>'
                );
                tt.disableFormats = true;
                tt.compile();
                Ext.layout.BorderLayout.Region.prototype.toolTemplate = tt;
            }
            this.collapsedEl = this.targetEl.createChild({
                cls: "x-layout-collapsed x-layout-collapsed-"+this.position,
                id: this.panel.id + '-xcollapsed'
            });
            this.collapsedEl.enableDisplayMode('block');

            if(this.collapseMode == 'mini'){
                this.collapsedEl.addClass('x-layout-cmini-'+this.position);
                this.miniCollapsedEl = this.collapsedEl.createChild({
                    cls: "x-layout-mini x-layout-mini-"+this.position, html: "&#160;"
                });
                this.miniCollapsedEl.addClassOnOver('x-layout-mini-over');
                this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                this.collapsedEl.on('click', this.onExpandClick, this, {stopEvent:true});
            }else {
                if(this.collapsible !== false && !this.hideCollapseTool) {
                    var t = this.expandToolEl = this.toolTemplate.append(
                            this.collapsedEl.dom,
                            {id:'expand-'+this.position}, true);
                    t.addClassOnOver('x-tool-expand-'+this.position+'-over');
                    t.on('click', this.onExpandClick, this, {stopEvent:true});
                }
                if(this.floatable !== false || this.titleCollapse){
                   this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
                   this.collapsedEl.on("click", this[this.floatable ? 'collapseClick' : 'onExpandClick'], this);
                }
            }
        }
        return this.collapsedEl;
    },

    // private
    onExpandClick : function(e){
        if(this.isSlid){
            this.panel.expand(false);
        }else{
            this.panel.expand();
        }
    },

    // private
    onCollapseClick : function(e){
        this.panel.collapse();
    },

    // private
    beforeCollapse : function(p, animate){
        this.lastAnim = animate;
        if(this.splitEl){
            this.splitEl.hide();
        }
        this.getCollapsedEl().show();
        var el = this.panel.getEl();
        this.originalZIndex = el.getStyle('z-index');
        el.setStyle('z-index', 100);
        this.isCollapsed = true;
        this.layout.layout();
    },

    // private
    onCollapse : function(animate){
        this.panel.el.setStyle('z-index', 1);
        if(this.lastAnim === false || this.panel.animCollapse === false){
            this.getCollapsedEl().dom.style.visibility = 'visible';
        }else{
            this.getCollapsedEl().slideIn(this.panel.slideAnchor, {duration:.2});
        }
        this.state.collapsed = true;
        this.panel.saveState();
    },

    // private
    beforeExpand : function(animate){
        if(this.isSlid){
            this.afterSlideIn();
        }
        var c = this.getCollapsedEl();
        this.el.show();
        if(this.position == 'east' || this.position == 'west'){
            this.panel.setSize(undefined, c.getHeight());
        }else{
            this.panel.setSize(c.getWidth(), undefined);
        }
        c.hide();
        c.dom.style.visibility = 'hidden';
        this.panel.el.setStyle('z-index', this.floatingZIndex);
    },

    // private
    onExpand : function(){
        this.isCollapsed = false;
        if(this.splitEl){
            this.splitEl.show();
        }
        this.layout.layout();
        this.panel.el.setStyle('z-index', this.originalZIndex);
        this.state.collapsed = false;
        this.panel.saveState();
    },

    // private
    collapseClick : function(e){
        if(this.isSlid){
           e.stopPropagation();
           this.slideIn();
        }else{
           e.stopPropagation();
           this.slideOut();
        }
    },

    // private
    onHide : function(){
        if(this.isCollapsed){
            this.getCollapsedEl().hide();
        }else if(this.splitEl){
            this.splitEl.hide();
        }
    },

    // private
    onShow : function(){
        if(this.isCollapsed){
            this.getCollapsedEl().show();
        }else if(this.splitEl){
            this.splitEl.show();
        }
    },

    /**
     * True if this region is currently visible, else false.
     * @return {Boolean}
     */
    isVisible : function(){
        return !this.panel.hidden;
    },

    /**
     * Returns the current margins for this region.  If the region is collapsed, the
     * {@link #cmargins} (collapsed margins) value will be returned, otherwise the
     * {@link #margins} value will be returned.
     * @return {Object} An object containing the element's margins: <tt>{left: (left
     * margin), top: (top margin), right: (right margin), bottom: (bottom margin)}</tt>
     */
    getMargins : function(){
        return this.isCollapsed && this.cmargins ? this.cmargins : this.margins;
    },

    /**
     * Returns the current size of this region.  If the region is collapsed, the size of the
     * collapsedEl will be returned, otherwise the size of the region's panel will be returned.
     * @return {Object} An object containing the element's size: <tt>{width: (element width),
     * height: (element height)}</tt>
     */
    getSize : function(){
        return this.isCollapsed ? this.getCollapsedEl().getSize() : this.panel.getSize();
    },

    /**
     * Sets the specified panel as the container element for this region.
     * @param {Ext.Panel} panel The new panel
     */
    setPanel : function(panel){
        this.panel = panel;
    },

    /**
     * Returns the minimum allowable width for this region.
     * @return {Number} The minimum width
     */
    getMinWidth: function(){
        return this.minWidth;
    },

    /**
     * Returns the minimum allowable height for this region.
     * @return {Number} The minimum height
     */
    getMinHeight: function(){
        return this.minHeight;
    },

    // private
    applyLayoutCollapsed : function(box){
        var ce = this.getCollapsedEl();
        ce.setLeftTop(box.x, box.y);
        ce.setSize(box.width, box.height);
    },

    // private
    applyLayout : function(box){
        if(this.isCollapsed){
            this.applyLayoutCollapsed(box);
        }else{
            this.panel.setPosition(box.x, box.y);
            this.panel.setSize(box.width, box.height);
        }
    },

    // private
    beforeSlide: function(){
        this.panel.beforeEffect();
    },

    // private
    afterSlide : function(){
        this.panel.afterEffect();
    },

    // private
    initAutoHide : function(){
        if(this.autoHide !== false){
            if(!this.autoHideHd){
                this.autoHideSlideTask = new Ext.util.DelayedTask(this.slideIn, this);
                this.autoHideHd = {
                    "mouseout": function(e){
                        if(!e.within(this.el, true)){
                            this.autoHideSlideTask.delay(500);
                        }
                    },
                    "mouseover" : function(e){
                        this.autoHideSlideTask.cancel();
                    },
                    scope : this
                };
            }
            this.el.on(this.autoHideHd);
            this.collapsedEl.on(this.autoHideHd);
        }
    },

    // private
    clearAutoHide : function(){
        if(this.autoHide !== false){
            this.el.un("mouseout", this.autoHideHd.mouseout);
            this.el.un("mouseover", this.autoHideHd.mouseover);
            this.collapsedEl.un("mouseout", this.autoHideHd.mouseout);
            this.collapsedEl.un("mouseover", this.autoHideHd.mouseover);
        }
    },

    // private
    clearMonitor : function(){
        Ext.getDoc().un("click", this.slideInIf, this);
    },

    /**
     * If this Region is {@link #floatable}, this method slides this Region into full visibility <i>over the top
     * of the center Region</i> where it floats until either {@link #slideIn} is called, or other regions of the layout
     * are clicked, or the mouse exits the Region.
     */
    slideOut : function(){
        if(this.isSlid || this.el.hasActiveFx()){
            return;
        }
        this.isSlid = true;
        var ts = this.panel.tools, dh, pc;
        if(ts && ts.toggle){
            ts.toggle.hide();
        }
        this.el.show();

        // Temporarily clear the collapsed flag so we can onResize the panel on the slide
        pc = this.panel.collapsed;
        this.panel.collapsed = false;

        if(this.position == 'east' || this.position == 'west'){
            // Temporarily clear the deferHeight flag so we can size the height on the slide
            dh = this.panel.deferHeight;
            this.panel.deferHeight = false;

            this.panel.setSize(undefined, this.collapsedEl.getHeight());

            // Put the deferHeight flag back after setSize
            this.panel.deferHeight = dh;
        }else{
            this.panel.setSize(this.collapsedEl.getWidth(), undefined);
        }

        // Put the collapsed flag back after onResize
        this.panel.collapsed = pc;

        this.restoreLT = [this.el.dom.style.left, this.el.dom.style.top];
        this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
        this.el.setStyle("z-index", this.floatingZIndex+2);
        this.panel.el.replaceClass('x-panel-collapsed', 'x-panel-floating');
        if(this.animFloat !== false){
            this.beforeSlide();
            this.el.slideIn(this.getSlideAnchor(), {
                callback: function(){
                    this.afterSlide();
                    this.initAutoHide();
                    Ext.getDoc().on("click", this.slideInIf, this);
                },
                scope: this,
                block: true
            });
        }else{
            this.initAutoHide();
             Ext.getDoc().on("click", this.slideInIf, this);
        }
    },

    // private
    afterSlideIn : function(){
        this.clearAutoHide();
        this.isSlid = false;
        this.clearMonitor();
        this.el.setStyle("z-index", "");
        this.panel.el.replaceClass('x-panel-floating', 'x-panel-collapsed');
        this.el.dom.style.left = this.restoreLT[0];
        this.el.dom.style.top = this.restoreLT[1];

        var ts = this.panel.tools;
        if(ts && ts.toggle){
            ts.toggle.show();
        }
    },

    /**
     * If this Region is {@link #floatable}, and this Region has been slid into floating visibility, then this method slides
     * this region back into its collapsed state.
     */
    slideIn : function(cb){
        if(!this.isSlid || this.el.hasActiveFx()){
            Ext.callback(cb);
            return;
        }
        this.isSlid = false;
        if(this.animFloat !== false){
            this.beforeSlide();
            this.el.slideOut(this.getSlideAnchor(), {
                callback: function(){
                    this.el.hide();
                    this.afterSlide();
                    this.afterSlideIn();
                    Ext.callback(cb);
                },
                scope: this,
                block: true
            });
        }else{
            this.el.hide();
            this.afterSlideIn();
        }
    },

    // private
    slideInIf : function(e){
        if(!e.within(this.el)){
            this.slideIn();
        }
    },

    // private
    anchors : {
        "west" : "left",
        "east" : "right",
        "north" : "top",
        "south" : "bottom"
    },

    // private
    sanchors : {
        "west" : "l",
        "east" : "r",
        "north" : "t",
        "south" : "b"
    },

    // private
    canchors : {
        "west" : "tl-tr",
        "east" : "tr-tl",
        "north" : "tl-bl",
        "south" : "bl-tl"
    },

    // private
    getAnchor : function(){
        return this.anchors[this.position];
    },

    // private
    getCollapseAnchor : function(){
        return this.canchors[this.position];
    },

    // private
    getSlideAnchor : function(){
        return this.sanchors[this.position];
    },

    // private
    getAlignAdj : function(){
        var cm = this.cmargins;
        switch(this.position){
            case "west":
                return [0, 0];
            break;
            case "east":
                return [0, 0];
            break;
            case "north":
                return [0, 0];
            break;
            case "south":
                return [0, 0];
            break;
        }
    },

    // private
    getExpandAdj : function(){
        var c = this.collapsedEl, cm = this.cmargins;
        switch(this.position){
            case "west":
                return [-(cm.right+c.getWidth()+cm.left), 0];
            break;
            case "east":
                return [cm.right+c.getWidth()+cm.left, 0];
            break;
            case "north":
                return [0, -(cm.top+cm.bottom+c.getHeight())];
            break;
            case "south":
                return [0, cm.top+cm.bottom+c.getHeight()];
            break;
        }
    },

    destroy : function(){
        if (this.autoHideSlideTask && this.autoHideSlideTask.cancel){
            this.autoHideSlideTask.cancel();
        }
        Ext.destroyMembers(this, 'miniCollapsedEl', 'collapsedEl', 'expandToolEl');
    }
};

/**
 * @class Ext.layout.BorderLayout.SplitRegion
 * @extends Ext.layout.BorderLayout.Region
 * <p>This is a specialized type of {@link Ext.layout.BorderLayout.Region BorderLayout region} that
 * has a built-in {@link Ext.SplitBar} for user resizing of regions.  The movement of the split bar
 * is configurable to move either {@link #tickSize smooth or incrementally}.</p>
 * @constructor
 * Create a new SplitRegion.
 * @param {Layout} layout The {@link Ext.layout.BorderLayout BorderLayout} instance that is managing this Region.
 * @param {Object} config The configuration options
 * @param {String} position The region position.  Valid values are: north, south, east, west and center.  Every
 * BorderLayout must have a center region for the primary content -- all other regions are optional.
 */
Ext.layout.BorderLayout.SplitRegion = function(layout, config, pos){
    Ext.layout.BorderLayout.SplitRegion.superclass.constructor.call(this, layout, config, pos);
    // prevent switch
    this.applyLayout = this.applyFns[pos];
};

Ext.extend(Ext.layout.BorderLayout.SplitRegion, Ext.layout.BorderLayout.Region, {
    /**
     * @cfg {Number} tickSize
     * The increment, in pixels by which to move this Region's {@link Ext.SplitBar SplitBar}.
     * By default, the {@link Ext.SplitBar SplitBar} moves smoothly.
     */
    /**
     * @cfg {String} splitTip
     * The tooltip to display when the user hovers over a
     * {@link Ext.layout.BorderLayout.Region#collapsible non-collapsible} region's split bar
     * (defaults to <tt>"Drag to resize."</tt>).  Only applies if
     * <tt>{@link #useSplitTips} = true</tt>.
     */
    splitTip : "Drag to resize.",
    /**
     * @cfg {String} collapsibleSplitTip
     * The tooltip to display when the user hovers over a
     * {@link Ext.layout.BorderLayout.Region#collapsible collapsible} region's split bar
     * (defaults to "Drag to resize. Double click to hide."). Only applies if
     * <tt>{@link #useSplitTips} = true</tt>.
     */
    collapsibleSplitTip : "Drag to resize. Double click to hide.",
    /**
     * @cfg {Boolean} useSplitTips
     * <tt>true</tt> to display a tooltip when the user hovers over a region's split bar
     * (defaults to <tt>false</tt>).  The tooltip text will be the value of either
     * <tt>{@link #splitTip}</tt> or <tt>{@link #collapsibleSplitTip}</tt> as appropriate.
     */
    useSplitTips : false,

    // private
    splitSettings : {
        north : {
            orientation: Ext.SplitBar.VERTICAL,
            placement: Ext.SplitBar.TOP,
            maxFn : 'getVMaxSize',
            minProp: 'minHeight',
            maxProp: 'maxHeight'
        },
        south : {
            orientation: Ext.SplitBar.VERTICAL,
            placement: Ext.SplitBar.BOTTOM,
            maxFn : 'getVMaxSize',
            minProp: 'minHeight',
            maxProp: 'maxHeight'
        },
        east : {
            orientation: Ext.SplitBar.HORIZONTAL,
            placement: Ext.SplitBar.RIGHT,
            maxFn : 'getHMaxSize',
            minProp: 'minWidth',
            maxProp: 'maxWidth'
        },
        west : {
            orientation: Ext.SplitBar.HORIZONTAL,
            placement: Ext.SplitBar.LEFT,
            maxFn : 'getHMaxSize',
            minProp: 'minWidth',
            maxProp: 'maxWidth'
        }
    },

    // private
    applyFns : {
        west : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            this.panel.setPosition(box.x, box.y);
            var sw = sd.offsetWidth;
            s.left = (box.x+box.width-sw)+'px';
            s.top = (box.y)+'px';
            s.height = Math.max(0, box.height)+'px';
            this.panel.setSize(box.width-sw, box.height);
        },
        east : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sw = sd.offsetWidth;
            this.panel.setPosition(box.x+sw, box.y);
            s.left = (box.x)+'px';
            s.top = (box.y)+'px';
            s.height = Math.max(0, box.height)+'px';
            this.panel.setSize(box.width-sw, box.height);
        },
        north : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sh = sd.offsetHeight;
            this.panel.setPosition(box.x, box.y);
            s.left = (box.x)+'px';
            s.top = (box.y+box.height-sh)+'px';
            s.width = Math.max(0, box.width)+'px';
            this.panel.setSize(box.width, box.height-sh);
        },
        south : function(box){
            if(this.isCollapsed){
                return this.applyLayoutCollapsed(box);
            }
            var sd = this.splitEl.dom, s = sd.style;
            var sh = sd.offsetHeight;
            this.panel.setPosition(box.x, box.y+sh);
            s.left = (box.x)+'px';
            s.top = (box.y)+'px';
            s.width = Math.max(0, box.width)+'px';
            this.panel.setSize(box.width, box.height-sh);
        }
    },

    // private
    render : function(ct, p){
        Ext.layout.BorderLayout.SplitRegion.superclass.render.call(this, ct, p);

        var ps = this.position;

        this.splitEl = ct.createChild({
            cls: "x-layout-split x-layout-split-"+ps, html: "&#160;",
            id: this.panel.id + '-xsplit'
        });

        if(this.collapseMode == 'mini'){
            this.miniSplitEl = this.splitEl.createChild({
                cls: "x-layout-mini x-layout-mini-"+ps, html: "&#160;"
            });
            this.miniSplitEl.addClassOnOver('x-layout-mini-over');
            this.miniSplitEl.on('click', this.onCollapseClick, this, {stopEvent:true});
        }

        var s = this.splitSettings[ps];

        this.split = new Ext.SplitBar(this.splitEl.dom, p.el, s.orientation);
        this.split.tickSize = this.tickSize;
        this.split.placement = s.placement;
        this.split.getMaximumSize = this[s.maxFn].createDelegate(this);
        this.split.minSize = this.minSize || this[s.minProp];
        this.split.on("beforeapply", this.onSplitMove, this);
        this.split.useShim = this.useShim === true;
        this.maxSize = this.maxSize || this[s.maxProp];

        if(p.hidden){
            this.splitEl.hide();
        }

        if(this.useSplitTips){
            this.splitEl.dom.title = this.collapsible ? this.collapsibleSplitTip : this.splitTip;
        }
        if(this.collapsible){
            this.splitEl.on("dblclick", this.onCollapseClick,  this);
        }
    },

    //docs inherit from superclass
    getSize : function(){
        if(this.isCollapsed){
            return this.collapsedEl.getSize();
        }
        var s = this.panel.getSize();
        if(this.position == 'north' || this.position == 'south'){
            s.height += this.splitEl.dom.offsetHeight;
        }else{
            s.width += this.splitEl.dom.offsetWidth;
        }
        return s;
    },

    // private
    getHMaxSize : function(){
         var cmax = this.maxSize || 10000;
         var center = this.layout.center;
         return Math.min(cmax, (this.el.getWidth()+center.el.getWidth())-center.getMinWidth());
    },

    // private
    getVMaxSize : function(){
        var cmax = this.maxSize || 10000;
        var center = this.layout.center;
        return Math.min(cmax, (this.el.getHeight()+center.el.getHeight())-center.getMinHeight());
    },

    // private
    onSplitMove : function(split, newSize){
        var s = this.panel.getSize();
        this.lastSplitSize = newSize;
        if(this.position == 'north' || this.position == 'south'){
            this.panel.setSize(s.width, newSize);
            this.state.height = newSize;
        }else{
            this.panel.setSize(newSize, s.height);
            this.state.width = newSize;
        }
        this.layout.layout();
        this.panel.saveState();
        return false;
    },

    /**
     * Returns a reference to the split bar in use by this region.
     * @return {Ext.SplitBar} The split bar
     */
    getSplitBar : function(){
        return this.split;
    },

    // inherit docs
    destroy : function() {
        Ext.destroy(this.miniSplitEl, this.split, this.splitEl);
        Ext.layout.BorderLayout.SplitRegion.superclass.destroy.call(this);
    }
});

Ext.Container.LAYOUTS['border'] = Ext.layout.BorderLayout;
