define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',

        'views/addGameFormView',
        'views/gameView',
        'views/tagFilterView'
        ],
    function($, _, Backbone, moment, deny, DynamicTable, AddGameFormView, GameView, TagFilterView) {
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
                    setTimeout(function() {
                        self.reload();
                        //self.$("#gameTable").dynamictable("reload");
                    }, 500);
                });
                this.listenTo(Backbone, "hide-game", function() {
                    this.$el.removeClass("showGame");
                    this.gameView = false;
                    setTimeout(function() {
                        self.reload();
                        //self.$("#gameTable").dynamictable("reload");
                    }, 500);
                });

                this.listenTo(this.router.tagGames, "add remove", function() {
                    self.reload();
                    //this.$("#gameTable").dynamictable("reload");
                });
                this.listenTo(this.router.games, "sync add", function() {
                    self.reload();
                    //this.$("#gameTable").dynamictable("reload");
                });

                this.addGameForm = new AddGameFormView({router: this.router});
            },

            reload: function () {
                clearTimeout(this._reloadTimer);
                var self = this;
                this._reloadTimer = setTimeout(function () {
                    self.$('#gameTable').dynamictable('reload');
                }, 100);
            },

            render: function() {
                var headerscale = this.$el.outerWidth() / (this.$el.children("h1").outerWidth() - 4);
                this.$el.children('h1').css({
                    "-webkit-transform": "scale(" + headerscale + ")"
                });

                this.$(".has-tooltip").tooltip();

                this.$("#pagesize").dropdown({width: "auto"});

                this.tagFilter = new TagFilterView({
                    collection: window.router.tags
                });

                this.$("#gameTable").dynamictable({
                    data: this.router.games,
                    pageindicator: this.$("#pageindicator"),
                    prevpagebutton: this.$("#prevpage"),
                    nextpagebutton: this.$("#nextpage"),
                    pagesizemenu: this.$("#pagesize"),
                    pageSize: 'auto',
                    onRender: function(table) {
                        table.find(".has-tooltip").tooltip();
                    },
                    columns: [
                            "Name",
                            {
                                property: "Tags",
                                sortable: false,
                                filter: {
                                    view: this.tagFilter,
                                    property: 'tag'
                                }
                            },
                            {
                                property: "Duration",
                                sortProperty: "DurationSort",
                                filter: {
                                    collection: window.router.durations,
                                    property: 'DurationID',
                                    attributes: {
                                        value: 'DurationID',
                                        title: 'Description',
                                        text: 'Name'
                                    }
                                }
                            },
                            {
                                header: "Number of Players",
                                property: "PlayerCount",
                                sortProperty: "PlayerCountSort",
                                filter: {
                                    collection: window.router.playerCounts,
                                    property: 'PlayerCountID',
                                    attributes: {
                                        value: 'PlayerCountID',
                                        title: 'Description',
                                        text: 'Name'
                                    }
                                }
                            }/*,
                            {
                                header: "Last Modified",
                                property: "ModifiedDisplay",
                                sortProperty: "DateModified"
                            }*/
                    ]
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
                    this.$('#gameBox').append(this.addGameForm.$el);
                    this.addGameForm.render();
                }
            },

            showGame: function(e) {
                var data = $(e.currentTarget).closest(".dt-row").addClass("active").data("data");
                if (data) {
                    if (this.gameView) {
                        this.gameView.destroy();
                    }
                    this.addGameForm.destroy();

                    this.gameView = new GameView({
                        GameID: data.id,
                        router: this.router,
                        model: data
                    });
                    this.$('#gameBox').append(this.gameView.$el);
                    this.gameView.render();
                }
            }

        });
    });
