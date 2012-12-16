var $ = require('jquery');
var _ = require('underscore');
var jsdom = require('jsdom');

var host = "http://www.residentadvisor.net/";

module.exports = function(options, callback){
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

            var getRowData = function(node){
                return node.children("td").eq(1).text()
            }

            var date = getRowData(infoRows.eq(1));
            var time = getRowData(infoRows.eq(2));

            //a bit involved but this accounts for slashes in the venue name
            var venueStr = getRowData(infoRows.eq(3));
            var slashTokens = venueStr.split("/");
            var venueAddress = venueStr.split("/")[slashTokens.length-1].trim();
            var venueName = venueStr.substr(0, venueStr.length - venueAddress.length - 2); //-2 accounts for '/ '
            var cost = getRowData(infoRows.eq(4));

            var infoPanes = window.$("#_contentmain_EventDisplay").find("tr").first().children("td");
            var mainInfo = infoPanes.eq(0);
            var attendees = infoPanes.eq(1);
            var imgURL = mainInfo.find("img").length ? host + mainInfo.find("img").attr("src") : undefined;
            var resObj = {
                id: eventId,
                title: title,
                date: date,
                time: time,
                venue: venueName,
                address: venueAddress,
                cost: cost,
                img: imgURL
            }

            var infoMap = {
                lineup: "Line-up",
                promoter: "Promoter",
                links: "Promotional links"
            }
            var extraInfo = {};
            var extraStrings = "";
            mainInfo.children().each(function(index, el){
                var $el = $(el);

                var allText = $el.text().trim();
                var hasKey = false;
                var theSection, content;
                //1. check if it's a named section e.g. "Line-up"
                _.each(infoMap, function(value, key){
                    if (allText.indexOf(value)==0){
                        hasKey = true;
                        theSection = value;
                    }
                });
                if(hasKey){ //it is a named section
                    var theChildren = $el.children();
                    for(var i=0; i<theChildren.length; i++){
                        //let's remove all of the nodes up until and including the value e.g. "Line-up"
                        var foundIt = false;
                        var elNino = theChildren.eq(i);
                        if(elNino.text().indexOf(theSection)==0){
                            foundIt = true;
                        }
                        elNino.remove();
                        if(foundIt){
                            break;
                        }
                    }
                    //now we can return the rest with all the markup
                    content = $el.html();
                    extraInfo[theSection] = content;
                } else {
                    //it's just extra information
                    content = $el.text();
                    extraStrings += content + "<br/>";
                }
            });
            resObj.extraInfo = extraInfo;
            resObj.extraStrings = extraStrings;

            callback(resObj);
        }
    );
}
