var $ = require('jquery');
var _ = require('underscore');
var jsdom = require("jsdom");
var gmaps = require("googlemaps");

var host = "http://www.residentadvisor.net/";

module.exports = function(options, callback){
    var venueId = options.venueId;
    var urlBase = "http://www.residentadvisor.net/club-detail.aspx?id=";
    var url = urlBase + venueId;
    
    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var propsMap = {
                address: 'Address',
                phone: 'Phone',
                capacity: 'Capacity',
                aka: 'Aka',
                venueSize: 'Venue size'
            }

            var resObj = {};
            var infoSections = window.$(".cat-title table").first().find("table");
            var mainInfoTRs = infoSections.eq(0).find("tr");
            mainInfoTRs.each(function(index, el){
                var $el = $(el);
                var rowTDs = $el.find("td");
                var entryText = rowTDs.first().text();
                _.each(propsMap, function(value, key){
                    if(entryText.indexOf(value) != -1){
                        var infoTD = rowTDs.eq(1);
                        infoTD.find("div").remove();
                        resObj[key] = infoTD.text().trim();
                    }
                });
                _.each(propsMap, function(value, key){
                    if( resObj[key]===undefined ) resObj[key] = null; //normalize JSON schema
                });
            });
            var logo = window.document.getElementById("_contentmain__clublogo");
            resObj.logo = logo ? host+logo.src : null;
            resObj.id = venueId;
            resObj.name = window.$('h1.title2 span').first().text();
            if (propsMap.address) {
                gmaps.geocode(resObj.address, function(err, data) {
                    if(data !== undefined) {
                        latlng = data['results'][0]['geometry']['location'];
                        resObj.location = latlng;
                        callback(resObj);
                    }
                });
            } else {
                resObj.location = null;
                callback(resObj);
            }
        }
    );
}