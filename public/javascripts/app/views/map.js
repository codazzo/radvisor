radvisor.MapView = Backbone.View.extend({
    el: "#mapPage",
    template: _.template($("#map-template").html()),

    initialize: function(date){
        this.model = new radvisor.EventsByDate(date);
        this.wrapper = $("<div/>");

    },

    render: function(date, options) {
        $content = this.$el.find("[data-role=content]");
        $content.html(this.template());
        $content.trigger('create');

        // 82: The sum of the header height plus the upper and bottom margins.
        $('#map_canvas').height($('body').innerHeight() - 82); // <magicnumber/>
        $(window).resize(function(){
            $('#map_canvas').height($('body').innerHeight() - 82);
        });

        //TODO refactor the following lines
        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        var dateStr = date || radvisor.getDateStr(currentDate);
        var eventsURI = '/events/' + dateStr;
        $('#map_canvas').gmap({'zoom': 10}).bind('init', function() {
            $.getJSON(eventsURI, function(eventsData){
                _.each(eventsData, function(event) {
                    // FIXME: We have to do something about the id-less venues
                    if(event['venueId'] !== null) {
                        var infoWinContent = '<a href="#/event/' + event['id'] + '">' +
                                             event['title'] + ' at ' + event['venue'] + '</a>';
                        var venueURI = '/venue/' + event['venueId'];
                        $.getJSON(venueURI, function(venue){
                            $('#map_canvas').gmap('addMarker', {
                                'position': new google.maps.LatLng(venue['location']['lat'],
                                                                   venue['location']['lng']),
                                'bounds': true
                            }).click(function() {
                                $('#map_canvas').gmap('openInfoWindow', {'content': infoWinContent}, this);
                            });
                        });
                    }
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
