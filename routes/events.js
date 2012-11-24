
/*
 * scrape events
 */


//var url = "http://www.residentadvisor.net/events.aspx?ai=34"; //events overview
var url = "http://www.residentadvisor.net/events.aspx?ai=34&mn=11&yr=2012&dy=23&v=day"; //single day


var host = "http://www.residentadvisor.net/";
var cityCode = "34";

var $ = require('jquery');
var _ = require('underscore');

var jDistiller = require('/Users/antonio/node/jDistiller').jDistiller;
var jd = new jDistiller();

var jsdom = require("jsdom");

exports.events = function(req, res){
//using jDistiller    
    // jd.
    // set('oldevents', 'tr[valign="bottom"]', function(element, prev, i) {
    //     if (i<this.___currentElements.length - 2){
    //         return [element.text()]
    //     }
    // }).
    // set('events', 'tr.white-bg', function(element, prev, i) {
    //     var days = element.children().first().children("table").find("tr[valign=bottom]");
    //     var res = [];
    //     _.each(days, function(dayTR){
    //         var date = dayTR.find(".f16").find("a").text().trim();
    //         res.push(date)
    //     });
    //     return res;
    // })
    // .distill(url, function(err, distilledPage) {
    //     var resJSON = JSON.stringify(distilledPage)
    //     res.send(resJSON);
    // });

    // Count all of the links from the nodejs build page

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
        // var resStr = "there have been " + window.$("a").length + " nodejs releases!";

        //var eventDivs = window.$(".hr-dark").nextAll().filter("[onmouseover]");
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
