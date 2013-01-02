require('date-utils');
var async = require('async');
var _ = require('underscore');
var db = require('../db');

var cdb = require('./clear_db_collections');
cdb.clearCollection('events');

var locations = [
    34, //Berlin
    171, //Italy - North
    172, //Italy - South
    13, //London
    44, //Paris
    60, //Switzerland
    8, //New York
    20, //Barcelona
    43, //Ireland
    16, //North, Uk
    29, //Amsterdam
    70, //Mexico
]

var q = async.queue(function (params, callback) {
    db.get(params, callback);
}, 1);

var dates = [];
var daysFromNow = [0, 1, 2];
_.each(daysFromNow, function(daysFromNow){
    var date = new Date();
    dates.push(date.add({
        days: daysFromNow
    }));
});

var totalCount = daysFromNow.length * locations.length;
var scrapedCount = 0;
_.each(dates, function(date){
    _.each(locations, function(locationNum){
        var options = {
            day: date.toFormat('DD'),
            month: date.toFormat('MM'),
            year: date.toFormat('YYYY'),
            locationId: '' + locationNum
        }
        var params = {
            page: 'events',
            options: options
        }
        q.push(params, function (data) {
            scrapedCount++;
            console.log('[scrape] Scraped ' + data.length + ' events for ' + JSON.stringify(options) + '(' + scrapedCount + '/' + totalCount +')');
            if (scrapedCount == totalCount) {
                console.log("Success!");
                process.exit(0);
            }
        });
    })
});