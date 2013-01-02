var db = require("../db");

module.exports = function(req, res){
    var urlBase = "http://www.residentadvisor.net/events.aspx";
    var params = {
        page: 'regions',
        options: {}
    }
    db.get(params, function(regionsArray){
        var resStr = JSON.stringify(regionsArray);
        res.send(resStr);
    });
};
