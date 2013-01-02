//Usage:
//node clear_db_collections.js (clears all collections)
//node clear_db_collections.js cName (clears only collection cName)

var _ = require('underscore');
var db = require('../db');
var dbi = db.getInstance();

var collections;
var cName = process.argv[2]

function clearCollection(cName, callback) {
    dbi.collection(cName).remove(callback);
}

if (cName) {
    //used from the command line
    if (cName == 'all') {
        collections = db.getCollections();
    } else {
        collections = [cName];
        if(db.getCollections().indexOf(cName) == -1 ) {
            console.log('Collection name not valid: ' + cName);
            process.exit(-1);
        }
    }
    
    var count = 0;
    _.each(collections, function(cName){
        clearCollection(cName, function(dunno, howManyRemoved){
            console.log('Removed ' + howManyRemoved + ' elements from collection: ' + cName);
            count++;
            if (count == collections.length) {
                process.exit();
            }
        });
    });
} else {
    module.exports = {
        clearCollection: clearCollection
    }
}