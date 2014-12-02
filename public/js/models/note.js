define(['backbone'],
    function(Backbone) {
        return Backbone.Model.extend({
            urlRoot: '/api/note',
            parse: function(response) {
                return response;
            },
            idAttribute: "NoteID"
        });
    });
