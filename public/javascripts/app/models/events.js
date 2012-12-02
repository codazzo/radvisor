radvisor.Events = Backbone.Collection.extend({
  urlBase: '/events/',

  setDate: function(date){
    this.date = date;
  },

  url: function(){
    return this.urlBase + this.date;
  }
});
