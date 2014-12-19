define(['backbone', 'underscore', 'models/tag'],
    function(Backbone, _, Tag) {
        return Backbone.Collection.extend({
            url: '/api/tagGame',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
            },
            model: Tag,
            friendlyName: "Tag",
            comparator: 'Name'
        });
    });
