/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.calendar.WeekView
 * @extends Ext.calendar.DayView
 * <p>Displays a calendar view by week. This class does not usually need ot be used directly as you can
 * use a {@link Ext.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the week view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.calendar.WeekView = Ext.extend(Ext.calendar.DayView, {
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});

Ext.reg('weekview', Ext.calendar.WeekView);