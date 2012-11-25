var $ = require('jquery');
var _ = require('underscore');
var jsdom = require("jsdom");

var host = "http://www.residentadvisor.net/";

module.exports = function(options, callback){
    var urlBase = "http://www.residentadvisor.net/events.aspx";
    var defaultLocation = "34"; //<3
    var day = options.day,
        month = options.month,
        year = options.year,
        locationId = options.locationId;

    var url = urlBase + "?ai=" + locationId + "&mn=" + month + "&yr=" + year + "&dy=" + day + "&v=day";
    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var eventDivs = window.$(".hr-dark").nextAll().not(".hr");

            var resArray = [];
            _.each(eventDivs, function(ev){
                var $ev = $(ev);
                var hrefs = _.map($ev.find("a[href]"), function(el){
                    return $(el).attr("href")
                });
                var idHref = _.find(hrefs, function(el){
                    return el.indexOf("event") != -1
                });
                if (!idHref) return; //no event id: dirty data! skip
                var eventObj = {
                    id: idHref.split("?")[1],
                    title: $ev.children(".black").text(),
                    img: host+$ev.find(".im-list").find("img").attr("src"),
                    info: $ev.children(".pt1.grey").text(),
                    ppl: $ev.children(".pt1").find(".f10").find(".grey").text().split(" ")[0]
                };
                resArray.push(eventObj);
            });

            callback(resArray);
        }
    );
}