var express = require('express'),
    path = require('path'),
    hbs = require('hbs');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.set("db_name", "restful_advisor");

    if ('development' == app.get('env')) {
        app.set('db_host', 'localhost');
    }
    if ('production' == app.get('env')) {
        app.set('db_host', 'DERP');
    }
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

module.exports = {
    app: app
}
