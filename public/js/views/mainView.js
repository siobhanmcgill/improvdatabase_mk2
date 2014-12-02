define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',

        'views/addGameFormView',
        'views/gameView'
        ],
    function($, _, Backbone, moment, deny, DynamicTable, AddGameFormView, GameView) {
        return Backbone.View.extend({
            el: "#main",
            events: {
                'click #btnAddGame': 'showAddGame',
                'click #gameTable .dt-row': 'showGame'
            },
            initialize: function(options) {
                this.router = options.router;
                var self = this;

                this.listenTo(Backbone, "show-game", function() {
                    this.$el.addClass("showGame");
                    var self = this;
                    setTimeout(function() {
                        self.$("#gameTable").dynamictable("reload");
                    }, 500);
                });
                this.listenTo(Backbone, "hide-game", function() {
                    this.$el.removeClass("showGame");
                    var self = this;
                    setTimeout(function() {
                        self.$("#gameTable").dynamictable("reload");
                    }, 500);
                });

                this.listenTo(this.router.tagGames, "add remove", function() {
                    this.$("#gameTable").dynamictable("reload");
                });
                this.listenTo(this.router.games, "sync add", function() {
                    this.$("#gameTable").dynamictable("reload");
                });

                this.addGameForm = new AddGameFormView({router: this.router});
            },
            render: function() {
                var headerscale = this.$el.outerWidth() / (this.$("h1").outerWidth() - 4);
                this.$('h1').css({
                    "-webkit-transform": "scale(" + headerscale + ")"
                });

                this.$(".has-tooltip").tooltip();

                this.$("#pagesize").dropdown({width: "auto"});

                var self = this;
                this.$("#gameTable").dynamictable({
                    data: this.router.games,
                    pageindicator: this.$("#pageindicator"),
                    prevpagebutton: this.$("#prevpage"),
                    nextpagebutton: this.$("#nextpage"),
                    pagesizemenu: this.$("#pagesize"),
                    onRender: function(table, data) {
                        table.find(".has-tooltip").tooltip();
                    }
                    /*, MANUAL COLUMN CONFIG
                    columns: [
                        {
                            header: "Name",
                            className: "name",
                            property: function(data) {
                                var id = data.GameID;
                                return self.router.names.getMainName(id);
                            }
                        }, {
                            property: 'Description',
                            sortable: false
                        }, {
                            header: "Tags",
                            sortable: false,
                            className: "tags",
                            property: function(data) {
                                var id = data.GameID;
                                var taglist = self.router.tagGames.where({"GameID": id});
                                var obj = $("<div></div>");
                                _.each(taglist, function(tag) {
                                    var thisTag = self.router.tags.get(tag.get("TagID"));
                                    obj.append("<div class='tag'>" + thisTag.get("Name") + "</div>");
                                });
                                return obj.html();
                            }
                        }, {
                            header: "Duration",
                            property: function(data) {
                                var id = data.DurationID;
                                var durobj = self.router.durations.get(id);
                                var d = document.createElement("span");
                                d.innerHTML = durobj.get("Name");
                                d.title = durobj.get("Description");
                                d.className = "has-tooltip";

                                return d;
                            }
                        }, {
                            header: "Number of Players",
                            property: function(data) {
                                var id = data.PlayerCountID;
                                var durobj = self.router.playerCounts.get(id);
                                var d = document.createElement("span");
                                d.innerHTML = durobj.get("Name");
                                d.title = durobj.get("Description");
                                d.className = "has-tooltip";

                                return d;
                            }
                        }, {
                            header: "Last Updated",
                            property: function(data) {
                                return moment(data.DateModified).format("MM/DD/YYYY [at] h:mm:ss a");
                            }
                        }
                    ]*/
                });

            },

            showAddGame: function() {
                if (this.$el.hasClass("showGame")) {
                    if (this.gameView) {
                        this.gameView.hide();
                    } else {
                        this.addGameForm.hide();
                    }
                } else {
                    this.addGameForm.render();
                }
            },

            showGame: function(e) {
                var data = $(e.currentTarget).closest(".dt-row").addClass("active").data("data");
                if (data) {
                    this.gameView = new GameView({
                        GameID: data.id,
                        router: this.router,
                        model: data
                    });
                    this.gameView.render();
                }
            }

        });
    });
