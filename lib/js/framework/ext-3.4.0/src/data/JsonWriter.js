/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/**
 * @class Ext.data.JsonWriter
 * @extends Ext.data.DataWriter
 * DataWriter extension for writing an array or single {@link Ext.data.Record} object(s) in preparation for executing a remote CRUD action.
 */
Ext.data.JsonWriter = Ext.extend(Ext.data.DataWriter, {
    /**
     * @cfg {Boolean} encode <p><tt>true</tt> to {@link Ext.util.JSON#encode JSON encode} the
     * {@link Ext.data.DataWriter#toHash hashed data} into a standard HTTP parameter named after this
     * Reader's <code>meta.root</code> property which, by default is imported from the associated Reader. Defaults to <tt>true</tt>.</p>
     * <p>If set to <code>false</code>, the hashed data is {@link Ext.util.JSON#encode JSON encoded}, along with
     * the associated {@link Ext.data.Store}'s {@link Ext.data.Store#baseParams baseParams}, into the POST body.</p>
     * <p>When using {@link Ext.data.DirectProxy}, set this to <tt>false</tt> since Ext.Direct.JsonProvider will perform
     * its own json-encoding.  In addition, if you're using {@link Ext.data.HttpProxy}, setting to <tt>false</tt>
     * will cause HttpProxy to transmit data using the <b>jsonData</b> configuration-params of {@link Ext.Ajax#request}
     * instead of <b>params</b>.</p>
     * <p>When using a {@link Ext.data.Store#restful} Store, some serverside frameworks are
     * tuned to expect data through the jsonData mechanism.  In those cases, one will want to set <b>encode: <tt>false</tt></b>, as in
     * let the lower-level connection object (eg: Ext.Ajax) do the encoding.</p>
     */
    encode : true,
    /**
     * @cfg {Boolean} encodeDelete False to send only the id to the server on delete, true to encode it in an object
     * literal, eg: <pre><code>
{id: 1}
 * </code></pre> Defaults to <tt>false</tt>
     */
    encodeDelete: false,
    
    constructor : function(config){
        Ext.data.JsonWriter.superclass.constructor.call(this, config);    
    },

    /**
     * <p>This method should not need to be called by application code, however it may be useful on occasion to
     * override it, or augment it with an {@link Function#createInterceptor interceptor} or {@link Function#createSequence sequence}.</p>
     * <p>The provided implementation encodes the serialized data representing the Store's modified Records into the Ajax request's
     * <code>params</code> according to the <code>{@link #encode}</code> setting.</p>
     * @param {Object} Ajax request params object to write into.
     * @param {Object} baseParams as defined by {@link Ext.data.Store#baseParams}.  The baseParms must be encoded by the extending class, eg: {@link Ext.data.JsonWriter}, {@link Ext.data.XmlWriter}.
     * @param {Object/Object[]} data Data object representing the serialized modified records from the Store. May be either a single object,
     * or an Array of objects - user implementations must handle both cases.
     */
    render : function(params, baseParams, data) {
        if (this.encode === true) {
            // Encode here now.
            Ext.apply(params, baseParams);
            params[this.meta.root] = Ext.encode(data);
        } else {
            // defer encoding for some other layer, probably in {@link Ext.Ajax#request}.  Place everything into "jsonData" key.
            var jdata = Ext.apply({}, baseParams);
            jdata[this.meta.root] = data;
            params.jsonData = jdata;
        }
    },
    /**
     * Implements abstract Ext.data.DataWriter#createRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    createRecord : function(rec) {
       return this.toHash(rec);
    },
    /**
     * Implements abstract Ext.data.DataWriter#updateRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    updateRecord : function(rec) {
        return this.toHash(rec);

    },
    /**
     * Implements abstract Ext.data.DataWriter#destroyRecord
     * @protected
     * @param {Ext.data.Record} rec
     * @return {Object}
     */
    destroyRecord : function(rec){
        if(this.encodeDelete){
            var data = {};
            data[this.meta.idProperty] = rec.id;
            return data;
        }else{
            return rec.id;
        }
    }
});