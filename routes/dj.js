var db = require("../db");

module.exports = function(req, res){
    var options = {
        name: req.params.name
    }

    db.get("dj", options, function(eventData){
        var resStr = JSON.stringify(eventData);
        res.send(resStr);
    });
}