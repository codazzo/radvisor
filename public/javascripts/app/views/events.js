radvisor.EventsView = Backbone.View.extend({
    el: "#eventsPage",
    template: _.template($("#events-template").html()),
    eventTemplate: _.template($("#listevent-template").html()),

    events: {
        'tap .calendar': 'pickDate'
    },

    update: function(date, callback){
        var me = this;
        //TODO refactor the following lines
        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        var dateStr = date || radvisor.getDateStr(currentDate);

        this.model.getEvents(dateStr, function(eventsModel){
            if(me.cachedModel != eventsModel){
                me.render({
                    model: eventsModel
                });
            }
            me.cachedModel = eventsModel;
            callback();
        });
    },

    pickDate: function(evt){
        this.datepicker.tap();
    },

    render: function(options) {
        var events = options.model.toJSON();
        _.each(events, function(event){
            event.title = event.title || 'N/A'
        });
        var location = radvisor.locationManager.getLocation();
        var regionName = location.country + ' - ' + location.name;
        //TODO refactor all dates code
        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        var todayNum = currentDate.getDay();
        var daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.$(".todayName .ui-btn-text").html(daysMap[todayNum]);
        this.$(".tomorrowName .ui-btn-text").html(daysMap[(todayNum+1)%7]);
        var tmpHtml = this.template({
            events: events,
            eventTemplate: this.eventTemplate,
            regionName: regionName,
            date: this.model.getDate()
        });

        $content = this.$el.find("[data-role=content]");
        $content.html(tmpHtml);

        var me = this;
        radvisor.loading.mobipick.done(function(){
            me.initDatepicker();
        });
        this.$(".date-selection").show();
        $content.trigger('create'); //jqueryMobile init
    },

    initDatepicker: function(){
        var me = this;
        this.datepicker = this.$("#datePicker");
        this.datepicker.mobipick({
            change: function(evt){
                var date = me.datepicker.val();
                var dateObject = me.datepicker.mobipick( "option", "date" );
                var day = date.split("-")[2];
                var month = date.split("-")[1];
                var year = date.split("-")[0];
                var dateStr = day+month+year;
                radvisor.router.navigate("date/"+dateStr,  {trigger: true});
            },

            cancel: function(evt){
                var route = Backbone.history.fragment;
                //http://stackoverflow.com/questions/8550841/trigger-same-location-route
                Backbone.history.loadUrl(route);
            }
        });
    }
});
