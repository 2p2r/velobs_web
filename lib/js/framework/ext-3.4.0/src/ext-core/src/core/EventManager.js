/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.EventManager
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 * See {@link Ext.EventObject} for more details on normalized event objects.
 * @singleton
 */
Ext.EventManager = function(){
    var docReadyEvent,
        docReadyProcId,
        docReadyState = false,
        DETECT_NATIVE = Ext.isGecko || Ext.isWebKit || Ext.isSafari,
        E = Ext.lib.Event,
        D = Ext.lib.Dom,
        DOC = document,
        WINDOW = window,
        DOMCONTENTLOADED = "DOMContentLoaded",
        COMPLETE = 'complete',
        propRe = /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,
        /*
         * This cache is used to hold special js objects, the document and window, that don't have an id. We need to keep
         * a reference to them so we can look them up at a later point.
         */
        specialElCache = [];

     function getId(el){
        var id = false,
            i = 0,
            len = specialElCache.length,
            skip = false,
            o;
            
        if (el) {
            if (el.getElementById || el.navigator) {
                // look up the id
                for(; i < len; ++i){
                    o = specialElCache[i];
                    if(o.el === el){
                        id = o.id;
                        break;
                    }
                }
                if(!id){
                    // for browsers that support it, ensure that give the el the same id
                    id = Ext.id(el);
                    specialElCache.push({
                        id: id,
                        el: el
                    });
                    skip = true;
                }
            }else{
                id = Ext.id(el);
            }
            if(!Ext.elCache[id]){
                Ext.Element.addToCache(new Ext.Element(el), id);
                if(skip){
                    Ext.elCache[id].skipGC = true;
                }
            }
        }
        return id;
     }

    /// There is some jquery work around stuff here that isn't needed in Ext Core.
    function addListener(el, ename, fn, task, wrap, scope){
        el = Ext.getDom(el);
        var id = getId(el),
            es = Ext.elCache[id].events,
            wfn;

        wfn = E.on(el, ename, wrap);
        es[ename] = es[ename] || [];

        /* 0 = Original Function,
           1 = Event Manager Wrapped Function,
           2 = Scope,
           3 = Adapter Wrapped Function,
           4 = Buffered Task
        */
        es[ename].push([fn, wrap, scope, wfn, task]);

        // this is a workaround for jQuery and should somehow be removed from Ext Core in the future
        // without breaking ExtJS.

        // workaround for jQuery
        if(el.addEventListener && ename == "mousewheel"){
            var args = ["DOMMouseScroll", wrap, false];
            el.addEventListener.apply(el, args);
            Ext.EventManager.addListener(WINDOW, 'unload', function(){
                el.removeEventListener.apply(el, args);
            });
        }

        // fix stopped mousedowns on the document
        if(el == DOC && ename == "mousedown"){
            Ext.EventManager.stoppedMouseDownEvent.addListener(wrap);
        }
    }

    function doScrollChk(){
        /* Notes:
             'doScroll' will NOT work in a IFRAME/FRAMESET.
             The method succeeds but, a DOM query done immediately after -- FAILS.
          */
        if(window != top){
            return false;
        }

        try{
            DOC.documentElement.doScroll('left');
        }catch(e){
             return false;
        }

        fireDocReady();
        return true;
    }
    /**
     * @return {Boolean} True if the document is in a 'complete' state (or was determined to
     * be true by other means). If false, the state is evaluated again until canceled.
     */
    function checkReadyState(e){

        if(Ext.isIE && doScrollChk()){
            return true;
        }
        if(DOC.readyState == COMPLETE){
            fireDocReady();
            return true;
        }
        docReadyState || (docReadyProcId = setTimeout(arguments.callee, 2));
        return false;
    }

    var styles;
    function checkStyleSheets(e){
        styles || (styles = Ext.query('style, link[rel=stylesheet]'));
        if(styles.length == DOC.styleSheets.length){
            fireDocReady();
            return true;
        }
        docReadyState || (docReadyProcId = setTimeout(arguments.callee, 2));
        return false;
    }

    function OperaDOMContentLoaded(e){
        DOC.removeEventListener(DOMCONTENTLOADED, arguments.callee, false);
        checkStyleSheets();
    }

    function fireDocReady(e){
        if(!docReadyState){
            docReadyState = true; //only attempt listener removal once

            if(docReadyProcId){
                clearTimeout(docReadyProcId);
            }
            if(DETECT_NATIVE) {
                DOC.removeEventListener(DOMCONTENTLOADED, fireDocReady, false);
            }
            if(Ext.isIE && checkReadyState.bindIE){  //was this was actually set ??
                DOC.detachEvent('onreadystatechange', checkReadyState);
            }
            E.un(WINDOW, "load", arguments.callee);
        }
        if(docReadyEvent && !Ext.isReady){
            Ext.isReady = true;
            docReadyEvent.fire();
            docReadyEvent.listeners = [];
        }

    }

    function initDocReady(){
        docReadyEvent || (docReadyEvent = new Ext.util.Event());
        if (DETECT_NATIVE) {
            DOC.addEventListener(DOMCONTENTLOADED, fireDocReady, false);
        }
        /*
         * Handle additional (exceptional) detection strategies here
         */
        if (Ext.isIE){
            //Use readystatechange as a backup AND primary detection mechanism for a FRAME/IFRAME
            //See if page is already loaded
            if(!checkReadyState()){
                checkReadyState.bindIE = true;
                DOC.attachEvent('onreadystatechange', checkReadyState);
            }

        }else if(Ext.isOpera ){
            /* Notes:
               Opera needs special treatment needed here because CSS rules are NOT QUITE
               available after DOMContentLoaded is raised.
            */

            //See if page is already loaded and all styleSheets are in place
            (DOC.readyState == COMPLETE && checkStyleSheets()) ||
                DOC.addEventListener(DOMCONTENTLOADED, OperaDOMContentLoaded, false);

        }else if (Ext.isWebKit){
            //Fallback for older Webkits without DOMCONTENTLOADED support
            checkReadyState();
        }
        // no matter what, make sure it fires on load
        E.on(WINDOW, "load", fireDocReady);
    }

    function createTargeted(h, o){
        return function(){
            var args = Ext.toArray(arguments);
            if(o.target == Ext.EventObject.setEvent(args[0]).target){
                h.apply(this, args);
            }
        };
    }

    function createBuffered(h, o, task){
        return function(e){
            // create new event object impl so new events don't wipe out properties
            task.delay(o.buffer, h, null, [new Ext.EventObjectImpl(e)]);
        };
    }

    function createSingle(h, el, ename, fn, scope){
        return function(e){
            Ext.EventManager.removeListener(el, ename, fn, scope);
            h(e);
        };
    }

    function createDelayed(h, o, fn){
        return function(e){
            var task = new Ext.util.DelayedTask(h);
            if(!fn.tasks) {
                fn.tasks = [];
            }
            fn.tasks.push(task);
            task.delay(o.delay || 10, h, null, [new Ext.EventObjectImpl(e)]);
        };
    }

    function listen(element, ename, opt, fn, scope){
        var o = (!opt || typeof opt == "boolean") ? {} : opt,
            el = Ext.getDom(element), task;

        fn = fn || o.fn;
        scope = scope || o.scope;

        if(!el){
            throw "Error listening for \"" + ename + '\". Element "' + element + '" doesn\'t exist.';
        }
        function h(e){
            // prevent errors while unload occurring
            if(!Ext){// !window[xname]){  ==> can't we do this?
                return;
            }
            e = Ext.EventObject.setEvent(e);
            var t;
            if (o.delegate) {
                if(!(t = e.getTarget(o.delegate, el))){
                    return;
                }
            } else {
                t = e.target;
            }
            if (o.stopEvent) {
                e.stopEvent();
            }
            if (o.preventDefault) {
               e.preventDefault();
            }
            if (o.stopPropagation) {
                e.stopPropagation();
            }
            if (o.normalized === false) {
                e = e.browserEvent;
            }

            fn.call(scope || el, e, t, o);
        }
        if(o.target){
            h = createTargeted(h, o);
        }
        if(o.delay){
            h = createDelayed(h, o, fn);
        }
        if(o.single){
            h = createSingle(h, el, ename, fn, scope);
        }
        if(o.buffer){
            task = new Ext.util.DelayedTask(h);
            h = createBuffered(h, o, task);
        }

        addListener(el, ename, fn, task, h, scope);
        return h;
    }

    var pub = {
        /**
         * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
         * use {@link Ext.Element#addListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The html element or id to assign the event handler to.
         * @param {String} eventName The name of the event to listen for.
         * @param {Function} handler The handler function the event invokes. This function is passed
         * the following parameters:<ul>
         * <li>evt : EventObject<div class="sub-desc">The {@link Ext.EventObject EventObject} describing the event.</div></li>
         * <li>t : Element<div class="sub-desc">The {@link Ext.Element Element} which was the target of the event.
         * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
         * <li>o : Object<div class="sub-desc">The options object from the addListener call.</div></li>
         * </ul>
         * @param {Object} scope (optional) The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.
         * @param {Object} options (optional) An object containing handler configuration properties.
         * This may contain any of the following properties:<ul>
         * <li>scope : Object<div class="sub-desc">The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.</div></li>
         * <li>delegate : String<div class="sub-desc">A simple selector to filter the target or look for a descendant of the target</div></li>
         * <li>stopEvent : Boolean<div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
         * <li>preventDefault : Boolean<div class="sub-desc">True to prevent the default action</div></li>
         * <li>stopPropagation : Boolean<div class="sub-desc">True to prevent event propagation</div></li>
         * <li>normalized : Boolean<div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
         * <li>delay : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after te event fires.</div></li>
         * <li>single : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
         * <li>buffer : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
         * by the specified number of milliseconds. If the event fires again within that time, the original
         * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
         * <li>target : Element<div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
         * </ul><br>
         * <p>See {@link Ext.Element#addListener} for examples of how to use these options.</p>
         */
        addListener : function(element, eventName, fn, scope, options){
            if(typeof eventName == 'object'){
                var o = eventName, e, val;
                for(e in o){
                    val = o[e];
                    if(!propRe.test(e)){
                        if(Ext.isFunction(val)){
                            // shared options
                            listen(element, e, o, val, o.scope);
                        }else{
                            // individual options
                            listen(element, e, val);
                        }
                    }
                }
            } else {
                listen(element, eventName, options, fn, scope);
            }
        },

        /**
         * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
         * you will use {@link Ext.Element#removeListener} directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The id or html element from which to remove the listener.
         * @param {String} eventName The name of the event.
         * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
         * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
         * then this must refer to the same object.
         */
        removeListener : function(el, eventName, fn, scope){
            el = Ext.getDom(el);
            var id = getId(el),
                f = el && (Ext.elCache[id].events)[eventName] || [],
                wrap, i, l, k, len, fnc;

            for (i = 0, len = f.length; i < len; i++) {

                /* 0 = Original Function,
                   1 = Event Manager Wrapped Function,
                   2 = Scope,
                   3 = Adapter Wrapped Function,
                   4 = Buffered Task
                */
                if (Ext.isArray(fnc = f[i]) && fnc[0] == fn && (!scope || fnc[2] == scope)) {
                    if(fnc[4]) {
                        fnc[4].cancel();
                    }
                    k = fn.tasks && fn.tasks.length;
                    if(k) {
                        while(k--) {
                            fn.tasks[k].cancel();
                        }
                        delete fn.tasks;
                    }
                    wrap = fnc[1];
                    E.un(el, eventName, E.extAdapter ? fnc[3] : wrap);

                    // jQuery workaround that should be removed from Ext Core
                    if(wrap && el.addEventListener && eventName == "mousewheel"){
                        el.removeEventListener("DOMMouseScroll", wrap, false);
                    }

                    // fix stopped mousedowns on the document
                    if(wrap && el == DOC && eventName == "mousedown"){
                        Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
                    }

                    f.splice(i, 1);
                    if (f.length === 0) {
                        delete Ext.elCache[id].events[eventName];
                    }
                    for (k in Ext.elCache[id].events) {
                        return false;
                    }
                    Ext.elCache[id].events = {};
                    return false;
                }
            }
        },

        /**
         * Removes all event handers from an element.  Typically you will use {@link Ext.Element#removeAllListeners}
         * directly on an Element in favor of calling this version.
         * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
         */
        removeAll : function(el){
            el = Ext.getDom(el);
            var id = getId(el),
                ec = Ext.elCache[id] || {},
                es = ec.events || {},
                f, i, len, ename, fn, k, wrap;

            for(ename in es){
                if(es.hasOwnProperty(ename)){
                    f = es[ename];
                    /* 0 = Original Function,
                       1 = Event Manager Wrapped Function,
                       2 = Scope,
                       3 = Adapter Wrapped Function,
                       4 = Buffered Task
                    */
                    for (i = 0, len = f.length; i < len; i++) {
                        fn = f[i];
                        if(fn[4]) {
                            fn[4].cancel();
                        }
                        if(fn[0].tasks && (k = fn[0].tasks.length)) {
                            while(k--) {
                                fn[0].tasks[k].cancel();
                            }
                            delete fn.tasks;
                        }
                        wrap =  fn[1];
                        E.un(el, ename, E.extAdapter ? fn[3] : wrap);

                        // jQuery workaround that should be removed from Ext Core
                        if(el.addEventListener && wrap && ename == "mousewheel"){
                            el.removeEventListener("DOMMouseScroll", wrap, false);
                        }

                        // fix stopped mousedowns on the document
                        if(wrap && el == DOC &&  ename == "mousedown"){
                            Ext.EventManager.stoppedMouseDownEvent.removeListener(wrap);
                        }
                    }
                }
            }
            if (Ext.elCache[id]) {
                Ext.elCache[id].events = {};
            }
        },

        getListeners : function(el, eventName) {
            el = Ext.getDom(el);
            var id = getId(el),
                ec = Ext.elCache[id] || {},
                es = ec.events || {},
                results = [];
            if (es && es[eventName]) {
                return es[eventName];
            } else {
                return null;
            }
        },

        purgeElement : function(el, recurse, eventName) {
            el = Ext.getDom(el);
            var id = getId(el),
                ec = Ext.elCache[id] || {},
                es = ec.events || {},
                i, f, len;
            if (eventName) {
                if (es && es.hasOwnProperty(eventName)) {
                    f = es[eventName];
                    for (i = 0, len = f.length; i < len; i++) {
                        Ext.EventManager.removeListener(el, eventName, f[i][0]);
                    }
                }
            } else {
                Ext.EventManager.removeAll(el);
            }
            if (recurse && el && el.childNodes) {
                for (i = 0, len = el.childNodes.length; i < len; i++) {
                    Ext.EventManager.purgeElement(el.childNodes[i], recurse, eventName);
                }
            }
        },

        _unload : function() {
            var el;
            for (el in Ext.elCache) {
                Ext.EventManager.removeAll(el);
            }
            delete Ext.elCache;
            delete Ext.Element._flyweights;

            // Abort any outstanding Ajax requests
            var c,
                conn,
                tid,
                ajax = Ext.lib.Ajax;
            (typeof ajax.conn == 'object') ? conn = ajax.conn : conn = {};
            for (tid in conn) {
                c = conn[tid];
                if (c) {
                    ajax.abort({conn: c, tId: tid});
                }
            }
        },
        /**
         * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Can be
         * accessed shorthanded as Ext.onReady().
         * @param {Function} fn The method the event invokes.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
         * @param {boolean} options (optional) Options object as passed to {@link Ext.Element#addListener}. It is recommended that the options
         * <code>{single: true}</code> be used so that the handler is removed on first invocation.
         */
        onDocumentReady : function(fn, scope, options){
            if (Ext.isReady) { // if it already fired or document.body is present
                docReadyEvent || (docReadyEvent = new Ext.util.Event());
                docReadyEvent.addListener(fn, scope, options);
                docReadyEvent.fire();
                docReadyEvent.listeners = [];
            } else {
                if (!docReadyEvent) {
                    initDocReady();
                }
                options = options || {};
                options.delay = options.delay || 1;
                docReadyEvent.addListener(fn, scope, options);
            }
        },

        /**
         * Forces a document ready state transition for the framework.  Used when Ext is loaded
         * into a DOM structure AFTER initial page load (Google API or other dynamic load scenario.
         * Any pending 'onDocumentReady' handlers will be fired (if not already handled).
         */
        fireDocReady  : fireDocReady
    };
     /**
     * Appends an event handler to an element.  Shorthand for {@link #addListener}.
     * @param {String/HTMLElement} el The html element or id to assign the event handler to
     * @param {String} eventName The name of the event to listen for.
     * @param {Function} handler The handler function the event invokes.
     * @param {Object} scope (optional) (<code>this</code> reference) in which the handler function executes. <b>Defaults to the Element</b>.
     * @param {Object} options (optional) An object containing standard {@link #addListener} options
     * @member Ext.EventManager
     * @method on
     */
    pub.on = pub.addListener;
    /**
     * Removes an event handler from an element.  Shorthand for {@link #removeListener}.
     * @param {String/HTMLElement} el The id or html element from which to remove the listener.
     * @param {String} eventName The name of the event.
     * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #on} call.</b>
     * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
     * then this must refer to the same object.
     * @member Ext.EventManager
     * @method un
     */
    pub.un = pub.removeListener;

    pub.stoppedMouseDownEvent = new Ext.util.Event();
    return pub;
}();
/**
  * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Shorthand of {@link Ext.EventManager#onDocumentReady}.
  * @param {Function} fn The method the event invokes.
  * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
  * @param {boolean} options (optional) Options object as passed to {@link Ext.Element#addListener}. It is recommended that the options
  * <code>{single: true}</code> be used so that the handler is removed on first invocation.
  * @member Ext
  * @method onReady
 */
