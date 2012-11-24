
/**
 * Module dependencies.
 */

var express = require('express')
  // , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , hbs = require('hbs')
  , less = require("less")
  , fs = require("fs");
  
// var store = require('./routes/store');
var ui = require('./routes/ui');
var events = require('./routes/events');
var event = require('./routes/event');

// var jDistiller = require('jdistiller').jDistiller;

// var jd = new jDistiller();

var app = express();
// app.locals.layout = false; //we dont use layout... hbs will break without one

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  // app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // app.use(express.cookieParser('your secret here'));
  // app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
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

// app.get('/', routes.index);
// app.get('/', store.home);
app.get('/', ui.mobile);

app.get('/users', user.list);
app.get('/events/*', events.events);
app.get('/event/*', event.event);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
