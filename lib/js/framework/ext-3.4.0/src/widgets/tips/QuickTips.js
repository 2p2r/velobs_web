/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.QuickTips
 * <p>Provides attractive and customizable tooltips for any element. The QuickTips
 * singleton is used to configure and manage tooltips globally for multiple elements
 * in a generic manner.  To create individual tooltips with maximum customizability,
 * you should consider either {@link Ext.Tip} or {@link Ext.ToolTip}.</p>
 * <p>Quicktips can be configured via tag attributes directly in markup, or by
 * registering quick tips programmatically via the {@link #register} method.</p>
 * <p>The singleton's instance of {@link Ext.QuickTip} is available via
 * {@link #getQuickTip}, and supports all the methods, and all the all the
 * configuration properties of Ext.QuickTip. These settings will apply to all
 * tooltips shown by the singleton.</p>
 * <p>Below is the summary of the configuration properties which can be used.
 * For detailed descriptions see the config options for the {@link Ext.QuickTip QuickTip} class</p>
 * <p><b>QuickTips singleton configs (all are optional)</b></p>
 * <div class="mdetail-params"><ul><li>dismissDelay</li>
 * <li>hideDelay</li>
 * <li>maxWidth</li>
 * <li>minWidth</li>
 * <li>showDelay</li>
 * <li>trackMouse</li></ul></div>
 * <p><b>Target element configs (optional unless otherwise noted)</b></p>
 * <div class="mdetail-params"><ul><li>autoHide</li>
 * <li>cls</li>
 * <li>dismissDelay (overrides singleton value)</li>
 * <li>target (required)</li>
 * <li>text (required)</li>
 * <li>title</li>
 * <li>width</li></ul></div>
 * <p>Here is an example showing how some of these config options could be used:</p>
 * <pre><code>
// Init the singleton.  Any tag-based quick tips will start working.
Ext.QuickTips.init();

// Apply a set of config properties to the singleton
Ext.apply(Ext.QuickTips.getQuickTip(), {
    maxWidth: 200,
    minWidth: 100,
    showDelay: 50,      // Show 50ms after entering target
    trackMouse: true
});

// Manually register a quick tip for a specific element
Ext.QuickTips.register({
    target: 'my-div',
    title: 'My Tooltip',
    text: 'This tooltip was added in code',
    width: 100,
    dismissDelay: 10000 // Hide after 10 seconds hover
});
</code></pre>
 * <p>To register a quick tip in markup, you simply add one or more of the valid QuickTip attributes prefixed with
 * the <b>ext:</b> namespace.  The HTML element itself is automatically set as the quick tip target. Here is the summary
 * of supported attributes (optional unless otherwise noted):</p>
 * <ul><li><b>hide</b>: Specifying "user" is equivalent to setting autoHide = false.  Any other value will be the
 * same as autoHide = true.</li>
 * <li><b>qclass</b>: A CSS class to be applied to the quick tip (equivalent to the 'cls' target element config).</li>
 * <li><b>qtip (required)</b>: The quick tip text (equivalent to the 'text' target element config).</li>
 * <li><b>qtitle</b>: The quick tip title (equivalent to the 'title' target element config).</li>
 * <li><b>qwidth</b>: The quick tip width (equivalent to the 'width' target element config).</li></ul>
 * <p>Here is an example of configuring an HTML element to display a tooltip from markup:</p>
 * <pre><code>
// Add a quick tip to an HTML button
&lt;input type="button" value="OK" ext:qtitle="OK Button" ext:qwidth="100"
     ext:qtip="This is a quick tip from markup!">&lt;/input>
</code></pre>
 * @singleton
 */
Ext.QuickTips = function(){
    var tip,
        disabled = false;
        
    return {
        /**
         * Initialize the global QuickTips instance and prepare any quick tips.
         * @param {Boolean} autoRender True to render the QuickTips container immediately to preload images. (Defaults to true) 
         */
        init : function(autoRender){
            if(!tip){
                if(!Ext.isReady){
                    Ext.onReady(function(){
                        Ext.QuickTips.init(autoRender);
                    });
                    return;
                }
                tip = new Ext.QuickTip({
                    elements:'header,body', 
                    disabled: disabled
                });
                if(autoRender !== false){
                    tip.render(Ext.getBody());
                }
            }
        },
        
        // Protected method called by the dd classes
        ddDisable : function(){
            // don't disable it if we don't need to
            if(tip && !disabled){
                tip.disable();
            }    
        },
        
        // Protected method called by the dd classes
        ddEnable : function(){
            // only enable it if it hasn't been disabled
            if(tip && !disabled){
                tip.enable();
            }
        },

        /**
         * Enable quick tips globally.
         */
        enable : function(){
            if(tip){
                tip.enable();
            }
            disabled = false;
        },

        /**
         * Disable quick tips globally.
         */
        disable : function(){
            if(tip){
                tip.disable();
            }
            disabled = true;
        },

        /**
         * Returns true if quick tips are enabled, else false.
         * @return {Boolean}
         */
        isEnabled : function(){
            return tip !== undefined && !tip.disabled;
        },

        /**
         * Gets the single {@link Ext.QuickTip QuickTip} instance used to show tips from all registered elements.
         * @return {Ext.QuickTip}
         */
        getQuickTip : function(){
            return tip;
        },

        /**
         * Configures a new quick tip instance and assigns it to a target element.  See
         * {@link Ext.QuickTip#register} for details.
         * @param {Object} config The config object
         */
        register : function(){
            tip.register.apply(tip, arguments);
        },

        /**
         * Removes any registered quick tip from the target element and destroys it.
         * @param {String/HTMLElement/Element} el The element from which the quick tip is to be removed.
         */
        unregister : function(){
            tip.unregister.apply(tip, arguments);
        },

        /**
         * Alias of {@link #register}.
         * @param {Object} config The config object
         */
        tips : function(){
            tip.register.apply(tip, arguments);
        }
    };
}();