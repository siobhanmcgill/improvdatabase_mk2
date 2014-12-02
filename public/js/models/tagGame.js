define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/tagGame',
            parse: function(response) {
                return response;
            },
            idAttribute: "TagGameID"
        });
    });
