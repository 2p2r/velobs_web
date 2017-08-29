/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.debug');
Ext.debug.Assistant = function(){
    var enabled = true;
        
    return {
        enable: function(){
            enabled = true;
        },
        
        disable: function(){
            enabled = false;
        },
        
        init : function(classes){
            var klass,
                intercept = false,
                fn,
                method;
            Ext.each(classes, function(cls){
                if(this.namespaceExists(cls.name)){
                    klass = this.getClass(cls.name);
                    method = cls.instance ? this.addInstanceCheck : this.addPrototypeCheck;
                    Ext.each(cls.checks, function(check){
                        intercept = check.intercept == true;
                        fn = method.call(this, klass, check.name, check.fn, check.intercept == true);
                        if(check.after){
                            check.after(fn);
                        }
                    }, this);
                }
            }, this);  
        },
        
        namespaceExists: function(name){
            var parent = window,
                exists = true;
                
            Ext.each(name.split('.'), function(n){
                if(!Ext.isDefined(parent[n])){
                    exists = false;
                    return false;
                }
                parent = parent[n];
            });
            return exists;
        },
        
        getClass : function(name){
            var parent = window;
            Ext.each(name.split('.'), function(n){
                parent = parent[n];
            });  
            return parent;
        },
        
        warn: function(){
            if(enabled && window.console){
                console.warn.apply(console, arguments);
            }
        },
        
        error: function(){
            if(enabled && window.console){
                console.error.apply(console, arguments);
            }
        },
        
        addPrototypeCheck : function(cls, method, fn, intercept){
            return (cls.prototype[method] = cls.prototype[method][intercept ? 'createInterceptor' : 'createSequence'](fn));
        },
        
        addInstanceCheck : function(cls, method, fn, intercept){
            return (cls[method] = cls[method][intercept ? 'createInterceptor' : 'createSequence'](fn));
        }
    };
}();

