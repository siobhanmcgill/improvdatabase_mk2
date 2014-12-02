define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',

        'tmpl!templates/gameView.html',

        'views/dropdownView',
        'views/tagInputView',

        'models/game',
        'models/name',
        ],
    function($, _, Backbone, moment, deny, DynamicTable, GameView, DropdownView, TagInputView, Game, Name) {
        return Backbone.View.extend({
            el: "#gameBox",
            events: {
                "click #saveItUp" : "doSave",

                "click #duration_dropdown .edit": "showDurationDropdown",
                "click #playerCount_dropdown .edit": "showPlayerCountDropdown"
            },
            initialize: function(options) {
                this.router = options.router;
                this.GameID = options.GameID;
            },
            render: function() {
                var self = this;
                
                var templateData = {
                    mainName: this.model.Name(),
                    Description: this.model.get("Description"),
                    durationName: this.router.durations.get(this.model.get("DurationID")).get("Name"),
                    durationDescription: this.router.durations.get(this.model.get("DurationID")).get("Description"),
                    playerCountName: this.router.playerCounts.get(this.model.get("PlayerCountID")).get("Name"),
                    playerCountDescription: this.router.playerCounts.get(this.model.get("PlayerCountID")).get("Description")
                };

                this.$(".content").html(GameView(templateData)).show();

                this.$("#btnAddGame").show().addClass("active");

                this.tagInput = new TagInputView({
                    el: "#tags",
                    collection: this.router.tags,
                    GameID: this.GameID,
                    TagGameCollection: this.router.tagGames
                });
                this.tagInput.render();

                this.listenTo(Backbone, "resize", this.boxHeight);
                this.listenTo(this.tagInput, "tag.add tag.remove", this.boxHeight);
                /*

                */

                this.boxHeight();
                this.$(".has-tooltip").tooltip();
            },

            showDurationDropdown: function(e) {
                this.durationDropdown = new DropdownView({
                    el: "#duration_dropdown",
                    collection: this.router.durations,
                    idattr: "duration",
                    idname: "Duration",
                    attr: "(Minutes)"
                });
                this.durationDropdown.render();
                this.boxHeight();

                this.listenToOnce(this.durationDropdown, "change", function(model) {
                    this.model.set({"DurationID": model.get("DurationID")});
                    this.model.save();
                    this.render();
                });

                if (e) {
                    e.stopPropagation();
                }
            },
            showPlayerCountDropdown: function(e) {
                this.playerCountDropdown = new DropdownView({
                    el: "#playerCount_dropdown",
                    collection: this.router.playerCounts,
                    idattr: "playerCount",
                    idname: "Player Count",
                    attr: "Players"
                });
                this.playerCountDropdown.render();
                this.boxHeight();

                this.listenToOnce(this.playerCountDropdown, "change", function(model) {
                    this.model.set({"PlayerCountID": model.get("PlayerCountID")});
                    this.model.save();
                    this.render();
                });

                if (e) {
                    e.stopPropagation();
                }
            },

            hide: function() {
                this.$el.removeAttr("style");
                this.$("#btnAddGame").removeClass("active");
                var self = this;

                setTimeout(function() {
                    self.$el.removeClass("open");
                    self.$(".content").empty().hide();
                    Backbone.trigger("hide-game");
                }, 500);
            },
            boxHeight: function() { //Bruce Boxheigtner
                var self = this;
                var h = this.$(".content").outerHeight() + 20;
                if (h > $(window).height() * 0.6) {
                    h = $(window).height() * 0.6;
                }
                this.$el.css("overflow", "hidden");
                setTimeout(function() {
                    Backbone.trigger("show-game");
                    self.$el.css("height", h);
                }, 10);
                setTimeout(function() {
                    self.$el.addClass("open").css("overflow", "auto");
                }, 1500);
            },
            clearForm: function() {
                this.$("input[name=Name]").val("");
                this.$("textarea").val("");
                this.$("#tagOutput").empty();
                this.boxHeight();
            },
            doSave: function() {
                var tags = [];
                var self = this;
                this.$(".tag").each(function(tag) {
                    if ($(this).text()) {
                        tags.push(self.router.tags.findWhere({"Name": $(this).text()}).get("TagID"));
                    }
                });
                var data = {
                    Name: this.$("input[name=Name]").val(),
                    Description: this.$("textarea").val(),
                    DurationID: this.$("#duration_toggle").data("val").get("DurationID"),
                    PlayerCountID: this.$("#playerCount_toggle").data("val").get("PlayerCountID"),
                    Tags: tags
                };
                this.$("#saveItUp").addClass("wait");
                var newModel = new Game();
                newModel.save(data, {
                    success: function(model, response, options) {
                        var newName = new Name({
                            "NameID": response.NameID,
                            "GameID": response.GameID,
                            "Name": model.get("Name")
                        });
                        _.each(tags, function(tag) {
                            self.router.tagGames.add({TagID: tag, GameID: response.GameID});
                        });
                        self.router.names.add(newName);
                        self.router.games.add(model);
                        
                        self.$("#saveItUp").removeClass("wait");
                        $.toast("<em>" + model.get("Name") + "</em> added.");

                        self.clearForm();
                    }, 
                    error: function(model, xhr, options) {

                    }
                });
            }
        });
    });
