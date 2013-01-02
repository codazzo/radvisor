var db = require("../db");

module.exports = function(req, res){
    var params = {
        page: 'dj',
        options: {name: req.params.name}
    }

    db.get(params, function(eventData){
        var resStr = JSON.stringify(eventData);
        res.send(resStr);
    });
}