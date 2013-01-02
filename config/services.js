var path = require('path'),
    express = require('express'),
    fs = require('fs');

exports.getConf = function() {
    var servicesConf;
    try {
        //if there's a services config file, use it
        var env = process.env.NODE_ENV || 'development';
        servicesConf = require('./loginData').getConf(env);
    } catch (e) {
        console.log("[CONF] /config/loginData.js missing. Falling back to ENV variables.");
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
    return servicesConf;
}
