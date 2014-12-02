define(['backbone', 'underscore', 'models/group'],
    function(Backbone, _, Group) {
        return Backbone.Collection.extend({
            url: '/api/name',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: Group,
            friendlyName: "Group"
        });
    });
