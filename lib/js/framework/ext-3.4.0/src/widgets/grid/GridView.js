/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.grid.GridView
 * @extends Ext.util.Observable
 * <p>This class encapsulates the user interface of an {@link Ext.grid.GridPanel}.
 * Methods of this class may be used to access user interface elements to enable
 * special display effects. Do not change the DOM structure of the user interface.</p>
 * <p>This class does not provide ways to manipulate the underlying data. The data
 * model of a Grid is held in an {@link Ext.data.Store}.</p>
 * @constructor
 * @param {Object} config
 */
Ext.grid.GridView = Ext.extend(Ext.util.Observable, {
    /**
     * Override this function to apply custom CSS classes to rows during rendering.  You can also supply custom
     * parameters to the row template for the current row to customize how it is rendered using the <b>rowParams</b>
     * parameter.  This function should return the CSS class name (or empty string '' for none) that will be added
     * to the row's wrapping div.  To apply multiple class names, simply return them space-delimited within the string
     * (e.g., 'my-class another-class'). Example usage:
    <pre><code>
viewConfig: {
    forceFit: true,
    showPreview: true, // custom property
    enableRowBody: true, // required to create a second, full-width row to show expanded Record data
    getRowClass: function(record, rowIndex, rp, ds){ // rp = rowParams
        if(this.showPreview){
            rp.body = '&lt;p>'+record.data.excerpt+'&lt;/p>';
            return 'x-grid3-row-expanded';
        }
        return 'x-grid3-row-collapsed';
    }
},
    </code></pre>
     * @param {Record} record The {@link Ext.data.Record} corresponding to the current row.
     * @param {Number} index The row index.
     * @param {Object} rowParams A config object that is passed to the row template during rendering that allows
     * customization of various aspects of a grid row.
     * <p>If {@link #enableRowBody} is configured <b><tt></tt>true</b>, then the following properties may be set
     * by this function, and will be used to render a full-width expansion row below each grid row:</p>
     * <ul>
     * <li><code>body</code> : String <div class="sub-desc">An HTML fragment to be used as the expansion row's body content (defaults to '').</div></li>
     * <li><code>bodyStyle</code> : String <div class="sub-desc">A CSS style specification that will be applied to the expansion row's &lt;tr> element. (defaults to '').</div></li>
     * </ul>
     * The following property will be passed in, and may be appended to:
     * <ul>
     * <li><code>tstyle</code> : String <div class="sub-desc">A CSS style specification that willl be applied to the &lt;table> element which encapsulates
     * both the standard grid row, and any expansion row.</div></li>
     * </ul>
     * @param {Store} store The {@link Ext.data.Store} this grid is bound to
     * @method getRowClass
     * @return {String} a CSS class name to add to the row.
     */

    /**
     * @cfg {Boolean} enableRowBody True to add a second TR element per row that can be used to provide a row body
     * that spans beneath the data row.  Use the {@link #getRowClass} method's rowParams config to customize the row body.
     */

    /**
     * @cfg {String} emptyText Default text (html tags are accepted) to display in the grid body when no rows
     * are available (defaults to ''). This value will be used to update the <tt>{@link #mainBody}</tt>:
    <pre><code>
    this.mainBody.update('&lt;div class="x-grid-empty">' + this.emptyText + '&lt;/div>');
    </code></pre>
     */

    /**
     * @cfg {Boolean} headersDisabled True to disable the grid column headers (defaults to <tt>false</tt>).
     * Use the {@link Ext.grid.ColumnModel ColumnModel} <tt>{@link Ext.grid.ColumnModel#menuDisabled menuDisabled}</tt>
     * config to disable the <i>menu</i> for individual columns.  While this config is true the
     * following will be disabled:<div class="mdetail-params"><ul>
     * <li>clicking on header to sort</li>
     * <li>the trigger to reveal the menu.</li>
     * </ul></div>
     */

    /**
     * <p>A customized implementation of a {@link Ext.dd.DragZone DragZone} which provides default implementations
     * of the template methods of DragZone to enable dragging of the selected rows of a GridPanel.
     * See {@link Ext.grid.GridDragZone} for details.</p>
     * <p>This will <b>only</b> be present:<div class="mdetail-params"><ul>
     * <li><i>if</i> the owning GridPanel was configured with {@link Ext.grid.GridPanel#enableDragDrop enableDragDrop}: <tt>true</tt>.</li>
     * <li><i>after</i> the owning GridPanel has been rendered.</li>
     * </ul></div>
     * @property dragZone
     * @type {Ext.grid.GridDragZone}
     */

    /**
     * @cfg {Boolean} deferEmptyText True to defer <tt>{@link #emptyText}</tt> being applied until the store's
     * first load (defaults to <tt>true</tt>).
     */
    deferEmptyText : true,

    /**
     * @cfg {Number} scrollOffset The amount of space to reserve for the vertical scrollbar
     * (defaults to <tt>undefined</tt>). If an explicit value isn't specified, this will be automatically
     * calculated.
     */
    scrollOffset : undefined,

    /**
     * @cfg {Boolean} autoFill
     * Defaults to <tt>false</tt>.  Specify <tt>true</tt> to have the column widths re-proportioned
     * when the grid is <b>initially rendered</b>.  The
     * {@link Ext.grid.Column#width initially configured width}</tt> of each column will be adjusted
     * to fit the grid width and prevent horizontal scrolling. If columns are later resized (manually
     * or programmatically), the other columns in the grid will <b>not</b> be resized to fit the grid width.
     * See <tt>{@link #forceFit}</tt> also.
     */
    autoFill : false,

    /**
     * @cfg {Boolean} forceFit
     * <p>Defaults to <tt>false</tt>.  Specify <tt>true</tt> to have the column widths re-proportioned
     * at <b>all times</b>.</p>
     * <p>The {@link Ext.grid.Column#width initially configured width}</tt> of each
     * column will be adjusted to fit the grid width and prevent horizontal scrolling. If columns are
     * later resized (manually or programmatically), the other columns in the grid <b>will</b> be resized
     * to fit the grid width.</p>
     * <p>Columns which are configured with <code>fixed: true</code> are omitted from being resized.</p>
     * <p>See <tt>{@link #autoFill}</tt>.</p>
     */
    forceFit : false,

    /**
     * @cfg {Array} sortClasses The CSS classes applied to a header when it is sorted. (defaults to <tt>['sort-asc', 'sort-desc']</tt>)
     */
    sortClasses : ['sort-asc', 'sort-desc'],

    /**
     * @cfg {String} sortAscText The text displayed in the 'Sort Ascending' menu item (defaults to <tt>'Sort Ascending'</tt>)
     */
    sortAscText : 'Sort Ascending',

    /**
     * @cfg {String} sortDescText The text displayed in the 'Sort Descending' menu item (defaults to <tt>'Sort Descending'</tt>)
     */
    sortDescText : 'Sort Descending',

    /**
     * @cfg {String} columnsText The text displayed in the 'Columns' menu item (defaults to <tt>'Columns'</tt>)
     */
    columnsText : 'Columns',

    /**
     * @cfg {String} selectedRowClass The CSS class applied to a selected row (defaults to <tt>'x-grid3-row-selected'</tt>). An
     * example overriding the default styling:
    <pre><code>
    .x-grid3-row-selected {background-color: yellow;}
    </code></pre>
     * Note that this only controls the row, and will not do anything for the text inside it.  To style inner
     * facets (like text) use something like:
    <pre><code>
    .x-grid3-row-selected .x-grid3-cell-inner {
        color: #FFCC00;
    }
    </code></pre>
     * @type String
     */
    selectedRowClass : 'x-grid3-row-selected',

    // private
    borderWidth : 2,
    tdClass : 'x-grid3-cell',
    hdCls : 'x-grid3-hd',
    
    
    /**
     * @cfg {Boolean} markDirty True to show the dirty cell indicator when a cell has been modified. Defaults to <tt>true</tt>.
     */
    markDirty : true,

    /**
     * @cfg {Number} cellSelectorDepth The number of levels to search for cells in event delegation (defaults to <tt>4</tt>)
     */
    cellSelectorDepth : 4,
    
    /**
     * @cfg {Number} rowSelectorDepth The number of levels to search for rows in event delegation (defaults to <tt>10</tt>)
     */
    rowSelectorDepth : 10,

    /**
     * @cfg {Number} rowBodySelectorDepth The number of levels to search for row bodies in event delegation (defaults to <tt>10</tt>)
     */
    rowBodySelectorDepth : 10,

    /**
     * @cfg {String} cellSelector The selector used to find cells internally (defaults to <tt>'td.x-grid3-cell'</tt>)
     */
    cellSelector : 'td.x-grid3-cell',
    
    /**
     * @cfg {String} rowSelector The selector used to find rows internally (defaults to <tt>'div.x-grid3-row'</tt>)
     */
    rowSelector : 'div.x-grid3-row',

    /**
     * @cfg {String} rowBodySelector The selector used to find row bodies internally (defaults to <tt>'div.x-grid3-row'</tt>)
     */
    rowBodySelector : 'div.x-grid3-row-body',

    // private
    firstRowCls: 'x-grid3-row-first',
    lastRowCls: 'x-grid3-row-last',
    rowClsRe: /(?:^|\s+)x-grid3-row-(first|last|alt)(?:\s+|$)/g,
    
    /**
     * @cfg {String} headerMenuOpenCls The CSS class to add to the header cell when its menu is visible. Defaults to 'x-grid3-hd-menu-open'
     */
    headerMenuOpenCls: 'x-grid3-hd-menu-open',
    
    /**
     * @cfg {String} rowOverCls The CSS class added to each row when it is hovered over. Defaults to 'x-grid3-row-over'
     */
    rowOverCls: 'x-grid3-row-over',

    constructor : function(config) {
        Ext.apply(this, config);
        
        // These events are only used internally by the grid components
        this.addEvents(
            /**
             * @event beforerowremoved
             * Internal UI Event. Fired before a row is removed.
             * @param {Ext.grid.GridView} view
             * @param {Number} rowIndex The index of the row to be removed.
             * @param {Ext.data.Record} record The Record to be removed
             */
            'beforerowremoved',
            
            /**
             * @event beforerowsinserted
             * Internal UI Event. Fired before rows are inserted.
             * @param {Ext.grid.GridView} view
             * @param {Number} firstRow The index of the first row to be inserted.
             * @param {Number} lastRow The index of the last row to be inserted.
             */
            'beforerowsinserted',
            
            /**
             * @event beforerefresh
             * Internal UI Event. Fired before the view is refreshed.
             * @param {Ext.grid.GridView} view
             */
            'beforerefresh',
            
            /**
             * @event rowremoved
             * Internal UI Event. Fired after a row is removed.
             * @param {Ext.grid.GridView} view
             * @param {Number} rowIndex The index of the row that was removed.
             * @param {Ext.data.Record} record The Record that was removed
             */
            'rowremoved',
            
            /**
             * @event rowsinserted
             * Internal UI Event. Fired after rows are inserted.
             * @param {Ext.grid.GridView} view
             * @param {Number} firstRow The index of the first inserted.
             * @param {Number} lastRow The index of the last row inserted.
             */
            'rowsinserted',
            
            /**
             * @event rowupdated
             * Internal UI Event. Fired after a row has been updated.
             * @param {Ext.grid.GridView} view
             * @param {Number} firstRow The index of the row updated.
             * @param {Ext.data.record} record The Record backing the row updated.
             */
            'rowupdated',
            
            /**
             * @event refresh
             * Internal UI Event. Fired after the GridView's body has been refreshed.
             * @param {Ext.grid.GridView} view
             */
            'refresh'
        );
        
        Ext.grid.GridView.superclass.constructor.call(this);
    },

    /* -------------------------------- UI Specific ----------------------------- */
    
    /**
     * The master template to use when rendering the GridView. Has a default template
     * @property Ext.Template
     * @type masterTpl
     */
    masterTpl: new Ext.Template(
        '<div class="x-grid3" hidefocus="true">',
            '<div class="x-grid3-viewport">',
                '<div class="x-grid3-header">',
                    '<div class="x-grid3-header-inner">',
                        '<div class="x-grid3-header-offset" style="{ostyle}">{header}</div>',
                    '</div>',
                    '<div class="x-clear"></div>',
                '</div>',
                '<div class="x-grid3-scroller">',
                    '<div class="x-grid3-body" style="{bstyle}">{body}</div>',
                    '<a href="#" class="x-grid3-focus" tabIndex="-1"></a>',
                '</div>',
            '</div>',
            '<div class="x-grid3-resize-marker">&#160;</div>',
            '<div class="x-grid3-resize-proxy">&#160;</div>',
        '</div>'
    ),
    
    /**
     * The template to use when rendering headers. Has a default template
     * @property headerTpl
     * @type Ext.Template
     */
    headerTpl: new Ext.Template(
        '<table border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
            '<thead>',
                '<tr class="x-grid3-hd-row">{cells}</tr>',
            '</thead>',
        '</table>'
    ),
    
    /**
     * The template to use when rendering the body. Has a default template
     * @property bodyTpl
     * @type Ext.Template
     */
    bodyTpl: new Ext.Template('{rows}'),
    
    /**
     * The template to use to render each cell. Has a default template
     * @property cellTpl
     * @type Ext.Template
     */
    cellTpl: new Ext.Template(
        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
            '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
        '</td>'
    ),
    
    /**
     * @private
     * Provides default templates if they are not given for this particular instance. Most of the templates are defined on
     * the prototype, the ones defined inside this function are done so because they are based on Grid or GridView configuration
     */
    initTemplates : function() {
        var templates = this.templates || {},
            template, name,
            
            headerCellTpl = new Ext.Template(
                '<td class="x-grid3-hd x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                    '<div {tooltip} {attr} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', 
                        this.grid.enableHdMenu ? '<a class="x-grid3-hd-btn" href="#"></a>' : '',
                        '{value}',
                        '<img alt="" class="x-grid3-sort-icon" src="', Ext.BLANK_IMAGE_URL, '" />',
                    '</div>',
                '</td>'
            ),
        
            rowBodyText = [
                '<tr class="x-grid3-row-body-tr" style="{bodyStyle}">',
                    '<td colspan="{cols}" class="x-grid3-body-cell" tabIndex="0" hidefocus="on">',
                        '<div class="x-grid3-row-body">{body}</div>',
                    '</td>',
                '</tr>'
            ].join(""),
        
            innerText = [
                '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                     '<tbody>',
                        '<tr>{cells}</tr>',
                        this.enableRowBody ? rowBodyText : '',
                     '</tbody>',
                '</table>'
            ].join("");
        
        Ext.applyIf(templates, {
            hcell   : headerCellTpl,
            cell    : this.cellTpl,
            body    : this.bodyTpl,
            header  : this.headerTpl,
            master  : this.masterTpl,
            row     : new Ext.Template('<div class="x-grid3-row {alt}" style="{tstyle}">' + innerText + '</div>'),
            rowInner: new Ext.Template(innerText)
        });

        for (name in templates) {
            template = templates[name];
            
            if (template && Ext.isFunction(template.compile) && !template.compiled) {
                template.disableFormats = true;
                template.compile();
            }
        }

        this.templates = templates;
        this.colRe = new RegExp('x-grid3-td-([^\\s]+)', '');
    },

    /**
     * @private
     * Each GridView has its own private flyweight, accessed through this method
     */
    fly : function(el) {
        if (!this._flyweight) {
            this._flyweight = new Ext.Element.Flyweight(document.body);
        }
        this._flyweight.dom = el;
        return this._flyweight;
    },

    // private
    getEditorParent : function() {
        return this.scroller.dom;
    },

    /**
     * @private
     * Finds and stores references to important elements
     */
    initElements : function() {
        var Element  = Ext.Element,
            el       = Ext.get(this.grid.getGridEl().dom.firstChild),
            mainWrap = new Element(el.child('div.x-grid3-viewport')),
            mainHd   = new Element(mainWrap.child('div.x-grid3-header')),
            scroller = new Element(mainWrap.child('div.x-grid3-scroller'));
        
        if (this.grid.hideHeaders) {
            mainHd.setDisplayed(false);
        }
        
        if (this.forceFit) {
            scroller.setStyle('overflow-x', 'hidden');
        }
        
        /**
         * <i>Read-only</i>. The GridView's body Element which encapsulates all rows in the Grid.
         * This {@link Ext.Element Element} is only available after the GridPanel has been rendered.
         * @type Ext.Element
         * @property mainBody
         */
        
        Ext.apply(this, {
            el      : el,
            mainWrap: mainWrap,
            scroller: scroller,
            mainHd  : mainHd,
            innerHd : mainHd.child('div.x-grid3-header-inner').dom,
            mainBody: new Element(Element.fly(scroller).child('div.x-grid3-body')),
            focusEl : new Element(Element.fly(scroller).child('a')),
            
            resizeMarker: new Element(el.child('div.x-grid3-resize-marker')),
            resizeProxy : new Element(el.child('div.x-grid3-resize-proxy'))
        });
        
        this.focusEl.swallowEvent('click', true);
    },

    // private
    getRows : function() {
        return this.hasRows() ? this.mainBody.dom.childNodes : [];
    },

    // finder methods, used with delegation

    // private
    findCell : function(el) {
        if (!el) {
            return false;
        }
        return this.fly(el).findParent(this.cellSelector, this.cellSelectorDepth);
    },

    /**
     * <p>Return the index of the grid column which contains the passed HTMLElement.</p>
     * See also {@link #findRowIndex}
     * @param {HTMLElement} el The target element
     * @return {Number} The column index, or <b>false</b> if the target element is not within a row of this GridView.
     */
    findCellIndex : function(el, requiredCls) {
        var cell = this.findCell(el),
            hasCls;
        
        if (cell) {
            hasCls = this.fly(cell).hasClass(requiredCls);
            if (!requiredCls || hasCls) {
                return this.getCellIndex(cell);
            }
        }
        return false;
    },

    // private
    getCellIndex : function(el) {
        if (el) {
            var match = el.className.match(this.colRe);
            
            if (match && match[1]) {
                return this.cm.getIndexById(match[1]);
            }
        }
        return false;
    },

    // private
    findHeaderCell : function(el) {
        var cell = this.findCell(el);
        return cell && this.fly(cell).hasClass(this.hdCls) ? cell : null;
    },

    // private
    findHeaderIndex : function(el){
        return this.findCellIndex(el, this.hdCls);
    },

    /**
     * Return the HtmlElement representing the grid row which contains the passed element.
     * @param {HTMLElement} el The target HTMLElement
     * @return {HTMLElement} The row element, or null if the target element is not within a row of this GridView.
     */
    findRow : function(el) {
        if (!el) {
            return false;
        }
        return this.fly(el).findParent(this.rowSelector, this.rowSelectorDepth);
    },

    /**
     * Return the index of the grid row which contains the passed HTMLElement.
     * See also {@link #findCellIndex}
     * @param {HTMLElement} el The target HTMLElement
     * @return {Number} The row index, or <b>false</b> if the target element is not within a row of this GridView.
     */
    findRowIndex : function(el) {
        var row = this.findRow(el);
        return row ? row.rowIndex : false;
    },

    /**
     * Return the HtmlElement representing the grid row body which contains the passed element.
     * @param {HTMLElement} el The target HTMLElement
     * @return {HTMLElement} The row body element, or null if the target element is not within a row body of this GridView.
     */
    findRowBody : function(el) {
        if (!el) {
            return false;
        }
        
        return this.fly(el).findParent(this.rowBodySelector, this.rowBodySelectorDepth);
    },

    // getter methods for fetching elements dynamically in the grid

    /**
     * Return the <tt>&lt;div></tt> HtmlElement which represents a Grid row for the specified index.
     * @param {Number} index The row index
     * @return {HtmlElement} The div element.
     */
    getRow : function(row) {
        return this.getRows()[row];
    },

    /**
     * Returns the grid's <tt>&lt;td></tt> HtmlElement at the specified coordinates.
     * @param {Number} row The row index in which to find the cell.
     * @param {Number} col The column index of the cell.
     * @return {HtmlElement} The td at the specified coordinates.
     */
    getCell : function(row, col) {
        return Ext.fly(this.getRow(row)).query(this.cellSelector)[col]; 
    },

    /**
     * Return the <tt>&lt;td></tt> HtmlElement which represents the Grid's header cell for the specified column index.
     * @param {Number} index The column index
     * @return {HtmlElement} The td element.
     */
    getHeaderCell : function(index) {
        return this.mainHd.dom.getElementsByTagName('td')[index];
    },

    // manipulating elements

    // private - use getRowClass to apply custom row classes
    addRowClass : function(rowId, cls) {
        var row = this.getRow(rowId);
        if (row) {
            this.fly(row).addClass(cls);
        }
    },

    // private
    removeRowClass : function(row, cls) {
        var r = this.getRow(row);
        if(r){
            this.fly(r).removeClass(cls);
        }
    },

    // private
    removeRow : function(row) {
        Ext.removeNode(this.getRow(row));
        this.syncFocusEl(row);
    },

    // private
    removeRows : function(firstRow, lastRow) {
        var bd = this.mainBody.dom,
            rowIndex;
            
        for (rowIndex = firstRow; rowIndex <= lastRow; rowIndex++){
            Ext.removeNode(bd.childNodes[firstRow]);
        }
        
        this.syncFocusEl(firstRow);
    },

    /* ----------------------------------- Scrolling functions -------------------------------------------*/
    
    // private
    getScrollState : function() {
        var sb = this.scroller.dom;
        
        return {
            left: sb.scrollLeft, 
            top : sb.scrollTop
        };
    },

    // private
    restoreScroll : function(state) {
        var sb = this.scroller.dom;
        sb.scrollLeft = state.left;
        sb.scrollTop  = state.top;
    },

    /**
     * Scrolls the grid to the top
     */
    scrollToTop : function() {
        var dom = this.scroller.dom;
        
        dom.scrollTop  = 0;
        dom.scrollLeft = 0;
    },

    // private
    syncScroll : function() {
        this.syncHeaderScroll();
        var mb = this.scroller.dom;
        this.grid.fireEvent('bodyscroll', mb.scrollLeft, mb.scrollTop);
    },

    // private
    syncHeaderScroll : function() {
        var innerHd    = this.innerHd,
            scrollLeft = this.scroller.dom.scrollLeft;
        
        innerHd.scrollLeft = scrollLeft;
        innerHd.scrollLeft = scrollLeft; // second time for IE (1/2 time first fails, other browsers ignore)
    },
    
    /**
     * @private
     * Ensures the given column has the given icon class
     */
    updateSortIcon : function(col, dir) {
        var sortClasses = this.sortClasses,
            sortClass   = sortClasses[dir == "DESC" ? 1 : 0],
            headers     = this.mainHd.select('td').removeClass(sortClasses);
        
        headers.item(col).addClass(sortClass);
    },

    /**
     * @private
     * Updates the size of every column and cell in the grid
     */
    updateAllColumnWidths : function() {
        var totalWidth = this.getTotalWidth(),
            colCount   = this.cm.getColumnCount(),
            rows       = this.getRows(),
            rowCount   = rows.length,
            widths     = [],
            row, rowFirstChild, trow, i, j;
        
        for (i = 0; i < colCount; i++) {
            widths[i] = this.getColumnWidth(i);
            this.getHeaderCell(i).style.width = widths[i];
        }
        
        this.updateHeaderWidth();
        
        for (i = 0; i < rowCount; i++) {
            row = rows[i];
            row.style.width = totalWidth;
            rowFirstChild = row.firstChild;
            
            if (rowFirstChild) {
                rowFirstChild.style.width = totalWidth;
                trow = rowFirstChild.rows[0];
                
                for (j = 0; j < colCount; j++) {
                    trow.childNodes[j].style.width = widths[j];
                }
            }
        }
        
        this.onAllColumnWidthsUpdated(widths, totalWidth);
    },

    /**
     * @private
     * Called after a column's width has been updated, this resizes all of the cells for that column in each row
     * @param {Number} column The column index
     */
    updateColumnWidth : function(column, width) {
        var columnWidth = this.getColumnWidth(column),
            totalWidth  = this.getTotalWidth(),
            headerCell  = this.getHeaderCell(column),
            nodes       = this.getRows(),
            nodeCount   = nodes.length,
            row, i, firstChild;
        
        this.updateHeaderWidth();
        headerCell.style.width = columnWidth;
        
        for (i = 0; i < nodeCount; i++) {
            row = nodes[i];
            firstChild = row.firstChild;
            
            row.style.width = totalWidth;
            if (firstChild) {
                firstChild.style.width = totalWidth;
                firstChild.rows[0].childNodes[column].style.width = columnWidth;
            }
        }
        
        this.onColumnWidthUpdated(column, columnWidth, totalWidth);
    },
    
    /**
     * @private
     * Sets the hidden status of a given column.
     * @param {Number} col The column index
     * @param {Boolean} hidden True to make the column hidden
     */
    updateColumnHidden : function(col, hidden) {
        var totalWidth = this.getTotalWidth(),
            display    = hidden ? 'none' : '',
            headerCell = this.getHeaderCell(col),
            nodes      = this.getRows(),
            nodeCount  = nodes.length,
            row, rowFirstChild, i;
        
        this.updateHeaderWidth();
        headerCell.style.display = display;
        
        for (i = 0; i < nodeCount; i++) {
            row = nodes[i];
            row.style.width = totalWidth;
            rowFirstChild = row.firstChild;
            
            if (rowFirstChild) {
                rowFirstChild.style.width = totalWidth;
                rowFirstChild.rows[0].childNodes[col].style.display = display;
            }
        }
        
        this.onColumnHiddenUpdated(col, hidden, totalWidth);
        delete this.lastViewWidth; //recalc
        this.layout();
    },

    /**
     * @private
     * Renders all of the rows to a string buffer and returns the string. This is called internally
     * by renderRows and performs the actual string building for the rows - it does not inject HTML into the DOM.
     * @param {Array} columns The column data acquired from getColumnData.
     * @param {Array} records The array of records to render
     * @param {Ext.data.Store} store The store to render the rows from
     * @param {Number} startRow The index of the first row being rendered. Sometimes we only render a subset of
     * the rows so this is used to maintain logic for striping etc
     * @param {Number} colCount The total number of columns in the column model
     * @param {Boolean} stripe True to stripe the rows
     * @return {String} A string containing the HTML for the rendered rows
     */
    doRender : function(columns, records, store, startRow, colCount, stripe) {
        var templates = this.templates,
            cellTemplate = templates.cell,
            rowTemplate = templates.row,
            last = colCount - 1,
            tstyle = 'width:' + this.getTotalWidth() + ';',
            // buffers
            rowBuffer = [],
            colBuffer = [],
            rowParams = {tstyle: tstyle},
            meta = {},
            len  = records.length,
            alt,
            column,
            record, i, j, rowIndex;

        //build up each row's HTML
        for (j = 0; j < len; j++) {
            record    = records[j];
            colBuffer = [];

            rowIndex = j + startRow;

            //build up each column's HTML
            for (i = 0; i < colCount; i++) {
                column = columns[i];
                
                meta.id    = column.id;
                meta.css   = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                meta.attr  = meta.cellAttr = '';
                meta.style = column.style;
                meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);

                if (Ext.isEmpty(meta.value)) {
                    meta.value = '&#160;';
                }

                if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                    meta.css += ' x-grid3-dirty-cell';
                }

                colBuffer[colBuffer.length] = cellTemplate.apply(meta);
            }

            alt = [];
            //set up row striping and row dirtiness CSS classes
            if (stripe && ((rowIndex + 1) % 2 === 0)) {
                alt[0] = 'x-grid3-row-alt';
            }

            if (record.dirty) {
                alt[1] = ' x-grid3-dirty-row';
            }

            rowParams.cols = colCount;

            if (this.getRowClass) {
                alt[2] = this.getRowClass(record, rowIndex, rowParams, store);
            }

            rowParams.alt   = alt.join(' ');
            rowParams.cells = colBuffer.join('');

            rowBuffer[rowBuffer.length] = rowTemplate.apply(rowParams);
        }

        return rowBuffer.join('');
    },

    /**
     * @private
     * Adds CSS classes and rowIndex to each row
     * @param {Number} startRow The row to start from (defaults to 0)
     */
    processRows : function(startRow, skipStripe) {
        if (!this.ds || this.ds.getCount() < 1) {
            return;
        }

        var rows   = this.getRows(),
            length = rows.length,
            row, i;

        skipStripe = skipStripe || !this.grid.stripeRows;
        startRow   = startRow   || 0;

        for (i = 0; i < length; i++) {
            row = rows[i];
            if (row) {
                row.rowIndex = i;
                if (!skipStripe) {
                    row.className = row.className.replace(this.rowClsRe, ' ');
                    if ((i + 1) % 2 === 0){
                        row.className += ' x-grid3-row-alt';
                    }
                }
            }
        }

        // add first/last-row classes
        if (startRow === 0) {
            Ext.fly(rows[0]).addClass(this.firstRowCls);
        }

        Ext.fly(rows[length - 1]).addClass(this.lastRowCls);
    },
    
    /**
     * @private
     */
    afterRender : function() {
        if (!this.ds || !this.cm) {
            return;
        }
        
        this.mainBody.dom.innerHTML = this.renderBody() || '&#160;';
        this.processRows(0, true);

        if (this.deferEmptyText !== true) {
            this.applyEmptyText();
        }
        
        this.grid.fireEvent('viewready', this.grid);
    },
    
    /**
     * @private
     * This is always intended to be called after renderUI. Sets up listeners on the UI elements
     * and sets up options like column menus, moving and resizing.
     */
    afterRenderUI: function() {
        var grid = this.grid;
        
        this.initElements();

        // get mousedowns early
        Ext.fly(this.innerHd).on('click', this.handleHdDown, this);

        this.mainHd.on({
            scope    : this,
            mouseover: this.handleHdOver,
            mouseout : this.handleHdOut,
            mousemove: this.handleHdMove
        });

        this.scroller.on('scroll', this.syncScroll,  this);
        
        if (grid.enableColumnResize !== false) {
            this.splitZone = new Ext.grid.GridView.SplitDragZone(grid, this.mainHd.dom);
        }

        if (grid.enableColumnMove) {
            this.columnDrag = new Ext.grid.GridView.ColumnDragZone(grid, this.innerHd);
            this.columnDrop = new Ext.grid.HeaderDropZone(grid, this.mainHd.dom);
        }

        if (grid.enableHdMenu !== false) {
            this.hmenu = new Ext.menu.Menu({id: grid.id + '-hctx'});
            this.hmenu.add(
                {itemId:'asc',  text: this.sortAscText,  cls: 'xg-hmenu-sort-asc'},
                {itemId:'desc', text: this.sortDescText, cls: 'xg-hmenu-sort-desc'}
            );

            if (grid.enableColumnHide !== false) {
                this.colMenu = new Ext.menu.Menu({id:grid.id + '-hcols-menu'});
                this.colMenu.on({
                    scope     : this,
                    beforeshow: this.beforeColMenuShow,
                    itemclick : this.handleHdMenuClick
                });
                this.hmenu.add('-', {
                    itemId:'columns',
                    hideOnClick: false,
                    text: this.columnsText,
                    menu: this.colMenu,
                    iconCls: 'x-cols-icon'
                });
            }

            this.hmenu.on('itemclick', this.handleHdMenuClick, this);
        }

        if (grid.trackMouseOver) {
            this.mainBody.on({
                scope    : this,
                mouseover: this.onRowOver,
                mouseout : this.onRowOut
            });
        }

        if (grid.enableDragDrop || grid.enableDrag) {
            this.dragZone = new Ext.grid.GridDragZone(grid, {
                ddGroup : grid.ddGroup || 'GridDD'
            });
        }

        this.updateHeaderSortState();
    },

    /**
     * @private
     * Renders each of the UI elements in turn. This is called internally, once, by this.render. It does not
     * render rows from the store, just the surrounding UI elements.
     */
    renderUI : function() {
        var templates = this.templates;

        return templates.master.apply({
            body  : templates.body.apply({rows:'&#160;'}),
            header: this.renderHeaders(),
            ostyle: 'width:' + this.getOffsetWidth() + ';',
            bstyle: 'width:' + this.getTotalWidth()  + ';'
        });
    },

    // private
    processEvent : function(name, e) {
        var target = e.getTarget(),
            grid   = this.grid,
            header = this.findHeaderIndex(target),
            row, cell, col, body;

        grid.fireEvent(name, e);

        if (header !== false) {
            grid.fireEvent('header' + name, grid, header, e);
        } else {
            row = this.findRowIndex(target);

//          Grid's value-added events must bubble correctly to allow cancelling via returning false: cell->column->row
//          We must allow a return of false at any of these levels to cancel the event processing.
//          Particularly allowing rowmousedown to be cancellable by prior handlers which need to prevent selection.
            if (row !== false) {
                cell = this.findCellIndex(target);
                if (cell !== false) {
                    col = grid.colModel.getColumnAt(cell);
                    if (grid.fireEvent('cell' + name, grid, row, cell, e) !== false) {
                        if (!col || (col.processEvent && (col.processEvent(name, e, grid, row, cell) !== false))) {
                            grid.fireEvent('row' + name, grid, row, e);
                        }
                    }
                } else {
                    if (grid.fireEvent('row' + name, grid, row, e) !== false) {
                        (body = this.findRowBody(target)) && grid.fireEvent('rowbody' + name, grid, row, e);
                    }
                }
            } else {
                grid.fireEvent('container' + name, grid, e);
            }
        }
    },

    /**
     * @private
     * Sizes the grid's header and body elements
     */
    layout : function(initial) {
        if (!this.mainBody) {
            return; // not rendered
        }

        var grid       = this.grid,
            gridEl     = grid.getGridEl(),
            gridSize   = gridEl.getSize(true),
            gridWidth  = gridSize.width,
            gridHeight = gridSize.height,
            scroller   = this.scroller,
            scrollStyle, headerHeight, scrollHeight;
        
        if (gridWidth < 20 || gridHeight < 20) {
            return;
        }
        
        if (grid.autoHeight) {
            scrollStyle = scroller.dom.style;
            scrollStyle.overflow = 'visible';
            
            if (Ext.isWebKit) {
                scrollStyle.position = 'static';
            }
        } else {
            this.el.setSize(gridWidth, gridHeight);
            
            headerHeight = this.mainHd.getHeight();
            scrollHeight = gridHeight - headerHeight;
            
            scroller.setSize(gridWidth, scrollHeight);
            
            if (this.innerHd) {
                this.innerHd.style.width = (gridWidth) + "px";
            }
        }
        
        if (this.forceFit || (initial === true && this.autoFill)) {
            if (this.lastViewWidth != gridWidth) {
                this.fitColumns(false, false);
                this.lastViewWidth = gridWidth;
            }
        } else {
            this.autoExpand();
            this.syncHeaderScroll();
        }
        
        this.onLayout(gridWidth, scrollHeight);
    },

    // template functions for subclasses and plugins
    // these functions include precalculated values
    onLayout : function(vw, vh) {
        // do nothing
    },

    onColumnWidthUpdated : function(col, w, tw) {
        //template method
    },

    onAllColumnWidthsUpdated : function(ws, tw) {
        //template method
    },

    onColumnHiddenUpdated : function(col, hidden, tw) {
        // template method
    },

    updateColumnText : function(col, text) {
        // template method
    },

    afterMove : function(colIndex) {
        // template method
    },

    /* ----------------------------------- Core Specific -------------------------------------------*/
    // private
    init : function(grid) {
        this.grid = grid;

        this.initTemplates();
        this.initData(grid.store, grid.colModel);
        this.initUI(grid);
    },

    // private
    getColumnId : function(index){
        return this.cm.getColumnId(index);
    },

    // private
    getOffsetWidth : function() {
        return (this.cm.getTotalWidth() + this.getScrollOffset()) + 'px';
    },

    // private
    getScrollOffset: function() {
        return Ext.num(this.scrollOffset, Ext.getScrollBarWidth());
    },

    /**
     * @private
     * Renders the header row using the 'header' template. Does not inject the HTML into the DOM, just
     * returns a string.
     * @return {String} Rendered header row
     */
    renderHeaders : function() {
        var colModel   = this.cm,
            templates  = this.templates,
            headerTpl  = templates.hcell,
            properties = {},
            colCount   = colModel.getColumnCount(),
            last       = colCount - 1,
            cells      = [],
            i, cssCls;
        
        for (i = 0; i < colCount; i++) {
            if (i == 0) {
                cssCls = 'x-grid3-cell-first ';
            } else {
                cssCls = i == last ? 'x-grid3-cell-last ' : '';
            }
            
            properties = {
                id     : colModel.getColumnId(i),
                value  : colModel.getColumnHeader(i) || '',
                style  : this.getColumnStyle(i, true),
                css    : cssCls,
                tooltip: this.getColumnTooltip(i)
            };
            
            if (colModel.config[i].align == 'right') {
                properties.istyle = 'padding-right: 16px;';
            } else {
                delete properties.istyle;
            }
            
            cells[i] = headerTpl.apply(properties);
        }
        
        return templates.header.apply({
            cells : cells.join(""),
            tstyle: String.format("width: {0};", this.getTotalWidth())
        });
    },

    /**
     * @private
     */
    getColumnTooltip : function(i) {
        var tooltip = this.cm.getColumnTooltip(i);
        if (tooltip) {
            if (Ext.QuickTips.isEnabled()) {
                return 'ext:qtip="' + tooltip + '"';
            } else {
                return 'title="' + tooltip + '"';
            }
        }
        
        return '';
    },

    // private
    beforeUpdate : function() {
        this.grid.stopEditing(true);
    },

    /**
     * @private
     * Re-renders the headers and ensures they are sized correctly
     */
    updateHeaders : function() {
        this.innerHd.firstChild.innerHTML = this.renderHeaders();
        
        this.updateHeaderWidth(false);
    },
    
    /**
     * @private
     * Ensures that the header is sized to the total width available to it
     * @param {Boolean} updateMain True to update the mainBody's width also (defaults to true)
     */
    updateHeaderWidth: function(updateMain) {
        var innerHdChild = this.innerHd.firstChild,
            totalWidth   = this.getTotalWidth();
        
        innerHdChild.style.width = this.getOffsetWidth();
        innerHdChild.firstChild.style.width = totalWidth;
        
        if (updateMain !== false) {
            this.mainBody.dom.style.width = totalWidth;
        }
    },

    /**
     * Focuses the specified row.
     * @param {Number} row The row index
     */
    focusRow : function(row) {
        this.focusCell(row, 0, false);
    },

    /**
     * Focuses the specified cell.
     * @param {Number} row The row index
     * @param {Number} col The column index
     */
    focusCell : function(row, col, hscroll) {
        this.syncFocusEl(this.ensureVisible(row, col, hscroll));
        
        var focusEl = this.focusEl;
        
        if (Ext.isGecko) {
            focusEl.focus();
        } else {
            focusEl.focus.defer(1, focusEl);
        }
    },

    /**
     * @private
     * Finds the Elements corresponding to the given row and column indexes
     */
    resolveCell : function(row, col, hscroll) {
        if (!Ext.isNumber(row)) {
            row = row.rowIndex;
        }
        
        if (!this.ds) {
            return null;
        }
        
        if (row < 0 || row >= this.ds.getCount()) {
            return null;
        }
        col = (col !== undefined ? col : 0);

        var rowEl    = this.getRow(row),
            colModel = this.cm,
            colCount = colModel.getColumnCount(),
            cellEl;
            
        if (!(hscroll === false && col === 0)) {
            while (col < colCount && colModel.isHidden(col)) {
                col++;
            }
            
            cellEl = this.getCell(row, col);
        }

        return {row: rowEl, cell: cellEl};
    },

    /**
     * @private
     * Returns the XY co-ordinates of a given row/cell resolution (see {@link #resolveCell})
     * @return {Array} X and Y coords
     */
    getResolvedXY : function(resolved) {
        if (!resolved) {
            return null;
        }
        
        var cell = resolved.cell,
            row  = resolved.row;
        
        if (cell) {
            return Ext.fly(cell).getXY();
        } else {
            return [this.el.getX(), Ext.fly(row).getY()];
        }
    },

    /**
     * @private
     * Moves the focus element to the x and y co-ordinates of the given row and column
     */
    syncFocusEl : function(row, col, hscroll) {
        var xy = row;
        
        if (!Ext.isArray(xy)) {
            row = Math.min(row, Math.max(0, this.getRows().length-1));
            
            if (isNaN(row)) {
                return;
            }
            
            xy = this.getResolvedXY(this.resolveCell(row, col, hscroll));
        }
        
        this.focusEl.setXY(xy || this.scroller.getXY());
    },

    /**
     * @private
     */
    ensureVisible : function(row, col, hscroll) {
        var resolved = this.resolveCell(row, col, hscroll);
        
        if (!resolved || !resolved.row) {
            return null;
        }

        var rowEl  = resolved.row,
            cellEl = resolved.cell,
            c = this.scroller.dom,
            p = rowEl,
            ctop = 0,
            stop = this.el.dom;

        while (p && p != stop) {
            ctop += p.offsetTop;
            p = p.offsetParent;
        }

        ctop -= this.mainHd.dom.offsetHeight;
        stop = parseInt(c.scrollTop, 10);

        var cbot = ctop + rowEl.offsetHeight,
            ch = c.clientHeight,
            sbot = stop + ch;


        if (ctop < stop) {
          c.scrollTop = ctop;
        } else if(cbot > sbot) {
            c.scrollTop = cbot-ch;
        }

        if (hscroll !== false) {
            var cleft  = parseInt(cellEl.offsetLeft, 10),
                cright = cleft + cellEl.offsetWidth,
                sleft  = parseInt(c.scrollLeft, 10),
                sright = sleft + c.clientWidth;
                
            if (cleft < sleft) {
                c.scrollLeft = cleft;
            } else if(cright > sright) {
                c.scrollLeft = cright-c.clientWidth;
            }
        }
        
        return this.getResolvedXY(resolved);
    },

    // private
    insertRows : function(dm, firstRow, lastRow, isUpdate) {
        var last = dm.getCount() - 1;
        if( !isUpdate && firstRow === 0 && lastRow >= last) {
            this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
                this.refresh();
            this.fireEvent('rowsinserted', this, firstRow, lastRow);
        } else {
            if (!isUpdate) {
                this.fireEvent('beforerowsinserted', this, firstRow, lastRow);
            }
            var html = this.renderRows(firstRow, lastRow),
                before = this.getRow(firstRow);
            if (before) {
                if(firstRow === 0){
                    Ext.fly(this.getRow(0)).removeClass(this.firstRowCls);
                }
                Ext.DomHelper.insertHtml('beforeBegin', before, html);
            } else {
                var r = this.getRow(last - 1);
                if(r){
                    Ext.fly(r).removeClass(this.lastRowCls);
                }
                Ext.DomHelper.insertHtml('beforeEnd', this.mainBody.dom, html);
            }
            if (!isUpdate) {
                this.processRows(firstRow);
                this.fireEvent('rowsinserted', this, firstRow, lastRow);
            } else if (firstRow === 0 || firstRow >= last) {
                //ensure first/last row is kept after an update.
                Ext.fly(this.getRow(firstRow)).addClass(firstRow === 0 ? this.firstRowCls : this.lastRowCls);
            }
        }
        this.syncFocusEl(firstRow);
    },

    /**
     * @private
     * DEPRECATED - this doesn't appear to be called anywhere in the library, remove in 4.0. 
     */
    deleteRows : function(dm, firstRow, lastRow) {
        if (dm.getRowCount() < 1) {
            this.refresh();
        } else {
            this.fireEvent('beforerowsdeleted', this, firstRow, lastRow);

            this.removeRows(firstRow, lastRow);

            this.processRows(firstRow);
            this.fireEvent('rowsdeleted', this, firstRow, lastRow);
        }
    },

    /**
     * @private
     * Builds a CSS string for the given column index
     * @param {Number} colIndex The column index
     * @param {Boolean} isHeader True if getting the style for the column's header
     * @return {String} The CSS string
     */
    getColumnStyle : function(colIndex, isHeader) {
        var colModel  = this.cm,
            colConfig = colModel.config,
            style     = isHeader ? '' : colConfig[colIndex].css || '',
            align     = colConfig[colIndex].align;
        
        style += String.format("width: {0};", this.getColumnWidth(colIndex));
        
        if (colModel.isHidden(colIndex)) {
            style += 'display: none; ';
        }
        
        if (align) {
            style += String.format("text-align: {0};", align);
        }
        
        return style;
    },

    /**
     * @private
     * Returns the width of a given column minus its border width
     * @return {Number} The column index
     * @return {String|Number} The width in pixels
     */
    getColumnWidth : function(column) {
        var columnWidth = this.cm.getColumnWidth(column),
            borderWidth = this.borderWidth;
        
        if (Ext.isNumber(columnWidth)) {
            if (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2)) {
                return columnWidth + "px";
            } else {
                return Math.max(columnWidth - borderWidth, 0) + "px";
            }
        } else {
            return columnWidth;
        }
    },

    /**
     * @private
     * Returns the total width of all visible columns
     * @return {String} 
     */
    getTotalWidth : function() {
        return this.cm.getTotalWidth() + 'px';
    },

    /**
     * @private
     * Resizes each column to fit the available grid width.
     * TODO: The second argument isn't even used, remove it in 4.0
     * @param {Boolean} preventRefresh True to prevent resizing of each row to the new column sizes (defaults to false)
     * @param {null} onlyExpand NOT USED, will be removed in 4.0
     * @param {Number} omitColumn The index of a column to leave at its current width. Defaults to undefined
     * @return {Boolean} True if the operation succeeded, false if not or undefined if the grid view is not yet initialized
     */
    fitColumns : function(preventRefresh, onlyExpand, omitColumn) {
        var grid          = this.grid,
            colModel      = this.cm,
            totalColWidth = colModel.getTotalWidth(false),
            gridWidth     = this.getGridInnerWidth(),
            extraWidth    = gridWidth - totalColWidth,
            columns       = [],
            extraCol      = 0,
            width         = 0,
            colWidth, fraction, i;
        
        // not initialized, so don't screw up the default widths
        if (gridWidth < 20 || extraWidth === 0) {
            return false;
        }
        
        var visibleColCount = colModel.getColumnCount(true),
            totalColCount   = colModel.getColumnCount(false),
            adjCount        = visibleColCount - (Ext.isNumber(omitColumn) ? 1 : 0);
        
        if (adjCount === 0) {
            adjCount = 1;
            omitColumn = undefined;
        }
        
        //FIXME: the algorithm used here is odd and potentially confusing. Includes this for loop and the while after it.
        for (i = 0; i < totalColCount; i++) {
            if (!colModel.isFixed(i) && i !== omitColumn) {
                colWidth = colModel.getColumnWidth(i);
                columns.push(i, colWidth);
                
                if (!colModel.isHidden(i)) {
                    extraCol = i;
                    width += colWidth;
                }
            }
        }
        
        fraction = (gridWidth - colModel.getTotalWidth()) / width;
        
        while (columns.length) {
            colWidth = columns.pop();
            i        = columns.pop();
            
            colModel.setColumnWidth(i, Math.max(grid.minColumnWidth, Math.floor(colWidth + colWidth * fraction)), true);
        }
        
        //this has been changed above so remeasure now
        totalColWidth = colModel.getTotalWidth(false);
        
        if (totalColWidth > gridWidth) {
            var adjustCol = (adjCount == visibleColCount) ? extraCol : omitColumn,
                newWidth  = Math.max(1, colModel.getColumnWidth(adjustCol) - (totalColWidth - gridWidth));
            
            colModel.setColumnWidth(adjustCol, newWidth, true);
        }
        
        if (preventRefresh !== true) {
            this.updateAllColumnWidths();
        }
        
        return true;
    },

    /**
     * @private
     * Resizes the configured autoExpandColumn to take the available width after the other columns have 
     * been accounted for
     * @param {Boolean} preventUpdate True to prevent the resizing of all rows (defaults to false)
     */
    autoExpand : function(preventUpdate) {
        var grid             = this.grid,
            colModel         = this.cm,
            gridWidth        = this.getGridInnerWidth(),
            totalColumnWidth = colModel.getTotalWidth(false),
            autoExpandColumn = grid.autoExpandColumn;
        
        if (!this.userResized && autoExpandColumn) {
            if (gridWidth != totalColumnWidth) {
                //if we are not already using all available width, resize the autoExpandColumn
                var colIndex     = colModel.getIndexById(autoExpandColumn),
                    currentWidth = colModel.getColumnWidth(colIndex),
                    desiredWidth = gridWidth - totalColumnWidth + currentWidth,
                    newWidth     = Math.min(Math.max(desiredWidth, grid.autoExpandMin), grid.autoExpandMax);
                
                if (currentWidth != newWidth) {
                    colModel.setColumnWidth(colIndex, newWidth, true);
                    
                    if (preventUpdate !== true) {
                        this.updateColumnWidth(colIndex, newWidth);
                    }
                }
            }
        }
    },
    
    /**
     * Returns the total internal width available to the grid, taking the scrollbar into account
     * @return {Number} The total width
     */
    getGridInnerWidth: function() {
        return this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
    },

    /**
     * @private
     * Returns an array of column configurations - one for each column
     * @return {Array} Array of column config objects. This includes the column name, renderer, id style and renderer
     */
    getColumnData : function() {
        var columns  = [],
            colModel = this.cm,
            colCount = colModel.getColumnCount(),
            fields   = this.ds.fields,
            i, name;
        
        for (i = 0; i < colCount; i++) {
            name = colModel.getDataIndex(i);
            
            columns[i] = {
                name    : Ext.isDefined(name) ? name : (fields.get(i) ? fields.get(i).name : undefined),
                renderer: colModel.getRenderer(i),
                scope   : colModel.getRendererScope(i),
                id      : colModel.getColumnId(i),
                style   : this.getColumnStyle(i)
            };
        }
        
        return columns;
    },

    /**
     * @private
     * Renders rows between start and end indexes
     * @param {Number} startRow Index of the first row to render
     * @param {Number} endRow Index of the last row to render
     */
    renderRows : function(startRow, endRow) {
        var grid     = this.grid,
            store    = grid.store,
            stripe   = grid.stripeRows,
            colModel = grid.colModel,
            colCount = colModel.getColumnCount(),
            rowCount = store.getCount(),
            records;
        
        if (rowCount < 1) {
            return '';
        }
        
        startRow = startRow || 0;
        endRow   = Ext.isDefined(endRow) ? endRow : rowCount - 1;
        records  = store.getRange(startRow, endRow);
        
        return this.doRender(this.getColumnData(), records, store, startRow, colCount, stripe);
    },

    // private
    renderBody : function(){
        var markup = this.renderRows() || '&#160;';
        return this.templates.body.apply({rows: markup});
    },

    /**
     * @private
     * Refreshes a row by re-rendering it. Fires the rowupdated event when done
     */
    refreshRow: function(record) {
        var store     = this.ds,
            colCount  = this.cm.getColumnCount(),
            columns   = this.getColumnData(),
            last      = colCount - 1,
            cls       = ['x-grid3-row'],
            rowParams = {
                tstyle: String.format("width: {0};", this.getTotalWidth())
            },
            colBuffer = [],
            cellTpl   = this.templates.cell,
            rowIndex, row, column, meta, css, i;
        
        if (Ext.isNumber(record)) {
            rowIndex = record;
            record   = store.getAt(rowIndex);
        } else {
            rowIndex = store.indexOf(record);
        }
        
        //the record could not be found
        if (!record || rowIndex < 0) {
            return;
        }
        
        //builds each column in this row
        for (i = 0; i < colCount; i++) {
            column = columns[i];
            
            if (i == 0) {
                css = 'x-grid3-cell-first';
            } else {
                css = (i == last) ? 'x-grid3-cell-last ' : '';
            }
            
            meta = {
                id      : column.id,
                style   : column.style,
                css     : css,
                attr    : "",
                cellAttr: ""
            };
            // Need to set this after, because we pass meta to the renderer
            meta.value = column.renderer.call(column.scope, record.data[column.name], meta, record, rowIndex, i, store);
            
            if (Ext.isEmpty(meta.value)) {
                meta.value = '&#160;';
            }
            
            if (this.markDirty && record.dirty && typeof record.modified[column.name] != 'undefined') {
                meta.css += ' x-grid3-dirty-cell';
            }
            
            colBuffer[i] = cellTpl.apply(meta);
        }
        
        row = this.getRow(rowIndex);
        row.className = '';
        
        if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0)) {
            cls.push('x-grid3-row-alt');
        }
        
        if (this.getRowClass) {
            rowParams.cols = colCount;
            cls.push(this.getRowClass(record, rowIndex, rowParams, store));
        }
        
        this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
        rowParams.cells = colBuffer.join("");
        row.innerHTML = this.templates.rowInner.apply(rowParams);
        
        this.fireEvent('rowupdated', this, rowIndex, record);
    },

    /**
     * Refreshs the grid UI
     * @param {Boolean} headersToo (optional) True to also refresh the headers
     */
    refresh : function(headersToo) {
        this.fireEvent('beforerefresh', this);
        this.grid.stopEditing(true);

        var result = this.renderBody();
        this.mainBody.update(result).setWidth(this.getTotalWidth());
        if (headersToo === true) {
            this.updateHeaders();
            this.updateHeaderSortState();
        }
        this.processRows(0, true);
        this.layout();
        this.applyEmptyText();
        this.fireEvent('refresh', this);
    },

    /**
     * @private
     * Displays the configured emptyText if there are currently no rows to display
     */
    applyEmptyText : function() {
        if (this.emptyText && !this.hasRows()) {
            this.mainBody.update('<div class="x-grid-empty">' + this.emptyText + '</div>');
        }
    },

    /**
     * @private
     * Adds sorting classes to the column headers based on the bound store's sortInfo. Fires the 'sortchange' event
     * if the sorting has changed since this function was last run.
     */
    updateHeaderSortState : function() {
        var state = this.ds.getSortState();
        if (!state) {
            return;
        }

        if (!this.sortState || (this.sortState.field != state.field || this.sortState.direction != state.direction)) {
            this.grid.fireEvent('sortchange', this.grid, state);
        }

        this.sortState = state;

        var sortColumn = this.cm.findColumnIndex(state.field);
        if (sortColumn != -1) {
            var sortDir = state.direction;
            this.updateSortIcon(sortColumn, sortDir);
        }
    },

    /**
     * @private
     * Removes any sorting indicator classes from the column headers
     */
    clearHeaderSortState : function() {
        if (!this.sortState) {
            return;
        }
        this.grid.fireEvent('sortchange', this.grid, null);
        this.mainHd.select('td').removeClass(this.sortClasses);
        delete this.sortState;
    },

    /**
     * @private
     * Destroys all objects associated with the GridView
     */
    destroy : function() {
        var me              = this,
            grid            = me.grid,
            gridEl          = grid.getGridEl(),
            dragZone        = me.dragZone,
            splitZone       = me.splitZone,
            columnDrag      = me.columnDrag,
            columnDrop      = me.columnDrop,
            scrollToTopTask = me.scrollToTopTask,
            columnDragData,
            columnDragProxy;
        
        if (scrollToTopTask && scrollToTopTask.cancel) {
            scrollToTopTask.cancel();
        }
        
        Ext.destroyMembers(me, 'colMenu', 'hmenu');

        me.initData(null, null);
        me.purgeListeners();
        
        Ext.fly(me.innerHd).un("click", me.handleHdDown, me);

        if (grid.enableColumnMove) {
            columnDragData = columnDrag.dragData;
            columnDragProxy = columnDrag.proxy;
            Ext.destroy(
                columnDrag.el,
                columnDragProxy.ghost,
                columnDragProxy.el,
                columnDrop.el,
                columnDrop.proxyTop,
                columnDrop.proxyBottom,
                columnDragData.ddel,
                columnDragData.header
            );
            
            if (columnDragProxy.anim) {
                Ext.destroy(columnDragProxy.anim);
            }
            
            delete columnDragProxy.ghost;
            delete columnDragData.ddel;
            delete columnDragData.header;
            columnDrag.destroy();
            
            delete Ext.dd.DDM.locationCache[columnDrag.id];
            delete columnDrag._domRef;

            delete columnDrop.proxyTop;
            delete columnDrop.proxyBottom;
            columnDrop.destroy();
            delete Ext.dd.DDM.locationCache["gridHeader" + gridEl.id];
            delete columnDrop._domRef;
            delete Ext.dd.DDM.ids[columnDrop.ddGroup];
        }

        if (splitZone) { // enableColumnResize
            splitZone.destroy();
            delete splitZone._domRef;
            delete Ext.dd.DDM.ids["gridSplitters" + gridEl.id];
        }

        Ext.fly(me.innerHd).removeAllListeners();
        Ext.removeNode(me.innerHd);
        delete me.innerHd;

        Ext.destroy(
            me.el,
            me.mainWrap,
            me.mainHd,
            me.scroller,
            me.mainBody,
            me.focusEl,
            me.resizeMarker,
            me.resizeProxy,
            me.activeHdBtn,
            me._flyweight,
            dragZone,
            splitZone
        );

        delete grid.container;

        if (dragZone) {
            dragZone.destroy();
        }

        Ext.dd.DDM.currentTarget = null;
        delete Ext.dd.DDM.locationCache[gridEl.id];

        Ext.EventManager.removeResizeListener(me.onWindowResize, me);
    },

    // private
    onDenyColumnHide : function() {

    },

    // private
    render : function() {
        if (this.autoFill) {
            var ct = this.grid.ownerCt;
            
            if (ct && ct.getLayout()) {
                ct.on('afterlayout', function() {
                    this.fitColumns(true, true);
                    this.updateHeaders();
                    this.updateHeaderSortState();
                }, this, {single: true});
            }
        } else if (this.forceFit) {
            this.fitColumns(true, false);
        } else if (this.grid.autoExpandColumn) {
            this.autoExpand(true);
        }
        
        this.grid.getGridEl().dom.innerHTML = this.renderUI();
        
        this.afterRenderUI();
    },

    /* --------------------------------- Model Events and Handlers --------------------------------*/
    
    /**
     * @private
     * Binds a new Store and ColumnModel to this GridView. Removes any listeners from the old objects (if present)
     * and adds listeners to the new ones
     * @param {Ext.data.Store} newStore The new Store instance
     * @param {Ext.grid.ColumnModel} newColModel The new ColumnModel instance
     */
    initData : function(newStore, newColModel) {
        var me = this;
        
        if (me.ds) {
            var oldStore = me.ds;
            
            oldStore.un('add', me.onAdd, me);
            oldStore.un('load', me.onLoad, me);
            oldStore.un('clear', me.onClear, me);
            oldStore.un('remove', me.onRemove, me);
            oldStore.un('update', me.onUpdate, me);
            oldStore.un('datachanged', me.onDataChange, me);
            
            if (oldStore !== newStore && oldStore.autoDestroy) {
                oldStore.destroy();
            }
        }
        
        if (newStore) {
            newStore.on({
                scope      : me,
                load       : me.onLoad,
                add        : me.onAdd,
                remove     : me.onRemove,
                update     : me.onUpdate,
                clear      : me.onClear,
                datachanged: me.onDataChange
            });
        }
        
        if (me.cm) {
            var oldColModel = me.cm;
            
            oldColModel.un('configchange', me.onColConfigChange, me);
            oldColModel.un('widthchange',  me.onColWidthChange, me);
            oldColModel.un('headerchange', me.onHeaderChange, me);
            oldColModel.un('hiddenchange', me.onHiddenChange, me);
            oldColModel.un('columnmoved',  me.onColumnMove, me);
        }
        
        if (newColModel) {
            delete me.lastViewWidth;
            
            newColModel.on({
                scope       : me,
                configchange: me.onColConfigChange,
                widthchange : me.onColWidthChange,
                headerchange: me.onHeaderChange,
                hiddenchange: me.onHiddenChange,
                columnmoved : me.onColumnMove
            });
        }
        
        me.ds = newStore;
        me.cm = newColModel;
    },

    // private
    onDataChange : function(){
        this.refresh(true);
        this.updateHeaderSortState();
        this.syncFocusEl(0);
    },

    // private
    onClear : function() {
        this.refresh();
        this.syncFocusEl(0);
    },

    // private
    onUpdate : function(store, record) {
        this.refreshRow(record);
    },

    // private
    onAdd : function(store, records, index) {
        this.insertRows(store, index, index + (records.length-1));
    },

    // private
    onRemove : function(store, record, index, isUpdate) {
        if (isUpdate !== true) {
            this.fireEvent('beforerowremoved', this, index, record);
        }
        
        this.removeRow(index);
        
        if (isUpdate !== true) {
            this.processRows(index);
            this.applyEmptyText();
            this.fireEvent('rowremoved', this, index, record);
        }
    },

    /**
     * @private
     * Called when a store is loaded, scrolls to the top row
     */
    onLoad : function() {
        if (Ext.isGecko) {
            if (!this.scrollToTopTask) {
                this.scrollToTopTask = new Ext.util.DelayedTask(this.scrollToTop, this);
            }
            this.scrollToTopTask.delay(1);
        } else {
            this.scrollToTop();
        }
    },

    // private
    onColWidthChange : function(cm, col, width) {
        this.updateColumnWidth(col, width);
    },

    // private
    onHeaderChange : function(cm, col, text) {
        this.updateHeaders();
    },

    // private
    onHiddenChange : function(cm, col, hidden) {
        this.updateColumnHidden(col, hidden);
    },

    // private
    onColumnMove : function(cm, oldIndex, newIndex) {
        this.indexMap = null;
        this.refresh(true);
        this.restoreScroll(this.getScrollState());
        
        this.afterMove(newIndex);
        this.grid.fireEvent('columnmove', oldIndex, newIndex);
    },

    // private
    onColConfigChange : function() {
        delete this.lastViewWidth;
        this.indexMap = null;
        this.refresh(true);
    },

    /* -------------------- UI Events and Handlers ------------------------------ */
    // private
    initUI : function(grid) {
        grid.on('headerclick', this.onHeaderClick, this);
    },

    // private
    initEvents : Ext.emptyFn,

    // private
    onHeaderClick : function(g, index) {
        if (this.headersDisabled || !this.cm.isSortable(index)) {
            return;
        }
        g.stopEditing(true);
        g.store.sort(this.cm.getDataIndex(index));
    },

    /**
     * @private
     * Adds the hover class to a row when hovered over
     */
    onRowOver : function(e, target) {
        var row = this.findRowIndex(target);
        
        if (row !== false) {
            this.addRowClass(row, this.rowOverCls);
        }
    },

    /**
     * @private
     * Removes the hover class from a row on mouseout
     */
    onRowOut : function(e, target) {
        var row = this.findRowIndex(target);
        
        if (row !== false && !e.within(this.getRow(row), true)) {
            this.removeRowClass(row, this.rowOverCls);
        }
    },

    // private
    onRowSelect : function(row) {
        this.addRowClass(row, this.selectedRowClass);
    },

    // private
    onRowDeselect : function(row) {
        this.removeRowClass(row, this.selectedRowClass);
    },

    // private
    onCellSelect : function(row, col) {
        var cell = this.getCell(row, col);
        if (cell) {
            this.fly(cell).addClass('x-grid3-cell-selected');
        }
    },

    // private
    onCellDeselect : function(row, col) {
        var cell = this.getCell(row, col);
        if (cell) {
            this.fly(cell).removeClass('x-grid3-cell-selected');
        }
    },

    // private
    handleWheel : function(e) {
        e.stopPropagation();
    },

    /**
     * @private
     * Called by the SplitDragZone when a drag has been completed. Resizes the columns
     */
    onColumnSplitterMoved : function(cellIndex, width) {
        this.userResized = true;
        this.grid.colModel.setColumnWidth(cellIndex, width, true);

        if (this.forceFit) {
            this.fitColumns(true, false, cellIndex);
            this.updateAllColumnWidths();
        } else {
            this.updateColumnWidth(cellIndex, width);
            this.syncHeaderScroll();
        }

        this.grid.fireEvent('columnresize', cellIndex, width);
    },

    /**
     * @private
     * Click handler for the shared column dropdown menu, called on beforeshow. Builds the menu
     * which displays the list of columns for the user to show or hide.
     */
    beforeColMenuShow : function() {
        var colModel = this.cm,
            colCount = colModel.getColumnCount(),
            colMenu  = this.colMenu,
            i;

        colMenu.removeAll();

        for (i = 0; i < colCount; i++) {
            if (colModel.config[i].hideable !== false) {
                colMenu.add(new Ext.menu.CheckItem({
                    text       : colModel.getColumnHeader(i),
                    itemId     : 'col-' + colModel.getColumnId(i),
                    checked    : !colModel.isHidden(i),
                    disabled   : colModel.config[i].hideable === false,
                    hideOnClick: false
                }));
            }
        }
    },
    
    /**
     * @private
     * Attached as the 'itemclick' handler to the header menu and the column show/hide submenu (if available).
     * Performs sorting if the sorter buttons were clicked, otherwise hides/shows the column that was clicked.
     */
    handleHdMenuClick : function(item) {
        var store     = this.ds,
            dataIndex = this.cm.getDataIndex(this.hdCtxIndex);

        switch (item.getItemId()) {
            case 'asc':
                store.sort(dataIndex, 'ASC');
                break;
            case 'desc':
                store.sort(dataIndex, 'DESC');
                break;
            default:
                this.handleHdMenuClickDefault(item);
        }
        return true;
    },
    
    /**
     * Called by handleHdMenuClick if any button except a sort ASC/DESC button was clicked. The default implementation provides
     * the column hide/show functionality based on the check state of the menu item. A different implementation can be provided
     * if needed.
     * @param {Ext.menu.BaseItem} item The menu item that was clicked
     */
    handleHdMenuClickDefault: function(item) {
        var colModel = this.cm,
            itemId   = item.getItemId(),
            index    = colModel.getIndexById(itemId.substr(4));

        if (index != -1) {
            if (item.checked && colModel.getColumnsBy(this.isHideableColumn, this).length <= 1) {
                this.onDenyColumnHide();
                return;
            }
            colModel.setHidden(index, item.checked);
        }
    },

    /**
     * @private
     * Called when a header cell is clicked - shows the menu if the click happened over a trigger button
     */
    handleHdDown : function(e, target) {
        if (Ext.fly(target).hasClass('x-grid3-hd-btn')) {
            e.stopEvent();
            
            var colModel  = this.cm,
                header    = this.findHeaderCell(target),
                index     = this.getCellIndex(header),
                sortable  = colModel.isSortable(index),
                menu      = this.hmenu,
                menuItems = menu.items,
                menuCls   = this.headerMenuOpenCls;
            
            this.hdCtxIndex = index;
            
            Ext.fly(header).addClass(menuCls);
            menuItems.get('asc').setDisabled(!sortable);
            menuItems.get('desc').setDisabled(!sortable);
            
            menu.on('hide', function() {
                Ext.fly(header).removeClass(menuCls);
            }, this, {single:true});
            
            menu.show(target, 'tl-bl?');
        }
    },

    /**
     * @private
     * Attached to the headers' mousemove event. This figures out the CSS cursor to use based on where the mouse is currently
     * pointed. If the mouse is currently hovered over the extreme left or extreme right of any header cell and the cell next 
     * to it is resizable it is given the resize cursor, otherwise the cursor is set to an empty string.
     */
    handleHdMove : function(e) {
        var header = this.findHeaderCell(this.activeHdRef);
        
        if (header && !this.headersDisabled) {
            var handleWidth  = this.splitHandleWidth || 5,
                activeRegion = this.activeHdRegion,
                headerStyle  = header.style,
                colModel     = this.cm,
                cursor       = '',
                pageX        = e.getPageX();
                
            if (this.grid.enableColumnResize !== false) {
                var activeHeaderIndex = this.activeHdIndex,
                    previousVisible   = this.getPreviousVisible(activeHeaderIndex),
                    currentResizable  = colModel.isResizable(activeHeaderIndex),
                    previousResizable = previousVisible && colModel.isResizable(previousVisible),
                    inLeftResizer     = pageX - activeRegion.left <= handleWidth,
                    inRightResizer    = activeRegion.right - pageX <= (!this.activeHdBtn ? handleWidth : 2);
                
                if (inLeftResizer && previousResizable) {
                    cursor = Ext.isAir ? 'move' : Ext.isWebKit ? 'e-resize' : 'col-resize'; // col-resize not always supported
                } else if (inRightResizer && currentResizable) {
                    cursor = Ext.isAir ? 'move' : Ext.isWebKit ? 'w-resize' : 'col-resize';
                }
            }
            
            headerStyle.cursor = cursor;
        }
    },
    
    /**
     * @private
     * Returns the index of the nearest currently visible header to the left of the given index.
     * @param {Number} index The header index
     * @return {Number/undefined} The index of the nearest visible header
     */
    getPreviousVisible: function(index) {
        while (index > 0) {
            if (!this.cm.isHidden(index - 1)) {
                return index;
            }
            index--;
        }
        return undefined;
    },

    /**
     * @private
     * Tied to the header element's mouseover event - adds the over class to the header cell if the menu is not disabled
     * for that cell
     */
    handleHdOver : function(e, target) {
        var header = this.findHeaderCell(target);
        
        if (header && !this.headersDisabled) {
            var fly = this.fly(header);
            
            this.activeHdRef = target;
            this.activeHdIndex = this.getCellIndex(header);
            this.activeHdRegion = fly.getRegion();
            
            if (!this.isMenuDisabled(this.activeHdIndex, fly)) {
                fly.addClass('x-grid3-hd-over');
                this.activeHdBtn = fly.child('.x-grid3-hd-btn');
                
                if (this.activeHdBtn) {
                    this.activeHdBtn.dom.style.height = (header.firstChild.offsetHeight - 1) + 'px';
                }
            }
        }
    },

    /**
     * @private
     * Tied to the header element's mouseout event. Removes the hover class from the header cell
     */
    handleHdOut : function(e, target) {
        var header = this.findHeaderCell(target);
        
        if (header && (!Ext.isIE || !e.within(header, true))) {
            this.activeHdRef = null;
            this.fly(header).removeClass('x-grid3-hd-over');
            header.style.cursor = '';
        }
    },
    
    /**
     * @private
     * Used by {@link #handleHdOver} to determine whether or not to show the header menu class on cell hover
     * @param {Number} cellIndex The header cell index
     * @param {Ext.Element} el The cell element currently being hovered over
     */
    isMenuDisabled: function(cellIndex, el) {
        return this.cm.isMenuDisabled(cellIndex);
    },

    /**
     * @private
     * Returns true if there are any rows rendered into the GridView
     * @return {Boolean} True if any rows have been rendered
     */
    hasRows : function() {
        var fc = this.mainBody.dom.firstChild;
        return fc && fc.nodeType == 1 && fc.className != 'x-grid-empty';
    },
    
    /**
     * @private
     */
    isHideableColumn : function(c) {
        return !c.hidden;
    },

    /**
     * @private
     * DEPRECATED - will be removed in Ext JS 5.0
     */
    bind : function(d, c) {
        this.initData(d, c);
    }
});


