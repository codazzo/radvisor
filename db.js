var config = require('./config');
var scraper = require('./scraper');

var app = config.app;
var uri = app.get("db_uri");

var mongojs = require('mongojs');
var db = mongojs(uri);

/**
    page: pageName (e.g. "events")
    scraperOptions: options passed to the scraper. Also serves to uniquely identify resources.
    callback: will be called with scraped data when it is available
*/
exports.get = function(page, scraperOptions, callback){
    var documents = db.collection(page);
    var res = documents.find({params: scraperOptions}, function(err, doc){
        if (doc && doc.length) {
            //it's in the db: cool!
            callback(doc[0].data);
        } else {
            //it's not in the db. scrape it, store it.
            scraper.scrape(page, scraperOptions, function(data){
                var savedData = {
                    params: scraperOptions,
                    data: data
                }
                documents.save(savedData);
                callback(data);
            });
        }
    });
}
