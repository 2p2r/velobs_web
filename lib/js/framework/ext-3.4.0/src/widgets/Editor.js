/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.Editor
 * @extends Ext.Component
 * A base editor field that handles displaying/hiding on demand and has some built-in sizing and event handling logic.
 * @constructor
 * Create a new Editor
 * @param {Object} config The config object
 * @xtype editor
 */
Ext.Editor = function(field, config){
    if(field.field){
        this.field = Ext.create(field.field, 'textfield');
        config = Ext.apply({}, field); // copy so we don't disturb original config
        delete config.field;
    }else{
        this.field = field;
    }
    Ext.Editor.superclass.constructor.call(this, config);
};

Ext.extend(Ext.Editor, Ext.Component, {
    /**
    * @cfg {Ext.form.Field} field
    * The Field object (or descendant) or config object for field
    */
    /**
     * @cfg {Boolean} allowBlur
     * True to {@link #completeEdit complete the editing process} if in edit mode when the
     * field is blurred. Defaults to <tt>true</tt>.
     */
    allowBlur: true,
    /**
     * @cfg {Boolean/String} autoSize
     * True for the editor to automatically adopt the size of the underlying field, "width" to adopt the width only,
     * or "height" to adopt the height only, "none" to always use the field dimensions. (defaults to false)
     */
    /**
     * @cfg {Boolean} revertInvalid
     * True to automatically revert the field value and cancel the edit when the user completes an edit and the field
     * validation fails (defaults to true)
     */
    /**
     * @cfg {Boolean} ignoreNoChange
     * True to skip the edit completion process (no save, no events fired) if the user completes an edit and
     * the value has not changed (defaults to false).  Applies only to string values - edits for other data types
     * will never be ignored.
     */
    /**
     * @cfg {Boolean} hideEl
     * False to keep the bound element visible while the editor is displayed (defaults to true)
     */
    /**
     * @cfg {Mixed} value
     * The data value of the underlying field (defaults to "")
     */
    value : "",
    /**
     * @cfg {String} alignment
     * The position to align to (see {@link Ext.Element#alignTo} for more details, defaults to "c-c?").
     */
    alignment: "c-c?",
    /**
     * @cfg {Array} offsets
     * The offsets to use when aligning (see {@link Ext.Element#alignTo} for more details. Defaults to <tt>[0, 0]</tt>.
     */
    offsets: [0, 0],
    /**
     * @cfg {Boolean/String} shadow "sides" for sides/bottom only, "frame" for 4-way shadow, and "drop"
     * for bottom-right shadow (defaults to "frame")
     */
    shadow : "frame",
    /**
     * @cfg {Boolean} constrain True to constrain the editor to the viewport
     */
    constrain : false,
    /**
     * @cfg {Boolean} swallowKeys Handle the keydown/keypress events so they don't propagate (defaults to true)
     */
    swallowKeys : true,
    /**
     * @cfg {Boolean} completeOnEnter True to complete the edit when the enter key is pressed. Defaults to <tt>true</tt>.
     */
    completeOnEnter : true,
    /**
     * @cfg {Boolean} cancelOnEsc True to cancel the edit when the escape key is pressed. Defaults to <tt>true</tt>.
     */
    cancelOnEsc : true,
    /**
     * @cfg {Boolean} updateEl True to update the innerHTML of the bound element when the update completes (defaults to false)
     */
    updateEl : false,

    initComponent : function(){
        Ext.Editor.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event beforestartedit
             * Fires when editing is initiated, but before the value changes.  Editing can be canceled by returning
             * false from the handler of this event.
             * @param {Editor} this
             * @param {Ext.Element} boundEl The underlying element bound to this editor
             * @param {Mixed} value The field value being set
             */
            "beforestartedit",
            /**
             * @event startedit
             * Fires when this editor is displayed
             * @param {Ext.Element} boundEl The underlying element bound to this editor
             * @param {Mixed} value The starting field value
             */
            "startedit",
            /**
             * @event beforecomplete
             * Fires after a change has been made to the field, but before the change is reflected in the underlying
             * field.  Saving the change to the field can be canceled by returning false from the handler of this event.
             * Note that if the value has not changed and ignoreNoChange = true, the editing will still end but this
             * event will not fire since no edit actually occurred.
             * @param {Editor} this
             * @param {Mixed} value The current field value
             * @param {Mixed} startValue The original field value
             */
            "beforecomplete",
            /**
             * @event complete
             * Fires after editing is complete and any changed value has been written to the underlying field.
             * @param {Editor} this
             * @param {Mixed} value The current field value
             * @param {Mixed} startValue The original field value
             */
            "complete",
            /**
             * @event canceledit
             * Fires after editing has been canceled and the editor's value has been reset.
             * @param {Editor} this
             * @param {Mixed} value The user-entered field value that was discarded
             * @param {Mixed} startValue The original field value that was set back into the editor after cancel
             */
            "canceledit",
            /**
             * @event specialkey
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
             * {@link Ext.EventObject#getKey} to determine which key was pressed.
             * @param {Ext.form.Field} this
             * @param {Ext.EventObject} e The event object
             */
            "specialkey"
        );
    },

    // private
    onRender : function(ct, position){
        this.el = new Ext.Layer({
            shadow: this.shadow,
            cls: "x-editor",
            parentEl : ct,
            shim : this.shim,
            shadowOffset: this.shadowOffset || 4,
            id: this.id,
            constrain: this.constrain
        });
        if(this.zIndex){
            this.el.setZIndex(this.zIndex);
        }
        this.el.setStyle("overflow", Ext.isGecko ? "auto" : "hidden");
        if(this.field.msgTarget != 'title'){
            this.field.msgTarget = 'qtip';
        }
        this.field.inEditor = true;
        this.mon(this.field, {
            scope: this,
            blur: this.onBlur,
            specialkey: this.onSpecialKey
        });
        if(this.field.grow){
            this.mon(this.field, "autosize", this.el.sync,  this.el, {delay:1});
        }
        this.field.render(this.el).show();
        this.field.getEl().dom.name = '';
        if(this.swallowKeys){
            this.field.el.swallowEvent([
                'keypress', // *** Opera
                'keydown'   // *** all other browsers
            ]);
        }
    },

    // private
    onSpecialKey : function(field, e){
        var key = e.getKey(),
            complete = this.completeOnEnter && key == e.ENTER,
            cancel = this.cancelOnEsc && key == e.ESC;
        if(complete || cancel){
            e.stopEvent();
            if(complete){
                this.completeEdit();
            }else{
                this.cancelEdit();
            }
            if(field.triggerBlur){
                field.triggerBlur();
            }
        }
        this.fireEvent('specialkey', field, e);
    },

    /**
     * Starts the editing process and shows the editor.
     * @param {Mixed} el The element to edit
     * @param {String} value (optional) A value to initialize the editor with. If a value is not provided, it defaults
      * to the innerHTML of el.
     */
    startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Ext.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) !== false){
            this.startValue = v;
            this.field.reset();
            this.field.setValue(v);
            this.realign(true);
            this.editing = true;
            this.show();
        }
    },

    // private
    doAutoSize : function(){
        if(this.autoSize){
            var sz = this.boundEl.getSize(),
                fs = this.field.getSize();

            switch(this.autoSize){
                case "width":
                    this.setSize(sz.width, fs.height);
                    break;
                case "height":
                    this.setSize(fs.width, sz.height);
                    break;
                case "none":
                    this.setSize(fs.width, fs.height);
                    break;
                default:
                    this.setSize(sz.width, sz.height);
            }
        }
    },

    /**
     * Sets the height and width of this editor.
     * @param {Number} width The new width
     * @param {Number} height The new height
     */
    setSize : function(w, h){
        delete this.field.lastSize;
        this.field.setSize(w, h);
        if(this.el){
            // IE7 in strict mode doesn't size properly.
            if(Ext.isGecko2 || Ext.isOpera || (Ext.isIE7 && Ext.isStrict)){
                // prevent layer scrollbars
                this.el.setSize(w, h);
            }
            this.el.sync();
        }
    },

    /**
     * Realigns the editor to the bound field based on the current alignment config value.
     * @param {Boolean} autoSize (optional) True to size the field to the dimensions of the bound element.
     */
    realign : function(autoSize){
        if(autoSize === true){
            this.doAutoSize();
        }
        this.el.alignTo(this.boundEl, this.alignment, this.offsets);
    },

    /**
     * Ends the editing process, persists the changed value to the underlying field, and hides the editor.
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after edit (defaults to false)
     */
    completeEdit : function(remainVisible){
        if(!this.editing){
            return;
        }
        // Assert combo values first
        if (this.field.assertValue) {
            this.field.assertValue();
        }
        var v = this.getValue();
        if(!this.field.isValid()){
            if(this.revertInvalid !== false){
                this.cancelEdit(remainVisible);
            }
            return;
        }
        if(String(v) === String(this.startValue) && this.ignoreNoChange){
            this.hideEdit(remainVisible);
            return;
        }
        if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
            v = this.getValue();
            if(this.updateEl && this.boundEl){
                this.boundEl.update(v);
            }
            this.hideEdit(remainVisible);
            this.fireEvent("complete", this, v, this.startValue);
        }
    },

    // private
    onShow : function(){
        this.el.show();
        if(this.hideEl !== false){
            this.boundEl.hide();
        }
        this.field.show().focus(false, true);
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },

    /**
     * Cancels the editing process and hides the editor without persisting any changes.  The field value will be
     * reverted to the original starting value.
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after
     * cancel (defaults to false)
     */
    cancelEdit : function(remainVisible){
        if(this.editing){
            var v = this.getValue();
            this.setValue(this.startValue);
            this.hideEdit(remainVisible);
            this.fireEvent("canceledit", this, v, this.startValue);
        }
    },

    // private
    hideEdit: function(remainVisible){
        if(remainVisible !== true){
            this.editing = false;
            this.hide();
        }
    },

    // private
    onBlur : function(){
        // selectSameEditor flag allows the same editor to be started without onBlur firing on itself
        if(this.allowBlur === true && this.editing && this.selectSameEditor !== true){
            this.completeEdit();
        }
    },

    // private
    onHide : function(){
        if(this.editing){
            this.completeEdit();
            return;
        }
        this.field.blur();
        if(this.field.collapse){
            this.field.collapse();
        }
        this.el.hide();
        if(this.hideEl !== false){
            this.boundEl.show();
        }
    },

    /**
     * Sets the data value of the editor
     * @param {Mixed} value Any valid value supported by the underlying field
     */
    setValue : function(v){
        this.field.setValue(v);
    },

    /**
     * Gets the data value of the editor
     * @return {Mixed} The data value
     */
    getValue : function(){
        return this.field.getValue();
    },

    beforeDestroy : function(){
        Ext.destroyMembers(this, 'field');

        delete this.parentEl;
        delete this.boundEl;
    }
});
Ext.reg('editor', Ext.Editor);
