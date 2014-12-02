define(['backbone', 'underscore', 'models/playerCount'],
    function(Backbone, _, PlayerCount) {
        return Backbone.Collection.extend({
            url: '/api/playerCount',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: PlayerCount,
            friendlyName: "Player Count Value"
        });
    });
