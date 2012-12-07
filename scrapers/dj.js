var config = require('../config');
var app = config.app;
var $ = require('jquery');
var _ = require('underscore');
var jsdom = require("jsdom");

var host = "http://www.residentadvisor.net";
var client_id = app.get('sc_client_id');

module.exports = function(options, callback){
    var djName = options.name;
    var urlBase = "http://www.residentadvisor.net/dj/";
    var url = urlBase + djName;
    
    jsdom.env(
        url,
        ["http://code.jquery.com/jquery.js"],
        function (errors, window) {
            var resObj = {
                name: window.$("meta[name='Description']").attr("content"),
                img: host + window.$(".nav-usr-gap").find("img").attr("src")
            };

            var smallBioDiv = window.$(".pb8.pl8.white");
            smallBioDiv.find("div").remove();
            resObj.bio = smallBioDiv.text();

            var onTheInternetSpan = window.$(".white12b").filter(function(index, el){
                return $(el).text().indexOf("On the internet") != -1;
            });

            var internetTR = onTheInternetSpan.closest("tr");
            var linkTRs = internetTR.nextAll();
            var keyMap = {
                "RA DJ Page": "residentadvisor",
                "Website": "website",
                "Twitter": "twitter",
                "Soundcloud": "soundcloud",
                "Discogs": "discogs",
                "Facebook": "facebook"
            }
            var linksObj = {};
            linkTRs.each(function(index, tr){
                var $tr = $(tr);
                if ($tr.text().trim() == "") return;
                var key = $tr.children().eq(0).text().split("/")[0].trim();
                var value = $tr.children().eq(1).text();
                var mappedKey = keyMap[key];
                linksObj[mappedKey] = value;
            });
            resObj.links = linksObj;


            var scLink = linksObj['soundcloud'];
            if(scLink){
                var djTokens = scLink.split("/");
                var djName = djTokens[djTokens.length-1];

                $.ajax({
                    url: 'http://api.soundcloud.com/users.json',
                    dataType: 'jsonp',
                    data: {
                        q: djName,
                        client_id: client_id
                    },
                    error: function(res, status, xhr){
                        callback(resObj);
                    },
                    success:function(res, status, xhr){
                        if(!res) {
                            callback(resObj); //no users found TODO do this better
                        }
                        var userID = res[0].id; //TODO better check?
                        $.ajax({
                            url: 'http://api.soundcloud.com/users/'+userID+'/tracks.json',
                            dataType: 'jsonp',
                            data: {
                                client_id: client_id
                            },
                            error: function(res, status, xhr){
                                callback(resObj);
                            },
                            success:function(res, status, xhr){
                                if(!res) {
                                    callback(resObj); //no tracks found TODO do this better
                                }
                                resObj.sc_tracks = res;
                                callback(resObj);
                            }
                        });
                    }
                });

            }else{
            callback(resObj);
            }
        }
    );
}