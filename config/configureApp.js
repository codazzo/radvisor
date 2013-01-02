var path = require('path'),
    express = require('express');

module.exports = function(app) {
    app.configure('development', function(){
        //these are only used if env == 'development'
        app.use(express.errorHandler());
    });
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/../views');
    app.use(express.favicon(__dirname + '/../public/images/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/../public')));

    console.log("*** ENV ***");
    console.log(JSON.stringify(process.env));
    console.log("***********");

    var servicesConf = require('./services').getConf();
    console.log("[CONF] Services conf:");
    console.log(JSON.stringify(servicesConf));

    app.set('servicesConf', servicesConf);
}