// private
// This is a support class used internally by the Grid components
Ext.grid.GridView.SplitDragZone = Ext.extend(Ext.dd.DDProxy, {

    constructor: function(grid, hd){
        this.grid = grid;
        this.view = grid.getView();
        this.marker = this.view.resizeMarker;
        this.proxy = this.view.resizeProxy;
        Ext.grid.GridView.SplitDragZone.superclass.constructor.call(this, hd,
            'gridSplitters' + this.grid.getGridEl().id, {
            dragElId : Ext.id(this.proxy.dom), resizeFrame:false
        });
        this.scroll = false;
        this.hw = this.view.splitHandleWidth || 5;
    },

    b4StartDrag : function(x, y){
        this.dragHeadersDisabled = this.view.headersDisabled;
        this.view.headersDisabled = true;
        var h = this.view.mainWrap.getHeight();
        this.marker.setHeight(h);
        this.marker.show();
        this.marker.alignTo(this.view.getHeaderCell(this.cellIndex), 'tl-tl', [-2, 0]);
        this.proxy.setHeight(h);
        var w = this.cm.getColumnWidth(this.cellIndex),
            minw = Math.max(w-this.grid.minColumnWidth, 0);
        this.resetConstraints();
        this.setXConstraint(minw, 1000);
        this.setYConstraint(0, 0);
        this.minX = x - minw;
        this.maxX = x + 1000;
        this.startPos = x;
        Ext.dd.DDProxy.prototype.b4StartDrag.call(this, x, y);
    },

    allowHeaderDrag : function(e){
        return true;
    },

    handleMouseDown : function(e){
        var t = this.view.findHeaderCell(e.getTarget());
        if(t && this.allowHeaderDrag(e)){
            var xy = this.view.fly(t).getXY(), 
                x = xy[0],
                exy = e.getXY(), 
                ex = exy[0],
                w = t.offsetWidth, 
                adjust = false;
                
            if((ex - x) <= this.hw){
                adjust = -1;
            }else if((x+w) - ex <= this.hw){
                adjust = 0;
            }
            if(adjust !== false){
                this.cm = this.grid.colModel;
                var ci = this.view.getCellIndex(t);
                if(adjust == -1){
                  if (ci + adjust < 0) {
                    return;
                  }
                    while(this.cm.isHidden(ci+adjust)){
                        --adjust;
                        if(ci+adjust < 0){
                            return;
                        }
                    }
                }
                this.cellIndex = ci+adjust;
                this.split = t.dom;
                if(this.cm.isResizable(this.cellIndex) && !this.cm.isFixed(this.cellIndex)){
                    Ext.grid.GridView.SplitDragZone.superclass.handleMouseDown.apply(this, arguments);
                }
            }else if(this.view.columnDrag){
                this.view.columnDrag.callHandleMouseDown(e);
            }
        }
    },

    endDrag : function(e){
        this.marker.hide();
        var v = this.view,
            endX = Math.max(this.minX, e.getPageX()),
            diff = endX - this.startPos,
            disabled = this.dragHeadersDisabled;
            
        v.onColumnSplitterMoved(this.cellIndex, this.cm.getColumnWidth(this.cellIndex)+diff);
        setTimeout(function(){
            v.headersDisabled = disabled;
        }, 50);
    },

    autoOffset : function(){
        this.setDelta(0,0);
    }
});
