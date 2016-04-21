/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.form.TimeField
 * @extends Ext.form.ComboBox
 * Provides a time input field with a time dropdown and automatic time validation.  Example usage:
 * <pre><code>
new Ext.form.TimeField({
    minValue: '9:00 AM',
    maxValue: '6:00 PM',
    increment: 30
});
</code></pre>
 * @constructor
 * Create a new TimeField
 * @param {Object} config
 * @xtype timefield
 */
Ext.form.TimeField = Ext.extend(Ext.form.ComboBox, {
    /**
     * @cfg {Date/String} minValue
     * The minimum allowed time. Can be either a Javascript date object with a valid time value or a string
     * time in a valid format -- see {@link #format} and {@link #altFormats} (defaults to undefined).
     */
    minValue : undefined,
    /**
     * @cfg {Date/String} maxValue
     * The maximum allowed time. Can be either a Javascript date object with a valid time value or a string
     * time in a valid format -- see {@link #format} and {@link #altFormats} (defaults to undefined).
     */
    maxValue : undefined,
    /**
     * @cfg {String} minText
     * The error text to display when the date in the cell is before minValue (defaults to
     * 'The time in this field must be equal to or after {0}').
     */
    minText : "The time in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * The error text to display when the time is after maxValue (defaults to
     * 'The time in this field must be equal to or before {0}').
     */
    maxText : "The time in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * The error text to display when the time in the field is invalid (defaults to
     * '{value} is not a valid time').
     */
    invalidText : "{0} is not a valid time",
    /**
     * @cfg {String} format
     * The default time format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to 'g:i A', e.g., '3:15 PM').  For 24-hour time
     * format try 'H:i' instead.
     */
    format : "g:i A",
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it doesn't match the defined
     * format (defaults to 'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A').
     */
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A",
    /**
     * @cfg {Number} increment
     * The number of minutes between each time value in the list (defaults to 15).
     */
    increment: 15,

    // private override
    mode: 'local',
    // private override
    triggerAction: 'all',
    // private override
    typeAhead: false,

    // private - This is the date to use when generating time values in the absence of either minValue
    // or maxValue.  Using the current date causes DST issues on DST boundary dates, so this is an
    // arbitrary "safe" date that can be any date aside from DST boundary dates.
    initDate: '1/1/2008',

    initDateFormat: 'j/n/Y',

    // private
    initComponent : function(){
        if(Ext.isDefined(this.minValue)){
            this.setMinValue(this.minValue, true);
        }
        if(Ext.isDefined(this.maxValue)){
            this.setMaxValue(this.maxValue, true);
        }
        if(!this.store){
            this.generateStore(true);
        }
        Ext.form.TimeField.superclass.initComponent.call(this);
    },

    /**
     * Replaces any existing {@link #minValue} with the new time and refreshes the store.
     * @param {Date/String} value The minimum time that can be selected
     */
    setMinValue: function(value, /* private */ initial){
        this.setLimit(value, true, initial);
        return this;
    },

    /**
     * Replaces any existing {@link #maxValue} with the new time and refreshes the store.
     * @param {Date/String} value The maximum time that can be selected
     */
    setMaxValue: function(value, /* private */ initial){
        this.setLimit(value, false, initial);
        return this;
    },

    // private
    generateStore: function(initial){
        var min = this.minValue || new Date(this.initDate).clearTime(),
            max = this.maxValue || new Date(this.initDate).clearTime().add('mi', (24 * 60) - 1),
            times = [];

        while(min <= max){
            times.push(min.dateFormat(this.format));
            min = min.add('mi', this.increment);
        }
        this.bindStore(times, initial);
    },

    // private
    setLimit: function(value, isMin, initial){
        var d;
        if(Ext.isString(value)){
            d = this.parseDate(value);
        }else if(Ext.isDate(value)){
            d = value;
        }
        if(d){
            var val = new Date(this.initDate).clearTime();
            val.setHours(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            this[isMin ? 'minValue' : 'maxValue'] = val;
            if(!initial){
                this.generateStore();
            }
        }
    },

    // inherited docs
    getValue : function(){
        var v = Ext.form.TimeField.superclass.getValue.call(this);
        return this.formatDate(this.parseDate(v)) || '';
    },

    // inherited docs
    setValue : function(value){
        return Ext.form.TimeField.superclass.setValue.call(this, this.formatDate(this.parseDate(value)));
    },

    // private overrides
    validateValue : Ext.form.DateField.prototype.validateValue,

    formatDate : Ext.form.DateField.prototype.formatDate,

    parseDate: function(value) {
        if (!value || Ext.isDate(value)) {
            return value;
        }

        var id = this.initDate + ' ',
            idf = this.initDateFormat + ' ',
            v = Date.parseDate(id + value, idf + this.format), // *** handle DST. note: this.format is a TIME-only format
            af = this.altFormats;

        if (!v && af) {
            if (!this.altFormatsArray) {
                this.altFormatsArray = af.split("|");
            }
            for (var i = 0, afa = this.altFormatsArray, len = afa.length; i < len && !v; i++) {
                v = Date.parseDate(id + value, idf + afa[i]);
            }
        }

        return v;
    }
});
Ext.reg('timefield', Ext.form.TimeField);