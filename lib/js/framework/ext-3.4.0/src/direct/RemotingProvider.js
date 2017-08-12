/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.direct.RemotingProvider
 * @extends Ext.direct.JsonProvider
 * 
 * <p>The {@link Ext.direct.RemotingProvider RemotingProvider} exposes access to
 * server side methods on the client (a remote procedure call (RPC) type of
 * connection where the client can initiate a procedure on the server).</p>
 * 
 * <p>This allows for code to be organized in a fashion that is maintainable,
 * while providing a clear path between client and server, something that is
 * not always apparent when using URLs.</p>
 * 
 * <p>To accomplish this the server-side needs to describe what classes and methods
 * are available on the client-side. This configuration will typically be
 * outputted by the server-side Ext.Direct stack when the API description is built.</p>
 */
Ext.direct.RemotingProvider = Ext.extend(Ext.direct.JsonProvider, {       
    /**
     * @cfg {Object} actions
     * Object literal defining the server side actions and methods. For example, if
     * the Provider is configured with:
     * <pre><code>
"actions":{ // each property within the 'actions' object represents a server side Class 
    "TestAction":[ // array of methods within each server side Class to be   
    {              // stubbed out on client
        "name":"doEcho", 
        "len":1            
    },{
        "name":"multiply",// name of method
        "len":2           // The number of parameters that will be used to create an
                          // array of data to send to the server side function.
                          // Ensure the server sends back a Number, not a String. 
    },{
        "name":"doForm",
        "formHandler":true, // direct the client to use specialized form handling method 
        "len":1
    }]
}
     * </code></pre>
     * <p>Note that a Store is not required, a server method can be called at any time.
     * In the following example a <b>client side</b> handler is used to call the
     * server side method "multiply" in the server-side "TestAction" Class:</p>
     * <pre><code>
TestAction.multiply(
    2, 4, // pass two arguments to server, so specify len=2
    // callback function after the server is called
    // result: the result returned by the server
    //      e: Ext.Direct.RemotingEvent object
    function(result, e){
        var t = e.getTransaction();
        var action = t.action; // server side Class called
        var method = t.method; // server side method called
        if(e.status){
            var answer = Ext.encode(result); // 8
    
        }else{
            var msg = e.message; // failure message
        }
    }
);
     * </code></pre>
     * In the example above, the server side "multiply" function will be passed two
     * arguments (2 and 4).  The "multiply" method should return the value 8 which will be
     * available as the <tt>result</tt> in the example above. 
     */
    
    /**
     * @cfg {String/Object} namespace
     * Namespace for the Remoting Provider (defaults to the browser global scope of <i>window</i>).
     * Explicitly specify the namespace Object, or specify a String to have a
     * {@link Ext#namespace namespace created} implicitly.
     */
    
    /**
     * @cfg {String} url
     * <b>Required<b>. The url to connect to the {@link Ext.Direct} server-side router. 
     */
    
    /**
     * @cfg {String} enableUrlEncode
     * Specify which param will hold the arguments for the method.
     * Defaults to <tt>'data'</tt>.
     */
    
    /**
     * @cfg {Number/Boolean} enableBuffer
     * <p><tt>true</tt> or <tt>false</tt> to enable or disable combining of method
     * calls. If a number is specified this is the amount of time in milliseconds
     * to wait before sending a batched request (defaults to <tt>10</tt>).</p>
     * <br><p>Calls which are received within the specified timeframe will be
     * concatenated together and sent in a single request, optimizing the
     * application by reducing the amount of round trips that have to be made
     * to the server.</p>
     */
    enableBuffer: 10,
    
    /**
     * @cfg {Number} maxRetries
     * Number of times to re-attempt delivery on failure of a call. Defaults to <tt>1</tt>.
     */
    maxRetries: 1,
    
    /**
     * @cfg {Number} timeout
     * The timeout to use for each request. Defaults to <tt>undefined</tt>.
     */
    timeout: undefined,

    constructor : function(config){
        Ext.direct.RemotingProvider.superclass.constructor.call(this, config);
        this.addEvents(
            /**
             * @event beforecall
             * Fires immediately before the client-side sends off the RPC call.
             * By returning false from an event handler you can prevent the call from
             * executing.
             * @param {Ext.direct.RemotingProvider} provider
             * @param {Ext.Direct.Transaction} transaction
             * @param {Object} meta The meta data
             */            
            'beforecall',            
            /**
             * @event call
             * Fires immediately after the request to the server-side is sent. This does
             * NOT fire after the response has come back from the call.
             * @param {Ext.direct.RemotingProvider} provider
             * @param {Ext.Direct.Transaction} transaction
             * @param {Object} meta The meta data
             */            
            'call'
        );
        this.namespace = (Ext.isString(this.namespace)) ? Ext.ns(this.namespace) : this.namespace || window;
        this.transactions = {};
        this.callBuffer = [];
    },

    // private
    initAPI : function(){
        var o = this.actions;
        for(var c in o){
            var cls = this.namespace[c] || (this.namespace[c] = {}),
                ms = o[c];
            for(var i = 0, len = ms.length; i < len; i++){
                var m = ms[i];
                cls[m.name] = this.createMethod(c, m);
            }
        }
    },

    // inherited
    isConnected: function(){
        return !!this.connected;
    },

    connect: function(){
        if(this.url){
            this.initAPI();
            this.connected = true;
            this.fireEvent('connect', this);
        }else if(!this.url){
            throw 'Error initializing RemotingProvider, no url configured.';
        }
    },

    disconnect: function(){
        if(this.connected){
            this.connected = false;
            this.fireEvent('disconnect', this);
        }
    },

    onData: function(opt, success, xhr){
        if(success){
            var events = this.getEvents(xhr);
            for(var i = 0, len = events.length; i < len; i++){
                var e = events[i],
                    t = this.getTransaction(e);
                this.fireEvent('data', this, e);
                if(t){
                    this.doCallback(t, e, true);
                    Ext.Direct.removeTransaction(t);
                }
            }
        }else{
            var ts = [].concat(opt.ts);
            for(var i = 0, len = ts.length; i < len; i++){
                var t = this.getTransaction(ts[i]);
                if(t && t.retryCount < this.maxRetries){
                    t.retry();
                }else{
                    var e = new Ext.Direct.ExceptionEvent({
                        data: e,
                        transaction: t,
                        code: Ext.Direct.exceptions.TRANSPORT,
                        message: 'Unable to connect to the server.',
                        xhr: xhr
                    });
                    this.fireEvent('data', this, e);
                    if(t){
                        this.doCallback(t, e, false);
                        Ext.Direct.removeTransaction(t);
                    }
                }
            }
        }
    },

    getCallData: function(t){
        return {
            action: t.action,
            method: t.method,
            data: t.data,
            type: 'rpc',
            tid: t.tid
        };
    },

    doSend : function(data){
        var o = {
            url: this.url,
            callback: this.onData,
            scope: this,
            ts: data,
            timeout: this.timeout
        }, callData;

        if(Ext.isArray(data)){
            callData = [];
            for(var i = 0, len = data.length; i < len; i++){
                callData.push(this.getCallData(data[i]));
            }
        }else{
            callData = this.getCallData(data);
        }

        if(this.enableUrlEncode){
            var params = {};
            params[Ext.isString(this.enableUrlEncode) ? this.enableUrlEncode : 'data'] = Ext.encode(callData);
            o.params = params;
        }else{
            o.jsonData = callData;
        }
        Ext.Ajax.request(o);
    },

    combineAndSend : function(){
        var len = this.callBuffer.length;
        if(len > 0){
            this.doSend(len == 1 ? this.callBuffer[0] : this.callBuffer);
            this.callBuffer = [];
        }
    },

    queueTransaction: function(t){
        if(t.form){
            this.processForm(t);
            return;
        }
        this.callBuffer.push(t);
        if(this.enableBuffer){
            if(!this.callTask){
                this.callTask = new Ext.util.DelayedTask(this.combineAndSend, this);
            }
            this.callTask.delay(Ext.isNumber(this.enableBuffer) ? this.enableBuffer : 10);
        }else{
            this.combineAndSend();
        }
    },

    doCall : function(c, m, args){
        var data = null, hs = args[m.len], scope = args[m.len+1];

        if(m.len !== 0){
            data = args.slice(0, m.len);
        }

        var t = new Ext.Direct.Transaction({
            provider: this,
            args: args,
            action: c,
            method: m.name,
            data: data,
            cb: scope && Ext.isFunction(hs) ? hs.createDelegate(scope) : hs
        });

        if(this.fireEvent('beforecall', this, t, m) !== false){
            Ext.Direct.addTransaction(t);
            this.queueTransaction(t);
            this.fireEvent('call', this, t, m);
        }
    },

    doForm : function(c, m, form, callback, scope){
        var t = new Ext.Direct.Transaction({
            provider: this,
            action: c,
            method: m.name,
            args:[form, callback, scope],
            cb: scope && Ext.isFunction(callback) ? callback.createDelegate(scope) : callback,
            isForm: true
        });

        if(this.fireEvent('beforecall', this, t, m) !== false){
            Ext.Direct.addTransaction(t);
            var isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data',
                params = {
                    extTID: t.tid,
                    extAction: c,
                    extMethod: m.name,
                    extType: 'rpc',
                    extUpload: String(isUpload)
                };
            
            // change made from typeof callback check to callback.params
            // to support addl param passing in DirectSubmit EAC 6/2
            Ext.apply(t, {
                form: Ext.getDom(form),
                isUpload: isUpload,
                params: callback && Ext.isObject(callback.params) ? Ext.apply(params, callback.params) : params
            });
            this.fireEvent('call', this, t, m);
            this.processForm(t);
        }
    },
    
    processForm: function(t){
        Ext.Ajax.request({
            url: this.url,
            params: t.params,
            callback: this.onData,
            scope: this,
            form: t.form,
            isUpload: t.isUpload,
            ts: t
        });
    },

    createMethod : function(c, m){
        var f;
        if(!m.formHandler){
            f = function(){
                this.doCall(c, m, Array.prototype.slice.call(arguments, 0));
            }.createDelegate(this);
        }else{
            f = function(form, callback, scope){
                this.doForm(c, m, form, callback, scope);
            }.createDelegate(this);
        }
        f.directCfg = {
            action: c,
            method: m
        };
        return f;
    },

    getTransaction: function(opt){
        return opt && opt.tid ? Ext.Direct.getTransaction(opt.tid) : null;
    },

    doCallback: function(t, e){
        var fn = e.status ? 'success' : 'failure';
        if(t && t.cb){
            var hs = t.cb,
                result = Ext.isDefined(e.result) ? e.result : e.data;
            if(Ext.isFunction(hs)){
                hs(result, e);
            } else{
                Ext.callback(hs[fn], hs.scope, [result, e]);
                Ext.callback(hs.callback, hs.scope, [result, e]);
            }
        }
    }
});
Ext.Direct.PROVIDERS['remoting'] = Ext.direct.RemotingProvider;