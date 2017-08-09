/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.data.DataReader
 * Abstract base class for reading structured data from a data source and converting
 * it into an object containing {@link Ext.data.Record} objects and metadata for use
 * by an {@link Ext.data.Store}.  This class is intended to be extended and should not
 * be created directly. For existing implementations, see {@link Ext.data.ArrayReader},
 * {@link Ext.data.JsonReader} and {@link Ext.data.XmlReader}.
 * @constructor Create a new DataReader
 * @param {Object} meta Metadata configuration options (implementation-specific).
 * @param {Array/Object} recordType
 * <p>Either an Array of {@link Ext.data.Field Field} definition objects (which
 * will be passed to {@link Ext.data.Record#create}, or a {@link Ext.data.Record Record}
 * constructor created using {@link Ext.data.Record#create}.</p>
 */
Ext.data.DataReader = function(meta, recordType){
    /**
     * This DataReader's configured metadata as passed to the constructor.
     * @type Mixed
     * @property meta
     */
    this.meta = meta;
    /**
     * @cfg {Array/Object} fields
     * <p>Either an Array of {@link Ext.data.Field Field} definition objects (which
     * will be passed to {@link Ext.data.Record#create}, or a {@link Ext.data.Record Record}
     * constructor created from {@link Ext.data.Record#create}.</p>
     */
    this.recordType = Ext.isArray(recordType) ?
        Ext.data.Record.create(recordType) : recordType;

    // if recordType defined make sure extraction functions are defined
    if (this.recordType){
        this.buildExtractors();
    }
};

Ext.data.DataReader.prototype = {
    /**
     * @cfg {String} messageProperty [undefined] Optional name of a property within a server-response that represents a user-feedback message.
     */
    /**
     * Abstract method created in extension's buildExtractors impl.
     */
    getTotal: Ext.emptyFn,
    /**
     * Abstract method created in extension's buildExtractors impl.
     */
    getRoot: Ext.emptyFn,
    /**
     * Abstract method created in extension's buildExtractors impl.
     */
    getMessage: Ext.emptyFn,
    /**
     * Abstract method created in extension's buildExtractors impl.
     */
    getSuccess: Ext.emptyFn,
    /**
     * Abstract method created in extension's buildExtractors impl.
     */
    getId: Ext.emptyFn,
    /**
     * Abstract method, overridden in DataReader extensions such as {@link Ext.data.JsonReader} and {@link Ext.data.XmlReader}
     */
    buildExtractors : Ext.emptyFn,
    /**
     * Abstract method overridden in DataReader extensions such as {@link Ext.data.JsonReader} and {@link Ext.data.XmlReader}
     */
    extractValues : Ext.emptyFn,

    /**
     * Used for un-phantoming a record after a successful database insert.  Sets the records pk along with new data from server.
     * You <b>must</b> return at least the database pk using the idProperty defined in your DataReader configuration.  The incoming
     * data from server will be merged with the data in the local record.
     * In addition, you <b>must</b> return record-data from the server in the same order received.
     * Will perform a commit as well, un-marking dirty-fields.  Store's "update" event will be suppressed.
     * @param {Record/Record[]} record The phantom record to be realized.
     * @param {Object/Object[]} data The new record data to apply.  Must include the primary-key from database defined in idProperty field.
     */
    realize: function(rs, data){
        if (Ext.isArray(rs)) {
            for (var i = rs.length - 1; i >= 0; i--) {
                // recurse
                if (Ext.isArray(data)) {
                    this.realize(rs.splice(i,1).shift(), data.splice(i,1).shift());
                }
                else {
                    // weird...rs is an array but data isn't??  recurse but just send in the whole invalid data object.
                    // the else clause below will detect !this.isData and throw exception.
                    this.realize(rs.splice(i,1).shift(), data);
                }
            }
        }
        else {
            // If rs is NOT an array but data IS, see if data contains just 1 record.  If so extract it and carry on.
            if (Ext.isArray(data) && data.length == 1) {
                data = data.shift();
            }
            if (!this.isData(data)) {
                // TODO: Let exception-handler choose to commit or not rather than blindly rs.commit() here.
                //rs.commit();
                throw new Ext.data.DataReader.Error('realize', rs);
            }
            rs.phantom = false; // <-- That's what it's all about
            rs._phid = rs.id;  // <-- copy phantom-id -> _phid, so we can remap in Store#onCreateRecords
            rs.id = this.getId(data);
            rs.data = data;

            rs.commit();
            rs.store.reMap(rs);
        }
    },

    /**
     * Used for updating a non-phantom or "real" record's data with fresh data from server after remote-save.
     * If returning data from multiple-records after a batch-update, you <b>must</b> return record-data from the server in
     * the same order received.  Will perform a commit as well, un-marking dirty-fields.  Store's "update" event will be
     * suppressed as the record receives fresh new data-hash
     * @param {Record/Record[]} rs
     * @param {Object/Object[]} data
     */
    update : function(rs, data) {
        if (Ext.isArray(rs)) {
            for (var i=rs.length-1; i >= 0; i--) {
                if (Ext.isArray(data)) {
                    this.update(rs.splice(i,1).shift(), data.splice(i,1).shift());
                }
                else {
                    // weird...rs is an array but data isn't??  recurse but just send in the whole data object.
                    // the else clause below will detect !this.isData and throw exception.
                    this.update(rs.splice(i,1).shift(), data);
                }
            }
        }
        else {
            // If rs is NOT an array but data IS, see if data contains just 1 record.  If so extract it and carry on.
            if (Ext.isArray(data) && data.length == 1) {
                data = data.shift();
            }
            if (this.isData(data)) {
                rs.data = Ext.apply(rs.data, data);
            }
            rs.commit();
        }
    },

    /**
     * returns extracted, type-cast rows of data.  Iterates to call #extractValues for each row
     * @param {Object[]/Object} data-root from server response
     * @param {Boolean} returnRecords [false] Set true to return instances of Ext.data.Record
     * @private
     */
    extractData : function(root, returnRecords) {
        // A bit ugly this, too bad the Record's raw data couldn't be saved in a common property named "raw" or something.
        var rawName = (this instanceof Ext.data.JsonReader) ? 'json' : 'node';

        var rs = [];

        // Had to add Check for XmlReader, #isData returns true if root is an Xml-object.  Want to check in order to re-factor
        // #extractData into DataReader base, since the implementations are almost identical for JsonReader, XmlReader
        if (this.isData(root) && !(this instanceof Ext.data.XmlReader)) {
            root = [root];
        }
        var f       = this.recordType.prototype.fields,
            fi      = f.items,
            fl      = f.length,
            rs      = [];
        if (returnRecords === true) {
            var Record = this.recordType;
            for (var i = 0; i < root.length; i++) {
                var n = root[i];
                var record = new Record(this.extractValues(n, fi, fl), this.getId(n));
                record[rawName] = n;    // <-- There's implementation of ugly bit, setting the raw record-data.
                rs.push(record);
            }
        }
        else {
            for (var i = 0; i < root.length; i++) {
                var data = this.extractValues(root[i], fi, fl);
                data[this.meta.idProperty] = this.getId(root[i]);
                rs.push(data);
            }
        }
        return rs;
    },

    /**
     * Returns true if the supplied data-hash <b>looks</b> and quacks like data.  Checks to see if it has a key
     * corresponding to idProperty defined in your DataReader config containing non-empty pk.
     * @param {Object} data
     * @return {Boolean}
     */
    isData : function(data) {
        return (data && Ext.isObject(data) && !Ext.isEmpty(this.getId(data))) ? true : false;
    },

    // private function a store will createSequence upon
    onMetaChange : function(meta){
        delete this.ef;
        this.meta = meta;
        this.recordType = Ext.data.Record.create(meta.fields);
        this.buildExtractors();
    }
};

/**
 * @class Ext.data.DataReader.Error
 * @extends Ext.Error
 * General error class for Ext.data.DataReader
 */
Ext.data.DataReader.Error = Ext.extend(Ext.Error, {
    constructor : function(message, arg) {
        this.arg = arg;
        Ext.Error.call(this, message);
    },
    name: 'Ext.data.DataReader'
});
Ext.apply(Ext.data.DataReader.Error.prototype, {
    lang : {
        'update': "#update received invalid data from server.  Please see docs for DataReader#update and review your DataReader configuration.",
        'realize': "#realize was called with invalid remote-data.  Please see the docs for DataReader#realize and review your DataReader configuration.",
        'invalid-response': "#readResponse received an invalid response from the server."
    }
});
