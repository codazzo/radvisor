radvisor.TracksView = Backbone.View.extend({
    trackViews: {}, // maps track ID's to TrackView's

    el: "#tracks",

    render: function() {
        var $el = this.$el;
        $el.html(''); //clear view //TODO check if we actually need this
        //add single TrackViews
        var me = this;
        this.model.each(function(element, index, list){
            var trackLi = $("<li class='track-li'></li>");
            $el.append(trackLi);
            var trackView = new radvisor.TrackView({
                el: trackLi[0],
                model: element
            });
            me.trackViews[element.attributes.id] = trackView;
            trackView.render();
        })
    }
});
