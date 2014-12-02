define(['backbone', 'underscore', 'models/duration'],
    function(Backbone, _, Duration) {
        return Backbone.Collection.extend({
            url: '/api/duration',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: Duration,
            friendlyName: "Duration Value"
        });
    });
