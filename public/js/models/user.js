define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/user',
            parse: function(response) {
                return response;
            },
            idAttribute: "UserID"
        });
    });
