define(['backbone', 'underscore', 'models/suggestionTypeGame'],
    function(Backbone, _, SuggestionTypeGame) {
        return Backbone.Collection.extend({
            url: '/api/suggestionTypeGame',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: SuggestionTypeGame,
            friendlyName: "Suggestion Type Association"
        });
    });
