/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.Component
 * @extends Ext.util.Observable
 * <p>Base class for all Ext components.  All subclasses of Component may participate in the automated
 * Ext component lifecycle of creation, rendering and destruction which is provided by the {@link Ext.Container Container} class.
 * Components may be added to a Container through the {@link Ext.Container#items items} config option at the time the Container is created,
 * or they may be added dynamically via the {@link Ext.Container#add add} method.</p>
 * <p>The Component base class has built-in support for basic hide/show and enable/disable behavior.</p>
 * <p>All Components are registered with the {@link Ext.ComponentMgr} on construction so that they can be referenced at any time via
 * {@link Ext#getCmp}, passing the {@link #id}.</p>
 * <p>All user-developed visual widgets that are required to participate in automated lifecycle and size management should subclass Component (or
 * {@link Ext.BoxComponent} if managed box model handling is required, ie height and width management).</p>
 * <p>See the <a href="http://extjs.com/learn/Tutorial:Creating_new_UI_controls">Creating new UI controls</a> tutorial for details on how
 * and to either extend or augment ExtJs base classes to create custom Components.</p>
 * <p>Every component has a specific xtype, which is its Ext-specific type name, along with methods for checking the
 * xtype like {@link #getXType} and {@link #isXType}. This is the list of all valid xtypes:</p>
 * <pre>
xtype            Class
-------------    ------------------
box              {@link Ext.BoxComponent}
button           {@link Ext.Button}
buttongroup      {@link Ext.ButtonGroup}
colorpalette     {@link Ext.ColorPalette}
component        {@link Ext.Component}
container        {@link Ext.Container}
cycle            {@link Ext.CycleButton}
dataview         {@link Ext.DataView}
datepicker       {@link Ext.DatePicker}
editor           {@link Ext.Editor}
editorgrid       {@link Ext.grid.EditorGridPanel}
flash            {@link Ext.FlashComponent}
grid             {@link Ext.grid.GridPanel}
listview         {@link Ext.ListView}
multislider      {@link Ext.slider.MultiSlider}
panel            {@link Ext.Panel}
progress         {@link Ext.ProgressBar}
propertygrid     {@link Ext.grid.PropertyGrid}
slider           {@link Ext.slider.SingleSlider}
spacer           {@link Ext.Spacer}
splitbutton      {@link Ext.SplitButton}
tabpanel         {@link Ext.TabPanel}
treepanel        {@link Ext.tree.TreePanel}
viewport         {@link Ext.ViewPort}
window           {@link Ext.Window}

Toolbar components
---------------------------------------
paging           {@link Ext.PagingToolbar}
toolbar          {@link Ext.Toolbar}
tbbutton         {@link Ext.Toolbar.Button}        (deprecated; use button)
tbfill           {@link Ext.Toolbar.Fill}
tbitem           {@link Ext.Toolbar.Item}
tbseparator      {@link Ext.Toolbar.Separator}
tbspacer         {@link Ext.Toolbar.Spacer}
tbsplit          {@link Ext.Toolbar.SplitButton}   (deprecated; use splitbutton)
tbtext           {@link Ext.Toolbar.TextItem}

Menu components
---------------------------------------
menu             {@link Ext.menu.Menu}
colormenu        {@link Ext.menu.ColorMenu}
datemenu         {@link Ext.menu.DateMenu}
menubaseitem     {@link Ext.menu.BaseItem}
menucheckitem    {@link Ext.menu.CheckItem}
menuitem         {@link Ext.menu.Item}
menuseparator    {@link Ext.menu.Separator}
menutextitem     {@link Ext.menu.TextItem}

Form components
---------------------------------------
form             {@link Ext.form.FormPanel}
checkbox         {@link Ext.form.Checkbox}
checkboxgroup    {@link Ext.form.CheckboxGroup}
combo            {@link Ext.form.ComboBox}
compositefield   {@link Ext.form.CompositeField}
datefield        {@link Ext.form.DateField}
displayfield     {@link Ext.form.DisplayField}
field            {@link Ext.form.Field}
fieldset         {@link Ext.form.FieldSet}
hidden           {@link Ext.form.Hidden}
htmleditor       {@link Ext.form.HtmlEditor}
label            {@link Ext.form.Label}
numberfield      {@link Ext.form.NumberField}
radio            {@link Ext.form.Radio}
radiogroup       {@link Ext.form.RadioGroup}
textarea         {@link Ext.form.TextArea}
textfield        {@link Ext.form.TextField}
timefield        {@link Ext.form.TimeField}
trigger          {@link Ext.form.TriggerField}

Chart components
---------------------------------------
chart            {@link Ext.chart.Chart}
barchart         {@link Ext.chart.BarChart}
cartesianchart   {@link Ext.chart.CartesianChart}
columnchart      {@link Ext.chart.ColumnChart}
linechart        {@link Ext.chart.LineChart}
piechart         {@link Ext.chart.PieChart}

Store xtypes
---------------------------------------
arraystore       {@link Ext.data.ArrayStore}
directstore      {@link Ext.data.DirectStore}
groupingstore    {@link Ext.data.GroupingStore}
jsonstore        {@link Ext.data.JsonStore}
simplestore      {@link Ext.data.SimpleStore}      (deprecated; use arraystore)
store            {@link Ext.data.Store}
xmlstore         {@link Ext.data.XmlStore}
</pre>
 * @constructor
 * @param {Ext.Element/String/Object} config The configuration options may be specified as either:
 * <div class="mdetail-params"><ul>
 * <li><b>an element</b> :
 * <p class="sub-desc">it is set as the internal element and its id used as the component id</p></li>
 * <li><b>a string</b> :
 * <p class="sub-desc">it is assumed to be the id of an existing element and is used as the component id</p></li>
 * <li><b>anything else</b> :
 * <p class="sub-desc">it is assumed to be a standard config object and is applied to the component</p></li>
 * </ul></div>
 */
Ext.Component = function(config){
    config = config || {};
    if(config.initialConfig){
        if(config.isAction){           // actions
            this.baseAction = config;
        }
        config = config.initialConfig; // component cloning / action set up
    }else if(config.tagName || config.dom || Ext.isString(config)){ // element object
        config = {applyTo: config, id: config.id || config};
    }

    /**
     * This Component's initial configuration specification. Read-only.
     * @type Object
     * @property initialConfig
     */
    this.initialConfig = config;

    Ext.apply(this, config);
    this.addEvents(
        /**
         * @event added
         * Fires when a component is added to an Ext.Container
         * @param {Ext.Component} this
         * @param {Ext.Container} ownerCt Container which holds the component
         * @param {number} index Position at which the component was added
         */
        'added',
        /**
         * @event disable
         * Fires after the component is disabled.
         * @param {Ext.Component} this
         */
        'disable',
        /**
         * @event enable
         * Fires after the component is enabled.
         * @param {Ext.Component} this
         */
        'enable',
        /**
         * @event beforeshow
         * Fires before the component is shown by calling the {@link #show} method.
         * Return false from an event handler to stop the show.
         * @param {Ext.Component} this
         */
        'beforeshow',
        /**
         * @event show
         * Fires after the component is shown when calling the {@link #show} method.
         * @param {Ext.Component} this
         */
        'show',
        /**
         * @event beforehide
         * Fires before the component is hidden by calling the {@link #hide} method.
         * Return false from an event handler to stop the hide.
         * @param {Ext.Component} this
         */
        'beforehide',
        /**
         * @event hide
         * Fires after the component is hidden.
         * Fires after the component is hidden when calling the {@link #hide} method.
         * @param {Ext.Component} this
         */
        'hide',
        /**
         * @event removed
         * Fires when a component is removed from an Ext.Container
         * @param {Ext.Component} this
         * @param {Ext.Container} ownerCt Container which holds the component
         */
        'removed',
        /**
         * @event beforerender
         * Fires before the component is {@link #rendered}. Return false from an
         * event handler to stop the {@link #render}.
         * @param {Ext.Component} this
         */
        'beforerender',
        /**
         * @event render
         * Fires after the component markup is {@link #rendered}.
         * @param {Ext.Component} this
         */
        'render',
        /**
         * @event afterrender
         * <p>Fires after the component rendering is finished.</p>
         * <p>The afterrender event is fired after this Component has been {@link #rendered}, been postprocesed
         * by any afterRender method defined for the Component, and, if {@link #stateful}, after state
         * has been restored.</p>
         * @param {Ext.Component} this
         */
        'afterrender',
        /**
         * @event beforedestroy
         * Fires before the component is {@link #destroy}ed. Return false from an event handler to stop the {@link #destroy}.
         * @param {Ext.Component} this
         */
        'beforedestroy',
        /**
         * @event destroy
         * Fires after the component is {@link #destroy}ed.
         * @param {Ext.Component} this
         */
        'destroy',
        /**
         * @event beforestaterestore
         * Fires before the state of the component is restored. Return false from an event handler to stop the restore.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values returned from the StateProvider. If this
         * event is not vetoed, then the state object is passed to <b><tt>applyState</tt></b>. By default,
         * that simply copies property values into this Component. The method maybe overriden to
         * provide custom state restoration.
         */
        'beforestaterestore',
        /**
         * @event staterestore
         * Fires after the state of the component is restored.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values returned from the StateProvider. This is passed
         * to <b><tt>applyState</tt></b>. By default, that simply copies property values into this
         * Component. The method maybe overriden to provide custom state restoration.
         */
        'staterestore',
        /**
         * @event beforestatesave
         * Fires before the state of the component is saved to the configured state provider. Return false to stop the save.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values. This is determined by calling
         * <b><tt>getState()</tt></b> on the Component. This method must be provided by the
         * developer to return whetever representation of state is required, by default, Ext.Component
         * has a null implementation.
         */
        'beforestatesave',
        /**
         * @event statesave
         * Fires after the state of the component is saved to the configured state provider.
         * @param {Ext.Component} this
         * @param {Object} state The hash of state values. This is determined by calling
         * <b><tt>getState()</tt></b> on the Component. This method must be provided by the
         * developer to return whetever representation of state is required, by default, Ext.Component
         * has a null implementation.
         */
        'statesave'
    );
    this.getId();
    Ext.ComponentMgr.register(this);
    Ext.Component.superclass.constructor.call(this);

    if(this.baseAction){
        this.baseAction.addComponent(this);
    }

    this.initComponent();

    if(this.plugins){
        if(Ext.isArray(this.plugins)){
            for(var i = 0, len = this.plugins.length; i < len; i++){
                this.plugins[i] = this.initPlugin(this.plugins[i]);
            }
        }else{
            this.plugins = this.initPlugin(this.plugins);
        }
    }

    if(this.stateful !== false){
        this.initState();
    }

    if(this.applyTo){
        this.applyToMarkup(this.applyTo);
        delete this.applyTo;
    }else if(this.renderTo){
        this.render(this.renderTo);
        delete this.renderTo;
    }
};

// private
Ext.Component.AUTO_ID = 1000;

Ext.extend(Ext.Component, Ext.util.Observable, {
    // Configs below are used for all Components when rendered by FormLayout.
    /**
     * @cfg {String} fieldLabel <p>The label text to display next to this Component (defaults to '').</p>
     * <br><p><b>Note</b>: this config is only used when this Component is rendered by a Container which
     * has been configured to use the <b>{@link Ext.layout.FormLayout FormLayout}</b> layout manager (e.g.
     * {@link Ext.form.FormPanel} or specifying <tt>layout:'form'</tt>).</p><br>
     * <p>Also see <tt>{@link #hideLabel}</tt> and
     * {@link Ext.layout.FormLayout}.{@link Ext.layout.FormLayout#fieldTpl fieldTpl}.</p>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name'
    }]
});
</code></pre>
     */
    /**
     * @cfg {String} labelStyle <p>A CSS style specification string to apply directly to this field's
     * label.  Defaults to the container's labelStyle value if set (e.g.,
     * <tt>{@link Ext.layout.FormLayout#labelStyle}</tt> , or '').</p>
     * <br><p><b>Note</b>: see the note for <code>{@link #clearCls}</code>.</p><br>
     * <p>Also see <code>{@link #hideLabel}</code> and
     * <code>{@link Ext.layout.FormLayout}.{@link Ext.layout.FormLayout#fieldTpl fieldTpl}.</code></p>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        labelStyle: 'font-weight:bold;'
    }]
});
</code></pre>
     */
    /**
     * @cfg {String} labelSeparator <p>The separator to display after the text of each
     * <tt>{@link #fieldLabel}</tt>.  This property may be configured at various levels.
     * The order of precedence is:
     * <div class="mdetail-params"><ul>
     * <li>field / component level</li>
     * <li>container level</li>
     * <li>{@link Ext.layout.FormLayout#labelSeparator layout level} (defaults to colon <tt>':'</tt>)</li>
     * </ul></div>
     * To display no separator for this field's label specify empty string ''.</p>
     * <br><p><b>Note</b>: see the note for <tt>{@link #clearCls}</tt>.</p><br>
     * <p>Also see <tt>{@link #hideLabel}</tt> and
     * {@link Ext.layout.FormLayout}.{@link Ext.layout.FormLayout#fieldTpl fieldTpl}.</p>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    layoutConfig: {
        labelSeparator: '~'   // layout config has lowest priority (defaults to ':')
    },
    {@link Ext.layout.FormLayout#labelSeparator labelSeparator}: '>>',     // config at container level
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Field 1',
        labelSeparator: '...' // field/component level config supersedes others
    },{
        xtype: 'textfield',
        fieldLabel: 'Field 2' // labelSeparator will be '='
    }]
});
</code></pre>
     */
    /**
     * @cfg {Boolean} hideLabel <p><tt>true</tt> to completely hide the label element
     * ({@link #fieldLabel label} and {@link #labelSeparator separator}). Defaults to <tt>false</tt>.
     * By default, even if you do not specify a <tt>{@link #fieldLabel}</tt> the space will still be
     * reserved so that the field will line up with other fields that do have labels.
     * Setting this to <tt>true</tt> will cause the field to not reserve that space.</p>
     * <br><p><b>Note</b>: see the note for <tt>{@link #clearCls}</tt>.</p><br>
     * Example use:<pre><code>
new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield'
        hideLabel: true
    }]
});
</code></pre>
     */
    /**
     * @cfg {String} clearCls <p>The CSS class used to to apply to the special clearing div rendered
     * directly after each form field wrapper to provide field clearing (defaults to
     * <tt>'x-form-clear-left'</tt>).</p>
     * <br><p><b>Note</b>: this config is only used when this Component is rendered by a Container
     * which has been configured to use the <b>{@link Ext.layout.FormLayout FormLayout}</b> layout
     * manager (e.g. {@link Ext.form.FormPanel} or specifying <tt>layout:'form'</tt>) and either a
     * <tt>{@link #fieldLabel}</tt> is specified or <tt>isFormField=true</tt> is specified.</p><br>
     * <p>See {@link Ext.layout.FormLayout}.{@link Ext.layout.FormLayout#fieldTpl fieldTpl} also.</p>
     */
    /**
     * @cfg {String} itemCls
     * <p><b>Note</b>: this config is only used when this Component is rendered by a Container which
     * has been configured to use the <b>{@link Ext.layout.FormLayout FormLayout}</b> layout manager (e.g.
     * {@link Ext.form.FormPanel} or specifying <tt>layout:'form'</tt>).</p><br>
     * <p>An additional CSS class to apply to the div wrapping the form item
     * element of this field.  If supplied, <tt>itemCls</tt> at the <b>field</b> level will override
     * the default <tt>itemCls</tt> supplied at the <b>container</b> level. The value specified for
     * <tt>itemCls</tt> will be added to the default class (<tt>'x-form-item'</tt>).</p>
     * <p>Since it is applied to the item wrapper (see
     * {@link Ext.layout.FormLayout}.{@link Ext.layout.FormLayout#fieldTpl fieldTpl}), it allows
     * you to write standard CSS rules that can apply to the field, the label (if specified), or
     * any other element within the markup for the field.</p>
     * <br><p><b>Note</b>: see the note for <tt>{@link #fieldLabel}</tt>.</p><br>
     * Example use:<pre><code>
// Apply a style to the field&#39;s label:
&lt;style>
    .required .x-form-item-label {font-weight:bold;color:red;}
&lt;/style>

new Ext.FormPanel({
    height: 100,
    renderTo: Ext.getBody(),
    items: [{
        xtype: 'textfield',
        fieldLabel: 'Name',
        itemCls: 'required' //this label will be styled
    },{
        xtype: 'textfield',
        fieldLabel: 'Favorite Color'
    }]
});
</code></pre>
     */

    /**
     * @cfg {String} id
     * <p>The <b>unique</b> id of this component (defaults to an {@link #getId auto-assigned id}).
     * You should assign an id if you need to be able to access the component later and you do
     * not have an object reference available (e.g., using {@link Ext}.{@link Ext#getCmp getCmp}).</p>
     * <p>Note that this id will also be used as the element id for the containing HTML element
     * that is rendered to the page for this component. This allows you to write id-based CSS
     * rules to style the specific instance of this component uniquely, and also to select
     * sub-elements using this component's id as the parent.</p>
     * <p><b>Note</b>: to avoid complications imposed by a unique <tt>id</tt> also see
     * <code>{@link #itemId}</code> and <code>{@link #ref}</code>.</p>
     * <p><b>Note</b>: to access the container of an item see <code>{@link #ownerCt}</code>.</p>
     */
    /**
     * @cfg {String} itemId
     * <p>An <tt>itemId</tt> can be used as an alternative way to get a reference to a component
     * when no object reference is available.  Instead of using an <code>{@link #id}</code> with
     * {@link Ext}.{@link Ext#getCmp getCmp}, use <code>itemId</code> with
     * {@link Ext.Container}.{@link Ext.Container#getComponent getComponent} which will retrieve
     * <code>itemId</code>'s or <tt>{@link #id}</tt>'s. Since <code>itemId</code>'s are an index to the
     * container's internal MixedCollection, the <code>itemId</code> is scoped locally to the container --
     * avoiding potential conflicts with {@link Ext.ComponentMgr} which requires a <b>unique</b>
     * <code>{@link #id}</code>.</p>
     * <pre><code>
var c = new Ext.Panel({ //
    {@link Ext.BoxComponent#height height}: 300,
    {@link #renderTo}: document.body,
    {@link Ext.Container#layout layout}: 'auto',
    {@link Ext.Container#items items}: [
        {
            itemId: 'p1',
            {@link Ext.Panel#title title}: 'Panel 1',
            {@link Ext.BoxComponent#height height}: 150
        },
        {
            itemId: 'p2',
            {@link Ext.Panel#title title}: 'Panel 2',
            {@link Ext.BoxComponent#height height}: 150
        }
    ]
})
p1 = c.{@link Ext.Container#getComponent getComponent}('p1'); // not the same as {@link Ext#getCmp Ext.getCmp()}
p2 = p1.{@link #ownerCt}.{@link Ext.Container#getComponent getComponent}('p2'); // reference via a sibling
     * </code></pre>
     * <p>Also see <tt>{@link #id}</tt> and <code>{@link #ref}</code>.</p>
     * <p><b>Note</b>: to access the container of an item see <tt>{@link #ownerCt}</tt>.</p>
     */
    /**
     * @cfg {String} xtype
     * The registered <tt>xtype</tt> to create. This config option is not used when passing
     * a config object into a constructor. This config option is used only when
     * lazy instantiation is being used, and a child item of a Container is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. The <tt>xtype</tt> will be looked up at render time up to determine what
     * type of child Component to create.<br><br>
     * The predefined xtypes are listed {@link Ext.Component here}.
     * <br><br>
     * If you subclass Components to create your own Components, you may register
     * them using {@link Ext.ComponentMgr#registerType} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {String} ptype
     * The registered <tt>ptype</tt> to create. This config option is not used when passing
     * a config object into a constructor. This config option is used only when
     * lazy instantiation is being used, and a Plugin is being
     * specified not as a fully instantiated Component, but as a <i>Component config
     * object</i>. The <tt>ptype</tt> will be looked up at render time up to determine what
     * type of Plugin to create.<br><br>
     * If you create your own Plugins, you may register them using
     * {@link Ext.ComponentMgr#registerPlugin} in order to be able to
     * take advantage of lazy instantiation and rendering.
     */
    /**
     * @cfg {String} cls
     * An optional extra CSS class that will be added to this component's Element (defaults to '').  This can be
     * useful for adding customized styles to the component or any of its children using standard CSS rules.
     */
    /**
     * @cfg {String} overCls
     * An optional extra CSS class that will be added to this component's Element when the mouse moves
     * over the Element, and removed when the mouse moves out. (defaults to '').  This can be
     * useful for adding customized 'active' or 'hover' styles to the component or any of its children using standard CSS rules.
     */
    /**
     * @cfg {String} style
     * A custom style specification to be applied to this component's Element.  Should be a valid argument to
     * {@link Ext.Element#applyStyles}.
     * <pre><code>
new Ext.Panel({
    title: 'Some Title',
    renderTo: Ext.getBody(),
    width: 400, height: 300,
    layout: 'form',
    items: [{
        xtype: 'textarea',
        style: {
            width: '95%',
            marginBottom: '10px'
        }
    },
        new Ext.Button({
            text: 'Send',
            minWidth: '100',
            style: {
                marginBottom: '10px'
            }
        })
    ]
});
     * </code></pre>
     */
    /**
     * @cfg {String} ctCls
     * <p>An optional extra CSS class that will be added to this component's container. This can be useful for
     * adding customized styles to the container or any of its children using standard CSS rules.  See
     * {@link Ext.layout.ContainerLayout}.{@link Ext.layout.ContainerLayout#extraCls extraCls} also.</p>
     * <p><b>Note</b>: <tt>ctCls</tt> defaults to <tt>''</tt> except for the following class
     * which assigns a value by default:
     * <div class="mdetail-params"><ul>
     * <li>{@link Ext.layout.Box Box Layout} : <tt>'x-box-layout-ct'</tt></li>
     * </ul></div>
     * To configure the above Class with an extra CSS class append to the default.  For example,
     * for BoxLayout (Hbox and Vbox):<pre><code>
     * ctCls: 'x-box-layout-ct custom-class'
     * </code></pre>
     * </p>
     */
    /**
     * @cfg {Boolean} disabled
     * Render this component disabled (default is false).
     */
    disabled : false,
    /**
     * @cfg {Boolean} hidden
     * Render this component hidden (default is false). If <tt>true</tt>, the
     * {@link #hide} method will be called internally.
     */
    hidden : false,
    /**
     * @cfg {Object/Array} plugins
     * An object or array of objects that will provide custom functionality for this component.  The only
     * requirement for a valid plugin is that it contain an init method that accepts a reference of type Ext.Component.
     * When a component is created, if any plugins are available, the component will call the init method on each
     * plugin, passing a reference to itself.  Each plugin can then call methods or respond to events on the
     * component as needed to provide its functionality.
     */
    /**
     * @cfg {Mixed} applyTo
     * <p>Specify the id of the element, a DOM element or an existing Element corresponding to a DIV
     * that is already present in the document that specifies some structural markup for this
     * component.</p><div><ul>
     * <li><b>Description</b> : <ul>
     * <div class="sub-desc">When <tt>applyTo</tt> is used, constituent parts of the component can also be specified
     * by id or CSS class name within the main element, and the component being created may attempt
     * to create its subcomponents from that markup if applicable.</div>
     * </ul></li>
     * <li><b>Notes</b> : <ul>
     * <div class="sub-desc">When using this config, a call to render() is not required.</div>
     * <div class="sub-desc">If applyTo is specified, any value passed for {@link #renderTo} will be ignored and the target
     * element's parent node will automatically be used as the component's container.</div>
     * </ul></li>
     * </ul></div>
     */
    /**
     * @cfg {Mixed} renderTo
     * <p>Specify the id of the element, a DOM element or an existing Element that this component
     * will be rendered into.</p><div><ul>
     * <li><b>Notes</b> : <ul>
     * <div class="sub-desc">Do <u>not</u> use this option if the Component is to be a child item of
     * a {@link Ext.Container Container}. It is the responsibility of the
     * {@link Ext.Container Container}'s {@link Ext.Container#layout layout manager}
     * to render and manage its child items.</div>
     * <div class="sub-desc">When using this config, a call to render() is not required.</div>
     * </ul></li>
     * </ul></div>
     * <p>See <tt>{@link #render}</tt> also.</p>
     */
    /**
     * @cfg {Boolean} stateful
     * <p>A flag which causes the Component to attempt to restore the state of
     * internal properties from a saved state on startup. The component must have
     * either a <code>{@link #stateId}</code> or <code>{@link #id}</code> assigned
     * for state to be managed. Auto-generated ids are not guaranteed to be stable
     * across page loads and cannot be relied upon to save and restore the same
     * state for a component.<p>
     * <p>For state saving to work, the state manager's provider must have been
     * set to an implementation of {@link Ext.state.Provider} which overrides the
     * {@link Ext.state.Provider#set set} and {@link Ext.state.Provider#get get}
     * methods to save and recall name/value pairs. A built-in implementation,
     * {@link Ext.state.CookieProvider} is available.</p>
     * <p>To set the state provider for the current page:</p>
     * <pre><code>
Ext.state.Manager.setProvider(new Ext.state.CookieProvider({
    expires: new Date(new Date().getTime()+(1000*60*60*24*7)), //7 days from now
}));
     * </code></pre>
     * <p>A stateful Component attempts to save state when one of the events
     * listed in the <code>{@link #stateEvents}</code> configuration fires.</p>
     * <p>To save state, a stateful Component first serializes its state by
     * calling <b><code>getState</code></b>. By default, this function does
     * nothing. The developer must provide an implementation which returns an
     * object hash which represents the Component's restorable state.</p>
     * <p>The value yielded by getState is passed to {@link Ext.state.Manager#set}
     * which uses the configured {@link Ext.state.Provider} to save the object
     * keyed by the Component's <code>{@link stateId}</code>, or, if that is not
     * specified, its <code>{@link #id}</code>.</p>
     * <p>During construction, a stateful Component attempts to <i>restore</i>
     * its state by calling {@link Ext.state.Manager#get} passing the
     * <code>{@link #stateId}</code>, or, if that is not specified, the
     * <code>{@link #id}</code>.</p>
     * <p>The resulting object is passed to <b><code>applyState</code></b>.
     * The default implementation of <code>applyState</code> simply copies
     * properties into the object, but a developer may override this to support
     * more behaviour.</p>
     * <p>You can perform extra processing on state save and restore by attaching
     * handlers to the {@link #beforestaterestore}, {@link #staterestore},
     * {@link #beforestatesave} and {@link #statesave} events.</p>
     */
    /**
     * @cfg {String} stateId
     * The unique id for this component to use for state management purposes
     * (defaults to the component id if one was set, otherwise null if the
     * component is using a generated id).
     * <p>See <code>{@link #stateful}</code> for an explanation of saving and
     * restoring Component state.</p>
     */
    /**
     * @cfg {Array} stateEvents
     * <p>An array of events that, when fired, should trigger this component to
     * save its state (defaults to none). <code>stateEvents</code> may be any type
     * of event supported by this component, including browser or custom events
     * (e.g., <tt>['click', 'customerchange']</tt>).</p>
     * <p>See <code>{@link #stateful}</code> for an explanation of saving and
     * restoring Component state.</p>
     */
    /**
     * @cfg {Mixed} autoEl
     * <p>A tag name or {@link Ext.DomHelper DomHelper} spec used to create the {@link #getEl Element} which will
     * encapsulate this Component.</p>
     * <p>You do not normally need to specify this. For the base classes {@link Ext.Component}, {@link Ext.BoxComponent},
     * and {@link Ext.Container}, this defaults to <b><tt>'div'</tt></b>. The more complex Ext classes use a more complex
     * DOM structure created by their own onRender methods.</p>
     * <p>This is intended to allow the developer to create application-specific utility Components encapsulated by
     * different DOM elements. Example usage:</p><pre><code>
{
    xtype: 'box',
    autoEl: {
        tag: 'img',
        src: 'http://www.example.com/example.jpg'
    }
}, {
    xtype: 'box',
    autoEl: {
        tag: 'blockquote',
        html: 'autoEl is cool!'
    }
}, {
    xtype: 'container',
    autoEl: 'ul',
    cls: 'ux-unordered-list',
    items: {
        xtype: 'box',
        autoEl: 'li',
        html: 'First list item'
    }
}
</code></pre>
     */
    autoEl : 'div',

    /**
     * @cfg {String} disabledClass
     * CSS class added to the component when it is disabled (defaults to 'x-item-disabled').
     */
    disabledClass : 'x-item-disabled',
    /**
     * @cfg {Boolean} allowDomMove
     * Whether the component can move the Dom node when rendering (defaults to true).
     */
    allowDomMove : true,
    /**
     * @cfg {Boolean} autoShow
     * True if the component should check for hidden classes (e.g. 'x-hidden' or 'x-hide-display') and remove
     * them on render (defaults to false).
     */
    autoShow : false,
    /**
     * @cfg {String} hideMode
     * <p>How this component should be hidden. Supported values are <tt>'visibility'</tt>
     * (css visibility), <tt>'offsets'</tt> (negative offset position) and <tt>'display'</tt>
     * (css display).</p>
     * <br><p><b>Note</b>: the default of <tt>'display'</tt> is generally preferred
     * since items are automatically laid out when they are first shown (no sizing
     * is done while hidden).</p>
     */
    hideMode : 'display',
    /**
     * @cfg {Boolean} hideParent
     * True to hide and show the component's container when hide/show is called on the component, false to hide
     * and show the component itself (defaults to false).  For example, this can be used as a shortcut for a hide
     * button on a window by setting hide:true on the button when adding it to its parent container.
     */
    hideParent : false,
    /**
     * <p>The {@link Ext.Element} which encapsulates this Component. Read-only.</p>
     * <p>This will <i>usually</i> be a &lt;DIV> element created by the class's onRender method, but
     * that may be overridden using the <code>{@link #autoEl}</code> config.</p>
     * <br><p><b>Note</b>: this element will not be available until this Component has been rendered.</p><br>
     * <p>To add listeners for <b>DOM events</b> to this Component (as opposed to listeners
     * for this Component's own Observable events), see the {@link Ext.util.Observable#listeners listeners}
     * config for a suggestion, or use a render listener directly:</p><pre><code>
new Ext.Panel({
    title: 'The Clickable Panel',
    listeners: {
        render: function(p) {
            // Append the Panel to the click handler&#39;s argument list.
            p.getEl().on('click', handlePanelClick.createDelegate(null, [p], true));
        },
        single: true  // Remove the listener after first invocation
    }
});
</code></pre>
     * <p>See also <tt>{@link #getEl getEl}</p>
     * @type Ext.Element
     * @property el
     */
    /**
     * This Component's owner {@link Ext.Container Container} (defaults to undefined, and is set automatically when
     * this Component is added to a Container).  Read-only.
     * <p><b>Note</b>: to access items within the Container see <tt>{@link #itemId}</tt>.</p>
     * @type Ext.Container
     * @property ownerCt
     */
    /**
     * True if this component is hidden. Read-only.
     * @type Boolean
     * @property hidden
     */
    /**
     * True if this component is disabled. Read-only.
     * @type Boolean
     * @property disabled
     */
    /**
     * True if this component has been rendered. Read-only.
     * @type Boolean
     * @property rendered
     */
    rendered : false,

    /**
     * @cfg {String} contentEl
     * <p>Optional. Specify an existing HTML element, or the <code>id</code> of an existing HTML element to use as the content
     * for this component.</p>
     * <ul>
     * <li><b>Description</b> :
     * <div class="sub-desc">This config option is used to take an existing HTML element and place it in the layout element
     * of a new component (it simply moves the specified DOM element <i>after the Component is rendered</i> to use as the content.</div></li>
     * <li><b>Notes</b> :
     * <div class="sub-desc">The specified HTML element is appended to the layout element of the component <i>after any configured
     * {@link #html HTML} has been inserted</i>, and so the document will not contain this element at the time the {@link #render} event is fired.</div>
     * <div class="sub-desc">The specified HTML element used will not participate in any <code><b>{@link Ext.Container#layout layout}</b></code>
     * scheme that the Component may use. It is just HTML. Layouts operate on child <code><b>{@link Ext.Container#items items}</b></code>.</div>
     * <div class="sub-desc">Add either the <code>x-hidden</code> or the <code>x-hide-display</code> CSS class to
     * prevent a brief flicker of the content before it is rendered to the panel.</div></li>
     * </ul>
     */
    /**
     * @cfg {String/Object} html
     * An HTML fragment, or a {@link Ext.DomHelper DomHelper} specification to use as the layout element
     * content (defaults to ''). The HTML content is added after the component is rendered,
     * so the document will not contain this HTML at the time the {@link #render} event is fired.
     * This content is inserted into the body <i>before</i> any configured {@link #contentEl} is appended.
     */

    /**
     * @cfg {Mixed} tpl
     * An <bold>{@link Ext.Template}</bold>, <bold>{@link Ext.XTemplate}</bold>
     * or an array of strings to form an Ext.XTemplate.
     * Used in conjunction with the <code>{@link #data}</code> and
     * <code>{@link #tplWriteMode}</code> configurations.
     */

    /**
     * @cfg {String} tplWriteMode The Ext.(X)Template method to use when
     * updating the content area of the Component. Defaults to <tt>'overwrite'</tt>
     * (see <code>{@link Ext.XTemplate#overwrite}</code>).
     */
    tplWriteMode : 'overwrite',

    /**
     * @cfg {Mixed} data
     * The initial set of data to apply to the <code>{@link #tpl}</code> to
     * update the content area of the Component.
     */
    
    /**
     * @cfg {Array} bubbleEvents
     * <p>An array of events that, when fired, should be bubbled to any parent container.
     * See {@link Ext.util.Observable#enableBubble}.
     * Defaults to <tt>[]</tt>.
     */
    bubbleEvents: [],


    // private
    ctype : 'Ext.Component',

    // private
    actionMode : 'el',

    // private
    getActionEl : function(){
        return this[this.actionMode];
    },

    initPlugin : function(p){
        if(p.ptype && !Ext.isFunction(p.init)){
            p = Ext.ComponentMgr.createPlugin(p);
        }else if(Ext.isString(p)){
            p = Ext.ComponentMgr.createPlugin({
                ptype: p
            });
        }
        p.init(this);
        return p;
    },

    /* // protected
     * Function to be implemented by Component subclasses to be part of standard component initialization flow (it is empty by default).
     * <pre><code>
// Traditional constructor:
Ext.Foo = function(config){
    // call superclass constructor:
    Ext.Foo.superclass.constructor.call(this, config);

    this.addEvents({
        // add events
    });
};
Ext.extend(Ext.Foo, Ext.Bar, {
   // class body
}

// initComponent replaces the constructor:
Ext.Foo = Ext.extend(Ext.Bar, {
    initComponent : function(){
        // call superclass initComponent
        Ext.Container.superclass.initComponent.call(this);

        this.addEvents({
            // add events
        });
    }
}
</code></pre>
     */
    initComponent : function(){
        /*
         * this is double processing, however it allows people to be able to do
         * Ext.apply(this, {
         *     listeners: {
         *         //here
         *     }
         * });
         * MyClass.superclass.initComponent.call(this);
         */
        if(this.listeners){
            this.on(this.listeners);
            delete this.listeners;
        }
        this.enableBubble(this.bubbleEvents);
    },

    /**
     * <p>Render this Component into the passed HTML element.</p>
     * <p><b>If you are using a {@link Ext.Container Container} object to house this Component, then
     * do not use the render method.</b></p>
     * <p>A Container's child Components are rendered by that Container's
     * {@link Ext.Container#layout layout} manager when the Container is first rendered.</p>
     * <p>Certain layout managers allow dynamic addition of child components. Those that do
     * include {@link Ext.layout.CardLayout}, {@link Ext.layout.AnchorLayout},
     * {@link Ext.layout.FormLayout}, {@link Ext.layout.TableLayout}.</p>
     * <p>If the Container is already rendered when a new child Component is added, you may need to call
     * the Container's {@link Ext.Container#doLayout doLayout} to refresh the view which causes any
     * unrendered child Components to be rendered. This is required so that you can add multiple
     * child components if needed while only refreshing the layout once.</p>
     * <p>When creating complex UIs, it is important to remember that sizing and positioning
     * of child items is the responsibility of the Container's {@link Ext.Container#layout layout} manager.
     * If you expect child items to be sized in response to user interactions, you must
     * configure the Container with a layout manager which creates and manages the type of layout you
     * have in mind.</p>
     * <p><b>Omitting the Container's {@link Ext.Container#layout layout} config means that a basic
     * layout manager is used which does nothing but render child components sequentially into the
     * Container. No sizing or positioning will be performed in this situation.</b></p>
     * @param {Element/HTMLElement/String} container (optional) The element this Component should be
     * rendered into. If it is being created from existing markup, this should be omitted.
     * @param {String/Number} position (optional) The element ID or DOM node index within the container <b>before</b>
     * which this component will be inserted (defaults to appending to the end of the container)
     */
    render : function(container, position){
        if(!this.rendered && this.fireEvent('beforerender', this) !== false){
            if(!container && this.el){
                this.el = Ext.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Ext.get(container);
            if(this.ctCls){
                this.container.addClass(this.ctCls);
            }
            this.rendered = true;
            if(position !== undefined){
                if(Ext.isNumber(position)){
                    position = this.container.dom.childNodes[position];
                }else{
                    position = Ext.getDom(position);
                }
            }
            this.onRender(this.container, position || null);
            if(this.autoShow){
                this.el.removeClass(['x-hidden','x-hide-' + this.hideMode]);
            }
            if(this.cls){
                this.el.addClass(this.cls);
                delete this.cls;
            }
            if(this.style){
                this.el.applyStyles(this.style);
                delete this.style;
            }
            if(this.overCls){
                this.el.addClassOnOver(this.overCls);
            }
            this.fireEvent('render', this);


            // Populate content of the component with html, contentEl or
            // a tpl.
            var contentTarget = this.getContentTarget();
            if (this.html){
                contentTarget.update(Ext.DomHelper.markup(this.html));
                delete this.html;
            }
            if (this.contentEl){
                var ce = Ext.getDom(this.contentEl);
                Ext.fly(ce).removeClass(['x-hidden', 'x-hide-display']);
                contentTarget.appendChild(ce);
            }
            if (this.tpl) {
                if (!this.tpl.compile) {
                    this.tpl = new Ext.XTemplate(this.tpl);
                }
                if (this.data) {
                    this.tpl[this.tplWriteMode](contentTarget, this.data);
                    delete this.data;
                }
            }
            this.afterRender(this.container);


            if(this.hidden){
                // call this so we don't fire initial hide events.
                this.doHide();
            }
            if(this.disabled){
                // pass silent so the event doesn't fire the first time.
                this.disable(true);
            }

            if(this.stateful !== false){
                this.initStateEvents();
            }
            this.fireEvent('afterrender', this);
        }
        return this;
    },


    /**
     * Update the content area of a component.
     * @param {Mixed} htmlOrData
     * If this component has been configured with a template via the tpl config
     * then it will use this argument as data to populate the template.
     * If this component was not configured with a template, the components
     * content area will be updated via Ext.Element update
     * @param {Boolean} loadScripts
     * (optional) Only legitimate when using the html configuration. Defaults to false
     * @param {Function} callback
     * (optional) Only legitimate when using the html configuration. Callback to execute when scripts have finished loading
     */
    update: function(htmlOrData, loadScripts, cb) {
        var contentTarget = this.getContentTarget();
        if (this.tpl && typeof htmlOrData !== "string") {
            this.tpl[this.tplWriteMode](contentTarget, htmlOrData || {});
        } else {
            var html = Ext.isObject(htmlOrData) ? Ext.DomHelper.markup(htmlOrData) : htmlOrData;
            contentTarget.update(html, loadScripts, cb);
        }
    },


    /**
     * @private
     * Method to manage awareness of when components are added to their
     * respective Container, firing an added event.
     * References are established at add time rather than at render time.
     * @param {Ext.Container} container Container which holds the component
     * @param {number} pos Position at which the component was added
     */
    onAdded : function(container, pos) {
        this.ownerCt = container;
        this.initRef();
        this.fireEvent('added', this, container, pos);
    },

    /**
     * @private
     * Method to manage awareness of when components are removed from their
     * respective Container, firing an removed event. References are properly
     * cleaned up after removing a component from its owning container.
     */
    onRemoved : function() {
        this.removeRef();
        this.fireEvent('removed', this, this.ownerCt);
        delete this.ownerCt;
    },

    /**
     * @private
     * Method to establish a reference to a component.
     */
    initRef : function() {
        /**
         * @cfg {String} ref
         * <p>A path specification, relative to the Component's <code>{@link #ownerCt}</code>
         * specifying into which ancestor Container to place a named reference to this Component.</p>
         * <p>The ancestor axis can be traversed by using '/' characters in the path.
         * For example, to put a reference to a Toolbar Button into <i>the Panel which owns the Toolbar</i>:</p><pre><code>
var myGrid = new Ext.grid.EditorGridPanel({
    title: 'My EditorGridPanel',
    store: myStore,
    colModel: myColModel,
    tbar: [{
        text: 'Save',
        handler: saveChanges,
        disabled: true,
        ref: '../saveButton'
    }],
    listeners: {
        afteredit: function() {
//          The button reference is in the GridPanel
            myGrid.saveButton.enable();
        }
    }
});
</code></pre>
         * <p>In the code above, if the <code>ref</code> had been <code>'saveButton'</code>
         * the reference would have been placed into the Toolbar. Each '/' in the <code>ref</code>
         * moves up one level from the Component's <code>{@link #ownerCt}</code>.</p>
         * <p>Also see the <code>{@link #added}</code> and <code>{@link #removed}</code> events.</p>
         */
        if(this.ref && !this.refOwner){
            var levels = this.ref.split('/'),
                last = levels.length,
                i = 0,
                t = this;

            while(t && i < last){
                t = t.ownerCt;
                ++i;
            }
            if(t){
                t[this.refName = levels[--i]] = this;
                /**
                 * @type Ext.Container
                 * @property refOwner
                 * The ancestor Container into which the {@link #ref} reference was inserted if this Component
                 * is a child of a Container, and has been configured with a <code>ref</code>.
                 */
                this.refOwner = t;
            }
        }
    },

    removeRef : function() {
        if (this.refOwner && this.refName) {
            delete this.refOwner[this.refName];
            delete this.refOwner;
        }
    },

    // private
    initState : function(){
        if(Ext.state.Manager){
            var id = this.getStateId();
            if(id){
                var state = Ext.state.Manager.get(id);
                if(state){
                    if(this.fireEvent('beforestaterestore', this, state) !== false){
                        this.applyState(Ext.apply({}, state));
                        this.fireEvent('staterestore', this, state);
                    }
                }
            }
        }
    },

    // private
    getStateId : function(){
        return this.stateId || ((/^(ext-comp-|ext-gen)/).test(String(this.id)) ? null : this.id);
    },

    // private
    initStateEvents : function(){
        if(this.stateEvents){
            for(var i = 0, e; e = this.stateEvents[i]; i++){
                this.on(e, this.saveState, this, {delay:100});
            }
        }
    },

    // private
    applyState : function(state){
        if(state){
            Ext.apply(this, state);
        }
    },

    // private
    getState : function(){
        return null;
    },

    // private
    saveState : function(){
        if(Ext.state.Manager && this.stateful !== false){
            var id = this.getStateId();
            if(id){
                var state = this.getState();
                if(this.fireEvent('beforestatesave', this, state) !== false){
                    Ext.state.Manager.set(id, state);
                    this.fireEvent('statesave', this, state);
                }
            }
        }
    },

    /**
     * Apply this component to existing markup that is valid. With this function, no call to render() is required.
     * @param {String/HTMLElement} el
     */
    applyToMarkup : function(el){
        this.allowDomMove = false;
        this.el = Ext.get(el);
        this.render(this.el.dom.parentNode);
    },

    /**
     * Adds a CSS class to the component's underlying element.
     * @param {string} cls The CSS class name to add
     * @return {Ext.Component} this
     */
    addClass : function(cls){
        if(this.el){
            this.el.addClass(cls);
        }else{
            this.cls = this.cls ? this.cls + ' ' + cls : cls;
        }
        return this;
    },

    /**
     * Removes a CSS class from the component's underlying element.
     * @param {string} cls The CSS class name to remove
     * @return {Ext.Component} this
     */
    removeClass : function(cls){
        if(this.el){
            this.el.removeClass(cls);
        }else if(this.cls){
            this.cls = this.cls.split(' ').remove(cls).join(' ');
        }
        return this;
    },

    // private
    // default function is not really useful
    onRender : function(ct, position){
        if(!this.el && this.autoEl){
            if(Ext.isString(this.autoEl)){
                this.el = document.createElement(this.autoEl);
            }else{
                var div = document.createElement('div');
                Ext.DomHelper.overwrite(div, this.autoEl);
                this.el = div.firstChild;
            }
            if (!this.el.id) {
                this.el.id = this.getId();
            }
        }
        if(this.el){
            this.el = Ext.get(this.el);
            if(this.allowDomMove !== false){
                ct.dom.insertBefore(this.el.dom, position);
                if (div) {
                    Ext.removeNode(div);
                    div = null;
                }
            }
        }
    },

    // private
    getAutoCreate : function(){
        var cfg = Ext.isObject(this.autoCreate) ?
                      this.autoCreate : Ext.apply({}, this.defaultAutoCreate);
        if(this.id && !cfg.id){
            cfg.id = this.id;
        }
        return cfg;
    },

    // private
    afterRender : Ext.emptyFn,

    /**
     * Destroys this component by purging any event listeners, removing the component's element from the DOM,
     * removing the component from its {@link Ext.Container} (if applicable) and unregistering it from
     * {@link Ext.ComponentMgr}.  Destruction is generally handled automatically by the framework and this method
     * should usually not need to be called directly.
     *
     */
    destroy : function(){
        if(!this.isDestroyed){
            if(this.fireEvent('beforedestroy', this) !== false){
                this.destroying = true;
                this.beforeDestroy();
                if(this.ownerCt && this.ownerCt.remove){
                    this.ownerCt.remove(this, false);
                }
                if(this.rendered){
                    this.el.remove();
                    if(this.actionMode == 'container' || this.removeMode == 'container'){
                        this.container.remove();
                    }
                }
                // Stop any buffered tasks
                if(this.focusTask && this.focusTask.cancel){
                    this.focusTask.cancel();
                }
                this.onDestroy();
                Ext.ComponentMgr.unregister(this);
                this.fireEvent('destroy', this);
                this.purgeListeners();
                this.destroying = false;
                this.isDestroyed = true;
            }
        }
    },

    deleteMembers : function(){
        var args = arguments;
        for(var i = 0, len = args.length; i < len; ++i){
            delete this[args[i]];
        }
    },

    // private
    beforeDestroy : Ext.emptyFn,

    // private
    onDestroy  : Ext.emptyFn,

    /**
     * <p>Returns the {@link Ext.Element} which encapsulates this Component.</p>
     * <p>This will <i>usually</i> be a &lt;DIV> element created by the class's onRender method, but
     * that may be overridden using the {@link #autoEl} config.</p>
     * <br><p><b>Note</b>: this element will not be available until this Component has been rendered.</p><br>
     * <p>To add listeners for <b>DOM events</b> to this Component (as opposed to listeners
     * for this Component's own Observable events), see the {@link #listeners} config for a suggestion,
     * or use a render listener directly:</p><pre><code>
new Ext.Panel({
    title: 'The Clickable Panel',
    listeners: {
        render: function(p) {
            // Append the Panel to the click handler&#39;s argument list.
            p.getEl().on('click', handlePanelClick.createDelegate(null, [p], true));
        },
        single: true  // Remove the listener after first invocation
    }
});
</code></pre>
     * @return {Ext.Element} The Element which encapsulates this Component.
     */
    getEl : function(){
        return this.el;
    },

    // private
    getContentTarget : function(){
        return this.el;
    },

    /**
     * Returns the <code>id</code> of this component or automatically generates and
     * returns an <code>id</code> if an <code>id</code> is not defined yet:<pre><code>
     * 'ext-comp-' + (++Ext.Component.AUTO_ID)
     * </code></pre>
     * @return {String} id
     */
    getId : function(){
        return this.id || (this.id = 'ext-comp-' + (++Ext.Component.AUTO_ID));
    },

    /**
     * Returns the <code>{@link #itemId}</code> of this component.  If an
     * <code>{@link #itemId}</code> was not assigned through configuration the
     * <code>id</code> is returned using <code>{@link #getId}</code>.
     * @return {String}
     */
    getItemId : function(){
        return this.itemId || this.getId();
    },

    /**
     * Try to focus this component.
     * @param {Boolean} selectText (optional) If applicable, true to also select the text in this component
     * @param {Boolean/Number} delay (optional) Delay the focus this number of milliseconds (true for 10 milliseconds)
     * @return {Ext.Component} this
     */
    focus : function(selectText, delay){
        if(delay){
            this.focusTask = new Ext.util.DelayedTask(this.focus, this, [selectText, false]);
            this.focusTask.delay(Ext.isNumber(delay) ? delay : 10);
            return this;
        }
        if(this.rendered && !this.isDestroyed){
            this.el.focus();
            if(selectText === true){
                this.el.dom.select();
            }
        }
        return this;
    },

    // private
    blur : function(){
        if(this.rendered){
            this.el.blur();
        }
        return this;
    },

    /**
     * Disable this component and fire the 'disable' event.
     * @return {Ext.Component} this
     */
    disable : function(/* private */ silent){
        if(this.rendered){
            this.onDisable();
        }
        this.disabled = true;
        if(silent !== true){
            this.fireEvent('disable', this);
        }
        return this;
    },

    // private
    onDisable : function(){
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
    },

    /**
     * Enable this component and fire the 'enable' event.
     * @return {Ext.Component} this
     */
    enable : function(){
        if(this.rendered){
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent('enable', this);
        return this;
    },

    // private
    onEnable : function(){
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
    },

    /**
     * Convenience function for setting disabled/enabled by boolean.
     * @param {Boolean} disabled
     * @return {Ext.Component} this
     */
    setDisabled : function(disabled){
        return this[disabled ? 'disable' : 'enable']();
    },

    /**
     * Show this component.  Listen to the '{@link #beforeshow}' event and return
     * <tt>false</tt> to cancel showing the component.  Fires the '{@link #show}'
     * event after showing the component.
     * @return {Ext.Component} this
     */
    show : function(){
        if(this.fireEvent('beforeshow', this) !== false){
            this.hidden = false;
            if(this.autoRender){
                this.render(Ext.isBoolean(this.autoRender) ? Ext.getBody() : this.autoRender);
            }
            if(this.rendered){
                this.onShow();
            }
            this.fireEvent('show', this);
        }
        return this;
    },

    // private
    onShow : function(){
        this.getVisibilityEl().removeClass('x-hide-' + this.hideMode);
    },

    /**
     * Hide this component.  Listen to the '{@link #beforehide}' event and return
     * <tt>false</tt> to cancel hiding the component.  Fires the '{@link #hide}'
     * event after hiding the component. Note this method is called internally if
     * the component is configured to be <code>{@link #hidden}</code>.
     * @return {Ext.Component} this
     */
    hide : function(){
        if(this.fireEvent('beforehide', this) !== false){
            this.doHide();
            this.fireEvent('hide', this);
        }
        return this;
    },

    // private
    doHide: function(){
        this.hidden = true;
        if(this.rendered){
            this.onHide();
        }
    },

    // private
    onHide : function(){
        this.getVisibilityEl().addClass('x-hide-' + this.hideMode);
    },

    // private
    getVisibilityEl : function(){
        return this.hideParent ? this.container : this.getActionEl();
    },

    /**
     * Convenience function to hide or show this component by boolean.
     * @param {Boolean} visible True to show, false to hide
     * @return {Ext.Component} this
     */
    setVisible : function(visible){
        return this[visible ? 'show' : 'hide']();
    },

    /**
     * Returns true if this component is visible.
     * @return {Boolean} True if this component is visible, false otherwise.
     */
    isVisible : function(){
        return this.rendered && this.getVisibilityEl().isVisible();
    },

    /**
     * Clone the current component using the original config values passed into this instance by default.
     * @param {Object} overrides A new config containing any properties to override in the cloned version.
     * An id property can be passed on this object, otherwise one will be generated to avoid duplicates.
     * @return {Ext.Component} clone The cloned copy of this component
     */
    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Ext.id();
        var cfg = Ext.applyIf(overrides, this.initialConfig);
        cfg.id = id; // prevent dup id
        return new this.constructor(cfg);
    },

    /**
     * Gets the xtype for this component as registered with {@link Ext.ComponentMgr}. For a list of all
     * available xtypes, see the {@link Ext.Component} header. Example usage:
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXType());  // alerts 'textfield'
</code></pre>
     * @return {String} The xtype
     */
    getXType : function(){
        return this.constructor.xtype;
    },

    /**
     * <p>Tests whether or not this Component is of a specific xtype. This can test whether this Component is descended
     * from the xtype (default) or whether it is directly of the xtype specified (shallow = true).</p>
     * <p><b>If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>For a list of all available xtypes, see the {@link Ext.Component} header.</p>
     * <p>Example usage:</p>
     * <pre><code>
var t = new Ext.form.TextField();
var isText = t.isXType('textfield');        // true
var isBoxSubclass = t.isXType('box');       // true, descended from BoxComponent
var isBoxInstance = t.isXType('box', true); // false, not a direct BoxComponent instance
</code></pre>
     * @param {String/Ext.Component/Class} xtype The xtype to check for this Component. Note that the the component can either be an instance
     * or a component class:
     * <pre><code>
var c = new Ext.Component();
console.log(c.isXType(c));
console.log(c.isXType(Ext.Component)); 
</code></pre>
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Boolean} True if this component descends from the specified xtype, false otherwise.
     */
    isXType : function(xtype, shallow){
        //assume a string by default
        if (Ext.isFunction(xtype)){
            xtype = xtype.xtype; //handle being passed the class, e.g. Ext.Component
        }else if (Ext.isObject(xtype)){
            xtype = xtype.constructor.xtype; //handle being passed an instance
        }

        return !shallow ? ('/' + this.getXTypes() + '/').indexOf('/' + xtype + '/') != -1 : this.constructor.xtype == xtype;
    },

    /**
     * <p>Returns this Component's xtype hierarchy as a slash-delimited string. For a list of all
     * available xtypes, see the {@link Ext.Component} header.</p>
     * <p><b>If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.</b></p>
     * <p>Example usage:</p>
     * <pre><code>
var t = new Ext.form.TextField();
alert(t.getXTypes());  // alerts 'component/box/field/textfield'
</code></pre>
     * @return {String} The xtype hierarchy string
     */
    getXTypes : function(){
        var tc = this.constructor;
        if(!tc.xtypes){
            var c = [], sc = this;
            while(sc && sc.constructor.xtype){
                c.unshift(sc.constructor.xtype);
                sc = sc.constructor.superclass;
            }
            tc.xtypeChain = c;
            tc.xtypes = c.join('/');
        }
        return tc.xtypes;
    },

    /**
     * Find a container above this component at any level by a custom function. If the passed function returns
     * true, the container will be returned.
     * @param {Function} fn The custom function to call with the arguments (container, this component).
     * @return {Ext.Container} The first Container for which the custom function returns true
     */
    findParentBy : function(fn) {
        for (var p = this.ownerCt; (p != null) && !fn(p, this); p = p.ownerCt);
        return p || null;
    },

    /**
     * Find a container above this component at any level by xtype or class
     * @param {String/Ext.Component/Class} xtype The xtype to check for this Component. Note that the the component can either be an instance
     * or a component class:
     * @param {Boolean} shallow (optional) False to check whether this Component is descended from the xtype (this is
     * the default), or true to check whether this Component is directly of the specified xtype.
     * @return {Ext.Container} The first Container which matches the given xtype or class
     */
    findParentByType : function(xtype, shallow){
        return this.findParentBy(function(c){
            return c.isXType(xtype, shallow);
        });
    },
    
    /**
     * Bubbles up the component/container heirarchy, calling the specified function with each component. The scope (<i>this</i>) of
     * function call will be the scope provided or the current component. The arguments to the function
     * will be the args provided or the current component. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current component)
     * @return {Ext.Component} this
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.apply(scope || p, args || [p]) === false){
                break;
            }
            p = p.ownerCt;
        }
        return this;
    },

    // protected
    getPositionEl : function(){
        return this.positionEl || this.el;
    },

    // private
    purgeListeners : function(){
        Ext.Component.superclass.purgeListeners.call(this);
        if(this.mons){
            this.on('beforedestroy', this.clearMons, this, {single: true});
        }
    },

    // private
    clearMons : function(){
        Ext.each(this.mons, function(m){
            m.item.un(m.ename, m.fn, m.scope);
        }, this);
        this.mons = [];
    },

    // private
    createMons: function(){
        if(!this.mons){
            this.mons = [];
            this.on('beforedestroy', this.clearMons, this, {single: true});
        }
    },

    /**
     * <p>Adds listeners to any Observable object (or Elements) which are automatically removed when this Component
     * is destroyed. Usage:</p><code><pre>
myGridPanel.mon(myGridPanel.getSelectionModel(), 'selectionchange', handleSelectionChange, null, {buffer: 50});
</pre></code>
     * <p>or:</p><code><pre>
myGridPanel.mon(myGridPanel.getSelectionModel(), {
    selectionchange: handleSelectionChange,
    buffer: 50
});
</pre></code>
     * @param {Observable|Element} item The item to which to add a listener/listeners.
     * @param {Object|String} ename The event name, or an object containing event name properties.
     * @param {Function} fn Optional. If the <code>ename</code> parameter was an event name, this
     * is the handler function.
     * @param {Object} scope Optional. If the <code>ename</code> parameter was an event name, this
     * is the scope (<code>this</code> reference) in which the handler function is executed.
     * @param {Object} opt Optional. If the <code>ename</code> parameter was an event name, this
     * is the {@link Ext.util.Observable#addListener addListener} options.
     */
    mon : function(item, ename, fn, scope, opt){
        this.createMons();
        if(Ext.isObject(ename)){
            var propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/;

            var o = ename;
            for(var e in o){
                if(propRe.test(e)){
                    continue;
                }
                if(Ext.isFunction(o[e])){
                    // shared options
                    this.mons.push({
                        item: item, ename: e, fn: o[e], scope: o.scope
                    });
                    item.on(e, o[e], o.scope, o);
                }else{
                    // individual options
                    this.mons.push({
                        item: item, ename: e, fn: o[e], scope: o.scope
                    });
                    item.on(e, o[e]);
                }
            }
            return;
        }

        this.mons.push({
            item: item, ename: ename, fn: fn, scope: scope
        });
        item.on(ename, fn, scope, opt);
    },

    /**
     * Removes listeners that were added by the {@link #mon} method.
     * @param {Observable|Element} item The item from which to remove a listener/listeners.
     * @param {Object|String} ename The event name, or an object containing event name properties.
     * @param {Function} fn Optional. If the <code>ename</code> parameter was an event name, this
     * is the handler function.
     * @param {Object} scope Optional. If the <code>ename</code> parameter was an event name, this
     * is the scope (<code>this</code> reference) in which the handler function is executed.
     */
    mun : function(item, ename, fn, scope){
        var found, mon;
        this.createMons();
        for(var i = 0, len = this.mons.length; i < len; ++i){
            mon = this.mons[i];
            if(item === mon.item && ename == mon.ename && fn === mon.fn && scope === mon.scope){
                this.mons.splice(i, 1);
                item.un(ename, fn, scope);
                found = true;
                break;
            }
        }
        return found;
    },

    /**
     * Returns the next component in the owning container
     * @return Ext.Component
     */
    nextSibling : function(){
        if(this.ownerCt){
            var index = this.ownerCt.items.indexOf(this);
            if(index != -1 && index+1 < this.ownerCt.items.getCount()){
                return this.ownerCt.items.itemAt(index+1);
            }
        }
        return null;
    },

    /**
     * Returns the previous component in the owning container
     * @return Ext.Component
     */
    previousSibling : function(){
        if(this.ownerCt){
            var index = this.ownerCt.items.indexOf(this);
            if(index > 0){
                return this.ownerCt.items.itemAt(index-1);
            }
        }
        return null;
    },

    /**
     * Provides the link for Observable's fireEvent method to bubble up the ownership hierarchy.
     * @return {Ext.Container} the Container which owns this Component.
     */
    getBubbleTarget : function(){
        return this.ownerCt;
    }
});

Ext.reg('component', Ext.Component);
