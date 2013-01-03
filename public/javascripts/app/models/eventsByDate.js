radvisor.EventsByDate = Backbone.Collection.extend({
    initialize: function(){
        var me = this;
        radvisor.bus.on("reset:cache", function(){
            me.reset();
        });

        var today = new Date();
        var todayStr = radvisor.getDateStr(today);
        var todayLexical = radvisor.getLexicalDate(todayStr);
        //clean old events from cache
        var eventKeys = [];
        this.useLocalStorage = false;
        if(this.useLocalStorage && typeof(localStorage) != 'undefined' ){
            for(var i=0, ll=localStorage.length; i<ll; i++) {
                eventKeys.push(localStorage.key(i));
            }
            _.each(eventKeys, function(eventKey){
                if (eventKey.indexOf('events-') !=0 ) return;
                var eventDate = eventKey.split("-")[1];
                var eventLexicalString = radvisor.getLexicalDate(eventDate);
                if(todayLexical > eventLexicalString) {
                    var eventsJSON = JSON.parse(localStorage.getItem(eventKey));
                    var dayEventIds = _.pluck(eventsJSON, 'id');
                    for(var j=0; j<dayEventIds.length; j++){
                        localStorage.removeItem('event-'+dayEventIds[j])
                    }
                    localStorage.removeItem(eventKey);
                }
            });
        }
    },

    addEvents: function(dateStr, events){
        this.add({
            date: dateStr,
            events: events
        });
        if(this.useLocalStorage && typeof(localStorage)!='undefined') {
            localStorage.setItem('events-' + dateStr, JSON.stringify(events));
        }
    },

    /**
    * Async function to get an events collection.
    * TODO make location choice explicit
    * @param {String} dateStr If provided, events are returned for that date. Otherwise,
    *                 events are returned for the last dateStr used,
    *                 otherwise for today (up until 8AM the next day)
    */
    getEvents: function(dateStr, success){
        var me = this;

        var currentDate = new Date();
        currentDate = new Date(currentDate.getTime() - 8 * 60 * 60 * 1000); //we party till 8 :)
        var dateStr = dateStr || this.cachedDateStr || radvisor.getDateStr(currentDate);

        this.cachedDateStr = dateStr;
        
        var eventsByDate = this.find(function(el){
            return el.get("date") == dateStr;
        });
        if(!eventsByDate && this.useLocalStorage && typeof(localStorage) != 'undefined') { 
            var storedEvents = localStorage.getItem('events-' + dateStr); //try looking events up in localStorage
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
            var events = new radvisor.Events({
                locationId: radvisor.locationManager.getLocation().id,
                dateStr: dateStr
            });
            events.fetch({
                success: function(model, response, options){
                    me.addEvents(dateStr, model);
                    success(model);
                }
            });
        }
    },

    getDate: function(){
        if (!this.cachedDateStr) return '';
        return this.cachedDateStr.substr(0, 2) + '/' + this.cachedDateStr.substr(2, 2) + '/' + this.cachedDateStr.substr(4, 4);
    }
});