Ext.onReady = Ext.EventManager.onDocumentReady;


//Initialize doc classes
(function(){
    var initExtCss = function() {
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0];
        if (!bd) {
            return false;
        }

        var cls = [' ',
                Ext.isIE ? "ext-ie " + (Ext.isIE6 ? 'ext-ie6' : (Ext.isIE7 ? 'ext-ie7' : (Ext.isIE8 ? 'ext-ie8' : 'ext-ie9')))
                : Ext.isGecko ? "ext-gecko " + (Ext.isGecko2 ? 'ext-gecko2' : 'ext-gecko3')
                : Ext.isOpera ? "ext-opera"
                : Ext.isWebKit ? "ext-webkit" : ""];

        if (Ext.isSafari) {
            cls.push("ext-safari " + (Ext.isSafari2 ? 'ext-safari2' : (Ext.isSafari3 ? 'ext-safari3' : 'ext-safari4')));
        } else if(Ext.isChrome) {
            cls.push("ext-chrome");
        }

        if (Ext.isMac) {
            cls.push("ext-mac");
        }
        if (Ext.isLinux) {
            cls.push("ext-linux");
        }

        // add to the parent to allow for selectors like ".ext-strict .ext-ie"
        if (Ext.isStrict || Ext.isBorderBox) {
            var p = bd.parentNode;
            if (p) {
                if (!Ext.isStrict) {
                    Ext.fly(p, '_internal').addClass('x-quirks');
                    if (Ext.isIE && !Ext.isStrict) {
                        Ext.isIEQuirks = true;
                    }
                }
                Ext.fly(p, '_internal').addClass(((Ext.isStrict && Ext.isIE ) || (!Ext.enableForcedBoxModel && !Ext.isIE)) ? ' ext-strict' : ' ext-border-box');
            }
        }
        // Forced border box model class applied to all elements. Bypassing javascript based box model adjustments
        // in favor of css.  This is for non-IE browsers.
        if (Ext.enableForcedBoxModel && !Ext.isIE) {
            Ext.isForcedBorderBox = true;
            cls.push("ext-forced-border-box");
        }
        
        Ext.fly(bd, '_internal').addClass(cls);
        return true;
    };
    
    if (!initExtCss()) {
        Ext.onReady(initExtCss);
    }
})();

