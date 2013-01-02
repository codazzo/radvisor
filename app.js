var express = require('express'),
    fs = require("fs"),
    db = require("./db"),
    http = require('http'),
    less = require("less"),
    _ = require("underscore"),
    configureApp = require('./config/configureApp'),
    uglifier = require('./public/uglify');

/*
* Init
*/
var app = module.exports = express();
configureApp(app); //configure application
fs.mkdir('public/cache'); //create cache directory if missing
db.initSchema(); //create collections if they're missing
uglifier.uglifyDeps(); //create uglified files with source maps

/*
* Routes
*/
//compile .less files on the fly (useful for dev)
app.get("*\.less\.css", function(req, res) {
    var path = __dirname + '/public' + req.url;
    fs.readFile(path, "utf8", function(err, data) {
        if (err) throw err;
        less.render(data, function(err, css) {
            if (err) throw err;
            res.header("Content-type", "text/css");
            res.send(css);
        });
    });
});

// Register API routes
var apiRoutes = {
    regions: '/regions',
    events: '/events/:locationId/:dateStr',
    event: '/event/*',
    dj: '/dj/*',
    venue: '/venue/*'
}
_.each(apiRoutes, function(route, name){
    var handler = require('./routes/' + name);
    app.get(route, function(req, res){
        res.set('Content-Type', 'application/json');
        handler(req, res);
    });
});

//Register UI route
app.get('/', require('./routes/ui').mobile);

/*
* Server creation
*/
http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});