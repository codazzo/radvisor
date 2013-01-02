var db = require("../db");

module.exports = function(req, res){
    var options = {
        eventId: req.params.eventId
    }

    db.get("event", options, function(eventData){
        var resStr = JSON.stringify(eventData);
        res.send(resStr);
    });
}