var s_regions = require("./scrapers/regions");
var s_events = require("./scrapers/events");
var s_event = require("./scrapers/event");

exports.scrape = function(page, options, callback){
    var scrapers = {
        regions: s_regions,
        events: s_events,
        event: s_event
    }
    return scrapers[page](options, callback);
}