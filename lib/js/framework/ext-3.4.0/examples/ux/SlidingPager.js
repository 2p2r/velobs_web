/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * Plugin for PagingToolbar which replaces the textfield input with a slider 
 */
Ext.ux.SlidingPager = Ext.extend(Object, {
    init : function(pbar){
        var idx = pbar.items.indexOf(pbar.inputItem);
        Ext.each(pbar.items.getRange(idx - 2, idx + 2), function(c){
            c.hide();
        });
        var slider = new Ext.Slider({
            width: 114,
            minValue: 1,
            maxValue: 1,
            plugins: new Ext.slider.Tip({
                getText : function(thumb) {
                    return String.format('Page <b>{0}</b> of <b>{1}</b>', thumb.value, thumb.slider.maxValue);
                }
            }),
            listeners: {
                changecomplete: function(s, v){
                    pbar.changePage(v);
                }
            }
        });
        pbar.insert(idx + 1, slider);
        pbar.on({
            change: function(pb, data){
                slider.setMaxValue(data.pages);
                slider.setValue(data.activePage);
            }
        });
    }
});