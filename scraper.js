var config = require('./config');
var app = config.app;

var $ = require('jquery');
var _ = require('underscore');
var jsdom = require("jsdom");

var host = "http://www.residentadvisor.net/";

exports.scrape = function(page, options, callback){
    var scrapers = {
        regions: function(){
            var url = "http://www.residentadvisor.net/events.aspx?show=all";
            
            jsdom.env(
                url,
                ["http://code.jquery.com/jquery.js"],
                function (errors, window) {
                    var countryTables = window.$("table").splice(6,102); //window.$("form#Form1").find("table");

                    var resArray = [];
                    _.each(countryTables, function(table){
                        var $table = $(table);
                        var regions = $table.find("a");

                        var countryName = $table.find("tr").first().text().trim();
                        var countryFlag = $table.find("tr").first().find("img").first().attr("src");
                        var countryObj = {
                            name: countryName,
                            img: host+countryFlag,
                            regions: []
                        };

                        regions.each(function(index, region){
                            var $region = $(region);
                            var regionId = $region.attr("href").split("?")[1].split("=")[1];
                            var regionName = $region.text();
                            countryObj.regions.push({
                                id: regionId,
                                name: regionName
                            });
                        })

                        resArray.push(countryObj);
                    });
                    
                    callback(resArray); //<-------------
                }
            );
        },
        events: function(options){
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
                
                callback(resArray); //<-----------
              }
            );
        },
        event: function(options){
            var eventId = options.eventId;
            var urlBase = "http://www.residentadvisor.net/event.aspx?";
            var url = urlBase + eventId;
            jsdom.env(
                url,
                ["http://code.jquery.com/jquery.js"],
                function (errors, window) {
                    var topData = window.$(".cat-title>table tr>td.pb4"); //tbody is insterted by chrome!
                    var title = topData.children("div").text();
                    var infoRows = topData.find("table tr");

                    var getRowdata = function(node){
                        return node.children("td").eq(1).text()
                    }

                    var date = getRowdata(infoRows.eq(1));
                    var time = getRowdata(infoRows.eq(2));
                    var venueStr = getRowdata(infoRows.eq(3));
                    var venueName = venueStr.split("/")[0].trim();
                    var venueAddress = venueStr.split("/")[1].trim();
                    var cost = getRowdata(infoRows.eq(4));

                    var resObj = {
                        id: eventId,
                        title: title,
                        date: date,
                        time: time,
                        venue: venueName,
                        address: venueAddress,
                        cost: cost
                    }

                    var infoPanes = window.$("#_contentmain_EventDisplay").find("tr").first().children("td");
                    var mainInfo = infoPanes.eq(0);
                    var attendees = infoPanes.eq(1);

                    var infoMap = {
                        lineup: "Line-up",
                        promoter: "Promoter",
                        links: "Promotional links"
                    }
                    var extraInfo = {};
                    var extraStrings = "";
                    mainInfo.children().each(function(index, el){
                        var $el = $(el);
                        var content = $el.text();
                        var found = false;
                        _.each(infoMap, function(value, key){
                            if (content.indexOf(value)==0){
                                extraInfo[key] = content.split("/")[1]; //simple text..
                                //extraInfo[key] = $el.first().children().not(":first").html(); //html...
                                found = true;
                            }
                        });
                        if (found = false) {
                            extraStrings += content + "<br/>";
                        }
                    });
                    resObj.extraInfo = extraInfo;
                    resObj.extraStrings = extraStrings;
                    resObj.img = host + mainInfo.find("img").attr("src");

                    callback(resObj); //<-----------
                }
            );
        }
    }

    return scrapers[page](options);
}