/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , hbs = require('hbs')
  , less = require("less")
  , fs = require("fs");
  
var ui = require('./routes/ui');
var events = require('./routes/events');
var event = require('./routes/event');
var regions = require('./routes/regions');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // app.use(express.cookieParser('your secret here'));
  // app.use(express.session());
  app.use(app.router);
  // app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});


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

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', ui.mobile);

app.get('/regions', regions.regions);

app.get('/events/*', events.events);
app.get('/event/*', event.event);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
