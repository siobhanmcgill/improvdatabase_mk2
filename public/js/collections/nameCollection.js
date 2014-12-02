define(['backbone', 'underscore', 'models/name'],
    function(Backbone, _, Name) {
        return Backbone.Collection.extend({
            url: '/api/name',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            comparator: "Weight",
            model: Name,
            friendlyName: "Game Name",

            getMainName: function(GameID) {
                var names = this.where({GameID: GameID});
                return names.pop().get("Name");
            }
        });
    });
