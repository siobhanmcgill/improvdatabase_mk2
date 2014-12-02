define(['backbone', 'underscore', 'models/suggestionType'],
    function(Backbone, _, SuggestionType) {
        return Backbone.Collection.extend({
            url: '/api/suggestionType',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: SuggestionType,
            friendlyName: "Suggestion Type"
        });
    });
