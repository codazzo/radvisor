$(document).ready(function(){
    var AppRouter = Backbone.Router.extend({ 
        routes: {
            "": "events",
            "date/:id": "events",
            "locations": "locations", //locations view
            "event/:id": "getEvent",
            "dates": "dates"
        },
     
        events: function(date) {
            //TODO in the future we should force reloading the model when a new location cookie is set
            this.changePage(new EventsView(date));
            $("#eventPage").find("[data-role=content]").html(""); //hack to avoid superimposing event pages
            $("#eventPage").find("h1.title").html("");
        },
     
        locations: function() {
            this.changePage(new LocationsView());
        },
     
        getEvent: function(id) {
            this.changePage(new EventView(id));
        },

        dates: function(){
            this.changePage(new DatesView());
        },
     
        changePage:function (page) {
            // $(page.el).attr('data-role', 'page');
            // page.render();
            // $('body').append($(page.el));
            $.mobile.changePage($(page.el), {changeHash:false});
        }
    });


    //----------------MODELS
    var Event = Backbone.Model.extend({
        urlBase: '/event/',

        initialize: function(id){
            this.id = id; //thought it was automatic?
        },

        url: function(){
            return this.urlBase + this.id
        }
    });

    var Events = Backbone.Collection.extend({
      urlBase: '/events/',

      initialize: function(date){
        this.date = date;
      },

      url: function(){
        return this.urlBase + this.date;
      }
    });

    var Locations = Backbone.Collection.extend({
      url: '/regions/'
    });

 

    //------------VIEWS---------------------------//
    //1-Events (landing page ATM)
    var EventsView = Backbone.View.extend({
        el: "#eventsPage",
        template: Handlebars.compile($("#events-template").html()),

        initialize: function(date){
            var me = this;
            var currentDate = new Date();
            this.day = date ? date.substr(0,2) : currentDate.getDate();
            this.month = date ? date.substr(2,2) : currentDate.getMonth() + 1; //lame. so lame.
            this.year = date ? date.substr(4,4) : currentDate.getFullYear();
            var dateStr = "" + this.day + this.month + this.year;
            this.model = new Events(dateStr);
            //init models... TODO no need to fetch them every time
            var isTonight;
            if (date) {
                isTonight = false;
            } else {
                isTonight = true;
            }
            this.model.fetch({
                success: function(model, response, options){
                    me.render({
                        isTonight: isTonight
                    });
                }
            });
        },

        render: function(options) {
            var dateStr = this.day + "/"+ this.month + "/" + this.year;
            var locationData = $.parseJSON($.cookie("ra_location"));
            if (locationData.name=="All Regions") {
                locationData.name = locationData.country; //no use in displaying "All Regions"
            }
            var events = this.model.toJSON(); 
            _.each(events, function(event){
                event.title = event.title || 'N/A'
            });
            var tmpHtml = this.template({
                location: locationData,
                events: events,
                date: dateStr,
                isTonight: options.isTonight
            });
            $el = $(this.el);
            $content = $el.find("[data-role=content]");
            $content.html(tmpHtml);

            // $.mobile.initializePage();
            $content.trigger('create'); //jqueryMobile init
            // $("#mainFooter").hide();
        }
    });

    //2-Event
    var EventView = Backbone.View.extend({
        el: "#eventPage",
        template: Handlebars.compile($("#event-template").html()),

        initialize: function(id){
            var me = this;
            this.model = new Event(id);
            //init models... TODO no need to fetch them every time
            this.model.fetch({
                complete: function(){
                    me.render();
                }
            });
        },

        render: function() {
            var eventJSON = this.model.toJSON();
            var tmpHtml = this.template(eventJSON);
            $el = $(this.el);
            $el.find("h1.title").html(eventJSON.title);
            $content = $(this.el).find("[data-role=content]");
            $content.html(tmpHtml);
            // $.mobile.initializePage();
            $content.trigger('create'); //jqueryMobile init
        }
    });

    //3 - Locations
    var LocationsView = Backbone.View.extend({
        el: "#locationsPage",
        template: Handlebars.compile($("#locations-template").html()),
        events: {
            "click a.location" : "setLocation"
        },

        initialize: function(date){
            var me = this;
            this.model = new Locations();
            //init models... TODO no need to fetch them every time
            this.model.fetch({
                success: function(model, response, options){
                    me.render();
                }
            });
        },

        setLocation: function(evt){
            //set /{{../name}}/{{this.name}}
            var $el = $(evt.currentTarget);

            var location = {
                id: ""+$el.data("id"),
                country: $el.data("country"),
                name: $el.data("name"),
                img: $el.data("img")
            }
            var locationStr = JSON.stringify(location);
            $.cookie('ra_location', locationStr);
        },

        render: function() {
            var tmpHtml = this.template({
                regions: this.model.toJSON()
            });
            $el = $(this.el);
            $content = $el.find("[data-role=content]");
            $content.html(tmpHtml);

            // $.mobile.initializePage();
            $content.trigger('create'); //jqueryMobile init
            this.delegateEvents();
        }
    });

    //4 - Dates
    var DatesView = Backbone.View.extend({
        el: "#datesPage",
        template: Handlebars.compile($("#dates-template").html()),
        events: {
            "click #dateok": "chooseDate",
            "click #datecancel": "cancelDate",
            "click #tonight": "chooseTonight"
        },

        initialize: function(date){
            var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var days = [];
            for(var i =0; i<31; i++){
                days.push(i+1);
            }
            var years = [2011, 2012, 2013];
            this.render({
                months: monthsArray,
                days: days,
                years: years
            });
        },

        chooseDate: function(){
            var a = 2;
            var dayVal = ""+$("#select-choice-day").children(":checked").not(".null").index();
            if (dayVal.length==1) dayVal = "0" + dayVal;
            var monthVal = ""+$("#select-choice-month").children(":checked").not(".null").index();
            if (monthVal.length==1) monthVal = "0" + monthVal;
            var yearVal = $("#select-choice-year").children(":checked").not(".null").val();
            if (dayVal && monthVal && yearVal) {
                dateStr = ""+dayVal + monthVal + yearVal;
                app_router.navigate("date/" + dateStr,  {trigger: true});
            }
        },

        cancelDate: function(){
            window.history.back();
        },

        chooseTonight: function(){
            app_router.navigate("",  {trigger: true});
        },

        render: function(data) {
            var tmpHtml = this.template(data);
            $el = $(this.el);
            $content = $el.find("[data-role=content]");
            $content.html(tmpHtml);

            // $.mobile.initializePage();
            $content.trigger('create'); //jqueryMobile init
            this.delegateEvents();
        }
    });




    var app_router = new AppRouter;
    Backbone.history.start();

});