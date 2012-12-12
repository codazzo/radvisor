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
        this.locationsView = new radvisor.LocationsView();
        this.eventsView = new radvisor.EventsView();
        this.eventView = new radvisor.EventView();
        this.djView = new radvisor.DjView();
        this.mapView = new radvisor.MapView();
    },

    events: function(date) {
        var eventsView = this.eventsView;
        $(".date-selection .ui-btn-active").removeClass("ui-btn-active");
        if (date) {
            $(".date-selection .calendar").addClass("ui-btn-active");
        } else {
            $(".date-selection .todayName").addClass("ui-btn-active");
        }
        //TODO in the future we should force reloading the model when a new location cookie is set
        var me = this;
        $.mobile.showPageLoadingMsg();
        eventsView.update(date, function(){
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

    map: function (date){
        var me = this;
        this.mapView.render(date);
        me.changePage(this.mapView);
    },

    changePage:function (page) {
        $.mobile.changePage(page.$el, {transition:"none", changeHash: false});
    }
});
