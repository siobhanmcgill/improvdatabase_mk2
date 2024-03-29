define(['backbone', 'underscore', 'models/suggestion'],
    function(Backbone, _, Suggestion) {
        return Backbone.Collection.extend({
            url: '/api/suggestion',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: Suggestion,
            friendlyName: "Suggestion"
        });
    });
