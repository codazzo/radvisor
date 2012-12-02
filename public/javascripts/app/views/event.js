radvisor.EventView = Backbone.View.extend({
    el: "#eventPage",
    template: _.template($("#event-template").html()),

    initialize: function(){
        this.model = new radvisor.EventCache();
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
        $content.html(tmpHtml);
        // $.mobile.initializePage();
        $content.trigger('create'); //jqueryMobile init
    },

    cleanView: function(){
        this.$el.html(""); //hack to avoid superimposing event pages
        this.$el.closest("#eventPage").find("h1.title").html("");
    }
});
