radvisor.EventsByDate = Backbone.Collection.extend({
    initialize: function(){
        var me = this;
        radvisor.bus.on("reset:cache", function(){
            me.reset();
        });
    },

    addEvents: function(dateStr, events){
        this.add({
            date: dateStr,
            events: events
        });
    },

    getEvents: function(dateStr, success){
        var me = this;
        var eventsByDate = this.find(function(el){
            return el.get("date") == dateStr;
        });
        if(eventsByDate) {
            //use cached copy
            success(eventsByDate.get('events'));
        } else {
            //fetch events
            var events = new radvisor.Events();
            events.setDate(dateStr);
            events.fetch({
                success: function(model, response, options){
                    me.addEvents(dateStr, model);
                    success(model);
                }
            });
        }
    }
});
