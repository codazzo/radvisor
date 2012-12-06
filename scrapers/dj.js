var $ = require('jquery');
var _ = require('underscore');
var jsdom = require("jsdom");

var host = "http://www.residentadvisor.net";

module.exports = function(options, callback){
    var djName = options.name;
    var urlBase = "http://www.residentadvisor.net/dj/";
    var url = urlBase + djName;
    
    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var resObj = {
                name: window.$("meta[name='Description']").attr("content"),
                img: host + window.$(".nav-usr-gap").find("img").attr("src")
            };

            var smallBioDiv = window.$(".pb8.pl8.white");
            smallBioDiv.find("div").remove();
            resObj.bio = smallBioDiv.text();
            
            var onTheInternetSpan = window.$(".white12b").filter(function(index, el){
                return $(el).text().indexOf("On the internet") != -1;
            });

            var internetTR = onTheInternetSpan.closest("tr");
            var linkTRs = internetTR.nextAll();
            var keyMap = {
                "RA DJ Page": "residentadvisor",
                "Website": "website",
                "Twitter": "twitter",
                "Soundcloud": "soundcloud",
                "Discogs": "discogs",
                "Facebook": "facebook"
            }
            var linksObj = {};
            linkTRs.each(function(index, tr){
                var $tr = $(tr);
                if ($tr.text().trim() == "") return;
                var key = $tr.children().eq(0).text().split("/")[0].trim();
                var value = $tr.children().eq(1).text();
                var mappedKey = keyMap[key];
                linksObj[mappedKey] = value;
            });
            resObj.links = linksObj;
            callback(resObj);
        }
    );
}