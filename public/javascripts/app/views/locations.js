var getLocation = function(){
    return JSON.parse($.cookie("ra_location"));
}

radvisor.LocationsView = Backbone.View.extend({
    el: "#locationsPage",
    template: _.template($("#locations-template").html()),
    events: {
        "click #locationSubmit": "setLocation",
        "change #countrySelect": "changeCountry"
    },

    initialize: function(date){
        this.model = new radvisor.Locations();
        if (typeof(radBootstrap) != 'undefined' && radBootstrap.regions) {
            this.model.add(radBootstrap.regions);
            this.render();
            this.isLoaded = true;
        }
    },

    update: function(callback){
        if (this.isLoaded){
            if (callback) callback();
            return;
        }
        var me = this;
        this.model.fetch({
            success: function(model, response, options){
                me.render();
                me.isLoaded = true;
                if (callback) callback();
            }
        });
    },

    changeCountry: function(evt){
        var country = $(evt.currentTarget).val();
        this.render(country);
    },

    setLocation: function(evt){
        var $el = $(evt.currentTarget);
        var $country = $("#countrySelect");
        var $region = $("#regionSelect");
        var location = {
            id: $region.children("option:selected").data("id"),
            country: $country.val(),
            name: $region.children("option:selected").data("name"),
            img: $country.children("option:selected").data("img")
        }
        var locationStr = JSON.stringify(location);
        $.cookie('ra_location', locationStr);

        /*
        * reset the cache as events are identified by their date.
        * when looking up an events collection by the date,
        * the cache must be invalidated since the location has changed.
        */
        radvisor.bus.trigger('reset:cache');
        localStorage.clear(); //clear all cache in localStorage

        radvisor.router.navigate("",  {trigger: true});
        $.mobile.showPageLoadingMsg();
    },

    render: function(country) {
        var currentCountry = country || getLocation().country;
        var currentRegion = getLocation().name;
        var allRegions = this.model.toJSON();
        var countryRegions = _.find(allRegions, function(country){
            return country.name == currentCountry;
        }).regions;
        var tmpHtml = this.template({
            currentCountry: currentCountry,
            currentRegion: currentRegion,
            countryRegions: countryRegions,
            regions: allRegions
        });
        $content = this.$el.find("[data-role=content]");
        $content.html(tmpHtml);

        // $.mobile.initializePage();
        $content.trigger('create'); //jqueryMobile init
        this.delegateEvents();
    }
});