/**
 * Code used to detect certain browser feature/quirks/bugs at startup.
 */
(function(){
    var supports = Ext.apply(Ext.supports, {
        /**
         * In Webkit, there is an issue with getting the margin right property, see
         * https://bugs.webkit.org/show_bug.cgi?id=13343
         */
        correctRightMargin: true,
        
        /**
         * Webkit browsers return rgba(0, 0, 0) when a transparent color is used
         */
        correctTransparentColor: true,
        
        /**
         * IE uses styleFloat, not cssFloat for the float property.
         */
        cssFloat: true
    });
    
    var supportTests = function(){
            var div = document.createElement('div'),
                doc = document,
                view,
                last;
                
            div.innerHTML = '<div style="height:30px;width:50px;"><div style="height:20px;width:20px;"></div></div><div style="float:left;background-color:transparent;">';
            doc.body.appendChild(div);
            last = div.lastChild;
            
            if((view = doc.defaultView)){
                if(view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px'){
                    supports.correctRightMargin = false;
                }
                if(view.getComputedStyle(last, null).backgroundColor != 'transparent'){
                    supports.correctTransparentColor = false;
                }
            }
            supports.cssFloat = !!last.style.cssFloat;
            doc.body.removeChild(div);
    };
    
    if (Ext.isReady) {
        supportTests();    
    } else {
        Ext.onReady(supportTests);
    }
})();


