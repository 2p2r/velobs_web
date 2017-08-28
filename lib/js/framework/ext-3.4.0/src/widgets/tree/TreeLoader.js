/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.tree.TreeLoader
 * @extends Ext.util.Observable
 * A TreeLoader provides for lazy loading of an {@link Ext.tree.TreeNode}'s child
 * nodes from a specified URL. The response must be a JavaScript Array definition
 * whose elements are node definition objects. e.g.:
 * <pre><code>
    [{
        id: 1,
        text: 'A leaf Node',
        leaf: true
    },{
        id: 2,
        text: 'A folder Node',
        children: [{
            id: 3,
            text: 'A child Node',
            leaf: true
        }]
   }]
</code></pre>
 * <br><br>
 * A server request is sent, and child nodes are loaded only when a node is expanded.
 * The loading node's id is passed to the server under the parameter name "node" to
 * enable the server to produce the correct child nodes.
 * <br><br>
 * To pass extra parameters, an event handler may be attached to the "beforeload"
 * event, and the parameters specified in the TreeLoader's baseParams property:
 * <pre><code>
    myTreeLoader.on("beforeload", function(treeLoader, node) {
        this.baseParams.category = node.attributes.category;
    }, this);
</code></pre>
 * This would pass an HTTP parameter called "category" to the server containing
 * the value of the Node's "category" attribute.
 * @constructor
 * Creates a new Treeloader.
 * @param {Object} config A config object containing config properties.
 */
Ext.tree.TreeLoader = function(config){
    this.baseParams = {};
    Ext.apply(this, config);

    this.addEvents(
        /**
         * @event beforeload
         * Fires before a network request is made to retrieve the Json text which specifies a node's children.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} callback The callback function specified in the {@link #load} call.
         */
        "beforeload",
        /**
         * @event load
         * Fires when the node has been successfuly loaded.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} response The response object containing the data from the server.
         */
        "load",
        /**
         * @event loadexception
         * Fires if the network request failed.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Ext.tree.TreeNode} object being loaded.
         * @param {Object} response The response object containing the data from the server.
         */
        "loadexception"
    );
    Ext.tree.TreeLoader.superclass.constructor.call(this);
    if(Ext.isString(this.paramOrder)){
        this.paramOrder = this.paramOrder.split(/[\s,|]/);
    }
};

