radvisor.TrackView = Backbone.View.extend({
    template: _.template($("#track-template").html()),
    events: {
        "click .ui-icon-play"  : 'togglePlay',
        "click .ui-icon-pause" : 'togglePlay'
    },
    
    initialize: function(options){
        var me = this;
        this.el = this.options.el;
        this.$el = $(this.el);
        me.delegateEvents(me.events);
        this.model.bind('change', this.render, this);
        this.model.bind('selected', this.render, this);
    },
    
    togglePlay: function(evt){
        if (!this.model.get('streamable')) {
            return;
        }
        if (this.model.get("playing")) {
            this.soundObj.pause();
            this.model.set({
                playing: false
            })
        } else {
            var me = this;
            SC.whenStreamingReady(function(){
                if(!me.soundObj){
                    var trackId = me.model.id; //59051244
                    me.soundObj = SC.stream(trackId);
                }
                me.soundObj.play();
                me.model.set({
                    playing: true
                })
            });
        }
    },
    
    render: function(){
        var trackJSON = this.model.toJSON();
        var tmpHtml = this.template(trackJSON);
        this.$el.html(tmpHtml);
        this.$el.trigger('create'); //jqueryMobile init
    }
});