radvisor.MapView = Backbone.View.extend({
    el: "#mapPage",
    template: _.template($("#map-template").html()),
    eventTemplate: _.template($("#listevent-template").html()),

    initialize: function(){
        this.wrapper = $("<div/>");
        var $content = this.$el.find("[data-role=content]");
        $content.html(this.template());
        $content.trigger('create');

        this.map_canvas = $('#map_canvas');
        var homeLoc = new google.maps.LatLng(52.522867, 13.416297); //map requires a center position
        var mapOptions = {
          zoom: 10,
          center: homeLoc,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.overlays = [];
        this.map = new google.maps.Map(this.map_canvas[0], mapOptions);
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
        google.maps.event.trigger(this.map, 'resize');
    },

    render: function() {
        // this.map_canvas.bind('init', _.bind(this.centerMapFromGeolocation, this));
        this.clearOverlays();
        this.addVenueMarkers();
        this.centerMapFromGeolocation();
    },

    clearOverlays: function(){
        _.each(this.overlays, function(overlay){
            overlay.setMap(null);
        });
    },

    addVenueMarkers: function(){
        var me = this;

        var eventsData = me.cachedModel;
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow({
            maxWidth: 400
        });

        eventsData.each(function(event) {
            var infoWinContent = '<a href="#/event/' + event.get("id") + '">' + event.get("title") + ' at ' + event.get("venue").name + '</a>';
            var infoNodeWrapper = $("<div class='infoNodeWrapper' />")
            var infoNode = $("<ul class='listView' data-role='listview'>");
            infoNode.append(me.eventTemplate(event.toJSON()));
            infoNodeWrapper.append(infoNode);
            var venue = event.get('venue');
            if (venue.location) {
                var position = new google.maps.LatLng(venue.location.lat, venue.location.lng);
                var marker = new google.maps.Marker({
                    position: position,
                    map: me.map,
                    title: event.get('title')
                });
                me.overlays.push(marker);
                
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(infoNodeWrapper[0]);
                    infowindow.open(me.map, marker);
                    infoNodeWrapper.trigger('create');
                });
                bounds.extend(position);
            }
        });
        this.map.fitBounds(bounds);
    },

    centerMapFromGeolocation: function(){
        var me = this;
        me.getCurrentPosition(function(position, status){
            if (status === 'OK'){
                var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log("got pos. lat: " + position.coords.latitude + ", long: " + position.coords.longitude);
                // me.map_canvas.gmap({'center': clientPosition}); // center map around events instead
                var marker = new google.maps.Marker({
                    position: clientPosition,
                    map: me.map,
                    title: 'you are here',
                    icon: 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png'
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
