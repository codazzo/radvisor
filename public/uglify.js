var UglifyJS = require("uglify-js"),
	_ = require("underscore"),
	fs = require('fs');

var libConf = {
		files: [
		//the folllowing files are served directly by the CDN
		// "jquery-1.8.3.js",
		// "jquery.mobile-1.2.0.js",
		// "underscore.js",
		// "backbone.js",
		"jquery-cookie.js",
		"xdate-dev.js",
		"xdate.i18n.js",
		"mobipick.js"
	],
	path: "./public/javascripts/libs/",
	name: "libs.js"
}

var appConf = {
	files: [
		"class.js",
		"models/dj.js",
		"models/event.js",
		"models/eventCache.js",
		"models/events.js",
		"models/eventsByDate.js",
		"models/locations.js",
		"models/track.js",
		"router.js",
		"views/dj.js",
		"views/event.js",
		"views/events.js",
		"views/locations.js",
		"views/track.js",
		"views/tracks.js",
		"app.js"
	],
	path: "./public/javascripts/app/",
	name: "app.js"
}

var confs = [libConf, appConf];
var mapsPath = "http://localhost:3000/minified/";

_.each(confs, function(conf){
	var path = conf.path;
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