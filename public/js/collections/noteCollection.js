define(['backbone', 'underscore', 'models/note'],
    function(Backbone, _, Note) {
        return Backbone.Collection.extend({
            url: '/api/note',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: Note,
            friendlyName: "Note"
        });
    });
