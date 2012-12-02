radvisor.DjView = Backbone.View.extend({
    el: "#djPage",
    template: _.template($("#dj-template").html()),
    events: {
    },

    initialize: function(date){
        this.model = new radvisor.Dj;
    },

    update: function(name, callback){
        var me = this;
        this.model.set({name: name});
        this.model.fetch({
            success: function(model, response, options){
                me.render();
                callback();
            }
        });
    },

    render: function() {
        var modelJSON = this.model.toJSON();
        var tmpHtml = this.template(modelJSON);
        $content = this.$el.find("[data-role=content]");
        $content.html(tmpHtml);

        $content.trigger('create'); //jqueryMobile init
        this.delegateEvents();
    }
});

