$(document).ready(function(){
    var AppRouter = Backbone.Router.extend({ 
        routes: {
            "":"today",
            "page1":"page1",
            "event/:id": "getEvent"
        },
     
        today: function() {
            this.changePage(new EventsView());
        },
     
        page1: function() {
            this.changePage(new Page1View());
        },
     
        getEvent: function(id) {
            this.changePage(new EventView(id));
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
 

    //------------VIEWS---------------------------//
    //1-Events (landing page ATM)
    var EventsView = Backbone.View.extend({
        el: "#eventsPage",
        template: Handlebars.compile($("#events-template").html()),

        initialize: function(date){
            var me = this;
            date = date || "23112012"; //TODO change to TODAY
            this.model = new Events(date);
            //init models... TODO no need to fetch them every time
            this.model.fetch({
                success: function(model, response, options){
                    me.render();
                }
            });
        },

        render: function() {
            var tmpHtml = this.template({
                events: this.model.toJSON()
            });
            $el = $(this.el).find("[data-role=content]");
            $el.html(tmpHtml);
            // $.mobile.initializePage();
            $el.trigger('create'); //jqueryMobile init
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
            var tmpHtml = this.template(this.model.toJSON());
            $el = $(this.el).find("[data-role=content]");;
            $el.html(tmpHtml);
            // $.mobile.initializePage();
            $el.trigger('create'); //jqueryMobile init
        }
    });
    var app_router = new AppRouter;
    Backbone.history.start();

});