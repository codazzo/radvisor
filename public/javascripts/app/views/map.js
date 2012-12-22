radvisor.MapView = Backbone.View.extend({
    el: "#mapPage",
    template: _.template($("#map-template").html()),

    initialize: function(){
        this.wrapper = $("<div/>");
        var $content = this.$el.find("[data-role=content]");
        $content.html(this.template());
        $content.trigger('create');

        this.map_canvas = $('#map_canvas');
        $(window).resize(_.bind(this.fixGoogleMapLayout, this));
    },

    update: function(callback){
        var me = this;

        this.model.getEvents(null, function(eventsModel){
            //TODO this code is duplicated among views, could be refactored
            if(me.cachedModel != eventsModel){
                me.cachedModel = eventsModel;
                _.defer(_.bind(me.render, me)); //otherwise maps gets zoomed out to earth on 2nd view
            }
            callback();
            me.fixGoogleMapLayout();
        });
    },

    fixGoogleMapLayout: function(){
        //FIXME
        // 82: The sum of the header height plus the upper and bottom margins.
        this.map_canvas.height($('body').innerHeight() - 82); // <magicnumber/>
        this.map_canvas.gmap('refresh');
    },

    render: function() {
        // this.map_canvas.bind('init', _.bind(this.centerMapFromGeolocation, this));
        this.map_canvas.gmap('clear', 'markers');
        this.addVenueMarkers();
        this.centerMapFromGeolocation();
    },

    addVenueMarkers: function(){
        var me = this;

        var eventsData = me.cachedModel;
        eventsData.each(function(event) {
            var infoWinContent = '<a href="#/event/' + event.get("id") + '">' + event.get("title") + ' at ' + event.get("venue").name + '</a>';
            var venue = event.get('venue');
            if (venue.location) {
                var position = new google.maps.LatLng(venue.location.lat, venue.location.lng);
                me.map_canvas.gmap('addMarker', {
                    'position': position,
                    'bounds': true
                }).click(function() {
                    me.map_canvas.gmap('openInfoWindow', {'content': infoWinContent}, this);
                });
            }
        });
    },

    centerMapFromGeolocation: function(){
        var me = this;
        me.getCurrentPosition(function(position, status){
            if (status === 'OK'){
                var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log("fot pos. lat: "+position.coords.latitude + ", long: "+position.coords.longitude);
                me.map_canvas.gmap({'center': clientPosition});
                me.map_canvas.gmap('addMarker', {
                    'position': clientPosition,
                    'icon': 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png',
                });
            }
        });
    },

    cleanView: function(){
        this.$el.html(""); //hack to avoid superimposing event pages
        this.$el.closest("#mapPage").find("h1.title").html("");
    },

    getCurrentPosition: function(callback, geoPositionOptions) {
        if ( navigator.geolocation ) {
            navigator.geolocation.getCurrentPosition ( 
                function(result) {
                        callback(result, 'OK');
                }, 
                function(error) {
                        callback(null, error);
                }, 
                geoPositionOptions 
            );      
        } else {
            callback(null, 'NOT_SUPPORTED');
        }
    }
});
