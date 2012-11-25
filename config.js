var express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    less = require("less");

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
        app.set('db_uri', 'localhost');
        app.set('db_full_uri', 'http://localhost:5984');
    }
    if ('production' == app.get('env')) {
        app.set('db_uri', 'n.n.n.n/prod');
    }
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

module.exports = {
    app: app
}
