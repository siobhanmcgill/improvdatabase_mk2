define(['backbone', 'underscore', 'models/user'],
    function(Backbone, _, User) {
        return Backbone.Collection.extend({
            url: '/api/user',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: User,
            friendlyName: "User"
        });
    });
