var UglifyJS = require("uglify-js"),
    _ = require("underscore"),
    fs = require('fs'),
    deps = require('../config/deps');

var mapsPath = "http://localhost:3000/minified/";
var rootPath = __dirname;

exports.uglifyDeps = function(){
    _.each(deps, function(conf){
        var path = rootPath + conf.path;
        var name = conf.name;
        var mapName = name + ".map";
        var filesToMinify = _.clone(conf.files);

        _.each(filesToMinify, function(el, index){
            filesToMinify[index] = path + el; //store the complete path in the array
        });

        var minifiedObj = UglifyJS.minify(filesToMinify, {
            outSourceMap: mapName,
            sourceRoot: "http://localhost:3000/"
        });

        var code = minifiedObj.code + "\n" + "//@ sourceMappingURL=" + mapsPath + mapName;
        fs.writeFileSync( 'public/minified/' + name, code);
        //clean up sourceMap
        var rootRegExp = new RegExp(rootPath, 'g');
        var cleanMap = minifiedObj.map.replace(rootRegExp, '');
        fs.writeFileSync( 'public/minified/' + mapName, cleanMap);
    });
}
