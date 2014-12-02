define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/name',
            parse: function(response) {
                return response;
            },
            idAttribute: "NameID"
        });
    });
