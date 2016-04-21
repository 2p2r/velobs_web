/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.calendar.DayHeaderView
 * @extends Ext.calendar.MonthView
 * <p>This is the header area container within the day and week views where all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.calendar.DayView DayView}
 * which aggregates this class and the {@link Ext.calendar.DayBodyView DayBodyView} into the single unified view
 * presented by {@link Ext.calendar.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.calendar.DayHeaderView = Ext.extend(Ext.calendar.MonthView, {
    // private configs
    weekCount: 1,
    dayCount: 1,
    allDayOnly: true,
    monitorResize: false,

    /**
     * @event dayclick
     * Fires after the user clicks within the day view container and not on an event element
     * @param {Ext.calendar.DayBodyView} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
     * DayHeaderView always return true for this param.
     * @param {Ext.Element} el The Element that was clicked on
     */

    // private
    afterRender: function() {
        if (!this.tpl) {
            this.tpl = new Ext.calendar.DayHeaderTemplate({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        this.addClass('ext-cal-day-header');

        Ext.calendar.DayHeaderView.superclass.afterRender.call(this);
    },

    // private
    forceSize: Ext.emptyFn,

    // private
    refresh: function() {
        Ext.calendar.DayHeaderView.superclass.refresh.call(this);
        this.recalcHeaderBox();
    },

    // private
    recalcHeaderBox: function() {
        var tbl = this.el.child('.ext-cal-evt-tbl'),
        h = tbl.getHeight();

        this.el.setHeight(h + 7);

        if (Ext.isIE && Ext.isStrict) {
            this.el.child('.ext-cal-hd-ad-inner').setHeight(h + 4);
        }
        if (Ext.isOpera) {
            //TODO: figure out why Opera refuses to refresh height when
            //the new height is lower than the previous one
            //            var ct = this.el.child('.ext-cal-hd-ct');
            //            ct.repaint();
            }
    },

    // private
    moveNext: function(noRefresh) {
        this.moveDays(this.dayCount, noRefresh);
    },

    // private
    movePrev: function(noRefresh) {
        this.moveDays( - this.dayCount, noRefresh);
    },

    // private
    onClick: function(e, t) {
        var el = e.getTarget('td', 3),
            parts,
            dt;
        if (el) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                parts = el.id.split(this.dayElIdDelimiter);
                dt = parts[parts.length - 1];

                this.fireEvent('dayclick', this, Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt)));
                return;
            }
        }
        Ext.calendar.DayHeaderView.superclass.onClick.apply(this, arguments);
    }
});

Ext.reg('dayheaderview', Ext.calendar.DayHeaderView);
