var UglifyJS = require("uglify-js"),
	_ = require("underscore"),
	fs = require('fs');

var libFiles = [
	//the folllwing are served directly by the CDN
	// "jquery-1.8.3.js",
	// "jquery.mobile-1.2.0.js",
	// "underscore.js",
	// "backbone.js",

	"jquery-cookie.js",
	"xdate-dev.js",
	"xdate.i18n.js",
	"mobipick.js"
]


var libsPath = "./public/javascripts/libs/";
_.each(libFiles, function(el, index){
	libFiles[index] = libsPath + el; //store the complete path in the array
});

var libsMapName = "libs.js.map";
var mapsPath = "http://localhost:3000/minified/";
var minifiedLibs = UglifyJS.minify(libFiles, {
    outSourceMap: libsMapName
});

var libsCode = minifiedLibs.code + "\n" + "//@ sourceMappingURL=" + mapsPath + libsMapName;

fs.writeFileSync( 'public/minified/libs.js', libsCode);
fs.writeFileSync( 'public/minified/' + libsMapName, minifiedLibs.map);