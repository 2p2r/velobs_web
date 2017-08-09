/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.form.VTypes
 * <p>This is a singleton object which contains a set of commonly used field validation functions.
 * The validations provided are basic and intended to be easily customizable and extended.</p>
 * <p>To add custom VTypes specify the <code>{@link Ext.form.TextField#vtype vtype}</code> validation
 * test function, and optionally specify any corresponding error text to display and any keystroke
 * filtering mask to apply. For example:</p>
 * <pre><code>
// custom Vtype for vtype:'time'
var timeTest = /^([1-9]|1[0-9]):([0-5][0-9])(\s[a|p]m)$/i;
Ext.apply(Ext.form.VTypes, {
    //  vtype validation function
    time: function(val, field) {
        return timeTest.test(val);
    },
    // vtype Text property: The error text to display when the validation function returns false
    timeText: 'Not a valid time.  Must be in the format "12:34 PM".',
    // vtype Mask property: The keystroke filter mask
    timeMask: /[\d\s:amp]/i
});
 * </code></pre>
 * Another example:
 * <pre><code>
// custom Vtype for vtype:'IPAddress'
Ext.apply(Ext.form.VTypes, {
    IPAddress:  function(v) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
    },
    IPAddressText: 'Must be a numeric IP address',
    IPAddressMask: /[\d\.]/i
});
 * </code></pre>
 * @singleton
 */
Ext.form.VTypes = function(){
    // closure these in so they are only created once.
    var alpha = /^[a-zA-Z_]+$/,
        alphanum = /^[a-zA-Z0-9_]+$/,
        email = /^(\w+)([\-+.\'][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/,
        url = /(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

    // All these messages and functions are configurable
    return {
        /**
         * The function used to validate email addresses.  Note that this is a very basic validation -- complete
         * validation per the email RFC specifications is very complex and beyond the scope of this class, although
         * this function can be overridden if a more comprehensive validation scheme is desired.  See the validation
         * section of the <a href="http://en.wikipedia.org/wiki/E-mail_address">Wikipedia article on email addresses</a>
         * for additional information.  This implementation is intended to validate the following emails:<tt>
         * 'barney@example.de', 'barney.rubble@example.com', 'barney-rubble@example.coop', 'barney+rubble@example.com'
         * </tt>.
         * @param {String} value The email address
         * @return {Boolean} true if the RegExp test passed, and false if not.
         */
        'email' : function(v){
            return email.test(v);
        },
        /**
         * The error text to display when the email validation function returns false.  Defaults to:
         * <tt>'This field should be an e-mail address in the format "user@example.com"'</tt>
         * @type String
         */
        'emailText' : 'This field should be an e-mail address in the format "user@example.com"',
        /**
         * The keystroke filter mask to be applied on email input.  See the {@link #email} method for
         * information about more complex email validation. Defaults to:
         * <tt>/[a-z0-9_\.\-\+\'@]/i</tt>
         * @type RegExp
         */
        'emailMask' : /[a-z0-9_\.\-\+\'@]/i,

        /**
         * The function used to validate URLs
         * @param {String} value The URL
         * @return {Boolean} true if the RegExp test passed, and false if not.
         */
        'url' : function(v){
            return url.test(v);
        },
        /**
         * The error text to display when the url validation function returns false.  Defaults to:
         * <tt>'This field should be a URL in the format "http:/'+'/www.example.com"'</tt>
         * @type String
         */
        'urlText' : 'This field should be a URL in the format "http:/'+'/www.example.com"',

        /**
         * The function used to validate alpha values
         * @param {String} value The value
         * @return {Boolean} true if the RegExp test passed, and false if not.
         */
        'alpha' : function(v){
            return alpha.test(v);
        },
        /**
         * The error text to display when the alpha validation function returns false.  Defaults to:
         * <tt>'This field should only contain letters and _'</tt>
         * @type String
         */
        'alphaText' : 'This field should only contain letters and _',
        /**
         * The keystroke filter mask to be applied on alpha input.  Defaults to:
         * <tt>/[a-z_]/i</tt>
         * @type RegExp
         */
        'alphaMask' : /[a-z_]/i,

        /**
         * The function used to validate alphanumeric values
         * @param {String} value The value
         * @return {Boolean} true if the RegExp test passed, and false if not.
         */
        'alphanum' : function(v){
            return alphanum.test(v);
        },
        /**
         * The error text to display when the alphanumeric validation function returns false.  Defaults to:
         * <tt>'This field should only contain letters, numbers and _'</tt>
         * @type String
         */
        'alphanumText' : 'This field should only contain letters, numbers and _',
        /**
         * The keystroke filter mask to be applied on alphanumeric input.  Defaults to:
         * <tt>/[a-z0-9_]/i</tt>
         * @type RegExp
         */
        'alphanumMask' : /[a-z0-9_]/i
    };
}();
