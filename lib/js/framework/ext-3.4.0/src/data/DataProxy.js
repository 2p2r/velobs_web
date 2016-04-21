/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.data.DataProxy
 * @extends Ext.util.Observable
 * <p>Abstract base class for implementations which provide retrieval of unformatted data objects.
 * This class is intended to be extended and should not be created directly. For existing implementations,
 * see {@link Ext.data.DirectProxy}, {@link Ext.data.HttpProxy}, {@link Ext.data.ScriptTagProxy} and
 * {@link Ext.data.MemoryProxy}.</p>
 * <p>DataProxy implementations are usually used in conjunction with an implementation of {@link Ext.data.DataReader}
 * (of the appropriate type which knows how to parse the data object) to provide a block of
 * {@link Ext.data.Records} to an {@link Ext.data.Store}.</p>
 * <p>The parameter to a DataProxy constructor may be an {@link Ext.data.Connection} or can also be the
 * config object to an {@link Ext.data.Connection}.</p>
 * <p>Custom implementations must implement either the <code><b>doRequest</b></code> method (preferred) or the
 * <code>load</code> method (deprecated). See
 * {@link Ext.data.HttpProxy}.{@link Ext.data.HttpProxy#doRequest doRequest} or
 * {@link Ext.data.HttpProxy}.{@link Ext.data.HttpProxy#load load} for additional details.</p>
 * <p><b><u>Example 1</u></b></p>
 * <pre><code>
proxy: new Ext.data.ScriptTagProxy({
    {@link Ext.data.Connection#url url}: 'http://extjs.com/forum/topics-remote.php'
}),
 * </code></pre>
 * <p><b><u>Example 2</u></b></p>
 * <pre><code>
proxy : new Ext.data.HttpProxy({
    {@link Ext.data.Connection#method method}: 'GET',
    {@link Ext.data.HttpProxy#prettyUrls prettyUrls}: false,
    {@link Ext.data.Connection#url url}: 'local/default.php', // see options parameter for {@link Ext.Ajax#request}
    {@link #api}: {
        // all actions except the following will use above url
        create  : 'local/new.php',
        update  : 'local/update.php'
    }
}),
 * </code></pre>
 * <p>And <b>new in Ext version 3</b>, attach centralized event-listeners upon the DataProxy class itself!  This is a great place
 * to implement a <i>messaging system</i> to centralize your application's user-feedback and error-handling.</p>
 * <pre><code>
// Listen to all "beforewrite" event fired by all proxies.
Ext.data.DataProxy.on('beforewrite', function(proxy, action) {
    console.log('beforewrite: ', action);
});

// Listen to "write" event fired by all proxies
Ext.data.DataProxy.on('write', function(proxy, action, data, res, rs) {
    console.info('write: ', action);
});

// Listen to "exception" event fired by all proxies
Ext.data.DataProxy.on('exception', function(proxy, type, action, exception) {
    console.error(type + action + ' exception);
});
 * </code></pre>
 * <b>Note:</b> These three events are all fired with the signature of the corresponding <i>DataProxy instance</i> event {@link #beforewrite beforewrite}, {@link #write write} and {@link #exception exception}.
 */
Ext.data.DataProxy = function(conn){
    // make sure we have a config object here to support ux proxies.
    // All proxies should now send config into superclass constructor.
    conn = conn || {};

    // This line caused a bug when people use custom Connection object having its own request method.
    // http://extjs.com/forum/showthread.php?t=67194.  Have to set DataProxy config
    //Ext.applyIf(this, conn);

    this.api     = conn.api;
    this.url     = conn.url;
    this.restful = conn.restful;
    this.listeners = conn.listeners;

    // deprecated
    this.prettyUrls = conn.prettyUrls;

    /**
     * @cfg {Object} api
     * Specific urls to call on CRUD action methods "read", "create", "update" and "destroy".
     * Defaults to:<pre><code>
api: {
    read    : undefined,
    create  : undefined,
    update  : undefined,
    destroy : undefined
}
     * </code></pre>
     * <p>The url is built based upon the action being executed <tt>[load|create|save|destroy]</tt>
     * using the commensurate <tt>{@link #api}</tt> property, or if undefined default to the
     * configured {@link Ext.data.Store}.{@link Ext.data.Store#url url}.</p><br>
     * <p>For example:</p>
     * <pre><code>
api: {
    load :    '/controller/load',
    create :  '/controller/new',  // Server MUST return idProperty of new record
    save :    '/controller/update',
    destroy : '/controller/destroy_action'
}

// Alternatively, one can use the object-form to specify each API-action
api: {
    load: {url: 'read.php', method: 'GET'},
    create: 'create.php',
    destroy: 'destroy.php',
    save: 'update.php'
}
     * </code></pre>
     * <p>If the specific URL for a given CRUD action is undefined, the CRUD action request
     * will be directed to the configured <tt>{@link Ext.data.Connection#url url}</tt>.</p>
     * <br><p><b>Note</b>: To modify the URL for an action dynamically the appropriate API
     * property should be modified before the action is requested using the corresponding before
     * action event.  For example to modify the URL associated with the load action:
     * <pre><code>
// modify the url for the action
myStore.on({
    beforeload: {
        fn: function (store, options) {
            // use <tt>{@link Ext.data.HttpProxy#setUrl setUrl}</tt> to change the URL for *just* this request.
            store.proxy.setUrl('changed1.php');

            // set optional second parameter to true to make this URL change
            // permanent, applying this URL for all subsequent requests.
            store.proxy.setUrl('changed1.php', true);

            // Altering the proxy API should be done using the public
            // method <tt>{@link Ext.data.DataProxy#setApi setApi}</tt>.
            store.proxy.setApi('read', 'changed2.php');

            // Or set the entire API with a config-object.
            // When using the config-object option, you must redefine the <b>entire</b>
            // API -- not just a specific action of it.
            store.proxy.setApi({
                read    : 'changed_read.php',
                create  : 'changed_create.php',
                update  : 'changed_update.php',
                destroy : 'changed_destroy.php'
            });
        }
    }
});
     * </code></pre>
     * </p>
     */

    this.addEvents(
        /**
         * @event exception
         * <p>Fires if an exception occurs in the Proxy during a remote request. This event is relayed
         * through a corresponding {@link Ext.data.Store}.{@link Ext.data.Store#exception exception},
         * so any Store instance may observe this event.</p>
         * <p>In addition to being fired through the DataProxy instance that raised the event, this event is also fired
         * through the Ext.data.DataProxy <i>class</i> to allow for centralized processing of exception events from <b>all</b>
         * DataProxies by attaching a listener to the Ext.data.DataProxy class itself.</p>
         * <p>This event can be fired for one of two reasons:</p>
         * <div class="mdetail-params"><ul>
         * <li>remote-request <b>failed</b> : <div class="sub-desc">
         * The server did not return status === 200.
         * </div></li>
         * <li>remote-request <b>succeeded</b> : <div class="sub-desc">
         * The remote-request succeeded but the reader could not read the response.
         * This means the server returned data, but the configured Reader threw an
         * error while reading the response.  In this case, this event will be
         * raised and the caught error will be passed along into this event.
         * </div></li>
         * </ul></div>
         * <br><p>This event fires with two different contexts based upon the 2nd
         * parameter <tt>type [remote|response]</tt>.  The first four parameters
         * are identical between the two contexts -- only the final two parameters
         * differ.</p>
         * @param {DataProxy} this The proxy that sent the request
         * @param {String} type
         * <p>The value of this parameter will be either <tt>'response'</tt> or <tt>'remote'</tt>.</p>
         * <div class="mdetail-params"><ul>
         * <li><b><tt>'response'</tt></b> : <div class="sub-desc">
         * <p>An <b>invalid</b> response from the server was returned: either 404,
         * 500 or the response meta-data does not match that defined in the DataReader
         * (e.g.: root, idProperty, successProperty).</p>
         * </div></li>
         * <li><b><tt>'remote'</tt></b> : <div class="sub-desc">
         * <p>A <b>valid</b> response was returned from the server having
         * successProperty === false.  This response might contain an error-message
         * sent from the server.  For example, the user may have failed
         * authentication/authorization or a database validation error occurred.</p>
         * </div></li>
         * </ul></div>
         * @param {String} action Name of the action (see {@link Ext.data.Api#actions}.
         * @param {Object} options The options for the action that were specified in the {@link #request}.
         * @param {Object} response
         * <p>The value of this parameter depends on the value of the <code>type</code> parameter:</p>
         * <div class="mdetail-params"><ul>
         * <li><b><tt>'response'</tt></b> : <div class="sub-desc">
         * <p>The raw browser response object (e.g.: XMLHttpRequest)</p>
         * </div></li>
         * <li><b><tt>'remote'</tt></b> : <div class="sub-desc">
         * <p>The decoded response object sent from the server.</p>
         * </div></li>
         * </ul></div>
         * @param {Mixed} arg
         * <p>The type and value of this parameter depends on the value of the <code>type</code> parameter:</p>
         * <div class="mdetail-params"><ul>
         * <li><b><tt>'response'</tt></b> : Error<div class="sub-desc">
         * <p>The JavaScript Error object caught if the configured Reader could not read the data.
         * If the remote request returns success===false, this parameter will be null.</p>
         * </div></li>
         * <li><b><tt>'remote'</tt></b> : Record/Record[]<div class="sub-desc">
         * <p>This parameter will only exist if the <tt>action</tt> was a <b>write</b> action
         * (Ext.data.Api.actions.create|update|destroy).</p>
         * </div></li>
         * </ul></div>
         */
        'exception',
        /**
         * @event beforeload
         * Fires before a request to retrieve a data object.
         * @param {DataProxy} this The proxy for the request
         * @param {Object} params The params object passed to the {@link #request} function
         */
        'beforeload',
        /**
         * @event load
         * Fires before the load method's callback is called.
         * @param {DataProxy} this The proxy for the request
         * @param {Object} o The request transaction object
         * @param {Object} options The callback's <tt>options</tt> property as passed to the {@link #request} function
         */
        'load',
        /**
         * @event loadexception
         * <p>This event is <b>deprecated</b>.  The signature of the loadexception event
         * varies depending on the proxy, use the catch-all {@link #exception} event instead.
         * This event will fire in addition to the {@link #exception} event.</p>
         * @param {misc} misc See {@link #exception}.
         * @deprecated
         */
        'loadexception',
        /**
         * @event beforewrite
         * <p>Fires before a request is generated for one of the actions Ext.data.Api.actions.create|update|destroy</p>
         * <p>In addition to being fired through the DataProxy instance that raised the event, this event is also fired
         * through the Ext.data.DataProxy <i>class</i> to allow for centralized processing of beforewrite events from <b>all</b>
         * DataProxies by attaching a listener to the Ext.data.DataProxy class itself.</p>
         * @param {DataProxy} this The proxy for the request
         * @param {String} action [Ext.data.Api.actions.create|update|destroy]
         * @param {Record/Record[]} rs The Record(s) to create|update|destroy.
         * @param {Object} params The request <code>params</code> object.  Edit <code>params</code> to add parameters to the request.
         */
        'beforewrite',
        /**
         * @event write
         * <p>Fires before the request-callback is called</p>
         * <p>In addition to being fired through the DataProxy instance that raised the event, this event is also fired
         * through the Ext.data.DataProxy <i>class</i> to allow for centralized processing of write events from <b>all</b>
         * DataProxies by attaching a listener to the Ext.data.DataProxy class itself.</p>
         * @param {DataProxy} this The proxy that sent the request
         * @param {String} action [Ext.data.Api.actions.create|upate|destroy]
         * @param {Object} data The data object extracted from the server-response
         * @param {Object} response The decoded response from server
         * @param {Record/Record[]} rs The Record(s) from Store
         * @param {Object} options The callback's <tt>options</tt> property as passed to the {@link #request} function
         */
        'write'
    );
    Ext.data.DataProxy.superclass.constructor.call(this);

    // Prepare the proxy api.  Ensures all API-actions are defined with the Object-form.
    try {
        Ext.data.Api.prepare(this);
    } catch (e) {
        if (e instanceof Ext.data.Api.Error) {
            e.toConsole();
        }
    }
    // relay each proxy's events onto Ext.data.DataProxy class for centralized Proxy-listening
    Ext.data.DataProxy.relayEvents(this, ['beforewrite', 'write', 'exception']);
};

Ext.extend(Ext.data.DataProxy, Ext.util.Observable, {
    /**
     * @cfg {Boolean} restful
     * <p>Defaults to <tt>false</tt>.  Set to <tt>true</tt> to operate in a RESTful manner.</p>
     * <br><p> Note: this parameter will automatically be set to <tt>true</tt> if the
     * {@link Ext.data.Store} it is plugged into is set to <code>restful: true</code>. If the
     * Store is RESTful, there is no need to set this option on the proxy.</p>
     * <br><p>RESTful implementations enable the serverside framework to automatically route
     * actions sent to one url based upon the HTTP method, for example:
     * <pre><code>
store: new Ext.data.Store({
    restful: true,
    proxy: new Ext.data.HttpProxy({url:'/users'}); // all requests sent to /users
    ...
)}
     * </code></pre>
     * If there is no <code>{@link #api}</code> specified in the configuration of the proxy,
     * all requests will be marshalled to a single RESTful url (/users) so the serverside
     * framework can inspect the HTTP Method and act accordingly:
     * <pre>
<u>Method</u>   <u>url</u>        <u>action</u>
POST     /users     create
GET      /users     read
PUT      /users/23  update
DESTROY  /users/23  delete
     * </pre></p>
     * <p>If set to <tt>true</tt>, a {@link Ext.data.Record#phantom non-phantom} record's
     * {@link Ext.data.Record#id id} will be appended to the url. Some MVC (e.g., Ruby on Rails,
     * Merb and Django) support segment based urls where the segments in the URL follow the
     * Model-View-Controller approach:<pre><code>
     * someSite.com/controller/action/id
     * </code></pre>
     * Where the segments in the url are typically:<div class="mdetail-params"><ul>
     * <li>The first segment : represents the controller class that should be invoked.</li>
     * <li>The second segment : represents the class function, or method, that should be called.</li>
     * <li>The third segment : represents the ID (a variable typically passed to the method).</li>
     * </ul></div></p>
     * <br><p>Refer to <code>{@link Ext.data.DataProxy#api}</code> for additional information.</p>
     */
    restful: false,

    /**
     * <p>Redefines the Proxy's API or a single action of an API. Can be called with two method signatures.</p>
     * <p>If called with an object as the only parameter, the object should redefine the <b>entire</b> API, e.g.:</p><pre><code>
proxy.setApi({
    read    : '/users/read',
    create  : '/users/create',
    update  : '/users/update',
    destroy : '/users/destroy'
});
</code></pre>
     * <p>If called with two parameters, the first parameter should be a string specifying the API action to
     * redefine and the second parameter should be the URL (or function if using DirectProxy) to call for that action, e.g.:</p><pre><code>
proxy.setApi(Ext.data.Api.actions.read, '/users/new_load_url');
</code></pre>
     * @param {String/Object} api An API specification object, or the name of an action.
     * @param {String/Function} url The URL (or function if using DirectProxy) to call for the action.
     */
    setApi : function() {
        if (arguments.length == 1) {
            var valid = Ext.data.Api.isValid(arguments[0]);
            if (valid === true) {
                this.api = arguments[0];
            }
            else {
                throw new Ext.data.Api.Error('invalid', valid);
            }
        }
        else if (arguments.length == 2) {
            if (!Ext.data.Api.isAction(arguments[0])) {
                throw new Ext.data.Api.Error('invalid', arguments[0]);
            }
            this.api[arguments[0]] = arguments[1];
        }
        Ext.data.Api.prepare(this);
    },

    /**
     * Returns true if the specified action is defined as a unique action in the api-config.
     * request.  If all API-actions are routed to unique urls, the xaction parameter is unecessary.  However, if no api is defined
     * and all Proxy actions are routed to DataProxy#url, the server-side will require the xaction parameter to perform a switch to
     * the corresponding code for CRUD action.
     * @param {String [Ext.data.Api.CREATE|READ|UPDATE|DESTROY]} action
     * @return {Boolean}
     */
    isApiAction : function(action) {
        return (this.api[action]) ? true : false;
    },

    /**
     * All proxy actions are executed through this method.  Automatically fires the "before" + action event
     * @param {String} action Name of the action
     * @param {Ext.data.Record/Ext.data.Record[]/null} rs Will be null when action is 'load'
     * @param {Object} params
     * @param {Ext.data.DataReader} reader
     * @param {Function} callback
     * @param {Object} scope The scope (<code>this</code> reference) in which the callback function is executed. Defaults to the Proxy object.
     * @param {Object} options Any options specified for the action (e.g. see {@link Ext.data.Store#load}.
     */
    request : function(action, rs, params, reader, callback, scope, options) {
        if (!this.api[action] && !this.load) {
            throw new Ext.data.DataProxy.Error('action-undefined', action);
        }
        params = params || {};
        if ((action === Ext.data.Api.actions.read) ? this.fireEvent("beforeload", this, params) : this.fireEvent("beforewrite", this, action, rs, params) !== false) {
            this.doRequest.apply(this, arguments);
        }
        else {
            callback.call(scope || this, null, options, false);
        }
    },


    /**
     * <b>Deprecated</b> load method using old method signature. See {@doRequest} for preferred method.
     * @deprecated
     * @param {Object} params
     * @param {Object} reader
     * @param {Object} callback
     * @param {Object} scope
     * @param {Object} arg
     */
    load : null,

    /**
     * @cfg {Function} doRequest Abstract method that should be implemented in all subclasses.  <b>Note:</b> Should only be used by custom-proxy developers.
     * (e.g.: {@link Ext.data.HttpProxy#doRequest HttpProxy.doRequest},
     * {@link Ext.data.DirectProxy#doRequest DirectProxy.doRequest}).
     */
    doRequest : function(action, rs, params, reader, callback, scope, options) {
        // default implementation of doRequest for backwards compatibility with 2.0 proxies.
        // If we're executing here, the action is probably "load".
        // Call with the pre-3.0 method signature.
        this.load(params, reader, callback, scope, options);
    },

    /**
     * @cfg {Function} onRead Abstract method that should be implemented in all subclasses.  <b>Note:</b> Should only be used by custom-proxy developers.  Callback for read {@link Ext.data.Api#actions action}.
     * @param {String} action Action name as per {@link Ext.data.Api.actions#read}.
     * @param {Object} o The request transaction object
     * @param {Object} res The server response
     * @fires loadexception (deprecated)
     * @fires exception
     * @fires load
     * @protected
     */
    onRead : Ext.emptyFn,
    /**
     * @cfg {Function} onWrite Abstract method that should be implemented in all subclasses.  <b>Note:</b> Should only be used by custom-proxy developers.  Callback for <i>create, update and destroy</i> {@link Ext.data.Api#actions actions}.
     * @param {String} action [Ext.data.Api.actions.create|read|update|destroy]
     * @param {Object} trans The request transaction object
     * @param {Object} res The server response
     * @fires exception
     * @fires write
     * @protected
     */
    onWrite : Ext.emptyFn,
    /**
     * buildUrl
     * Sets the appropriate url based upon the action being executed.  If restful is true, and only a single record is being acted upon,
     * url will be built Rails-style, as in "/controller/action/32".  restful will aply iff the supplied record is an
     * instance of Ext.data.Record rather than an Array of them.
     * @param {String} action The api action being executed [read|create|update|destroy]
     * @param {Ext.data.Record/Ext.data.Record[]} record The record or Array of Records being acted upon.
     * @return {String} url
     * @private
     */
    buildUrl : function(action, record) {
        record = record || null;

        // conn.url gets nullified after each request.  If it's NOT null here, that means the user must have intervened with a call
        // to DataProxy#setUrl or DataProxy#setApi and changed it before the request was executed.  If that's the case, use conn.url,
        // otherwise, build the url from the api or this.url.
        var url = (this.conn && this.conn.url) ? this.conn.url : (this.api[action]) ? this.api[action].url : this.url;
        if (!url) {
            throw new Ext.data.Api.Error('invalid-url', action);
        }

        // look for urls having "provides" suffix used in some MVC frameworks like Rails/Merb and others.  The provides suffice informs
        // the server what data-format the client is dealing with and returns data in the same format (eg: application/json, application/xml, etc)
        // e.g.: /users.json, /users.xml, etc.
        // with restful routes, we need urls like:
        // PUT /users/1.json
        // DELETE /users/1.json
        var provides = null;
        var m = url.match(/(.*)(\.json|\.xml|\.html)$/);
        if (m) {
            provides = m[2];    // eg ".json"
            url      = m[1];    // eg: "/users"
        }
        // prettyUrls is deprectated in favor of restful-config
        if ((this.restful === true || this.prettyUrls === true) && record instanceof Ext.data.Record && !record.phantom) {
            url += '/' + record.id;
        }
        return (provides === null) ? url : url + provides;
    },

    /**
     * Destroys the proxy by purging any event listeners and cancelling any active requests.
     */
    destroy: function(){
        this.purgeListeners();
    }
});

// Apply the Observable prototype to the DataProxy class so that proxy instances can relay their
// events to the class.  Allows for centralized listening of all proxy instances upon the DataProxy class.
Ext.apply(Ext.data.DataProxy, Ext.util.Observable.prototype);
Ext.util.Observable.call(Ext.data.DataProxy);

/**
 * @class Ext.data.DataProxy.Error
 * @extends Ext.Error
 * DataProxy Error extension.
 * constructor
 * @param {String} message Message describing the error.
 * @param {Record/Record[]} arg
 */
Ext.data.DataProxy.Error = Ext.extend(Ext.Error, {
    constructor : function(message, arg) {
        this.arg = arg;
        Ext.Error.call(this, message);
    },
    name: 'Ext.data.DataProxy'
});
Ext.apply(Ext.data.DataProxy.Error.prototype, {
    lang: {
        'action-undefined': "DataProxy attempted to execute an API-action but found an undefined url / function.  Please review your Proxy url/api-configuration.",
        'api-invalid': 'Recieved an invalid API-configuration.  Please ensure your proxy API-configuration contains only the actions from Ext.data.Api.actions.'
    }
});


