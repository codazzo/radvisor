radvisor.EventCache = Backbone.Collection.extend({
    initialize: function(){
        var me = this;
        radvisor.bus.on("reset:cache", function(){
            me.reset();
        });
    },

    getEvent: function(eventId, success){
        var me = this;
        var event = this.find(function(el){
            return el.get("id") == eventId;
        });
        if(event) {
            //use cached copy
            success(event);
        } else {
            //fetch event
            var event = new radvisor.Event(eventId);
            event.fetch({
                success: function(model, response, options){
                    me.add(model);
                    success(model);
                }
            });
        }
    }
});
