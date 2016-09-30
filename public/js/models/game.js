define(['jquery', 'backbone', 'underscore', 'moment'],
    function($, Backbone, _, moment) {
        return Backbone.Model.extend({
            url: "/api/game",
            parse: function(response) {
                return response;
            },
            idAttribute: "GameID",

            initialize: function () {
                this.clearCache();
            },

            clearCache: function () {
                this._cache = {};
            },

            get: function (attr) {
                if (typeof this['get' + attr] === 'function') {
                    if (!this._cache[attr]) {
                        this._cache[attr] = this['get' + attr]();
                    }
                    return this._cache[attr];
                } else {
                    return Backbone.Model.prototype.get.call(this, attr);
                }
            },

            sync: function (method, model, options) {
                this.clearCache();
                Backbone.Model.prototype.sync.call(this, method, model, options);
            },

            //functions for table columns
            getName: function() {
                return this.collection.names.getMainName(this.id);
            },
            getTags: function() {
                var taglist = this.collection.tagGames.where({"GameID": this.id});
                var obj = $("<div></div>");
                var self = this;
                _.each(taglist, function(tag) {
                    var thisTag = self.collection.tags.get(tag.get("TagID"));
                    obj.append("<div class='tag'>" + thisTag.get("Name") + "</div>");
                });
                return obj.html();
            },
            getDuration: function() {
                var id = this.get("DurationID"),
                    durobj = this.collection.durations.get(id),
                    d = document.createElement("span");
                d.innerHTML = durobj.get("Name");
                d.title = durobj.get("Description");
                d.className = "has-tooltip";

                return d;
            },
            getDurationSort: function() {
                var durobj = this.collection.durations.get(this.get("DurationID"));
                return parseInt("" + durobj.get("Min") + durobj.get("Max"), 10);
            },
            getPlayerCount: function() {
                var id = this.get("PlayerCountID"),
                    durobj = this.collection.playerCounts.get(id),
                    d = document.createElement("span");
                d.innerHTML = durobj.get("Name");
                d.title = durobj.get("Description");
                d.className = "has-tooltip";
                return d;
            },
            getPlayerCountSort: function() {
                var durobj = this.collection.playerCounts.get(this.get("PlayerCountID"));
                return parseInt("" + (durobj.get("Min") || 0) + (durobj.get("Max") || 0), 10);
            },
            getModifiedDisplay: function () {
                var timestamp = this.get('DateModified');
                return moment(timestamp).fromNow();
            }
        });
    });
