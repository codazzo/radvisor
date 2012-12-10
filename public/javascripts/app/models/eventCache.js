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
        if(!event && typeof(localStorage) != 'undefined') { 
            var storedEvent = localStorage.getItem('event-' + eventId); //try looking event up in localstorage
            if(storedEvent) {
                var eventJSON = JSON.parse(storedEvent);
                me.add(eventJSON);
                //TODO find better way to get event plz
                event = this.find(function(el){
                    return el.get("id") == eventId;
                });
            }
        }

        if(event) {
            //use cached copy
            success(event);
        } else {
            //fetch event
            var event = new radvisor.Event(eventId);
            event.fetch({
                success: function(model, response, options){
                    me.add(model);
                    if(typeof(localStorage)!='undefined') {
                        localStorage.setItem('event-' + eventId, JSON.stringify(response));
                    }
                    success(model);
                }
            });
        }
    }
});
