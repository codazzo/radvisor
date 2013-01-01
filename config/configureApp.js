var path = require('path'),
    express = require('express'),
    fs = require('fs');

//create cache directory if missing
fs.mkdir('public/cache');

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

    var servicesConf;
    console.log("*** ENV ***");
    console.log(JSON.stringify(process.env));
    try {
        //if there's a services config file, use it
        var env = app.get('env');
        console.log("loading services conf.");
        servicesConf = require('./services').getConf(env);
        console.log("read conf:");
        console.log(JSON.stringify(servicesConf));
    } catch (e) {
        //try to read settings from env variables (e.g. heroku conf), otherwise use defaults
        var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost/radvisor';
        var scClientID = process.env.SC_CLIENT_ID || ''; //you need to get one :P
        var cloudinaryConf = process.env.CLOUDINARY_CONF ? JSON.parse(process.env.CLOUDINARY_CONF) : {};
        servicesConf = {
            mongoURI: mongoURI,
            scClientID: scClientID,
            cloudinaryConf: cloudinaryConf
        }
    }

    console.log('CONFIG: ' + JSON.stringify(servicesConf));
    app.set('db_uri', servicesConf.mongoURI);
    app.set('scClientID', servicesConf.scClientID);
    app.set('cloudinaryConf', servicesConf.cloudinaryConf);
}
