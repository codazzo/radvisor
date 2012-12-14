radvisor.Event = Backbone.Model.extend({
    urlBase: '/event/',

    hostedLinks: ['/dj/'],

    url: function(){
        return this.urlBase + this.id
    },

    toJSON: function(){
        //sanitize href's with '#' so the backboune Router can intercept them
        var me = this;
        var baseJSON = Backbone.Model.prototype.toJSON.apply(this, arguments);
        _.each(baseJSON.extraInfo, function(value, key){
            var tempDiv = $("<div/>");
            tempDiv.html(value);
            tempDiv.find("[href]").each(function(index, el){
                var $this = $(this);
                var theHref = $this.attr("href");
                var isHostedLink = _.find(me.hostedLinks, function(hostedLink){
                    return theHref.indexOf(hostedLink) != -1;
                });
                var alreadySanitized = theHref[0]=="#" ;
                if(isHostedLink && !alreadySanitized){
                    $this.attr('href', "#" + theHref);
                }
            });
            baseJSON.extraInfo[key] = tempDiv.html();
        });
        return baseJSON;
    }
});
