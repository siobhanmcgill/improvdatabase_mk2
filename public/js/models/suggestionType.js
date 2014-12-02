define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/suggestionType',
            parse: function(response) {
                return response;
            },
            idAttribute: "SuggestionTypeID"
        });
    });
