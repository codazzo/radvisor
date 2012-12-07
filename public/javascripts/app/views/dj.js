radvisor.DjView = Backbone.View.extend({
    el: "#djPage",
    
    template: _.template($("#dj-template").html()),
    templates: {
        about: _.template($("#dj-about-template").html()),
        tracks: _.template($("#dj-tracks-template").html()),
        events: _.template($("#dj-events-template").html())
    },
    templates_html: {},

    events: {
        'click .dj-events' : 'showSection',
        'click .dj-tracks' : 'showSection',
        'click .dj-about' : 'showSection'
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
                me.templates_html = {}; //invalidate template html cache
                me.render();
                me.contentEl = me.$(".dj-content");
                //me.showAbout();
                me.$("a.dj-about").click(); //also selects the button
                callback();
            }
        });
    },

    showSection: function(evt){
        var me = this;
        var sectionName = $(evt.currentTarget).data("section");
        var tmpHtml = this.templates_html[sectionName];
        if (!tmpHtml) {
            tmpHtml = this.templates[sectionName](this.modelJSON);
            this.templates_html[sectionName] = tmpHtml;
        }

        this.contentEl.html(tmpHtml);
        this.contentEl.trigger('create');
        if (sectionName=="tracks") {
            var trackCollection = new radvisor.TrackCollection(me.model.get("sc_tracks"));
            var resTracksView = new radvisor.TracksView({
                 model: trackCollection
            });
            resTracksView.render();
            me.templates_html[tracks] = me.contentEl.html();
        }
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

