/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.layout.HBoxLayout
 * @extends Ext.layout.BoxLayout
 * <p>A layout that arranges items horizontally across a Container. This layout optionally divides available horizontal
 * space between child items containing a numeric <code>flex</code> configuration.</p>
 * This layout may also be used to set the heights of child items by configuring it with the {@link #align} option.
 */
Ext.layout.HBoxLayout = Ext.extend(Ext.layout.BoxLayout, {
    /**
     * @cfg {String} align
     * Controls how the child items of the container are aligned. Acceptable configuration values for this
     * property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>top</tt></b> : <b>Default</b><div class="sub-desc">child items are aligned vertically
     * at the <b>top</b> of the container</div></li>
     * <li><b><tt>middle</tt></b> : <div class="sub-desc">child items are aligned vertically in the
     * <b>middle</b> of the container</div></li>
     * <li><b><tt>stretch</tt></b> : <div class="sub-desc">child items are stretched vertically to fill
     * the height of the container</div></li>
     * <li><b><tt>stretchmax</tt></b> : <div class="sub-desc">child items are stretched vertically to
     * the height of the largest item.</div></li>
     */
    align: 'top', // top, middle, stretch, strechmax

    type : 'hbox',

    /**
     * @cfg {String} pack
     * Controls how the child items of the container are packed together. Acceptable configuration values
     * for this property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>start</tt></b> : <b>Default</b><div class="sub-desc">child items are packed together at
     * <b>left</b> side of container</div></li>
     * <li><b><tt>center</tt></b> : <div class="sub-desc">child items are packed together at
     * <b>mid-width</b> of container</div></li>
     * <li><b><tt>end</tt></b> : <div class="sub-desc">child items are packed together at <b>right</b>
     * side of container</div></li>
     * </ul></div>
     */
    /**
     * @cfg {Number} flex
     * This configuation option is to be applied to <b>child <tt>items</tt></b> of the container managed
     * by this layout. Each child item with a <tt>flex</tt> property will be flexed <b>horizontally</b>
     * according to each item's <b>relative</b> <tt>flex</tt> value compared to the sum of all items with
     * a <tt>flex</tt> value specified.  Any child items that have either a <tt>flex = 0</tt> or
     * <tt>flex = undefined</tt> will not be 'flexed' (the initial size will not be changed).
     */

    /**
     * @private
     * Calculates the size and positioning of each item in the HBox. This iterates over all of the rendered,
     * visible items and returns a height, width, top and left for each, as well as a reference to each. Also
     * returns meta data such as maxHeight which are useful when resizing layout wrappers such as this.innerCt.
     * @param {Array} visibleItems The array of all rendered, visible items to be calculated for
     * @param {Object} targetSize Object containing target size and height
     * @return {Object} Object containing box measurements for each child, plus meta data
     */
    calculateChildBoxes: function(visibleItems, targetSize) {
        var visibleCount = visibleItems.length,

            padding      = this.padding,
            topOffset    = padding.top,
            leftOffset   = padding.left,
            paddingVert  = topOffset  + padding.bottom,
            paddingHoriz = leftOffset + padding.right,

            width        = targetSize.width - this.scrollOffset,
            height       = targetSize.height,
            availHeight  = Math.max(0, height - paddingVert),

            isStart      = this.pack == 'start',
            isCenter     = this.pack == 'center',
            isEnd        = this.pack == 'end',

            nonFlexWidth = 0,
            maxHeight    = 0,
            totalFlex    = 0,
            desiredWidth = 0,
            minimumWidth = 0,

            //used to cache the calculated size and position values for each child item
            boxes        = [],

            //used in the for loops below, just declared here for brevity
            child, childWidth, childHeight, childSize, childMargins, canLayout, i, calcs, flexedWidth, 
            horizMargins, vertMargins, stretchHeight;

        //gather the total flex of all flexed items and the width taken up by fixed width items
        for (i = 0; i < visibleCount; i++) {
            child       = visibleItems[i];
            childHeight = child.height;
            childWidth  = child.width;
            canLayout   = !child.hasLayout && typeof child.doLayout == 'function';

            // Static width (numeric) requires no calcs
            if (typeof childWidth != 'number') {

                // flex and not 'auto' width
                if (child.flex && !childWidth) {
                    totalFlex += child.flex;

                // Not flexed or 'auto' width or undefined width
                } else {
                    //Render and layout sub-containers without a flex or width defined, as otherwise we
                    //don't know how wide the sub-container should be and cannot calculate flexed widths
                    if (!childWidth && canLayout) {
                        child.doLayout();
                    }

                    childSize   = child.getSize();
                    childWidth  = childSize.width;
                    childHeight = childSize.height;
                }
            }

            childMargins = child.margins;
            horizMargins = childMargins.left + childMargins.right;

            nonFlexWidth += horizMargins + (childWidth || 0);
            desiredWidth += horizMargins + (child.flex ? child.minWidth || 0 : childWidth);
            minimumWidth += horizMargins + (child.minWidth || childWidth || 0);

            // Max height for align - force layout of non-laid out subcontainers without a numeric height
            if (typeof childHeight != 'number') {
                if (canLayout) {
                    child.doLayout();
                }
                childHeight = child.getHeight();
            }

            maxHeight = Math.max(maxHeight, childHeight + childMargins.top + childMargins.bottom);

            //cache the size of each child component. Don't set height or width to 0, keep undefined instead
            boxes.push({
                component: child,
                height   : childHeight || undefined,
                width    : childWidth  || undefined
            });
        }
                
        var shortfall = desiredWidth - width,
            tooNarrow = minimumWidth > width;
            
        //the width available to the flexed items
        var availableWidth = Math.max(0, width - nonFlexWidth - paddingHoriz);
        
        if (tooNarrow) {
            for (i = 0; i < visibleCount; i++) {
                boxes[i].width = visibleItems[i].minWidth || visibleItems[i].width || boxes[i].width;
            }
        } else {
            //all flexed items should be sized to their minimum width, other items should be shrunk down until
            //the shortfall has been accounted for
            if (shortfall > 0) {
                var minWidths = [];
                
                /**
                 * When we have a shortfall but are not tooNarrow, we need to shrink the width of each non-flexed item.
                 * Flexed items are immediately reduced to their minWidth and anything already at minWidth is ignored.
                 * The remaining items are collected into the minWidths array, which is later used to distribute the shortfall.
                 */
                for (var index = 0, length = visibleCount; index < length; index++) {
                    var item     = visibleItems[index],
                        minWidth = item.minWidth || 0;

                    //shrink each non-flex tab by an equal amount to make them all fit. Flexed items are all
                    //shrunk to their minWidth because they're flexible and should be the first to lose width
                    if (item.flex) {
                        boxes[index].width = minWidth;
                    } else {
                        minWidths.push({
                            minWidth : minWidth,
                            available: boxes[index].width - minWidth,
                            index    : index
                        });
                    }
                }
                
                //sort by descending amount of width remaining before minWidth is reached
                minWidths.sort(function(a, b) {
                    return a.available > b.available ? 1 : -1;
                });
                
                /*
                 * Distribute the shortfall (difference between total desired with of all items and actual width available)
                 * between the non-flexed items. We try to distribute the shortfall evenly, but apply it to items with the
                 * smallest difference between their width and minWidth first, so that if reducing the width by the average
                 * amount would make that item less than its minWidth, we carry the remainder over to the next item.
                 */
                for (var i = 0, length = minWidths.length; i < length; i++) {
                    var itemIndex = minWidths[i].index;
                    
                    if (itemIndex == undefined) {
                        continue;
                    }
                        
                    var item      = visibleItems[itemIndex],
                        box       = boxes[itemIndex],
                        oldWidth  = box.width,
                        minWidth  = item.minWidth,
                        newWidth  = Math.max(minWidth, oldWidth - Math.ceil(shortfall / (length - i))),
                        reduction = oldWidth - newWidth;
                    
                    boxes[itemIndex].width = newWidth;
                    shortfall -= reduction;                    
                }
            } else {
                //temporary variables used in the flex width calculations below
                var remainingWidth = availableWidth,
                    remainingFlex  = totalFlex;

                //calculate the widths of each flexed item
                for (i = 0; i < visibleCount; i++) {
                    child = visibleItems[i];
                    calcs = boxes[i];

                    childMargins = child.margins;
                    vertMargins  = childMargins.top + childMargins.bottom;

                    if (isStart && child.flex && !child.width) {
                        flexedWidth     = Math.ceil((child.flex / remainingFlex) * remainingWidth);
                        remainingWidth -= flexedWidth;
                        remainingFlex  -= child.flex;

                        calcs.width = flexedWidth;
                        calcs.dirtySize = true;
                    }
                }
            }
        }
        
        if (isCenter) {
            leftOffset += availableWidth / 2;
        } else if (isEnd) {
            leftOffset += availableWidth;
        }
        
        //finally, calculate the left and top position of each item
        for (i = 0; i < visibleCount; i++) {
            child = visibleItems[i];
            calcs = boxes[i];
            
            childMargins = child.margins;
            leftOffset  += childMargins.left;
            vertMargins  = childMargins.top + childMargins.bottom;
            
            calcs.left = leftOffset;
            calcs.top  = topOffset + childMargins.top;

            switch (this.align) {
                case 'stretch':
                    stretchHeight = availHeight - vertMargins;
                    calcs.height  = stretchHeight.constrain(child.minHeight || 0, child.maxHeight || 1000000);
                    calcs.dirtySize = true;
                    break;
                case 'stretchmax':
                    stretchHeight = maxHeight - vertMargins;
                    calcs.height  = stretchHeight.constrain(child.minHeight || 0, child.maxHeight || 1000000);
                    calcs.dirtySize = true;
                    break;
                case 'middle':
                    var diff = availHeight - calcs.height - vertMargins;
                    if (diff > 0) {
                        calcs.top = topOffset + vertMargins + (diff / 2);
                    }
            }
            
            leftOffset += calcs.width + childMargins.right;
        }

        return {
            boxes: boxes,
            meta : {
                maxHeight   : maxHeight,
                nonFlexWidth: nonFlexWidth,
                desiredWidth: desiredWidth,
                minimumWidth: minimumWidth,
                shortfall   : desiredWidth - width,
                tooNarrow   : tooNarrow
            }
        };
    }
});

Ext.Container.LAYOUTS.hbox = Ext.layout.HBoxLayout;