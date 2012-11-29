var config = require('./config'),
    fs = require("fs"),
    db = require("./db"),
    http = require('http'),
    less = require("less"),
    _ = require("underscore");

var ui = require('./routes/ui'),
    events = require('./routes/events'),
    event = require('./routes/event'),
    regions = require('./routes/regions'),
    dj = require('./routes/dj');

var app = config.app;

app.get("*.less", function(req, res) {
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

var routes = {
    '/' : ui.mobile,
    '/regions': regions,
    '/events/*': events,
    '/event/*': event,
    '/dj/*': dj
}
_.each(routes, function(handler, route){
    app.get(route, handler);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
