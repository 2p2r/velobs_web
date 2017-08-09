/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.layout.VBoxLayout
 * @extends Ext.layout.BoxLayout
 * <p>A layout that arranges items vertically down a Container. This layout optionally divides available vertical
 * space between child items containing a numeric <code>flex</code> configuration.</p>
 * This layout may also be used to set the widths of child items by configuring it with the {@link #align} option.
 */
Ext.layout.VBoxLayout = Ext.extend(Ext.layout.BoxLayout, {
    /**
     * @cfg {String} align
     * Controls how the child items of the container are aligned. Acceptable configuration values for this
     * property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>left</tt></b> : <b>Default</b><div class="sub-desc">child items are aligned horizontally
     * at the <b>left</b> side of the container</div></li>
     * <li><b><tt>center</tt></b> : <div class="sub-desc">child items are aligned horizontally at the
     * <b>mid-width</b> of the container</div></li>
     * <li><b><tt>stretch</tt></b> : <div class="sub-desc">child items are stretched horizontally to fill
     * the width of the container</div></li>
     * <li><b><tt>stretchmax</tt></b> : <div class="sub-desc">child items are stretched horizontally to
     * the size of the largest item.</div></li>
     * </ul></div>
     */
    align : 'left', // left, center, stretch, strechmax
    type: 'vbox',

    /**
     * @cfg {String} pack
     * Controls how the child items of the container are packed together. Acceptable configuration values
     * for this property are:
     * <div class="mdetail-params"><ul>
     * <li><b><tt>start</tt></b> : <b>Default</b><div class="sub-desc">child items are packed together at
     * <b>top</b> side of container</div></li>
     * <li><b><tt>center</tt></b> : <div class="sub-desc">child items are packed together at
     * <b>mid-height</b> of container</div></li>
     * <li><b><tt>end</tt></b> : <div class="sub-desc">child items are packed together at <b>bottom</b>
     * side of container</div></li>
     * </ul></div>
     */

    /**
     * @cfg {Number} flex
     * This configuation option is to be applied to <b>child <tt>items</tt></b> of the container managed
     * by this layout. Each child item with a <tt>flex</tt> property will be flexed <b>vertically</b>
     * according to each item's <b>relative</b> <tt>flex</tt> value compared to the sum of all items with
     * a <tt>flex</tt> value specified.  Any child items that have either a <tt>flex = 0</tt> or
     * <tt>flex = undefined</tt> will not be 'flexed' (the initial size will not be changed).
     */

    /**
     * @private
     * Calculates the size and positioning of each item in the VBox. This iterates over all of the rendered,
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
            availWidth   = Math.max(0, width - paddingHoriz),

            isStart      = this.pack == 'start',
            isCenter     = this.pack == 'center',
            isEnd        = this.pack == 'end',

            nonFlexHeight= 0,
            maxWidth     = 0,
            totalFlex    = 0,
            desiredHeight= 0,
            minimumHeight= 0,

            //used to cache the calculated size and position values for each child item
            boxes        = [],
            
            //used in the for loops below, just declared here for brevity
            child, childWidth, childHeight, childSize, childMargins, canLayout, i, calcs, flexedHeight, 
            horizMargins, vertMargins, stretchWidth, length;

        //gather the total flex of all flexed items and the width taken up by fixed width items
        for (i = 0; i < visibleCount; i++) {
            child = visibleItems[i];
            childHeight = child.height;
            childWidth  = child.width;
            canLayout   = !child.hasLayout && typeof child.doLayout == 'function';

            // Static height (numeric) requires no calcs
            if (typeof childHeight != 'number') {

                // flex and not 'auto' height
                if (child.flex && !childHeight) {
                    totalFlex += child.flex;

                // Not flexed or 'auto' height or undefined height
                } else {
                    //Render and layout sub-containers without a flex or width defined, as otherwise we
                    //don't know how wide the sub-container should be and cannot calculate flexed widths
                    if (!childHeight && canLayout) {
                        child.doLayout();
                    }

                    childSize = child.getSize();
                    childWidth = childSize.width;
                    childHeight = childSize.height;
                }
            }
            
            childMargins = child.margins;
            vertMargins  = childMargins.top + childMargins.bottom;

            nonFlexHeight += vertMargins + (childHeight || 0);
            desiredHeight += vertMargins + (child.flex ? child.minHeight || 0 : childHeight);
            minimumHeight += vertMargins + (child.minHeight || childHeight || 0);

            // Max width for align - force layout of non-layed out subcontainers without a numeric width
            if (typeof childWidth != 'number') {
                if (canLayout) {
                    child.doLayout();
                }
                childWidth = child.getWidth();
            }

            maxWidth = Math.max(maxWidth, childWidth + childMargins.left + childMargins.right);

            //cache the size of each child component
            boxes.push({
                component: child,
                height   : childHeight || undefined,
                width    : childWidth || undefined
            });
        }
                
        var shortfall = desiredHeight - height,
            tooNarrow = minimumHeight > height;

        //the height available to the flexed items
        var availableHeight = Math.max(0, (height - nonFlexHeight - paddingVert));
        
        if (tooNarrow) {
            for (i = 0, length = visibleCount; i < length; i++) {
                boxes[i].height = visibleItems[i].minHeight || visibleItems[i].height || boxes[i].height;
            }
        } else {
            //all flexed items should be sized to their minimum width, other items should be shrunk down until
            //the shortfall has been accounted for
            if (shortfall > 0) {
                var minHeights = [];

                /**
                 * When we have a shortfall but are not tooNarrow, we need to shrink the height of each non-flexed item.
                 * Flexed items are immediately reduced to their minHeight and anything already at minHeight is ignored.
                 * The remaining items are collected into the minHeights array, which is later used to distribute the shortfall.
                 */
                for (var index = 0, length = visibleCount; index < length; index++) {
                    var item      = visibleItems[index],
                        minHeight = item.minHeight || 0;

                    //shrink each non-flex tab by an equal amount to make them all fit. Flexed items are all
                    //shrunk to their minHeight because they're flexible and should be the first to lose height
                    if (item.flex) {
                        boxes[index].height = minHeight;
                    } else {
                        minHeights.push({
                            minHeight: minHeight, 
                            available: boxes[index].height - minHeight,
                            index    : index
                        });
                    }
                }

                //sort by descending minHeight value
                minHeights.sort(function(a, b) {
                    return a.available > b.available ? 1 : -1;
                });

                /*
                 * Distribute the shortfall (difference between total desired with of all items and actual height available)
                 * between the non-flexed items. We try to distribute the shortfall evenly, but apply it to items with the
                 * smallest difference between their height and minHeight first, so that if reducing the height by the average
                 * amount would make that item less than its minHeight, we carry the remainder over to the next item.
                 */
                for (var i = 0, length = minHeights.length; i < length; i++) {
                    var itemIndex = minHeights[i].index;

                    if (itemIndex == undefined) {
                        continue;
                    }

                    var item      = visibleItems[itemIndex],
                        box       = boxes[itemIndex],
                        oldHeight  = box.height,
                        minHeight  = item.minHeight,
                        newHeight  = Math.max(minHeight, oldHeight - Math.ceil(shortfall / (length - i))),
                        reduction = oldHeight - newHeight;

                    boxes[itemIndex].height = newHeight;
                    shortfall -= reduction;
                }
            } else {
                //temporary variables used in the flex height calculations below
                var remainingHeight = availableHeight,
                    remainingFlex   = totalFlex;
                
                //calculate the height of each flexed item
                for (i = 0; i < visibleCount; i++) {
                    child = visibleItems[i];
                    calcs = boxes[i];

                    childMargins = child.margins;
                    horizMargins = childMargins.left + childMargins.right;

                    if (isStart && child.flex && !child.height) {
                        flexedHeight     = Math.ceil((child.flex / remainingFlex) * remainingHeight);
                        remainingHeight -= flexedHeight;
                        remainingFlex   -= child.flex;

                        calcs.height = flexedHeight;
                        calcs.dirtySize = true;
                    }
                }
            }
        }

        if (isCenter) {
            topOffset += availableHeight / 2;
        } else if (isEnd) {
            topOffset += availableHeight;
        }

        //finally, calculate the left and top position of each item
        for (i = 0; i < visibleCount; i++) {
            child = visibleItems[i];
            calcs = boxes[i];

            childMargins = child.margins;
            topOffset   += childMargins.top;
            horizMargins = childMargins.left + childMargins.right;
            

            calcs.left = leftOffset + childMargins.left;
            calcs.top  = topOffset;
            
            switch (this.align) {
                case 'stretch':
                    stretchWidth = availWidth - horizMargins;
                    calcs.width  = stretchWidth.constrain(child.minWidth || 0, child.maxWidth || 1000000);
                    calcs.dirtySize = true;
                    break;
                case 'stretchmax':
                    stretchWidth = maxWidth - horizMargins;
                    calcs.width  = stretchWidth.constrain(child.minWidth || 0, child.maxWidth || 1000000);
                    calcs.dirtySize = true;
                    break;
                case 'center':
                    var diff = availWidth - calcs.width - horizMargins;
                    if (diff > 0) {
                        calcs.left = leftOffset + horizMargins + (diff / 2);
                    }
            }

            topOffset += calcs.height + childMargins.bottom;
        }
        
        return {
            boxes: boxes,
            meta : {
                maxWidth     : maxWidth,
                nonFlexHeight: nonFlexHeight,
                desiredHeight: desiredHeight,
                minimumHeight: minimumHeight,
                shortfall    : desiredHeight - height,
                tooNarrow    : tooNarrow
            }
        };
    }
});

Ext.Container.LAYOUTS.vbox = Ext.layout.VBoxLayout;
