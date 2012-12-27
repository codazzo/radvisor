var AppRouter = Backbone.Router.extend({
    routes: {
        "": "events",
        "tomorrow": "tomorrow",
        "date/:id": "events",
        "locations": "locations", //locations view
        "event/:id": "getEvent",
        "dj/:name": "dj",
        "map": "map"
    },

    initialize: function(){
        var me = this;
        this.eventsByDate  = new radvisor.EventsByDate(); //common events model for Events and Map views
        this.locationsView = new radvisor.LocationsView();
        this.eventsView = new radvisor.EventsView({
            model: this.eventsByDate
        });
        this.eventView = new radvisor.EventView();
        this.djView = new radvisor.DjView();
        radvisor.bus.on("loaded:gmaps", function(){
            me.mapView = new radvisor.MapView({
                model: me.eventsByDate
            });
        });
    },

    events: function(dateStr) {
        var eventsView = this.eventsView;
        $(".date-selection .ui-btn-active").removeClass("ui-btn-active");
        if (dateStr) {
            $(".date-selection .calendar").addClass("ui-btn-active");
        } else {
            $(".date-selection .todayName").addClass("ui-btn-active");
        }
        //TODO in the future we should force reloading the model when a new location cookie is set
        var me = this;
        $.mobile.showPageLoadingMsg();
        eventsView.update(dateStr, function(){
            $.mobile.hidePageLoadingMsg();
            me.changePage(eventsView);
        });
    },

    tomorrow: function(){
        var eventsView = this.eventsView;
        $(".date-selection .ui-btn-active").removeClass("ui-btn-active");
        $(".date-selection .tomorrowName").addClass("ui-btn-active");
        var me = this;
        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        var tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        var dateStr = radvisor.getDateStr(tomorrow);

        $.mobile.showPageLoadingMsg();
        eventsView.update(dateStr, function(){
            $.mobile.hidePageLoadingMsg();
            me.changePage(eventsView);
        });
    },

    locations: function() {
        var me = this;
        this.locationsView.update();
        me.changePage(this.locationsView);
    },

    getEvent: function(id) {
        var me = this;
        $.mobile.showPageLoadingMsg();
        var eventView = this.eventView;
        eventView.update(id, function(){
            $.mobile.hidePageLoadingMsg();
            me.changePage(eventView);
        });
    },

    dj: function(name){
        var me = this;
        var djView = this.djView;
        $.mobile.showPageLoadingMsg();
        djView.update(name, function(){
            $.mobile.hidePageLoadingMsg();
            me.changePage(djView);
        });
    },

    map: function() {
        var me = this;
        var mapView = this.mapView;
        $.mobile.showPageLoadingMsg();
        mapView.update(function(){
            $.mobile.hidePageLoadingMsg();
            me.changePage(mapView);
        });
    },

    changePage:function (page) {
        $.mobile.changePage(page.$el, {transition:"none", changeHash: false});
    }
});
