var UglifyJS = require("uglify-js"),
    _ = require("underscore"),
    fs = require('fs'),
    deps = require('../config/deps');

var mapsPath = "http://localhost:3000/minified/";
var rootPath = "./public";
_.each(deps, function(conf){
    var path = rootPath + conf.path;
    var files = conf.files;
    var name = conf.name;
    var mapName = name + ".map";
    _.each(files, function(el, index){
        files[index] = path + el; //store the complete path in the array
    });

    var minifiedObj = UglifyJS.minify(files, {
        outSourceMap: mapName,
        sourceRoot: "http://localhost:3000"
    });

    var code = minifiedObj.code + "\n" + "//@ sourceMappingURL=" + mapsPath + mapName;
    fs.writeFileSync( 'public/minified/' + name, code);
    fs.writeFileSync( 'public/minified/' + mapName, minifiedObj.map);
});