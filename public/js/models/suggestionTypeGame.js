define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/suggestionTypeGame',
            parse: function(response) {
                return response;
            },
            idAttribute: "SuggestionTypeGameID"
        });
    });
