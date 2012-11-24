$(document).ready(function(){
    var AppRouter = Backbone.Router.extend({ 
        routes: {
            "":"today",
            "page1":"page1",
            "page2":"page2"
        },
     
        today: function() {
            this.changePage(new MenuView());
        },
     
        page1: function() {
            this.changePage(new Page1View());
        },
     
        page2: function() {
            this.changePage(new Page2View());
        },
     
        changePage:function (page) {
            $(page.el).attr('data-role', 'page');
            page.render();
            $('body').append($(page.el));
            $.mobile.changePage($(page.el), {changeHash:false});
        }
    });


    //----------------MODELS
    var Event = Backbone.Model;

    var Events = Backbone.Collection.extend({
      model: Event,

      urlBase: '/events/',

      initialize: function(date){
        this.date = date;
      },

      url: function(){
        return this.urlBase + this.date;
      }
    });

    var theDate = "23112012";
    theEvents = new Events(theDate);


    //------------VIEWS---------------------------//
    //1-Main menu
    var MenuView = Backbone.View.extend({
      el: $("#mainView"),
      template: Handlebars.compile($("#menu-template").html()),
      
      render: function() {
         var tmpHtml = this.template({
            events: theEvents.toJSON()
         });
         $el = $(this.el);
         $el.html(tmpHtml);
         $el.trigger('create'); //jqueryMobile init
         // $("#mainFooter").hide();
      }
    });
    var menuView = new MenuView; //can be cached here

    var app_router = new AppRouter;
    Backbone.history.start();

    //init models
    theEvents.fetch({
        complete: function(){
            menuView.render();
        }
    });
});