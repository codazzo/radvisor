$(document).ready(function(){
    var getLocation = function(){
        return JSON.parse($.cookie("ra_location"));
    }

    $(document).on("click", ".goback", function(){
        window.history.back(); //back buttons go back in history
    });

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
            var me = this;
            eventsView.update(date, function(){
                me.changePage(eventsView);    
            });
        },
     
        locations: function() {
            var me = this;
            locationsView.update();
            me.changePage(locationsView);
        },
     
        getEvent: function(id) {
            var me = this;
            $.mobile.showPageLoadingMsg();
            eventView.update(id, function(){
                me.changePage(eventView);
            });
        },

        dates: function(){
            this.changePage(datesView);
        },
     
        changePage:function (page) {
            $.mobile.changePage(page.$el, {transition:"none", changeHash: false});
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
        },

        toJSON: function(){
            //sanitize href's with '#' so the backboune Router can intercept them
            var baseJSON = Backbone.Model.prototype.toJSON.apply(this, arguments);
            _.each(baseJSON.extraInfo, function(value, key){
                var tempDiv = $("<div/>");
                tempDiv.html(value);
                tempDiv.find("[href]").each(function(index, el){
                    var $this = $(this);
                    var theHref = $this.attr("href");
                    $this.attr('href', "#" + theHref);
                });
                baseJSON.extraInfo[key] = tempDiv.html();
            });
            return baseJSON;
        }
    });

    var Events = Backbone.Collection.extend({
      urlBase: '/events/',

      setDate: function(date){
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
            this.model = new Events();
        },

        update: function(date, callback){
            var me = this;
            var currentDate = new Date();
            this.date = currentDate;
            this.day = date ? date.substr(0,2) : currentDate.getDate();
            this.month = date ? date.substr(2,2) : currentDate.getMonth() + 1; //lame. so lame.
            this.year = date ? date.substr(4,4) : currentDate.getFullYear();
            var dateStr = "" + this.day + this.month + this.year;

            this.model.setDate(dateStr);

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
                    callback();
                }
            });
        },

        getDate: function(){
            if(!this.date){
                var date = new Date();
                return {
                    date: date,
                    day: ""+date.getDate(),
                    month: date.getMonth() + 1,
                    year: ""+date.getFullYear()
                }
            } else {
                return {
                    date: this.date,
                    day: this.day,
                    month: this.month,
                    year: this.year
                }
            }
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

            $content = this.$el.find("[data-role=content]");
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

        initialize: function(){
            this.model = new Event();
        },

        update: function(id, callback){
            var me = this;
            this.model.set({id: id});
            //init models... TODO no need to fetch them every time
            this.model.fetch({
                complete: function(){
                    me.render();
                    callback();
                }
            });

        },

        render: function() {
            var eventJSON = this.model.toJSON();
            var tmpHtml = this.template(eventJSON);

            this.$el.find("h1.title").html(eventJSON.title);
            $content = this.$el.find("[data-role=content]");
            $content.html(tmpHtml);
            // $.mobile.initializePage();
            $content.trigger('create'); //jqueryMobile init
        },

        cleanView: function(){
            this.$el.html(""); //hack to avoid superimposing event pages
            this.$el.closest("#eventPage").find("h1.title").html("");
        }
    });

    //3 - Locations
    var LocationsView = Backbone.View.extend({
        el: "#locationsPage",
        template: Handlebars.compile($("#locations-template").html()),
        events: {
            "click #locationSubmit" : "setLocation",
            "change #countrySelect" : "changeCountry"
        },

        initialize: function(date){
            this.model = new Locations();
        },

        update: function(callback){
            if (this.isLoaded) return;
            var me = this;
            this.model.fetch({
                success: function(model, response, options){
                    me.render();
                }
            });
            this.isLoaded = true;
        },

        changeCountry: function(evt){
            var country = $(evt.currentTarget).val();
            this.render(country);
        },

        setLocation: function(evt){
            var $el = $(evt.currentTarget);
            var $country = $("#countrySelect");
            var $region = $("#regionSelect");
            var location = {
                id: $region.children("option:selected").data("id"),
                country: $country.val(),
                name: $region.children("option:selected").data("name"),
                img: $country.children("option:selected").data("img")
            }
            var locationStr = JSON.stringify(location);
            $.cookie('ra_location', locationStr);
            app_router.navigate("",  {trigger: true});
            $.mobile.showPageLoadingMsg();
        },

        render: function(country) {
            var currentCountry = country || getLocation().country;
            var currentRegion = getLocation().name;
            var allRegions = this.model.toJSON();
            var countryRegions = _.find(allRegions, function(country){
                return country.name == currentCountry;
            }).regions;
            var tmpHtml = this.template({
                currentCountry: currentCountry,
                currentRegion: currentRegion,
                countryRegions: countryRegions,
                regions: allRegions
            });
            $content = this.$el.find("[data-role=content]");
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
                years: years,
                selectedDate: eventsView.getDate()
            });
            this.$day = $("#select-choice-day");
            this.$month = $("#select-choice-month");
            this.$year = $("#select-choice-year");
        },

        chooseDate: function(){
            var dayVal = "" + this.$day.children(":checked").not(".null").index();
            if (dayVal.length==1) dayVal = "0" + dayVal;
            var monthVal = "" + this.$month.children(":checked").not(".null").index();
            if (monthVal.length==1) monthVal = "0" + monthVal;
            var yearVal = this.$year.children(":checked").not(".null").val();
            if (dayVal && monthVal && yearVal) {
                dateStr = "" + dayVal + monthVal + yearVal;
                $.mobile.showPageLoadingMsg();
                app_router.navigate("date/" + dateStr,  {trigger: true});
            }
        },

        cancelDate: function(){
            window.history.back();
        },

        chooseTonight: function(){
            app_router.navigate("",  {trigger: true});
            $.mobile.showPageLoadingMsg();
        },

        render: function(data) {
            var tmpHtml = this.template(data);
            $content = this.$el.find("[data-role=content]");
            $content.html(tmpHtml);

            // $.mobile.initializePage();
            $content.trigger('create'); //jqueryMobile init
            this.delegateEvents();
        }
    });


    var locationsView = new LocationsView();
    var eventsView = new EventsView();
    var eventView = new EventView();
    var datesView = new DatesView();


    var app_router = new AppRouter;
    Backbone.history.start();

});