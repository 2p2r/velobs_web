/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.CompositeElement
 * @extends Ext.CompositeElementLite
 * <p>This class encapsulates a <i>collection</i> of DOM elements, providing methods to filter
 * members, or to perform collective actions upon the whole set.</p>
 * <p>Although they are not listed, this class supports all of the methods of {@link Ext.Element} and
 * {@link Ext.Fx}. The methods from these classes will be performed on all the elements in this collection.</p>
 * <p>All methods return <i>this</i> and can be chained.</p>
 * Usage:
<pre><code>
var els = Ext.select("#some-el div.some-class", true);
// or select directly from an existing element
var el = Ext.get('some-el');
el.select('div.some-class', true);

els.setWidth(100); // all elements become 100 width
els.hide(true); // all elements fade out and hide
// or
els.setWidth(100).hide(true);
</code></pre>
 */
Ext.CompositeElement = Ext.extend(Ext.CompositeElementLite, {
    
    constructor : function(els, root){
        this.elements = [];
        this.add(els, root);
    },
    
    // private
    getElement : function(el){
        // In this case just return it, since we already have a reference to it
        return el;
    },
    
    // private
    transformElement : function(el){
        return Ext.get(el);
    }

    /**
    * Adds elements to this composite.
    * @param {String/Array} els A string CSS selector, an array of elements or an element
    * @return {CompositeElement} this
    */

    /**
     * Returns the Element object at the specified index
     * @param {Number} index
     * @return {Ext.Element}
     */

    /**
     * Iterates each <code>element</code> in this <code>composite</code>
     * calling the supplied function using {@link Ext#each}.
     * @param {Function} fn The function to be called with each
     * <code>element</code>. If the supplied function returns <tt>false</tt>,
     * iteration stops. This function is called with the following arguments:
     * <div class="mdetail-params"><ul>
     * <li><code>element</code> : <i>Ext.Element</i><div class="sub-desc">The element at the current <code>index</code>
     * in the <code>composite</code></div></li>
     * <li><code>composite</code> : <i>Object</i> <div class="sub-desc">This composite.</div></li>
     * <li><code>index</code> : <i>Number</i> <div class="sub-desc">The current index within the <code>composite</code> </div></li>
     * </ul></div>
     * @param {Object} scope (optional) The scope (<code><this</code> reference) in which the specified function is executed.
     * Defaults to the <code>element</code> at the current <code>index</code>
     * within the composite.
     * @return {CompositeElement} this
     */
});

/**
 * Selects elements based on the passed CSS selector to enable {@link Ext.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Ext.CompositeElement CompositeElement} or
 * {@link Ext.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {Boolean} unique (optional) true to create a unique Ext.Element for each element (defaults to a shared flyweight object)
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext.Element
 * @method select
 */
Ext.Element.select = function(selector, unique, root){
    var els;
    if(typeof selector == "string"){
        els = Ext.Element.selectorFunction(selector, root);
    }else if(selector.length !== undefined){
        els = selector;
    }else{
        throw "Invalid selector";
    }

    return (unique === true) ? new Ext.CompositeElement(els) : new Ext.CompositeElementLite(els);
};

/**
 * Selects elements based on the passed CSS selector to enable {@link Ext.Element Element} methods
 * to be applied to many related elements in one statement through the returned {@link Ext.CompositeElement CompositeElement} or
 * {@link Ext.CompositeElementLite CompositeElementLite} object.
 * @param {String/Array} selector The CSS selector or an array of elements
 * @param {Boolean} unique (optional) true to create a unique Ext.Element for each element (defaults to a shared flyweight object)
 * @param {HTMLElement/String} root (optional) The root element of the query or id of the root
 * @return {CompositeElementLite/CompositeElement}
 * @member Ext
 * @method select
 */
Ext.select = Ext.Element.select;