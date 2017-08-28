/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.onReady(function() {
    var toolbar = new Ext.Toolbar({
        plugins : [
            new Ext.ux.ToolbarReorderer({
                defaultReorderable: true
            })
        ],
        items   : [
            {
                xtype:'splitbutton',
                text: 'Menu Button',
                iconCls: 'add16',
                menu: [{text: 'Menu Item 1'}],
                reorderable: false
            },
            {
                xtype:'splitbutton',
                text: 'Cut',
                iconCls: 'add16',
                menu: [{text: 'Cut Menu Item'}]
            },
            {
                text: 'Copy',
                iconCls: 'add16'
            },
            {
                text: 'Paste',
                iconCls: 'add16',
                menu: [{text: 'Paste Menu Item'}],
                reorderable: true
            },
            {
                text: 'Format',
                iconCls: 'add16',
                reorderable: true
            }
        ]
    });

    new Ext.Panel({
        renderTo: document.body,
        tbar    : toolbar,
        border  : true,
        width   : 600,
        height  : 300
    });
});