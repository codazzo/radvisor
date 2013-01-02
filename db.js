var _ = require('underscore');
var scraper = require('./scraper');
var mongojs = require('mongojs');

var servicesConf = require('./config/services').getConf();
var uri = servicesConf.mongoURI;
var db = mongojs(uri);

var collections = ['dj', 'event', 'events', 'regions', 'venue'];

exports.getCollections = function(){
    return _.clone(collections);
}

exports.getInstance = function(){
    return db;
}

//Init DB schema (only needed on first deployment)
exports.initSchema = function(){
    _.each(collections, function(cName){
        db.createCollection(cName, function(err, collection){
            if (err) console.log("[ERROR] Error creating collection: " + collection);
        });
    });
}

/**
    params.page: pageName (e.g. "events")
    params.options: options passed to the scraper. Also serves to uniquely identify resources.
    callback: will be called with scraped data when it is available
*/
exports.get = function(params, callback){
    var page = params.page, options = params.options;
    var documents = db.collection(page);
    var res = documents.find({params: options}, function(err, doc){
        if (doc && doc.length) {
            //it's in the db: cool!
            callback(doc[0].data);
        } else {
            //it's not in the db. scrape it, store it.
            scraper.scrape(page, options, function(data){
                var savedData = {
                    params: options,
                    data: data
                }
                documents.save(savedData);
                callback(data);
            });
        }
    });
}
