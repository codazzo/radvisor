radvisor.Track = Backbone.Model.extend({
    initialize: function(){
        this.set({
            playing: false
        });
    }
});


/**
Just a collection of Tracks
*/
radvisor.TrackCollection = Backbone.Collection.extend({
    model: radvisor.Track
});
