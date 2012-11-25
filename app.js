var config = require('./config'),
    fs = require("fs"),
    db = require("./db"),
    http = require('http'),
    less = require("less");

var ui = require('./routes/ui'),
    events = require('./routes/events'),
    event = require('./routes/event'),
    regions = require('./routes/regions');

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


app.get('/', ui.mobile);

app.get('/regions', regions.regions);

app.get('/events/*', events.events);
app.get('/event/*', event.event);

app.get('/getDoc/*', db.getDoc);
app.get('/saveDoc/*', db.saveDoc);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
