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
        if(typeof(localStorage)!='undefined') {
            localStorage.setItem('events-' + dateStr, JSON.stringify(events));
        }
    },

    getEvents: function(dateStr, success){
        var me = this;
        var eventsByDate = this.find(function(el){
            return el.get("date") == dateStr;
        });
        if(!eventsByDate && typeof(localStorage) != 'undefined') { 
            var storedEvents = localStorage.getItem('events-' + dateStr); //try looking events up in localstorage
            if(storedEvents) {
                var eventsArray = JSON.parse(storedEvents);
                this.addEvents(dateStr, new radvisor.Events(eventsArray));
                //TODO find better way to get eventsByDate plz
                eventsByDate = this.find(function(el){
                    return el.get("date") == dateStr;
                });
            }
        }
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
