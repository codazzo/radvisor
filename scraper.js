var s_regions = require("./scrapers/regions");
var s_events = require("./scrapers/events");
var s_event = require("./scrapers/event");
var s_dj = require("./scrapers/dj");

exports.scrape = function(page, options, callback){
    var scrapers = {
        regions: s_regions,
        events: s_events,
        event: s_event,
        dj: s_dj
    }
    return scrapers[page](options, callback);
}