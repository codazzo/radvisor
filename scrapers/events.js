var db = require("../db");

var $ = require('jquery');
var _ = require('underscore');
var jsdom = require("jsdom");

var gm = require("gm");

var host = "http://www.residentadvisor.net";
var imageMagick = gm.subClass({ imageMagick: true });

module.exports = function(options, callback){
    var urlBase = "http://www.residentadvisor.net/events.aspx";
    var defaultLocation = "34"; //<3
    var day = options.day,
        month = options.month,
        year = options.year,
        locationId = options.locationId;

    var url = urlBase + "?ai=" + locationId + "&mn=" + month + "&yr=" + year + "&dy=" + day + "&v=day";
    var spritePath = 'cache/' + 'events-' + locationId + '-' + year + '-' + month + '-' + day + '.jpg';
    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var eventDivs = window.$(".hr-dark").nextAll().not(".hr");

            var eventsArray = [];
            var count = 0;
            if (!eventDivs.length) {
                callback([]); //no events found
            }
            var imgSprite = imageMagick();

            _.each(eventDivs, function(ev){
                var $ev = $(ev);
                var hrefs = _.map($ev.find("a[href]"), function(el){
                    return $(el).attr("href")
                });
                var idHref = _.find(hrefs, function(el){
                    return el.indexOf("event") != -1
                });
                if (!idHref) return; //no event id: dirty data! skip
                count++;
                var titleEl = $ev.children(".black");
                var isRAticket;
                if(!titleEl.length){
                    titleEl = $ev.children().eq(2); //RA tickets
                    isRAticket = true;
                }
                var eventAtVenue = titleEl.text();
                var venueAnchor = titleEl.children('a').filter(function(){
                    return this.href.indexOf('club-detail') != -1;
                });
                var venueId = venueAnchor && venueAnchor.length ? venueAnchor[0].href.split('id=')[1] : null;
                var eventName = titleEl.children().first().text();
                var venueName = eventAtVenue.substr(eventName.length+4, eventAtVenue.length); //" at "
                if(isRAticket){
                    venueName = eventAtVenue.split(" at ")[1];
                    eventName = eventAtVenue.substr(0, eventAtVenue.length-venueName.length-4);
                }
                var eventImg = host+$ev.find(".im-list").find("img").attr("src");
                imgSprite.append(eventImg);

                var eventObj = {
                    id: idHref.split("?")[1],
                    title: eventName,
                    venue: {
                        id: venueId,
                        name: venueName
                    },
                    img: eventImg,
                    sprite: spritePath,
                    info: $ev.children(".pt1.grey").text(),
                    ppl: $ev.children(".pt1").find(".f10").find(".grey").text().split(" ")[0]
                };

                function callbackIfAllScraped(){
                    if(eventsArray.length == count) {
                        eventsArray = _.sortBy(eventsArray, function(el){
                            var pplInt;
                            try{
                                pplInt = -parseInt(el.ppl);
                            } catch (e) { /*TODO */}
                            return pplInt;
                        });
                        _.each(eventsArray, function(el, index){
                            el.index = index;
                        });
                        imgSprite.write('public/' + spritePath, function(err, stdout, stderr, cmd){
                            console.log("image sprite written to disk: " + spritePath);
                            callback(eventsArray);
                        });
                    }
                }

                if (venueId) {
                    db.get("venue", {venueId: venueId}, function(venueData){
                        _.extend(eventObj.venue, venueData);
                        eventsArray.push(eventObj);
                        callbackIfAllScraped();
                    });
                } else {
                    eventsArray.push(eventObj);
                    callbackIfAllScraped();
                }
            });
            
        }
    );
}
