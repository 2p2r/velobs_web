/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.Element
 */
Ext.Element.addMethods({
    /**
     * Convenience method for constructing a KeyMap
     * @param {Number/Array/Object/String} key Either a string with the keys to listen for, the numeric key code, array of key codes or an object with the following options:
     * <code>{key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}</code>
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the specified function is executed. Defaults to this Element.
     * @return {Ext.KeyMap} The KeyMap created
     */
    addKeyListener : function(key, fn, scope){
        var config;
        if(typeof key != 'object' || Ext.isArray(key)){
            config = {
                key: key,
                fn: fn,
                scope: scope
            };
        }else{
            config = {
                key : key.key,
                shift : key.shift,
                ctrl : key.ctrl,
                alt : key.alt,
                fn: fn,
                scope: scope
            };
        }
        return new Ext.KeyMap(this, config);
    },

    /**
     * Creates a KeyMap for this element
     * @param {Object} config The KeyMap config. See {@link Ext.KeyMap} for more details
     * @return {Ext.KeyMap} The KeyMap created
     */
    addKeyMap : function(config){
        return new Ext.KeyMap(this, config);
    }
});

//Import the newly-added Ext.Element functions into CompositeElementLite. We call this here because
//Element.keys.js is the last extra Ext.Element include in the ext-all.js build
Ext.CompositeElementLite.importElementMethods();