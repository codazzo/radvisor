var resources = ["regions", "events", "event", "dj"];
var _ = require("underscore");

var scrapers = {};
_.each(resources, function(resource){
	scrapers[resource] = require("./scrapers/" + resource);
});

exports.scrape = function(page, options, callback){
    return scrapers[page](options, callback);
}