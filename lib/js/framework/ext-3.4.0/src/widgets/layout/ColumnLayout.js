/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.layout.ColumnLayout
 * @extends Ext.layout.ContainerLayout
 * <p>This is the layout style of choice for creating structural layouts in a multi-column format where the width of
 * each column can be specified as a percentage or fixed width, but the height is allowed to vary based on the content.
 * This class is intended to be extended or created via the layout:'column' {@link Ext.Container#layout} config,
 * and should generally not need to be created directly via the new keyword.</p>
 * <p>ColumnLayout does not have any direct config options (other than inherited ones), but it does support a
 * specific config property of <b><tt>columnWidth</tt></b> that can be included in the config of any panel added to it.  The
 * layout will use the columnWidth (if present) or width of each panel during layout to determine how to size each panel.
 * If width or columnWidth is not specified for a given panel, its width will default to the panel's width (or auto).</p>
 * <p>The width property is always evaluated as pixels, and must be a number greater than or equal to 1.
 * The columnWidth property is always evaluated as a percentage, and must be a decimal value greater than 0 and
 * less than 1 (e.g., .25).</p>
 * <p>The basic rules for specifying column widths are pretty simple.  The logic makes two passes through the
 * set of contained panels.  During the first layout pass, all panels that either have a fixed width or none
 * specified (auto) are skipped, but their widths are subtracted from the overall container width.  During the second
 * pass, all panels with columnWidths are assigned pixel widths in proportion to their percentages based on
 * the total <b>remaining</b> container width.  In other words, percentage width panels are designed to fill the space
 * left over by all the fixed-width and/or auto-width panels.  Because of this, while you can specify any number of columns
 * with different percentages, the columnWidths must always add up to 1 (or 100%) when added together, otherwise your
 * layout may not render as expected.  Example usage:</p>
 * <pre><code>
// All columns are percentages -- they must add up to 1
var p = new Ext.Panel({
    title: 'Column Layout - Percentage Only',
    layout:'column',
    items: [{
        title: 'Column 1',
        columnWidth: .25
    },{
        title: 'Column 2',
        columnWidth: .6
    },{
        title: 'Column 3',
        columnWidth: .15
    }]
});

// Mix of width and columnWidth -- all columnWidth values must add up
// to 1. The first column will take up exactly 120px, and the last two
// columns will fill the remaining container width.
var p = new Ext.Panel({
    title: 'Column Layout - Mixed',
    layout:'column',
    items: [{
        title: 'Column 1',
        width: 120
    },{
        title: 'Column 2',
        columnWidth: .8
    },{
        title: 'Column 3',
        columnWidth: .2
    }]
});
</code></pre>
 */
Ext.layout.ColumnLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    type: 'column',

    extraCls: 'x-column',

    scrollOffset : 0,

    // private

    targetCls: 'x-column-layout-ct',

    isValidParent : function(c, target){
        return this.innerCt && c.getPositionEl().dom.parentNode == this.innerCt.dom;
    },

    getLayoutTargetSize : function() {
        var target = this.container.getLayoutTarget(), ret;
        if (target) {
            ret = target.getViewSize();

            // IE in strict mode will return a width of 0 on the 1st pass of getViewSize.
            // Use getStyleSize to verify the 0 width, the adjustment pass will then work properly
            // with getViewSize
            if (Ext.isIE && Ext.isStrict && ret.width == 0){
                ret =  target.getStyleSize();
            }

            ret.width -= target.getPadding('lr');
            ret.height -= target.getPadding('tb');
        }
        return ret;
    },

    renderAll : function(ct, target) {
        if(!this.innerCt){
            // the innerCt prevents wrapping and shuffling while
            // the container is resizing
            this.innerCt = target.createChild({cls:'x-column-inner'});
            this.innerCt.createChild({cls:'x-clear'});
        }
        Ext.layout.ColumnLayout.superclass.renderAll.call(this, ct, this.innerCt);
    },

    // private
    onLayout : function(ct, target){
        var cs = ct.items.items,
            len = cs.length,
            c,
            i,
            m,
            margins = [];

        this.renderAll(ct, target);

        var size = this.getLayoutTargetSize();

        if(size.width < 1 && size.height < 1){ // display none?
            return;
        }

        var w = size.width - this.scrollOffset,
            h = size.height,
            pw = w;

        this.innerCt.setWidth(w);

        // some columns can be percentages while others are fixed
        // so we need to make 2 passes

        for(i = 0; i < len; i++){
            c = cs[i];
            m = c.getPositionEl().getMargins('lr');
            margins[i] = m;
            if(!c.columnWidth){
                pw -= (c.getWidth() + m);
            }
        }

        pw = pw < 0 ? 0 : pw;

        for(i = 0; i < len; i++){
            c = cs[i];
            m = margins[i];
            if(c.columnWidth){
                c.setSize(Math.floor(c.columnWidth * pw) - m);
            }
        }

        // Browsers differ as to when they account for scrollbars.  We need to re-measure to see if the scrollbar
        // spaces were accounted for properly.  If not, re-layout.
        if (Ext.isIE) {
            if (i = target.getStyle('overflow') && i != 'hidden' && !this.adjustmentPass) {
                var ts = this.getLayoutTargetSize();
                if (ts.width != size.width){
                    this.adjustmentPass = true;
                    this.onLayout(ct, target);
                }
            }
        }
        delete this.adjustmentPass;
    }

    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['column'] = Ext.layout.ColumnLayout;
