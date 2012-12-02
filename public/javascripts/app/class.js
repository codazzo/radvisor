//Base class for a simple event bus https://gist.github.com/2843476
(function(Backbone, _) {
    "use strict";

    // Create a new object constructor and call initialize on instantiation
    // This follows the convention laid down by other Backbone classes
    Backbone.Class = function(options) {
        this.cid = _.uniqueId('class');
        this.initialize.apply(this, arguments);
    };

    // Extend the prototype with Events and a default initialize function
    _.extend(Backbone.Class.prototype, Backbone.Events, {
        initialize: function(){}
    });

    // Add the extend method to allow us to create subclasses of the object
    // Steal the reference from Model as it's innaccessible outside Backbone
    Backbone.Class.extend = Backbone.Model.extend;

})(Backbone, _);

var radvisor = {}; //init the namespace
radvisor.bus = new Backbone.Class;