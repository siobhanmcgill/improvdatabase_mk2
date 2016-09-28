define(['jquery', 'backbone', 'underscore', 'moment'],
    function($, Backbone, _, moment) {
        return Backbone.Model.extend({
            url: "/api/game",
            parse: function(response) {
                return response;
            },
            idAttribute: "GameID",

            //functions for table columns
            Name: function() {
                return this.collection.names.getMainName(this.id);
            },
            Tags: function() {
                var taglist = this.collection.tagGames.where({"GameID": this.id});
                var obj = $("<div></div>");
                var self = this;
                _.each(taglist, function(tag) {
                    var thisTag = self.collection.tags.get(tag.get("TagID"));
                    obj.append("<div class='tag'>" + thisTag.get("Name") + "</div>");
                });
                return obj.html();
            },
            Duration: function() {
                var id = this.get("DurationID"),
                    durobj = this.collection.durations.get(id),
                    d = document.createElement("span");
                d.innerHTML = durobj.get("Name");
                d.title = durobj.get("Description");
                d.className = "has-tooltip";
                return d;
            },
            DurationSort: function() {
                var durobj = this.collection.durations.get(this.get("DurationID"));
                return parseInt("" + durobj.get("Min") + durobj.get("Max"), 10);
            },
            PlayerCount: function() {
                var id = this.get("PlayerCountID"),
                    durobj = this.collection.playerCounts.get(id),
                    d = document.createElement("span");
                d.innerHTML = durobj.get("Name");
                d.title = durobj.get("Description");
                d.className = "has-tooltip";
                return d;
            },
            PlayerCountSort: function() {
                var durobj = this.collection.playerCounts.get(this.get("PlayerCountID"));
                return parseInt("" + (durobj.get("Min") || 0) + (durobj.get("Max") || 0), 10);
            },

            ModifiedDisplay: function () {
                var timestamp = this.get('DateModified');
                return moment(timestamp).fromNow();
            }
        });
    });
