define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/addGameForm.html',

        'views/dropdownView',
        'views/tagInputView',

        'models/game',
        'models/name',
        ],
    function($, _, Backbone, moment, deny, AddGameTemplate, DropdownView, TagInputView, Game, Name) {
        return Backbone.View.extend({
            events: {
                "click #saveItUp" : "doSave"
            },
            initialize: function(options) {
                this.router = options.router;
            },
            render: function() {
                this.$el.addClass("content").html(_.template(AddGameTemplate)).show();
                this.$el.parent().find("#btnAddGame").addClass("active");

                this.durationDropdown = new DropdownView({
                    el: "#duration_dropdown",
                    collection: this.router.durations,
                    idattr: "duration",
                    idname: "Duration",
                    attr: "(Minutes)"
                });
                this.durationDropdown.render();

                this.playerCountDropdown = new DropdownView({
                    el: "#playerCount_dropdown",
                    collection: this.router.playerCounts,
                    idattr: "playerCount",
                    idname: "Player Count",
                    attr: "Players"
                });
                this.playerCountDropdown.render();

                this.tagInput = new TagInputView({
                    el: "#tags",
                    collection: this.router.tags
                });
                this.tagInput.render();

                this.listenTo(this.tagInput, "tag.add tag.remove", this.boxHeight);

                this.boxHeight();
            },
            hide: function() {
                this.$el.parent().removeAttr("style").css("overflow", "hidden");
                this.$el.parent().find("#btnAddGame").removeClass("active");
                var self = this;

                this.hideTimer = setTimeout(function() {
                    self.$el.parent().removeClass("open");
                    self.destroy();
                    Backbone.trigger("hide-game");
                }, 500);
            },
            destroy: function () {
                this.$el.empty().hide();
                this.undelegateEvents();
                clearTimeout(this.openTimer);
                clearTimeout(this.hideTimer);
            },

            boxHeight: function() { //Bruce Boxheigtner
                var self = this;

                var h = this.$el.outerHeight() + 20;
                if (h > $(window).height() * 0.6) {
                    h = $(window).height() * 0.6;
                }
                this.$el.parent().css("overflow", "hidden");
                setTimeout(function() {
                    Backbone.trigger("show-game");
                    self.$el.parent().css("height", h);
                }, 10);
                
                this.openTimer = setTimeout(function() {
                    self.$el.parent().addClass("open").css("overflow", "auto");
                }, 1000);
            },
            clearForm: function() {
                this.$("input[name=Name]").val("");
                this.$("textarea").val("");
                this.$("#tagOutput .tag:visible").remove();
                this.boxHeight();
            },
            doSave: function() {
                var tags = [];
                var self = this;

                if (!this.$('input[name=Name]').val()) {
                    $.toast("<em>What, no name?</em>");
                } else if (!this.$("#duration_toggle").data("val")) {
                    $.toast("<em>Picking a duration isn't that hard.</em>");
                } else if (!this.$("#playerCount_toggle").data("val")) {
                    $.toast("<em>But, how many players are needed?</em>");
                } else {
                    this.$(".tag").each(function() {
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
                        success: function(model, response) {
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
                        error: function() {

                        }
                    });
                }
            }
        });
    });
