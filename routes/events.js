var db = require("../db");
var Cookies = require("cookies");
var $ = require('jquery');

module.exports = function(req, res){
    var cookies = new Cookies( req, res );
    var locationCookie = cookies.get("ra_location");
    var locationId;
    if(locationCookie) {
        var locationData = $.parseJSON(decodeURIComponent(locationCookie));
        locationId = locationData.id;
    } else {
        locationId = defaultLocation;
    }

    var dateStr = req.params[0];    
    var options = {
        day: dateStr.substr(0,2),
        month: dateStr.substr(2,2),
        year: dateStr.substr(4,4),
        locationId: locationId
    }

    db.get("events", options, function(eventsArray){
        var resStr = JSON.stringify(eventsArray);
        res.send(resStr);
    });

};
