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
                return window.router.names.getMainName(this.id);
            },
            Tags: function() {
                var taglist = window.router.tagGames.where({"GameID": this.id});
                var obj = $("<div></div>");
                _.each(taglist, function(tag) {
                    var thisTag = window.router.tags.get(tag.get("TagID"));
                    obj.append("<div class='tag'>" + thisTag.get("Name") + "</div>");
                });
                return obj.html();
            },
            Duration: function() {
                var id = this.get("DurationID"),
                    durobj = window.router.durations.get(id),
                    d = document.createElement("span");
                d.innerHTML = durobj.get("Name");
                d.title = durobj.get("Description");
                d.className = "has-tooltip";
                return d;
            },
            DurationSort: function() {
                var durobj = window.router.durations.get(this.get("DurationID"));
                return parseInt("" + durobj.get("Min") + durobj.get("Max"), 10);
            },
            PlayerCount: function() {
                var id = this.get("PlayerCountID"),
                    durobj = window.router.playerCounts.get(id),
                    d = document.createElement("span");
                d.innerHTML = durobj.get("Name");
                d.title = durobj.get("Description");
                d.className = "has-tooltip";
                return d;
            },
            PlayerCountSort: function() {
                var durobj = window.router.playerCounts.get(this.get("PlayerCountID"));
                return parseInt("" + (durobj.get("Min") || 0) + (durobj.get("Max") || 0), 10);
            },

            ModifiedDisplay: function () {
                var timestamp = this.get('DateModified');
                return moment(timestamp).fromNow();
            }
        });
    });
