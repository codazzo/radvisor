radvisor.EventsView = Backbone.View.extend({
    el: "#eventsPage",
    template: _.template($("#events-template").html()),

    events: {
        'tap .calendar' : 'pickDate'
    },

    initialize: function(date){
        this.model = new radvisor.EventsByDate(date);
    },

    update: function(date, callback){
        var me = this;
        //TODO refactor the following lines
        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        this.date = currentDate;
        this.day = date ? date.substr(0,2) : ""+currentDate.getDate();
        if(this.day.length==1) this.day = "0" + this.day;
        this.month = date ? date.substr(2,2) : ""+ (currentDate.getMonth() + 1); //lame. so lame.
        if(this.month.length==1) this.month = "0" + this.month;
        this.year = date ? date.substr(4,4) : currentDate.getFullYear();
        var dateStr = "" + this.day + this.month + this.year;

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
        var dateStr = this.day + "/"+ this.month + "/" + this.year;
        var locationData = $.parseJSON($.cookie("ra_location"));
        if (locationData.name=="All Regions") {
            locationData.name = locationData.country; //no use in displaying "All Regions"
        }
        $(".countryIcon").attr("src", locationData.img);
        var events = options.model.toJSON();
        _.each(events, function(event){
            event.title = event.title || 'N/A'
        });

        //TODO refactor all dates code
        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        var todayNum = currentDate.getDay();
        var daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.$(".todayName .ui-btn-text").html(daysMap[todayNum]);
        this.$(".tomorrowName .ui-btn-text").html(daysMap[(todayNum+1)%7]);
        var tmpHtml = this.template({
            location: locationData,
            events: events,
            date: dateStr
        });

        $content = this.$el.find("[data-role=content]");
        $content.html(tmpHtml);

        var me = this;
        if($.fn.mobipick){
            this.initDatepicker();
        }else{
            radvisor.bus.on("loaded:datepicker", function(){
                this.initDatepicker();
            }, this);
        }
        this.$(".date-selection").show();
        $content.trigger('create'); //jqueryMobile init
    },

    initDatepicker: function(){
        this.datepicker = this.$( "#datePicker");
        this.datepicker.mobipick({
            change: function(evt){
                var date = $( this ).val();
                var dateObject = $( this ).mobipick( "option", "date" );
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