/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.calendar.ReminderField
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing a reminder setting for an event.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    width: 200,
    fieldLabel: 'Reminder',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value'
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.calendar.ReminderField = Ext.extend(Ext.form.ComboBox, {
    width: 200,
    fieldLabel: 'Reminder',
    mode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value',

    // private
    initComponent: function() {
        Ext.calendar.ReminderField.superclass.initComponent.call(this);

        this.store = this.store || new Ext.data.ArrayStore({
            fields: ['value', 'desc'],
            idIndex: 0,
            data: [
            ['', 'None'],
            ['0', 'At start time'],
            ['5', '5 minutes before start'],
            ['15', '15 minutes before start'],
            ['30', '30 minutes before start'],
            ['60', '1 hour before start'],
            ['90', '1.5 hours before start'],
            ['120', '2 hours before start'],
            ['180', '3 hours before start'],
            ['360', '6 hours before start'],
            ['720', '12 hours before start'],
            ['1440', '1 day before start'],
            ['2880', '2 days before start'],
            ['4320', '3 days before start'],
            ['5760', '4 days before start'],
            ['7200', '5 days before start'],
            ['10080', '1 week before start'],
            ['20160', '2 weeks before start']
            ]
        });
    },

    // inherited docs
    initValue: function() {
        if (this.value !== undefined) {
            this.setValue(this.value);
        }
        else {
            this.setValue('');
        }
        this.originalValue = this.getValue();
    }
});

Ext.reg('reminderfield', Ext.calendar.ReminderField);
