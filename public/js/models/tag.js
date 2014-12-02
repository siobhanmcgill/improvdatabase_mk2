define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/tag',
            parse: function(response) {
                return response;
            },
            idAttribute: "TagID"
        });
    });