(function(){
    var A = Ext.debug.Assistant,
        cls = [];
        
    cls.push({
        name: 'Ext.util.Observable',
        checks: [{
            name: 'addListener',
            intercept: true,
            fn: function(eventName, fn){
                if(typeof eventName == 'object'){
                    var ev, o;
                    for(ev in eventName){
                        if(!this.filterOptRe.test(ev)){
                            o = eventName[ev];
                            o = o && o.fn ? o.fn : o;
                            if(!Ext.isFunction(o)){
                                A.error('Non function passed to event listener', this, ev);
                                return false;
                            }
                        }
                    }
                }else{
                    if(!Ext.isFunction(fn)){
                        A.error('Non function passed to event listener', this, eventName);
                    }
                }
            },
            after: function(method){
                Ext.util.Observable.prototype.on = method;
            }
        }]
    });
    
    cls.push({
        name: 'Ext.Component',
        checks: [{
            name: 'render',
            intercept: true,
            fn: function(container, position){
                if(!container && !this.el){
                    A.error('Unable to render to container', this, container);
                }
            
                if(this.contentEl){
                    var el = Ext.getDom(this.contentEl);
                    if(!el){
                        A.error('Specified contentEl does not exist', this, this.contentEl);
                        return false;
                    }
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext.Container',
        checks: [{
            name: 'onBeforeAdd',
            intercept: true,
            fn: function(c){
                if(c.isDestroyed){
                    A.warn('Adding destroyed component to container', c, this);
                }
                if(c.renderTo){
                    A.warn('Using renderTo while adding an item to a Container. You should use the add() method or put the item in the items configuration', c, this);
                }
                if(c.applyTo){
                    A.warn('Using applyTo while adding an item to a Container. You should use the add() method or put the item in the items configuration', c, this);
                }
                
                var type = this.layout.type;
                if(type == 'container' || type == 'auto'){
                    A.warn('A non sizing layout is being used in a container that has child components. This means the child components will not be sized.', this);
                }
            }
        },{
            name: 'lookupComponent',
            intercept: true,
            fn: function(c){
                var valid = true;
                if(Ext.isEmpty(c)){
                    valid = false;
                }
                if(Ext.isString(c)){
                    c = Ext.ComponentMgr.get(comp);
                    valid = !Ext.isEmpty(c);
                }
                if(!valid){
                    A.error('Adding invalid component to container', this, c);
                    return false;
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext.DataView',
        checks: [{
            name: 'initComponent',
            fn: function(){
                if(!this.itemSelector){
                    A.error('No itemSelector specified', this);
                }
            }
        },{
            name: 'afterRender',
            fn: function(){
                if(!this.store){
                    A.error('No store attached to DataView', this);
                } 
            }
        }]
    });
    
    cls.push({
        name: 'Ext.Window',
        checks: [{
            name: 'show',
            intercept: true,
            fn: function(){
                if(this.isDestroyed){
                    A.error('Trying to show a destroyed window. If you want to reuse the window, look at the closeAction configuration.', this);
                    return false;
                } 
            }
        }]
    });
    
    cls.push({
        name: 'Ext.grid.GridPanel',
        checks: [{
            name: 'initComponent',
            fn: function(){
                if(!this.colModel){
                    A.error('No column model specified for grid', this);
                }
                if(!this.store){
                    A.error('No store specified for grid', this);
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext.grid.GridView',
        checks: [{
            name: 'autoExpand',
            intercept: true,
            fn: function(){
                var g = this.grid, 
                cm = this.cm;
                if(!this.userResized && g.autoExpandColumn){
                    var tw = cm.getTotalWidth(false), 
                        aw = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
                    if(tw != aw){
                        var ci = cm.getIndexById(g.autoExpandColumn);
                        if(ci == -1){
                            A.error('The autoExpandColumn does not exist in the column model', g, g.autoExpandColumn);
                            return false;
                        }
                    }
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext.chart.Chart',
        checks: [{
            name: 'initComponent',
            fn: function(){
                if(!this.store){
                    A.error('No store specified for chart', this);
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext.tree.TreePanel',
        checks: [{
            name: 'afterRender',
            intercept: true,
            fn: function(){
                if(!this.root){
                    A.error('No root node specified for tree', this);
                    return false;
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext',
        instance: true,
        checks: [{
            name: 'extend',
            intercept: true,
            fn: function(){
                if(arguments.length == 2 && !arguments[0]){
                    A.error('Invalid base class passed to extend', arguments[0]);
                    return false;
                }    
                if(arguments.length == 3){
                    if(!arguments[0]){
                        A.error('Invalid class to extend', arguments[0]);
                        return false;    
                    }else if(!arguments[1]){
                        A.error('Invalid base class passed to extend', arguments[1]);
                        return false;
                    }
                }
            }
        },{
            name: 'override',
            intercept: true,
            fn: function(c){
                if(!c){
                    A.error('Invalid class passed to override', c);
                    return false;
                }
            }
        }]    
    });
    
    cls.push({
        name: 'Ext.ComponentMgr',
        instance: true,
        checks: [{
            name: 'register',
            intercept: true,
            fn: function(c){
                if(this.all.indexOfKey(c.id) > -1){
                    A.warn('A component with this id already exists', c, c.id);
                }
            }
        },{
            name: 'create',
            intercept: true,
            fn: function(config, defaultType){
                var types = Ext.ComponentMgr.types;
                if(!config.render){
                    if(config.xtype){
                        if(!types[config.xtype]){
                            A.error('Unknown xtype specified', config, config.xtype);
                            return false;
                        }
                    }else{
                        if(!types[defaultType]){
                            A.error('Unknown defaultType specified', config, defaultType);
                            return false;
                        }
                    }
                }
            }
        }]
    });
    
    cls.push({
        name: 'Ext.layout.FitLayout',
        checks: [{
            name: 'onLayout',
            intercept: true,
            fn: function(){
                var ct = this.container;
                if(ct.items.getCount() > 1){
                    A.warn('More than 1 item in the container. A fit layout will only display a single item.', ct);
                }
            }
        }]
    });
    
    if(Ext.BLANK_IMAGE_URL == 'http:/' + '/www.extjs.com/s.gif'){
        A.warn('You should set the Ext.BLANK_IMAGE_URL to reference a local copy.');
    }
    
    A.init(cls);
    
        
})();