Ext.extend(Ext.tree.TreeLoader, Ext.util.Observable, {
    /**
    * @cfg {String} dataUrl The URL from which to request a Json string which
    * specifies an array of node definition objects representing the child nodes
    * to be loaded.
    */
    /**
     * @cfg {String} requestMethod The HTTP request method for loading data (defaults to the value of {@link Ext.Ajax#method}).
     */
    /**
     * @cfg {String} url Equivalent to {@link #dataUrl}.
     */
    /**
     * @cfg {Boolean} preloadChildren If set to true, the loader recursively loads "children" attributes when doing the first load on nodes.
     */
    /**
    * @cfg {Object} baseParams (optional) An object containing properties which
    * specify HTTP parameters to be passed to each request for child nodes.
    */
    /**
    * @cfg {Object} baseAttrs (optional) An object containing attributes to be added to all nodes
    * created by this loader. If the attributes sent by the server have an attribute in this object,
    * they take priority.
    */
    /**
    * @cfg {Object} uiProviders (optional) An object containing properties which
    * specify custom {@link Ext.tree.TreeNodeUI} implementations. If the optional
    * <i>uiProvider</i> attribute of a returned child node is a string rather
    * than a reference to a TreeNodeUI implementation, then that string value
    * is used as a property name in the uiProviders object.
    */
    uiProviders : {},

    /**
    * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove previously existing
    * child nodes before loading.
    */
    clearOnLoad : true,

    /**
     * @cfg {Array/String} paramOrder Defaults to <tt>undefined</tt>. Only used when using directFn.
     * Specifies the params in the order in which they must be passed to the server-side Direct method
     * as either (1) an Array of String values, or (2) a String of params delimited by either whitespace,
     * comma, or pipe. For example,
     * any of the following would be acceptable:<pre><code>
nodeParameter: 'node',
paramOrder: ['param1','param2','param3']
paramOrder: 'node param1 param2 param3'
paramOrder: 'param1,node,param2,param3'
paramOrder: 'param1|param2|param|node'
     </code></pre>
     */
    paramOrder: undefined,

    /**
     * @cfg {Boolean} paramsAsHash Only used when using directFn.
     * Send parameters as a collection of named arguments (defaults to <tt>false</tt>). Providing a
     * <tt>{@link #paramOrder}</tt> nullifies this configuration.
     */
    paramsAsHash: false,

    /**
     * @cfg {String} nodeParameter The name of the parameter sent to the server which contains
     * the identifier of the node. Defaults to <tt>'node'</tt>.
     */
    nodeParameter: 'node',

    /**
     * @cfg {Function} directFn
     * Function to call when executing a request.
     */
    directFn : undefined,

    /**
     * Load an {@link Ext.tree.TreeNode} from the URL specified in the constructor.
     * This is called automatically when a node is expanded, but may be used to reload
     * a node (or append new children if the {@link #clearOnLoad} option is false.)
     * @param {Ext.tree.TreeNode} node
     * @param {Function} callback Function to call after the node has been loaded. The
     * function is passed the TreeNode which was requested to be loaded.
     * @param {Object} scope The scope (<code>this</code> reference) in which the callback is executed.
     * defaults to the loaded TreeNode.
     */
    load : function(node, callback, scope){
        if(this.clearOnLoad){
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
        if(this.doPreload(node)){ // preloaded json children
            this.runCallback(callback, scope || node, [node]);
        }else if(this.directFn || this.dataUrl || this.url){
            this.requestData(node, callback, scope || node);
        }
    },

    doPreload : function(node){
        if(node.attributes.children){
            if(node.childNodes.length < 1){ // preloaded?
                var cs = node.attributes.children;
                node.beginUpdate();
                for(var i = 0, len = cs.length; i < len; i++){
                    var cn = node.appendChild(this.createNode(cs[i]));
                    if(this.preloadChildren){
                        this.doPreload(cn);
                    }
                }
                node.endUpdate();
            }
            return true;
        }
        return false;
    },

    getParams: function(node){
        var bp = Ext.apply({}, this.baseParams),
            np = this.nodeParameter,
            po = this.paramOrder;

        np && (bp[ np ] = node.id);

        if(this.directFn){
            var buf = [node.id];
            if(po){
                // reset 'buf' if the nodeParameter was included in paramOrder
                if(np && po.indexOf(np) > -1){
                    buf = [];
                }

                for(var i = 0, len = po.length; i < len; i++){
                    buf.push(bp[ po[i] ]);
                }
            }else if(this.paramsAsHash){
                buf = [bp];
            }
            return buf;
        }else{
            return bp;
        }
    },

    requestData : function(node, callback, scope){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            if(this.directFn){
                var args = this.getParams(node);
                args.push(this.processDirectResponse.createDelegate(this, [{callback: callback, node: node, scope: scope}], true));
                this.directFn.apply(window, args);
            }else{
                this.transId = Ext.Ajax.request({
                    method:this.requestMethod,
                    url: this.dataUrl||this.url,
                    success: this.handleResponse,
                    failure: this.handleFailure,
                    scope: this,
                    argument: {callback: callback, node: node, scope: scope},
                    params: this.getParams(node)
                });
            }
        }else{
            // if the load is cancelled, make sure we notify
            // the node that we are done
            this.runCallback(callback, scope || node, []);
        }
    },

    processDirectResponse: function(result, response, args){
        if(response.status){
            this.handleResponse({
                responseData: Ext.isArray(result) ? result : null,
                responseText: result,
                argument: args
            });
        }else{
            this.handleFailure({
                argument: args
            });
        }
    },

    // private
    runCallback: function(cb, scope, args){
        if(Ext.isFunction(cb)){
            cb.apply(scope, args);
        }
    },

    isLoading : function(){
        return !!this.transId;
    },

    abort : function(){
        if(this.isLoading()){
            Ext.Ajax.abort(this.transId);
        }
    },

    /**
    * <p>Override this function for custom TreeNode node implementation, or to
    * modify the attributes at creation time.</p>
    * Example:<pre><code>
new Ext.tree.TreePanel({
    ...
    loader: new Ext.tree.TreeLoader({
        url: 'dataUrl',
        createNode: function(attr) {
//          Allow consolidation consignments to have
//          consignments dropped into them.
            if (attr.isConsolidation) {
                attr.iconCls = 'x-consol',
                attr.allowDrop = true;
            }
            return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
        }
    }),
    ...
});
</code></pre>
    * @param attr {Object} The attributes from which to create the new node.
    */
    createNode : function(attr){
        // apply baseAttrs, nice idea Corey!
        if(this.baseAttrs){
            Ext.applyIf(attr, this.baseAttrs);
        }
        if(this.applyLoader !== false && !attr.loader){
            attr.loader = this;
        }
        if(Ext.isString(attr.uiProvider)){
           attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider);
        }
        if(attr.nodeType){
            return new Ext.tree.TreePanel.nodeTypes[attr.nodeType](attr);
        }else{
            return attr.leaf ?
                        new Ext.tree.TreeNode(attr) :
                        new Ext.tree.AsyncTreeNode(attr);
        }
    },

    processResponse : function(response, node, callback, scope){
        var json = response.responseText;
        try {
            var o = response.responseData || Ext.decode(json);
            node.beginUpdate();
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            node.endUpdate();
            this.runCallback(callback, scope || node, [node]);
        }catch(e){
            this.handleFailure(response);
        }
    },

    handleResponse : function(response){
        this.transId = false;
        var a = response.argument;
        this.processResponse(response, a.node, a.callback, a.scope);
        this.fireEvent("load", this, a.node, response);
    },

    handleFailure : function(response){
        this.transId = false;
        var a = response.argument;
        this.fireEvent("loadexception", this, a.node, response);
        this.runCallback(a.callback, a.scope || a.node, [a.node]);
    },

    destroy : function(){
        this.abort();
        this.purgeListeners();
    }
});