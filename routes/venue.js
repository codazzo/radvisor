var db = require("../db");

module.exports = function(req, res){
    var options = {
        venueId: req.params[0]
    }

    db.get("venue", options, function(venueData){
        var resStr = JSON.stringify(venueData);
        res.send(resStr);
    });
}