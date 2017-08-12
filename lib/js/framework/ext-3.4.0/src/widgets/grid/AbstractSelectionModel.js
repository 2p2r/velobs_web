/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.grid.AbstractSelectionModel
 * @extends Ext.util.Observable
 * Abstract base class for grid SelectionModels.  It provides the interface that should be
 * implemented by descendant classes.  This class should not be directly instantiated.
 * @constructor
 */
Ext.grid.AbstractSelectionModel = Ext.extend(Ext.util.Observable,  {
    /**
     * The GridPanel for which this SelectionModel is handling selection. Read-only.
     * @type Object
     * @property grid
     */

    constructor : function(){
        this.locked = false;
        Ext.grid.AbstractSelectionModel.superclass.constructor.call(this);
    },

    /** @ignore Called by the grid automatically. Do not call directly. */
    init : function(grid){
        this.grid = grid;
        if(this.lockOnInit){
            delete this.lockOnInit;
            this.locked = false;
            this.lock();
        }
        this.initEvents();
    },

    /**
     * Locks the selections.
     */
    lock : function(){
        if(!this.locked){
            this.locked = true;
            // If the grid has been set, then the view is already initialized.
            var g = this.grid;
            if(g){
                g.getView().on({
                    scope: this,
                    beforerefresh: this.sortUnLock,
                    refresh: this.sortLock
                });
            }else{
                this.lockOnInit = true;
            }
        }
    },

    // set the lock states before and after a view refresh
    sortLock : function() {
        this.locked = true;
    },

    // set the lock states before and after a view refresh
    sortUnLock : function() {
        this.locked = false;
    },

    /**
     * Unlocks the selections.
     */
    unlock : function(){
        if(this.locked){
            this.locked = false;
            var g = this.grid,
                gv;
                
            // If the grid has been set, then the view is already initialized.
            if(g){
                gv = g.getView();
                gv.un('beforerefresh', this.sortUnLock, this);
                gv.un('refresh', this.sortLock, this);    
            }else{
                delete this.lockOnInit;
            }
        }
    },

    /**
     * Returns true if the selections are locked.
     * @return {Boolean}
     */
    isLocked : function(){
        return this.locked;
    },

    destroy: function(){
        this.unlock();
        this.purgeListeners();
    }
});