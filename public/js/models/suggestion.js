define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/suggestion',
            parse: function(response) {
                return response;
            },
            idAttribute: "SuggestionID"
        });
    });
