radvisor.EventView = Backbone.View.extend({
    el: "#eventPage",
    template: _.template($("#event-template").html()),

    initialize: function(){
        this.model = new radvisor.EventCache();
        this.wrapper = $("<div/>");
    },

    update: function(id, callback){
        var me = this;
        this.model.getEvent(id, function(model){
            if(me.cachedModel != model){
                me.render({
                    model: model
                });                    
            }
            me.cachedModel = model;
            callback();
        });
    },

    render: function(options) {
        var eventJSON = options.model.toJSON();
        var tmpHtml = this.template(eventJSON);

        this.$el.find("h1.title").html(eventJSON.title);
        $content = this.$el.find("[data-role=content]");
        $content.html(this.decorate(tmpHtml));
        // $.mobile.initializePage();
        $content.trigger('create'); //jqueryMobile init
    },

    decorate: function(html){
         var attrs = 'data-role="button" data-inline="true" data-mini="true"';
         this.wrapper.html(html);
         this.wrapper.find("a").filter(function(){
            return this.href.indexOf('/dj/') != -1;
         }).attr({
            'data-role': 'button',
            'data-inline': 'true',
            'data-mini': 'true'
         });
         return this.wrapper.html();
    },

    cleanView: function(){
        this.$el.html(""); //hack to avoid superimposing event pages
        this.$el.closest("#eventPage").find("h1.title").html("");
    }
});
