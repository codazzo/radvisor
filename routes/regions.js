var db = require("../db");

exports.regions = function(req, res){
    var urlBase = "http://www.residentadvisor.net/events.aspx";

    db.get("regions", {}, function(regionsArray){
        var resStr = JSON.stringify(regionsArray);
        res.send(resStr);
    });
};
