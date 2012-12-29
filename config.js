var express = require('express'),
    path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    var servicesConf;
    try {
        //if there's a services config file, use it
        var env = app.get('env');
        servicesConf = require('./config-services').getConf(env);
    } catch (e) {
        //try to read settings from env variables (e.g. heroku conf), otherwise use defaults
        var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/restful_advisor';
        var scClientID = process.env.SC_CLIENT_ID || ''; //you need to get one :P
        servicesConf = {
            mongoURI: mongoURI,
            scClientID: scClientID
        }
    }

    console.log('CONFIG: ' + JSON.stringify(servicesConf));
    app.set('db_uri', servicesConf.mongoURI);
    app.set('scClientID', servicesConf.scClientID);
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var libDeps = {
        files: [
        //the folllowing files are served directly by the CDN
        // "jquery-1.8.3.js",
        // "jquery.mobile-1.2.0.js",
        // "underscore.js",
        // "backbone.js",
        // "jquery-cookie.js",
        "xdate-dev.js",
        "xdate.i18n.js",
        "mobipick.js"
    ],
    path: "/javascripts/libs/",
    name: "libs.js"
}

var appDeps = {
    files: [
        "../libs/jquery-cookie.js",
        "class.js",
        "utils.js",
        "models/dj.js",
        "models/event.js",
        "models/eventCache.js",
        "models/events.js",
        "models/eventsByDate.js",
        "models/locations.js",
        "models/track.js",
        "router.js",
        "views/dj.js",
        "views/event.js",
        "views/events.js",
        "views/locations.js",
        "views/track.js",
        "views/tracks.js",
        "views/map.js",
        "app.js"
    ],
    path: "/javascripts/app/",
    name: "app.js"
}

module.exports = {
    app: app,
    deps: [libDeps, appDeps]
}
