/*
 * GET home page.
 */

var defaultLocation = {
    id: "34",
    country:"Germany",
    name: "Berlin",
    img: "http://www.residentadvisor.net/images/flags/de.gif"
}

var $ = require('jquery');
var Cookies = require("cookies");

exports.mobile = function(req, res){
    var cookies = new Cookies( req, res );
    var locationCookie = cookies.get("ra_location");
    var locationId;
    if(!locationCookie) {
        res.cookie("ra_location", JSON.stringify(defaultLocation), { path: '/'});
    }
    res.sendfile('views/mobile.html');
};