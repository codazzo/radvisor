var express = require('express'),
    path = require('path'),
    uglifier = require('./public/uglify');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    if ('development' == app.get('env')) {
        app.set('db_uri', 'mongodb://localhost/restful_advisor');
    }
    if ('production' == app.get('env')) {
        app.set('db_uri', 'mongodb://heroku_app9447256:dkmdaactsstuot0bq60bie9ips@ds043497.mongolab.com:43497/heroku_app9447256');
    }
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

module.exports = {
    app: app
}
