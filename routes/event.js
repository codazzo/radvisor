var host = "http://www.residentadvisor.net/";
var cityCode = "34";

var $ = require('jquery');
var _ = require('underscore');

var jsdom = require("jsdom");

exports.event = function(req, res){
    var eventId = req.params[0];
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

            var resStr = JSON.stringify(resObj);
            res.send(resStr);
        }
    );
}