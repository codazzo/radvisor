radvisor.Dj = Backbone.Model.extend({
    urlBase: '/dj/',

    url: function(){
        return this.urlBase + this.get("name");
    }
});