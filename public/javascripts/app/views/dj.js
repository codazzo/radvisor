radvisor.DjView = Backbone.View.extend({
    el: "#djPage",
    template: _.template($("#dj-template").html()),
    template_about: _.template($("#dj-about-template").html()),
    template_tracks: _.template($("#dj-tracks-template").html()),
    template_events: _.template($("#dj-events-template").html()),

    events: {
        'click .dj-events' : 'showEvents',
        'click .dj-tracks' : 'showTracks',
        'click .dj-about' : 'showAbout'
    },

    initialize: function(date){
        this.model = new radvisor.Dj;
    },

    update: function(name, callback){
        var me = this;
        this.model.set({name: name});
        this.model.fetch({
            success: function(model, response, options){
                me.modelJSON = model.toJSON();
                me.render();
                me.contentEl = me.$(".dj-content");
                //me.showAbout();
                me.$("a.dj-about").click(); //also selects the button
                callback();
            }
        });
    },

    showAbout: function(){
        var tmpHtml;
        if(this.template_about_html){
            tmpHtml = this.template_about_html;
        } else {
            tmpHtml = this.template_about(this.modelJSON);
        }
        this.contentEl.html(tmpHtml);

        this.contentEl.trigger('create'); //refactoring potential
    },

    showEvents: function(){
        //TODO
    },

    showTracks: function(){
        var me = this;
        var tmpHtml;
        if(this.template_tracks_html){
            tmpHtml = this.template_tracks_html;
        } else {
            tmpHtml = this.template_tracks(this.modelJSON);
        }
        this.contentEl.html(tmpHtml);

        var tmpHtml = this.template_tracks(this.modelJSON);
        this.model.getUserTracks(function(trackCollection){
            me.contentEl.html(tmpHtml);
            var resTracksView = new radvisor.TracksView({
                 model: trackCollection
            });
            resTracksView.render();
        });

    },

    render: function() {
        var tmpHtml = this.template(this.modelJSON);
        this.$el.find("h1.title").html(this.modelJSON.name);
        $content = this.$el.find("[data-role=content]");
        $content.html(tmpHtml);

        $content.trigger('create'); //jqueryMobile init
        this.delegateEvents();
    }
});

