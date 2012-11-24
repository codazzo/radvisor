//var url = "http://www.residentadvisor.net/events.aspx?ai=34"; //events overview
var url = "http://www.residentadvisor.net/events.aspx?show=all";
var host = "http://www.residentadvisor.net/";


var $ = require('jquery');
var _ = require('underscore');

var jsdom = require("jsdom");

exports.regions = function(req, res){
    var urlBase = "http://www.residentadvisor.net/events.aspx";

    jsdom.env(
      url,
      ["http://code.jquery.com/jquery.js"],
      function (errors, window) {
        var countryTables = window.$("table").splice(6,102); //window.$("form#Form1").find("table");

        var resArray = [];
        _.each(countryTables, function(table){
            var $table = $(table);
            var regions = $table.find("a");

            var countryName = $table.find("tr").first().text().trim();
            var countryFlag = $table.find("tr").first().find("img").first().attr("src");
            var countryObj = {
                name: countryName,
                img: host+countryFlag,
                regions: []
            };

            regions.each(function(index, region){
                var $region = $(region);
                var regionId = $region.attr("href").split("?")[1].split("=")[1];
                var regionName = $region.text();
                countryObj.regions.push({
                    id: regionId,
                    name: regionName
                });
            })

            resArray.push(countryObj);
        });
        
        var resStr = JSON.stringify(resArray);
        res.send(resStr);
      }
    );
};
