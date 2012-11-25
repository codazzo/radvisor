var db = require("../db");

exports.event = function(req, res){
    var options = {
        eventId: req.params[0]
    }

    db.get("event", options, function(eventData){
        var resStr = JSON.stringify(eventData[0]);
        res.send(resStr);
    });
}