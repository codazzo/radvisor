var LocationManager = function(){
    var defaultLocation = {
        id: "34",
        country:"Germany",
        name: "Berlin",
        img: "http://www.residentadvisor.net/images/flags/de.gif"
    }

    var manager = {
        getLocation: function(){
            var location;
            try {
                location = JSON.parse($.cookie("ra_location"));
            } catch (e) {
                location = null;
            }
            return location;
        },
        setLocation: function(location){
            var locationStr = JSON.stringify(location);
            $.cookie('ra_location', locationStr);
        }
    }

    //init
    if ( !manager.getLocation() ) {
        manager.setLocation(defaultLocation);
    }
    return manager;
}