/**
 * @class Ext.EventObject
 * Just as {@link Ext.Element} wraps around a native DOM node, Ext.EventObject
 * wraps the browser's native event-object normalizing cross-browser differences,
 * such as which mouse button is clicked, keys pressed, mechanisms to stop
 * event-propagation along with a method to prevent default actions from taking place.
 * <p>For example:</p>
 * <pre><code>
function handleClick(e, t){ // e is not a standard event object, it is a Ext.EventObject
    e.preventDefault();
    var target = e.getTarget(); // same as t (the target HTMLElement)
    ...
}
var myDiv = {@link Ext#get Ext.get}("myDiv");  // get reference to an {@link Ext.Element}
myDiv.on(         // 'on' is shorthand for addListener
    "click",      // perform an action on click of myDiv
    handleClick   // reference to the action handler
);
// other methods to do the same:
Ext.EventManager.on("myDiv", 'click', handleClick);
Ext.EventManager.addListener("myDiv", 'click', handleClick);
 </code></pre>
 * @singleton
 */
Ext.EventObject = function(){
    var E = Ext.lib.Event,
        clickRe = /(dbl)?click/,
        // safari keypress events for special keys return bad keycodes
        safariKeys = {
            3 : 13, // enter
            63234 : 37, // left
            63235 : 39, // right
            63232 : 38, // up
            63233 : 40, // down
            63276 : 33, // page up
            63277 : 34, // page down
            63272 : 46, // delete
            63273 : 36, // home
            63275 : 35  // end
        },
        // normalize button clicks
        btnMap = Ext.isIE ? {1:0,4:1,2:2} : {0:0,1:1,2:2};

    Ext.EventObjectImpl = function(e){
        if(e){
            this.setEvent(e.browserEvent || e);
        }
    };

    Ext.EventObjectImpl.prototype = {
           /** @private */
        setEvent : function(e){
            var me = this;
            if(e == me || (e && e.browserEvent)){ // already wrapped
                return e;
            }
            me.browserEvent = e;
            if(e){
                // normalize buttons
                me.button = e.button ? btnMap[e.button] : (e.which ? e.which - 1 : -1);
                if(clickRe.test(e.type) && me.button == -1){
                    me.button = 0;
                }
                me.type = e.type;
                me.shiftKey = e.shiftKey;
                // mac metaKey behaves like ctrlKey
                me.ctrlKey = e.ctrlKey || e.metaKey || false;
                me.altKey = e.altKey;
                // in getKey these will be normalized for the mac
                me.keyCode = e.keyCode;
                me.charCode = e.charCode;
                // cache the target for the delayed and or buffered events
                me.target = E.getTarget(e);
                // same for XY
                me.xy = E.getXY(e);
            }else{
                me.button = -1;
                me.shiftKey = false;
                me.ctrlKey = false;
                me.altKey = false;
                me.keyCode = 0;
                me.charCode = 0;
                me.target = null;
                me.xy = [0, 0];
            }
            return me;
        },

        /**
         * Stop the event (preventDefault and stopPropagation)
         */
        stopEvent : function(){
            var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopEvent(me.browserEvent);
            }
        },

        /**
         * Prevents the browsers default handling of the event.
         */
        preventDefault : function(){
            if(this.browserEvent){
                E.preventDefault(this.browserEvent);
            }
        },

        /**
         * Cancels bubbling of the event.
         */
        stopPropagation : function(){
            var me = this;
            if(me.browserEvent){
                if(me.browserEvent.type == 'mousedown'){
                    Ext.EventManager.stoppedMouseDownEvent.fire(me);
                }
                E.stopPropagation(me.browserEvent);
            }
        },

        /**
         * Gets the character code for the event.
         * @return {Number}
         */
        getCharCode : function(){
            return this.charCode || this.keyCode;
        },

        /**
         * Returns a normalized keyCode for the event.
         * @return {Number} The key code
         */
        getKey : function(){
            return this.normalizeKey(this.keyCode || this.charCode);
        },

        // private
        normalizeKey: function(k){
            return Ext.isSafari ? (safariKeys[k] || k) : k;
        },

        /**
         * Gets the x coordinate of the event.
         * @return {Number}
         */
        getPageX : function(){
            return this.xy[0];
        },

        /**
         * Gets the y coordinate of the event.
         * @return {Number}
         */
        getPageY : function(){
            return this.xy[1];
        },

        /**
         * Gets the page coordinates of the event.
         * @return {Array} The xy values like [x, y]
         */
        getXY : function(){
            return this.xy;
        },

        /**
         * Gets the target for the event.
         * @param {String} selector (optional) A simple selector to filter the target or look for an ancestor of the target
         * @param {Number/Mixed} maxDepth (optional) The max depth to
                search as a number or element (defaults to 10 || document.body)
         * @param {Boolean} returnEl (optional) True to return a Ext.Element object instead of DOM node
         * @return {HTMLelement}
         */
        getTarget : function(selector, maxDepth, returnEl){
            return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
        },

        /**
         * Gets the related target.
         * @return {HTMLElement}
         */
        getRelatedTarget : function(){
            return this.browserEvent ? E.getRelatedTarget(this.browserEvent) : null;
        },

        /**
         * Normalizes mouse wheel delta across browsers
         * @return {Number} The delta
         */
        getWheelDelta : function(){
            var e = this.browserEvent;
            var delta = 0;
            if(e.wheelDelta){ /* IE/Opera. */
                delta = e.wheelDelta/120;
            }else if(e.detail){ /* Mozilla case. */
                delta = -e.detail/3;
            }
            return delta;
        },

        /**
        * Returns true if the target of this event is a child of el.  Unless the allowEl parameter is set, it will return false if if the target is el.
        * Example usage:<pre><code>
        // Handle click on any child of an element
        Ext.getBody().on('click', function(e){
            if(e.within('some-el')){
                alert('Clicked on a child of some-el!');
            }
        });

        // Handle click directly on an element, ignoring clicks on child nodes
        Ext.getBody().on('click', function(e,t){
            if((t.id == 'some-el') && !e.within(t, true)){
                alert('Clicked directly on some-el!');
            }
        });
        </code></pre>
         * @param {Mixed} el The id, DOM element or Ext.Element to check
         * @param {Boolean} related (optional) true to test if the related target is within el instead of the target
         * @param {Boolean} allowEl {optional} true to also check if the passed element is the target or related target
         * @return {Boolean}
         */
        within : function(el, related, allowEl){
            if(el){
                var t = this[related ? "getRelatedTarget" : "getTarget"]();
                return t && ((allowEl ? (t == Ext.getDom(el)) : false) || Ext.fly(el).contains(t));
            }
            return false;
        }
     };

    return new Ext.EventObjectImpl();
}();