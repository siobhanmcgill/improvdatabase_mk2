define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/duration',
            parse: function(response) {
                return response;
            },
            idAttribute: "DurationID"
        });
    });
