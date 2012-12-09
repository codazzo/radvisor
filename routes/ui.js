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
var Cookies = require("cookies");
var config = require('../config');
var app = config.app;

var templates = {
    dj: 'dj.html',
    dj_about: 'dj_about.html',
    dj_tracks: 'dj_tracks.html',
    dj_events: 'dj_events.html',
    event: 'event.html',
    events: 'events.html',
    locations: 'locations.html',
    track: 'track.html'
}

var templatesRootPath = 'public/templates/';
var uiTemplateSource = "" + fs.readFileSync('views/mobile.html'); //not sure why we must coerce to string
var uiTemplate = handlebars.compile(uiTemplateSource);
var nbl = "" + fs.readFileSync('public/javascripts/libs/nbl.plus.min.js');
exports.mobile = function(req, res){
    var cookies = new Cookies( req, res );
    var locationCookie = cookies.get("ra_location");
    var locationId;
    if(!locationCookie) {
        res.cookie("ra_location", JSON.stringify(defaultLocation), { path: '/'});
    }

    var uiData = {
        templates : {},
        env: {
            isProduction: app.get('env') == 'production'
        },
        deps: config.deps,
        nbl: nbl
    };

    _.each(templates, function(value, key){
        uiData.templates[key] =  "" + fs.readFileSync(templatesRootPath + value);
    });
    var resContent = uiTemplate(uiData);
    res.send(resContent);
};