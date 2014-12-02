define(['backbone', 'underscore', 'models/tagGame'],
    function(Backbone, _, TagGame) {
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
            model: TagGame,
            friendlyName: "Tag Association",

            addTagToGame: function(tagID, gameID, tagGameID) {
                var taggame = new TagGame(),
                    self = this,
                    tagData = {TagID: tagID, GameID: gameID};
                if (tagGameID) {
                    tagData.tagGameID = tagGameID;
                }
                taggame.save(tagData, {
                    success: function(model, response) {
                        self.add(model);
                    }
                });
            },
            removeTagFromGame: function(tagID, gameID) {
                this.findWhere({TagID: tagID, GameID: gameID}).destroy();
            }
        });
    });
