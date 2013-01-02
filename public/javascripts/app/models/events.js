radvisor.Events = Backbone.Collection.extend({
    urlBase: '/events/',

    initialize: function(params){
        this.locationId = params.locationId;
        this.dateStr = params.dateStr;
    },

    url: function(){
        return this.urlBase + this.locationId + '/' + this.dateStr;
    }
});
