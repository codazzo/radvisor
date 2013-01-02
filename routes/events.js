var db = require("../db");

module.exports = function(req, res){
    var dateStr = req.params.dateStr;
    var locationId = req.params.locationId;

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
