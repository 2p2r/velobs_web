/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.Toolbar
 * @extends Ext.Container
 * <p>Basic Toolbar class. Although the <tt>{@link Ext.Container#defaultType defaultType}</tt> for Toolbar
 * is <tt>{@link Ext.Button button}</tt>, Toolbar elements (child items for the Toolbar container) may
 * be virtually any type of Component. Toolbar elements can be created explicitly via their constructors,
 * or implicitly via their xtypes, and can be <tt>{@link #add}</tt>ed dynamically.</p>
 * <p>Some items have shortcut strings for creation:</p>
 * <pre>
<u>Shortcut</u>  <u>xtype</u>          <u>Class</u>                  <u>Description</u>
'->'      'tbfill'       {@link Ext.Toolbar.Fill}       begin using the right-justified button container
'-'       'tbseparator'  {@link Ext.Toolbar.Separator}  add a vertical separator bar between toolbar items
' '       'tbspacer'     {@link Ext.Toolbar.Spacer}     add horiztonal space between elements
 * </pre>
 *
 * Example usage of various elements:
 * <pre><code>
var tb = new Ext.Toolbar({
    renderTo: document.body,
    width: 600,
    height: 100,
    items: [
        {
            // xtype: 'button', // default for Toolbars, same as 'tbbutton'
            text: 'Button'
        },
        {
            xtype: 'splitbutton', // same as 'tbsplitbutton'
            text: 'Split Button'
        },
        // begin using the right-justified button container
        '->', // same as {xtype: 'tbfill'}, // Ext.Toolbar.Fill
        {
            xtype: 'textfield',
            name: 'field1',
            emptyText: 'enter search term'
        },
        // add a vertical separator bar between toolbar items
        '-', // same as {xtype: 'tbseparator'} to create Ext.Toolbar.Separator
        'text 1', // same as {xtype: 'tbtext', text: 'text1'} to create Ext.Toolbar.TextItem
        {xtype: 'tbspacer'},// same as ' ' to create Ext.Toolbar.Spacer
        'text 2',
        {xtype: 'tbspacer', width: 50}, // add a 50px space
        'text 3'
    ]
});
 * </code></pre>
 * Example adding a ComboBox within a menu of a button:
 * <pre><code>
// ComboBox creation
var combo = new Ext.form.ComboBox({
    store: new Ext.data.ArrayStore({
        autoDestroy: true,
        fields: ['initials', 'fullname'],
        data : [
            ['FF', 'Fred Flintstone'],
            ['BR', 'Barney Rubble']
        ]
    }),
    displayField: 'fullname',
    typeAhead: true,
    mode: 'local',
    forceSelection: true,
    triggerAction: 'all',
    emptyText: 'Select a name...',
    selectOnFocus: true,
    width: 135,
    getListParent: function() {
        return this.el.up('.x-menu');
    },
    iconCls: 'no-icon' //use iconCls if placing within menu to shift to right side of menu
});

// put ComboBox in a Menu
var menu = new Ext.menu.Menu({
    id: 'mainMenu',
    items: [
        combo // A Field in a Menu
    ]
});

// add a Button with the menu
tb.add({
        text:'Button w/ Menu',
        menu: menu  // assign menu by instance
    });
tb.doLayout();
 * </code></pre>
 * @constructor
 * Creates a new Toolbar
 * @param {Object/Array} config A config object or an array of buttons to <tt>{@link #add}</tt>
 * @xtype toolbar
 */
Ext.Toolbar = function(config){
    if(Ext.isArray(config)){
        config = {items: config, layout: 'toolbar'};
    } else {
        config = Ext.apply({
            layout: 'toolbar'
        }, config);
        if(config.buttons) {
            config.items = config.buttons;
        }
    }
    Ext.Toolbar.superclass.constructor.call(this, config);
};

(function(){

var T = Ext.Toolbar;

Ext.extend(T, Ext.Container, {

    defaultType: 'button',

    /**
     * @cfg {String/Object} layout
     * This class assigns a default layout (<code>layout:'<b>toolbar</b>'</code>).
     * Developers <i>may</i> override this configuration option if another layout
     * is required (the constructor must be passed a configuration object in this
     * case instead of an array).
     * See {@link Ext.Container#layout} for additional information.
     */

    enableOverflow : false,

    /**
     * @cfg {Boolean} enableOverflow
     * Defaults to false. Configure <tt>true</tt> to make the toolbar provide a button
     * which activates a dropdown Menu to show items which overflow the Toolbar's width.
     */
    /**
     * @cfg {String} buttonAlign
     * <p>The default position at which to align child items. Defaults to <code>"left"</code></p>
     * <p>May be specified as <code>"center"</code> to cause items added before a Fill (A <code>"->"</code>) item
     * to be centered in the Toolbar. Items added after a Fill are still right-aligned.</p>
     * <p>Specify as <code>"right"</code> to right align all child items.</p>
     */

    trackMenus : true,
    internalDefaults: {removeMode: 'container', hideParent: true},
    toolbarCls: 'x-toolbar',

    initComponent : function(){
        T.superclass.initComponent.call(this);

        /**
         * @event overflowchange
         * Fires after the overflow state has changed.
         * @param {Object} c The Container
         * @param {Boolean} lastOverflow overflow state
         */
        this.addEvents('overflowchange');
    },

    // private
    onRender : function(ct, position){
        if(!this.el){
            if(!this.autoCreate){
                this.autoCreate = {
                    cls: this.toolbarCls + ' x-small-editor'
                };
            }
            this.el = ct.createChild(Ext.apply({ id: this.id },this.autoCreate), position);
            Ext.Toolbar.superclass.onRender.apply(this, arguments);
        }
    },

    /**
     * <p>Adds element(s) to the toolbar -- this function takes a variable number of
     * arguments of mixed type and adds them to the toolbar.</p>
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Mixed} arg1 The following types of arguments are all valid:<br />
     * <ul>
     * <li>{@link Ext.Button} config: A valid button config object (equivalent to {@link #addButton})</li>
     * <li>HtmlElement: Any standard HTML element (equivalent to {@link #addElement})</li>
     * <li>Field: Any form field (equivalent to {@link #addField})</li>
     * <li>Item: Any subclass of {@link Ext.Toolbar.Item} (equivalent to {@link #addItem})</li>
     * <li>String: Any generic string (gets wrapped in a {@link Ext.Toolbar.TextItem}, equivalent to {@link #addText}).
     * Note that there are a few special strings that are treated differently as explained next.</li>
     * <li>'-': Creates a separator element (equivalent to {@link #addSeparator})</li>
     * <li>' ': Creates a spacer element (equivalent to {@link #addSpacer})</li>
     * <li>'->': Creates a fill element (equivalent to {@link #addFill})</li>
     * </ul>
     * @param {Mixed} arg2
     * @param {Mixed} etc.
     * @method add
     */

    // private
    lookupComponent : function(c){
        if(Ext.isString(c)){
            if(c == '-'){
                c = new T.Separator();
            }else if(c == ' '){
                c = new T.Spacer();
            }else if(c == '->'){
                c = new T.Fill();
            }else{
                c = new T.TextItem(c);
            }
            this.applyDefaults(c);
        }else{
            if(c.isFormField || c.render){ // some kind of form field, some kind of Toolbar.Item
                c = this.createComponent(c);
            }else if(c.tag){ // DomHelper spec
                c = new T.Item({autoEl: c});
            }else if(c.tagName){ // element
                c = new T.Item({el:c});
            }else if(Ext.isObject(c)){ // must be button config?
                c = c.xtype ? this.createComponent(c) : this.constructButton(c);
            }
        }
        return c;
    },

    // private
    applyDefaults : function(c){
        if(!Ext.isString(c)){
            c = Ext.Toolbar.superclass.applyDefaults.call(this, c);
            var d = this.internalDefaults;
            if(c.events){
                Ext.applyIf(c.initialConfig, d);
                Ext.apply(c, d);
            }else{
                Ext.applyIf(c, d);
            }
        }
        return c;
    },

    /**
     * Adds a separator
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @return {Ext.Toolbar.Item} The separator {@link Ext.Toolbar.Item item}
     */
    addSeparator : function(){
        return this.add(new T.Separator());
    },

    /**
     * Adds a spacer element
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @return {Ext.Toolbar.Spacer} The spacer item
     */
    addSpacer : function(){
        return this.add(new T.Spacer());
    },

    /**
     * Forces subsequent additions into the float:right toolbar
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     */
    addFill : function(){
        this.add(new T.Fill());
    },

    /**
     * Adds any standard HTML element to the toolbar
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Mixed} el The element or id of the element to add
     * @return {Ext.Toolbar.Item} The element's item
     */
    addElement : function(el){
        return this.addItem(new T.Item({el:el}));
    },

    /**
     * Adds any Toolbar.Item or subclass
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Ext.Toolbar.Item} item
     * @return {Ext.Toolbar.Item} The item
     */
    addItem : function(item){
        return this.add.apply(this, arguments);
    },

    /**
     * Adds a button (or buttons). See {@link Ext.Button} for more info on the config.
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Object/Array} config A button config or array of configs
     * @return {Ext.Button/Array}
     */
    addButton : function(config){
        if(Ext.isArray(config)){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        return this.add(this.constructButton(config));
    },

    /**
     * Adds text to the toolbar
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {String} text The text to add
     * @return {Ext.Toolbar.Item} The element's item
     */
    addText : function(text){
        return this.addItem(new T.TextItem(text));
    },

    /**
     * Adds a new element to the toolbar from the passed {@link Ext.DomHelper} config
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Object} config
     * @return {Ext.Toolbar.Item} The element's item
     */
    addDom : function(config){
        return this.add(new T.Item({autoEl: config}));
    },

    /**
     * Adds a dynamically rendered Ext.form field (TextField, ComboBox, etc). Note: the field should not have
     * been rendered yet. For a field that has already been rendered, use {@link #addElement}.
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Ext.form.Field} field
     * @return {Ext.Toolbar.Item}
     */
    addField : function(field){
        return this.add(field);
    },

    /**
     * Inserts any {@link Ext.Toolbar.Item}/{@link Ext.Button} at the specified index.
     * <br><p><b>Note</b>: See the notes within {@link Ext.Container#add}.</p>
     * @param {Number} index The index where the item is to be inserted
     * @param {Object/Ext.Toolbar.Item/Ext.Button/Array} item The button, or button config object to be
     * inserted, or an array of buttons/configs.
     * @return {Ext.Button/Item}
     */
    insertButton : function(index, item){
        if(Ext.isArray(item)){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        return Ext.Toolbar.superclass.insert.call(this, index, item);
    },

    // private
    trackMenu : function(item, remove){
        if(this.trackMenus && item.menu){
            var method = remove ? 'mun' : 'mon';
            this[method](item, 'menutriggerover', this.onButtonTriggerOver, this);
            this[method](item, 'menushow', this.onButtonMenuShow, this);
            this[method](item, 'menuhide', this.onButtonMenuHide, this);
        }
    },

    // private
    constructButton : function(item){
        var b = item.events ? item : this.createComponent(item, item.split ? 'splitbutton' : this.defaultType);
        return b;
    },

    // private
    onAdd : function(c){
        Ext.Toolbar.superclass.onAdd.call(this);
        this.trackMenu(c);
        if(this.disabled){
            c.disable();
        }
    },

    // private
    onRemove : function(c){
        Ext.Toolbar.superclass.onRemove.call(this);
        if (c == this.activeMenuBtn) {
            delete this.activeMenuBtn;
        }
        this.trackMenu(c, true);
    },

    // private
    onDisable : function(){
        this.items.each(function(item){
             if(item.disable){
                 item.disable();
             }
        });
    },

    // private
    onEnable : function(){
        this.items.each(function(item){
             if(item.enable){
                 item.enable();
             }
        });
    },

    // private
    onButtonTriggerOver : function(btn){
        if(this.activeMenuBtn && this.activeMenuBtn != btn){
            this.activeMenuBtn.hideMenu();
            btn.showMenu();
            this.activeMenuBtn = btn;
        }
    },

    // private
    onButtonMenuShow : function(btn){
        this.activeMenuBtn = btn;
    },

    // private
    onButtonMenuHide : function(btn){
        delete this.activeMenuBtn;
    }
});
Ext.reg('toolbar', Ext.Toolbar);

/**
 * @class Ext.Toolbar.Item
 * @extends Ext.BoxComponent
 * The base class that other non-interacting Toolbar Item classes should extend in order to
 * get some basic common toolbar item functionality.
 * @constructor
 * Creates a new Item
 * @param {HTMLElement} el
 * @xtype tbitem
 */
T.Item = Ext.extend(Ext.BoxComponent, {
    hideParent: true, //  Hiding a Toolbar.Item hides its containing TD
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
    /**
     * @cfg {String} overflowText Text to be used for the menu if the item is overflowed.
     */
});
Ext.reg('tbitem', T.Item);

/**
 * @class Ext.Toolbar.Separator
 * @extends Ext.Toolbar.Item
 * A simple class that adds a vertical separator bar between toolbar items
 * (css class:<tt>'xtb-sep'</tt>). Example usage:
 * <pre><code>
new Ext.Panel({
    tbar : [
        'Item 1',
        {xtype: 'tbseparator'}, // or '-'
        'Item 2'
    ]
});
</code></pre>
 * @constructor
 * Creates a new Separator
 * @xtype tbseparator
 */
T.Separator = Ext.extend(T.Item, {
    onRender : function(ct, position){
        this.el = ct.createChild({tag:'span', cls:'xtb-sep'}, position);
    }
});
Ext.reg('tbseparator', T.Separator);

/**
 * @class Ext.Toolbar.Spacer
 * @extends Ext.Toolbar.Item
 * A simple element that adds extra horizontal space between items in a toolbar.
 * By default a 2px wide space is added via css specification:<pre><code>
.x-toolbar .xtb-spacer {
    width:2px;
}
 * </code></pre>
 * <p>Example usage:</p>
 * <pre><code>
new Ext.Panel({
    tbar : [
        'Item 1',
        {xtype: 'tbspacer'}, // or ' '
        'Item 2',
        // space width is also configurable via javascript
        {xtype: 'tbspacer', width: 50}, // add a 50px space
        'Item 3'
    ]
});
</code></pre>
 * @constructor
 * Creates a new Spacer
 * @xtype tbspacer
 */
T.Spacer = Ext.extend(T.Item, {
    /**
     * @cfg {Number} width
     * The width of the spacer in pixels (defaults to 2px via css style <tt>.x-toolbar .xtb-spacer</tt>).
     */

    onRender : function(ct, position){
        this.el = ct.createChild({tag:'div', cls:'xtb-spacer', style: this.width?'width:'+this.width+'px':''}, position);
    }
});
Ext.reg('tbspacer', T.Spacer);

/**
 * @class Ext.Toolbar.Fill
 * @extends Ext.Toolbar.Spacer
 * A non-rendering placeholder item which instructs the Toolbar's Layout to begin using
 * the right-justified button container.
 * <pre><code>
new Ext.Panel({
    tbar : [
        'Item 1',
        {xtype: 'tbfill'}, // or '->'
        'Item 2'
    ]
});
</code></pre>
 * @constructor
 * Creates a new Fill
 * @xtype tbfill
 */
T.Fill = Ext.extend(T.Item, {
    // private
    render : Ext.emptyFn,
    isFill : true
});
Ext.reg('tbfill', T.Fill);

/**
 * @class Ext.Toolbar.TextItem
 * @extends Ext.Toolbar.Item
 * A simple class that renders text directly into a toolbar
 * (with css class:<tt>'xtb-text'</tt>). Example usage:
 * <pre><code>
new Ext.Panel({
    tbar : [
        {xtype: 'tbtext', text: 'Item 1'} // or simply 'Item 1'
    ]
});
</code></pre>
 * @constructor
 * Creates a new TextItem
 * @param {String/Object} text A text string, or a config object containing a <tt>text</tt> property
 * @xtype tbtext
 */
T.TextItem = Ext.extend(T.Item, {
    /**
     * @cfg {String} text The text to be used as innerHTML (html tags are accepted)
     */

    constructor: function(config){
        T.TextItem.superclass.constructor.call(this, Ext.isString(config) ? {text: config} : config);
    },

    // private
    onRender : function(ct, position) {
        this.autoEl = {cls: 'xtb-text', html: this.text || ''};
        T.TextItem.superclass.onRender.call(this, ct, position);
    },

    /**
     * Updates this item's text, setting the text to be used as innerHTML.
     * @param {String} t The text to display (html accepted).
     */
    setText : function(t) {
        if(this.rendered){
            this.el.update(t);
        }else{
            this.text = t;
        }
    }
});
Ext.reg('tbtext', T.TextItem);

// backwards compat
T.Button = Ext.extend(Ext.Button, {});
T.SplitButton = Ext.extend(Ext.SplitButton, {});
Ext.reg('tbbutton', T.Button);
Ext.reg('tbsplit', T.SplitButton);

})();
