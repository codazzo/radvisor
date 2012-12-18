radvisor.MapView = Backbone.View.extend({
    el: "#mapPage",
    template: _.template($("#map-template").html()),

    initialize: function(){
        this.wrapper = $("<div/>");
    },

    update: function(callback){
        var me = this;

        this.model.getEvents(null, function(eventsModel){
            //TODO this code is duplicated among views, could be refactored
            callback(); //changing the page first or google maps is resized incorrectly
            if(me.cachedModel != eventsModel){
                me.render();
            }
            me.cachedModel = eventsModel;
        });
    },


    render: function() {
        var me = this;
        var $content = this.$el.find("[data-role=content]");
        $content.html(this.template());
        $content.trigger('create');

        //FIXME
        // 82: The sum of the header height plus the upper and bottom margins.
        $('#map_canvas').height($('body').innerHeight() - 82); // <magicnumber/>
        $(window).resize(function(){
            $('#map_canvas').height($('body').innerHeight() - 82);
        });

        $('#map_canvas').gmap({'zoom': 10}).bind('init', function() {
            var eventsData = me.cachedModel;
            eventsData.each(function(event) {
                // FIXME: We have to do something about the id-less venues
                if (!event.has("venueId")) return;

                var infoWinContent = '<a href="#/event/' + event.get("id") + '">' +
                                     event.get("title") + ' at ' + event.get("venue") + '</a>';
                var venueURI = '/venue/' + event.get("venueId");
                $.getJSON(venueURI, function(venue){
                    $('#map_canvas').gmap('addMarker', {
                        'position': new google.maps.LatLng(venue['location']['lat'],
                                                           venue['location']['lng']),
                        'bounds': true
                    }).click(function() {
                        $('#map_canvas').gmap('openInfoWindow', {'content': infoWinContent}, this);
                    });
                });
            });
        });
        $('#map_canvas').gmap().bind('init', function(evt, map){
            $('#map_canvas').gmap('getCurrentPosition', function(position, status){
                if (status === 'OK'){
                    var clientPosition = new google.maps.LatLng(position.coords.latitude,
                                                                position.coords.longitude);
                    $('#map_canvas').gmap({'center': clientPosition});
                    $('#map_canvas').gmap('addMarker', {
                        'position': clientPosition,
                        'icon': 'http://maps.google.com/mapfiles/ms/micons/blue-dot.png',
                    });
                }
            });
        });
    },

    cleanView: function(){
        this.$el.html(""); //hack to avoid superimposing event pages
        this.$el.closest("#mapPage").find("h1.title").html("");
    }
});
