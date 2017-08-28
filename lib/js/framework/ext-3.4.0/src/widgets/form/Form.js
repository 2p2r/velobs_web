/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.form.FormPanel
 * @extends Ext.Panel
 * <p>Standard form container.</p>
 *
 * <p><b><u>Layout</u></b></p>
 * <p>By default, FormPanel is configured with <tt>layout:'form'</tt> to use an {@link Ext.layout.FormLayout}
 * layout manager, which styles and renders fields and labels correctly. When nesting additional Containers
 * within a FormPanel, you should ensure that any descendant Containers which host input Fields use the
 * {@link Ext.layout.FormLayout} layout manager.</p>
 *
 * <p><b><u>BasicForm</u></b></p>
 * <p>Although <b>not listed</b> as configuration options of FormPanel, the FormPanel class accepts all
 * of the config options required to configure its internal {@link Ext.form.BasicForm} for:
 * <div class="mdetail-params"><ul>
 * <li>{@link Ext.form.BasicForm#fileUpload file uploads}</li>
 * <li>functionality for {@link Ext.form.BasicForm#doAction loading, validating and submitting} the form</li>
 * </ul></div>
 *
 * <p><b>Note</b>: If subclassing FormPanel, any configuration options for the BasicForm must be applied to
 * the <tt><b>initialConfig</b></tt> property of the FormPanel. Applying {@link Ext.form.BasicForm BasicForm}
 * configuration settings to <b><tt>this</tt></b> will <b>not</b> affect the BasicForm's configuration.</p>
 *
 * <p><b><u>Form Validation</u></b></p>
 * <p>For information on form validation see the following:</p>
 * <div class="mdetail-params"><ul>
 * <li>{@link Ext.form.TextField}</li>
 * <li>{@link Ext.form.VTypes}</li>
 * <li>{@link Ext.form.BasicForm#doAction BasicForm.doAction <b>clientValidation</b> notes}</li>
 * <li><tt>{@link Ext.form.FormPanel#monitorValid monitorValid}</tt></li>
 * </ul></div>
 *
 * <p><b><u>Form Submission</u></b></p>
 * <p>By default, Ext Forms are submitted through Ajax, using {@link Ext.form.Action}. To enable normal browser
 * submission of the {@link Ext.form.BasicForm BasicForm} contained in this FormPanel, see the
 * <tt><b>{@link Ext.form.BasicForm#standardSubmit standardSubmit}</b></tt> option.</p>
 *
 * @constructor
 * @param {Object} config Configuration options
 * @xtype form
 */
Ext.FormPanel = Ext.extend(Ext.Panel, {
    /**
     * @cfg {String} formId (optional) The id of the FORM tag (defaults to an auto-generated id).
     */
    /**
     * @cfg {Boolean} hideLabels
     * <p><tt>true</tt> to hide field labels by default (sets <tt>display:none</tt>). Defaults to
     * <tt>false</tt>.</p>
     * <p>Also see {@link Ext.Component}.<tt>{@link Ext.Component#hideLabel hideLabel}</tt>.
     */
    /**
     * @cfg {Number} labelPad
     * The default padding in pixels for field labels (defaults to <tt>5</tt>). <tt>labelPad</tt> only
     * applies if <tt>{@link #labelWidth}</tt> is also specified, otherwise it will be ignored.
     */
    /**
     * @cfg {String} labelSeparator
     * See {@link Ext.Component}.<tt>{@link Ext.Component#labelSeparator labelSeparator}</tt>
     */
    /**
     * @cfg {Number} labelWidth The width of labels in pixels. This property cascades to child containers
     * and can be overridden on any child container (e.g., a fieldset can specify a different <tt>labelWidth</tt>
     * for its fields) (defaults to <tt>100</tt>).
     */
    /**
     * @cfg {String} itemCls A css class to apply to the x-form-item of fields. This property cascades to child containers.
     */
    /**
     * @cfg {Array} buttons
     * An array of {@link Ext.Button}s or {@link Ext.Button} configs used to add buttons to the footer of this FormPanel.<br>
     * <p>Buttons in the footer of a FormPanel may be configured with the option <tt>formBind: true</tt>. This causes
     * the form's {@link #monitorValid valid state monitor task} to enable/disable those Buttons depending on
     * the form's valid/invalid state.</p>
     */


    /**
     * @cfg {Number} minButtonWidth Minimum width of all buttons in pixels (defaults to <tt>75</tt>).
     */
    minButtonWidth : 75,

    /**
     * @cfg {String} labelAlign The label alignment value used for the <tt>text-align</tt> specification
     * for the <b>container</b>. Valid values are <tt>"left</tt>", <tt>"top"</tt> or <tt>"right"</tt>
     * (defaults to <tt>"left"</tt>). This property cascades to child <b>containers</b> and can be
     * overridden on any child <b>container</b> (e.g., a fieldset can specify a different <tt>labelAlign</tt>
     * for its fields).
     */
    labelAlign : 'left',

    /**
     * @cfg {Boolean} monitorValid If <tt>true</tt>, the form monitors its valid state <b>client-side</b> and
     * regularly fires the {@link #clientvalidation} event passing that state.<br>
     * <p>When monitoring valid state, the FormPanel enables/disables any of its configured
     * {@link #buttons} which have been configured with <code>formBind: true</code> depending
     * on whether the {@link Ext.form.BasicForm#isValid form is valid} or not. Defaults to <tt>false</tt></p>
     */
    monitorValid : false,

    /**
     * @cfg {Number} monitorPoll The milliseconds to poll valid state, ignored if monitorValid is not true (defaults to 200)
     */
    monitorPoll : 200,

    /**
     * @cfg {String} layout Defaults to <tt>'form'</tt>.  Normally this configuration property should not be altered.
     * For additional details see {@link Ext.layout.FormLayout} and {@link Ext.Container#layout Ext.Container.layout}.
     */
    layout : 'form',

    // private
    initComponent : function(){
        this.form = this.createForm();
        Ext.FormPanel.superclass.initComponent.call(this);

        this.bodyCfg = {
            tag: 'form',
            cls: this.baseCls + '-body',
            method : this.method || 'POST',
            id : this.formId || Ext.id()
        };
        if(this.fileUpload) {
            this.bodyCfg.enctype = 'multipart/form-data';
        }
        this.initItems();

        this.addEvents(
            /**
             * @event clientvalidation
             * If the monitorValid config option is true, this event fires repetitively to notify of valid state
             * @param {Ext.form.FormPanel} this
             * @param {Boolean} valid true if the form has passed client-side validation
             */
            'clientvalidation'
        );

        this.relayEvents(this.form, ['beforeaction', 'actionfailed', 'actioncomplete']);
    },

    // private
    createForm : function(){
        var config = Ext.applyIf({listeners: {}}, this.initialConfig);
        return new Ext.form.BasicForm(null, config);
    },

    // private
    initFields : function(){
        var f = this.form;
        var formPanel = this;
        var fn = function(c){
            if(formPanel.isField(c)){
                f.add(c);
            }else if(c.findBy && c != formPanel){
                formPanel.applySettings(c);
                //each check required for check/radio groups.
                if(c.items && c.items.each){
                    c.items.each(fn, this);
                }
            }
        };
        this.items.each(fn, this);
    },

    // private
    applySettings: function(c){
        var ct = c.ownerCt;
        Ext.applyIf(c, {
            labelAlign: ct.labelAlign,
            labelWidth: ct.labelWidth,
            itemCls: ct.itemCls
        });
    },

    // private
    getLayoutTarget : function(){
        return this.form.el;
    },

    /**
     * Provides access to the {@link Ext.form.BasicForm Form} which this Panel contains.
     * @return {Ext.form.BasicForm} The {@link Ext.form.BasicForm Form} which this Panel contains.
     */
    getForm : function(){
        return this.form;
    },

    // private
    onRender : function(ct, position){
        this.initFields();
        Ext.FormPanel.superclass.onRender.call(this, ct, position);
        this.form.initEl(this.body);
    },

    // private
    beforeDestroy : function(){
        this.stopMonitoring();
        this.form.destroy(true);
        Ext.FormPanel.superclass.beforeDestroy.call(this);
    },

    // Determine if a Component is usable as a form Field.
    isField : function(c) {
        return !!c.setValue && !!c.getValue && !!c.markInvalid && !!c.clearInvalid;
    },

    // private
    initEvents : function(){
        Ext.FormPanel.superclass.initEvents.call(this);
        // Listeners are required here to catch bubbling events from children.
        this.on({
            scope: this,
            add: this.onAddEvent,
            remove: this.onRemoveEvent
        });
        if(this.monitorValid){ // initialize after render
            this.startMonitoring();
        }
    },

    // private
    onAdd: function(c){
        Ext.FormPanel.superclass.onAdd.call(this, c);
        this.processAdd(c);
    },

    // private
    onAddEvent: function(ct, c){
        if(ct !== this){
            this.processAdd(c);
        }
    },

    // private
    processAdd : function(c){
        // If a single form Field, add it
        if(this.isField(c)){
            this.form.add(c);
        // If a Container, add any Fields it might contain
        }else if(c.findBy){
            this.applySettings(c);
            this.form.add.apply(this.form, c.findBy(this.isField));
        }
    },

    // private
    onRemove: function(c){
        Ext.FormPanel.superclass.onRemove.call(this, c);
        this.processRemove(c);
    },

    onRemoveEvent: function(ct, c){
        if(ct !== this){
            this.processRemove(c);
        }
    },

    // private
    processRemove: function(c){
        if(!this.destroying){
            // If a single form Field, remove it
            if(this.isField(c)){
                this.form.remove(c);
            // If a Container, its already destroyed by the time it gets here.  Remove any references to destroyed fields.
            }else if (c.findBy){
                Ext.each(c.findBy(this.isField), this.form.remove, this.form);
                /*
                 * This isn't the most efficient way of getting rid of the items, however it's the most
                 * correct, which in this case is most important.
                 */
                this.form.cleanDestroyed();
            }
        }
    },

    /**
     * Starts monitoring of the valid state of this form. Usually this is done by passing the config
     * option "monitorValid"
     */
    startMonitoring : function(){
        if(!this.validTask){
            this.validTask = new Ext.util.TaskRunner();
            this.validTask.start({
                run : this.bindHandler,
                interval : this.monitorPoll || 200,
                scope: this
            });
        }
    },

    /**
     * Stops monitoring of the valid state of this form
     */
    stopMonitoring : function(){
        if(this.validTask){
            this.validTask.stopAll();
            this.validTask = null;
        }
    },

    /**
     * This is a proxy for the underlying BasicForm's {@link Ext.form.BasicForm#load} call.
     * @param {Object} options The options to pass to the action (see {@link Ext.form.BasicForm#doAction} for details)
     */
    load : function(){
        this.form.load.apply(this.form, arguments);
    },

    // private
    onDisable : function(){
        Ext.FormPanel.superclass.onDisable.call(this);
        if(this.form){
            this.form.items.each(function(){
                 this.disable();
            });
        }
    },

    // private
    onEnable : function(){
        Ext.FormPanel.superclass.onEnable.call(this);
        if(this.form){
            this.form.items.each(function(){
                 this.enable();
            });
        }
    },

    // private
    bindHandler : function(){
        var valid = true;
        this.form.items.each(function(f){
            if(!f.isValid(true)){
                valid = false;
                return false;
            }
        });
        if(this.fbar){
            var fitems = this.fbar.items.items;
            for(var i = 0, len = fitems.length; i < len; i++){
                var btn = fitems[i];
                if(btn.formBind === true && btn.disabled === valid){
                    btn.setDisabled(!valid);
                }
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    }
});
Ext.reg('form', Ext.FormPanel);

Ext.form.FormPanel = Ext.FormPanel;
