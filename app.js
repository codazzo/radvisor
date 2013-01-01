var express = require('express'),
    app = module.exports = express(),
    configureApp = require('./config/configureApp');

configureApp(app);

var fs = require("fs"),
    db = require("./db"),
    http = require('http'),
    less = require("less"),
    _ = require("underscore"),
    uglifier = require('./public/uglify'); //minification is performed here //TODO find better pattern?

var ui = require('./routes/ui'),
    events = require('./routes/events'),
    event = require('./routes/event'),
    regions = require('./routes/regions'),
    dj = require('./routes/dj'),
    venue = require('./routes/venue');


app.get("*.less.*", function(req, res) {
    var path = __dirname + req.url;
    fs.readFile(path, "utf8", function(err, data) {
        if (err) throw err;
        less.render(data, function(err, css) {
            if (err) throw err;
            res.header("Content-type", "text/css");
            res.send(css);
        });
    });
});


/*
* Serve resources under /public. This is a hack because '/public' shouldn't be in the source map url
* TODO do this better
*/
var publicRouter = function(req, res){
    var originalUrl = req.originalUrl;
    var choppedUrl = originalUrl.substr('/public'.length, originalUrl.length);
    res.redirect(choppedUrl);
}

var api_routes = {
    '/regions': regions,
    '/events/*': events,
    '/event/*': event,
    '/dj/*': dj,
    '/public/*': publicRouter,
    '/venue/*': venue
}

_.each(api_routes, function(handler, route){
    app.get(route, function(req, res){
        res.set('Content-Type', 'application/json');
        handler(req, res);
    });
});

app.get('/', ui.mobile);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});