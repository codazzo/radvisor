$(document).ready(function(){
    var AppRouter = Backbone.Router.extend({ 
        routes: {
            "":"today",
            "page1":"page1",
            "event/:id": "getEvent"
        },
     
        today: function() {
            this.changePage(new EventsView());
            $("#eventPage").find("[data-role=content]").html(""); //hack to avoid superimposing event pages
            $("#eventPage").find("h1.title").html("");
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
            var currentDate = new Date();
            var dateStr = "" + currentDate.getDate() + currentDate.getMonth() + currentDate.getFullYear();
            date = date || dateStr;
            this.model = new Events(date);
            //init models... TODO no need to fetch them every time
            this.model.fetch({
                success: function(model, response, options){
                    me.render();
                }
            });
        },

        render: function() {
            var currentDate = new Date();
            var dateStr = currentDate.getDate() +"/"+ currentDate.getMonth() +"/"+ currentDate.getFullYear() ;
            var tmpHtml = this.template({
                events: this.model.toJSON(),
                date: dateStr
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
    var app_router = new AppRouter;
    Backbone.history.start();

});