var libDeps = {
        files: [
        //the folllowing files are served directly by the CDN
        // "jquery-1.8.3.js",
        // "jquery.mobile-1.2.0.js",
        // "underscore.js",
        // "backbone.js",
        // "jquery-cookie.js",
        "xdate-dev.js",
        "xdate.i18n.js",
        "mobipick.js"
    ],
    path: "/javascripts/libs/",
    name: "libs.js"
}

var appDeps = {
    files: [
        "../libs/jquery-cookie.js",
        "class.js",
        "utils.js",
        "models/dj.js",
        "models/event.js",
        "models/eventCache.js",
        "models/events.js",
        "models/eventsByDate.js",
        "models/locations.js",
        "models/track.js",
        "locationManager.js",
        "router.js",
        "views/dj.js",
        "views/event.js",
        "views/events.js",
        "views/locations.js",
        "views/track.js",
        "views/tracks.js",
        "views/map.js",
        "app.js"
    ],
    path: "/javascripts/app/",
    name: "app.js"
}

module.exports = [libDeps, appDeps];
