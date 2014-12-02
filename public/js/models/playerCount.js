define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/playerCount',
            parse: function(response) {
                return response;
            },
            idAttribute: "PlayerCountID"
        });
    });
