var db = require("../db");

module.exports = function(req, res){
    var options = {
        venueId: req.params.venueId
    }

    db.get("venue", options, function(venueData){
        var resStr = JSON.stringify(venueData);
        res.send(resStr);
    });
}