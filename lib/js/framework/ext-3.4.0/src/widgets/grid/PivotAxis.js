/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.grid.PivotAxis
 * @extends Ext.Component
 * <p>PivotAxis is a class that supports a {@link Ext.grid.PivotGrid}. Each PivotGrid contains two PivotAxis instances - the left
 * axis and the top axis. Each PivotAxis defines an ordered set of dimensions, each of which should correspond to a field in a
 * Store's Record (see {@link Ext.grid.PivotGrid} documentation for further explanation).</p>
 * <p>Developers should have little interaction with the PivotAxis instances directly as most of their management is performed by
 * the PivotGrid. An exception is the dynamic reconfiguration of axes at run time - to achieve this we use PivotAxis's 
 * {@link #setDimensions} function and refresh the grid:</p>
<pre><code>
var pivotGrid = new Ext.grid.PivotGrid({
    //some PivotGrid config here
});

//change the left axis dimensions
pivotGrid.leftAxis.setDimensions([
    {
        dataIndex: 'person',
        direction: 'DESC',
        width    : 100
    },
    {
        dataIndex: 'product',
        direction: 'ASC',
        width    : 80
    }
]);

pivotGrid.view.refresh(true);
</code></pre>
 * This clears the previous dimensions on the axis and redraws the grid with the new dimensions.
 */
Ext.grid.PivotAxis = Ext.extend(Ext.Component, {
    /**
     * @cfg {String} orientation One of 'vertical' or 'horizontal'. Defaults to horizontal
     */
    orientation: 'horizontal',
    
    /**
     * @cfg {Number} defaultHeaderWidth The width to render each row header that does not have a width specified via 
     {@link #getRowGroupHeaders}. Defaults to 80.
     */
    defaultHeaderWidth: 80,
    
    /**
     * @private
     * @cfg {Number} paddingWidth The amount of padding used by each cell.
     * TODO: From 4.x onwards this can be removed as it won't be needed. For now it is used to account for the differences between
     * the content box and border box measurement models
     */
    paddingWidth: 7,
    
    /**
     * Updates the dimensions used by this axis
     * @param {Array} dimensions The new dimensions
     */
    setDimensions: function(dimensions) {
        this.dimensions = dimensions;
    },
    
    /**
     * @private
     * Builds the html table that contains the dimensions for this axis. This branches internally between vertical
     * and horizontal orientations because the table structure is slightly different in each case
     */
    onRender: function(ct, position) {
        var rows = this.orientation == 'horizontal'
                 ? this.renderHorizontalRows()
                 : this.renderVerticalRows();
        
        this.el = Ext.DomHelper.overwrite(ct.dom, {tag: 'table', cn: rows}, true);
    },
    
    /**
     * @private
     * Specialised renderer for horizontal oriented axes
     * @return {Object} The HTML Domspec for a horizontal oriented axis
     */
    renderHorizontalRows: function() {
        var headers  = this.buildHeaders(),
            rowCount = headers.length,
            rows     = [],
            cells, cols, colCount, i, j;
        
        for (i = 0; i < rowCount; i++) {
            cells = [];
            cols  = headers[i].items;
            colCount = cols.length;

            for (j = 0; j < colCount; j++) {
                cells.push({
                    tag: 'td',
                    html: cols[j].header,
                    colspan: cols[j].span
                });
            }

            rows[i] = {
                tag: 'tr',
                cn: cells
            };
        }
        
        return rows;
    },
    
    /**
     * @private
     * Specialised renderer for vertical oriented axes
     * @return {Object} The HTML Domspec for a vertical oriented axis
     */
    renderVerticalRows: function() {
        var headers  = this.buildHeaders(),
            colCount = headers.length,
            rowCells = [],
            rows     = [],
            rowCount, col, row, colWidth, i, j;
        
        for (i = 0; i < colCount; i++) {
            col = headers[i];
            colWidth = col.width || 80;
            rowCount = col.items.length;
            
            for (j = 0; j < rowCount; j++) {
                row = col.items[j];
                
                rowCells[row.start] = rowCells[row.start] || [];
                rowCells[row.start].push({
                    tag    : 'td',
                    html   : row.header,
                    rowspan: row.span,
                    width  : Ext.isBorderBox ? colWidth : colWidth - this.paddingWidth
                });
            }
        }
        
        rowCount = rowCells.length;
        for (i = 0; i < rowCount; i++) {
            rows[i] = {
                tag: 'tr',
                cn : rowCells[i]
            };
        }
        
        return rows;
    },
    
    /**
     * @private
     * Returns the set of all unique tuples based on the bound store and dimension definitions.
     * Internally we construct a new, temporary store to make use of the multi-sort capabilities of Store. In
     * 4.x this functionality should have been moved to MixedCollection so this step should not be needed.
     * @return {Array} All unique tuples
     */
    getTuples: function() {
        var newStore = new Ext.data.Store({});
        
        newStore.data = this.store.data.clone();
        newStore.fields = this.store.fields;
        
        var sorters    = [],
            dimensions = this.dimensions,
            length     = dimensions.length,
            i;
        
        for (i = 0; i < length; i++) {
            sorters.push({
                field    : dimensions[i].dataIndex,
                direction: dimensions[i].direction || 'ASC'
            });
        }
        
        newStore.sort(sorters);
        
        var records = newStore.data.items,
            hashes  = [],
            tuples  = [],
            recData, hash, info, data, key;
        
        length = records.length;
        
        for (i = 0; i < length; i++) {
            info = this.getRecordInfo(records[i]);
            data = info.data;
            hash = "";
            
            for (key in data) {
                hash += data[key] + '---';
            }
            
            if (hashes.indexOf(hash) == -1) {
                hashes.push(hash);
                tuples.push(info);
            }
        }
        
        newStore.destroy();
        
        return tuples;
    },
    
    /**
     * @private
     */
    getRecordInfo: function(record) {
        var dimensions = this.dimensions,
            length  = dimensions.length,
            data    = {},
            dimension, dataIndex, i;
        
        //get an object containing just the data we are interested in based on the configured dimensions
        for (i = 0; i < length; i++) {
            dimension = dimensions[i];
            dataIndex = dimension.dataIndex;
            
            data[dataIndex] = record.get(dataIndex);
        }
        
        //creates a specialised matcher function for a given tuple. The returned function will return
        //true if the record passed to it matches the dataIndex values of each dimension in this axis
        var createMatcherFunction = function(data) {
            return function(record) {
                for (var dataIndex in data) {
                    if (record.get(dataIndex) != data[dataIndex]) {
                        return false;
                    }
                }
                
                return true;
            };
        };
        
        return {
            data: data,
            matcher: createMatcherFunction(data)
        };
    },
    
    /**
     * @private
     * Uses the calculated set of tuples to build an array of headers that can be rendered into a table using rowspan or
     * colspan. Basically this takes the set of tuples and spans any cells that run into one another, so if we had dimensions
     * of Person and Product and several tuples containing different Products for the same Person, those Products would be
     * spanned.
     * @return {Array} The headers
     */
    buildHeaders: function() {
        var tuples     = this.getTuples(),
            rowCount   = tuples.length,
            dimensions = this.dimensions,
            dimension,
            colCount   = dimensions.length,
            headers    = [],
            tuple, rows, currentHeader, previousHeader, span, start, isLast, changed, i, j;
        
        for (i = 0; i < colCount; i++) {
            dimension = dimensions[i];
            rows  = [];
            span  = 0;
            start = 0;
            
            for (j = 0; j < rowCount; j++) {
                tuple  = tuples[j];
                isLast = j == (rowCount - 1);
                currentHeader = tuple.data[dimension.dataIndex];
                
                /*
                 * 'changed' indicates that we need to create a new cell. This should be true whenever the cell
                 * above (previousHeader) is different from this cell, or when the cell on the previous dimension
                 * changed (e.g. if the current dimension is Product and the previous was Person, we need to start
                 * a new cell if Product is the same but Person changed, so we check the previous dimension and tuple)
                 */
                changed = previousHeader != undefined && previousHeader != currentHeader;
                if (i > 0 && j > 0) {
                    changed = changed || tuple.data[dimensions[i-1].dataIndex] != tuples[j-1].data[dimensions[i-1].dataIndex];
                }
                
                if (changed) {                    
                    rows.push({
                        header: previousHeader,
                        span  : span,
                        start : start
                    });
                    
                    start += span;
                    span = 0;
                }
                
                if (isLast) {
                    rows.push({
                        header: currentHeader,
                        span  : span + 1,
                        start : start
                    });
                    
                    start += span;
                    span = 0;
                }
                
                previousHeader = currentHeader;
                span++;
            }
            
            headers.push({
                items: rows,
                width: dimension.width || this.defaultHeaderWidth
            });
            
            previousHeader = undefined;
        }
        
        return headers;
    }
});
