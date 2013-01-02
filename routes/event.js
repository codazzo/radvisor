var db = require("../db");

module.exports = function(req, res){
    var params = {
        page: 'event',
        options: {eventId: req.params.eventId}
    }

    db.get(params, function(eventData){
        var resStr = JSON.stringify(eventData);
        res.send(resStr);
    });
}