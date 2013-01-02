var db = require("../db");

module.exports = function(req, res){
    var params = {
        page: 'venue',
        options: {venueId: req.params.venueId}
    }

    db.get(params, function(venueData){
        var resStr = JSON.stringify(venueData);
        res.send(resStr);
    });
}