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
var _ = require('underscore');
var handlebars = require('handlebars');
var fs = require('fs');
var db = require('../db');
var Buffer = require('buffer').Buffer;
var Cookies = require("cookies");
var deps = require('../config/deps');
var app = require('../app');

var templates = {
    dj: 'dj.html',
    dj_about: 'dj_about.html',
    dj_tracks: 'dj_tracks.html',
    dj_events: 'dj_events.html',
    event: 'event.html',
    events: 'events.html',
    locations: 'locations.html',
    track: 'track.html',
    map: 'map.html',
    list_event: 'list_event.html'
}

var images = {
    logo: 'radvisor_logo.png'
}

var templatesRootPath = 'public/templates/';
var imagesRootPath = 'public/images/';

var uiTemplateSource = "" + fs.readFileSync('views/mobile.html'); //FIXME not sure why we must coerce to string. check below too.
var uiTemplate = handlebars.compile(uiTemplateSource);

var scriptLoader = "" + fs.readFileSync('public/javascripts/libs/head.load.min.js'); //including script loader inline in html

exports.mobile = function(req, res){
    var cookies = new Cookies( req, res );
    var locationCookie = cookies.get("ra_location");
    var locationId;
    if(!locationCookie) {
        res.cookie("ra_location", JSON.stringify(defaultLocation), { path: '/'});
    }

    var imagesSRCs = {};
    _.each(images, function(file, key){
        var path = imagesRootPath + file;
        var image = fs.readFileSync(path);
        var buf = new Buffer(image);
        var imageEncoded = buf.toString('base64');
        imagesSRCs[key] = 'data:image/png;base64,' + imageEncoded;
    });

    db.get("regions", {}, function(regionsArray){
        var bootstrapData = {
            regions: regionsArray
        };
        var uiData = {
            templates: {},
            env: {
                isProduction: app.get('env') == 'production'
            },
            deps: deps,
            scriptLoader: scriptLoader,
            images: imagesSRCs,
            bootstrap: JSON.stringify(bootstrapData)
        };
        _.each(templates, function(value, key){
            uiData.templates[key] =  "" + fs.readFileSync(templatesRootPath + value);
        });
        var resContent = uiTemplate(uiData);
        res.send(resContent);
    });
};
