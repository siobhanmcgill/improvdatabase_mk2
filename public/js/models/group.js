define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/group',
            parse: function(response) {
                return response;
            },
            idAttribute: "GroupID"
        });
    });
