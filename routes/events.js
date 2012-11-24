//var url = "http://www.residentadvisor.net/events.aspx?ai=34"; //events overview
var url = "http://www.residentadvisor.net/events.aspx?ai=34&mn=11&yr=2012&dy=23&v=day"; //single day
var host = "http://www.residentadvisor.net/";
var cityCode = "34";

var $ = require('jquery');
var _ = require('underscore');

var jsdom = require("jsdom");

exports.events = function(req, res){
    var urlBase = "http://www.residentadvisor.net/events.aspx";
    var dateStr = req.params[0];
    var day = dateStr.substr(0,2);
    var month = dateStr.substr(2,2);
    var year = dateStr.substr(4,4);
    var url = urlBase + "?ai=" + cityCode + "&mn=" + month + "&yr=" + year + "&dy=" + day + "&v=day";
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
        
        var resStr = JSON.stringify(resArray);
        res.send(resStr);
      }
    );
};
