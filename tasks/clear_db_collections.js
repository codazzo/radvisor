var _ = require('underscore');
var db = require('../db');

var collections = db.getCollections();
var dbi = db.getInstance();

var count = 0;
_.each(collections, function(cName){
    dbi.collection(cName).remove(function(dunno, howManyRemoved){
        console.log('Removed ' + howManyRemoved + ' elements from collection: ' + cName);
        count++;
        if (count == collections.length) {
            process.exit();
        }
    });
});
