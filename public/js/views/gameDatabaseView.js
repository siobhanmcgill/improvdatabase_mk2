define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',

        'text!templates/gameDatabaseView.html',
        'text!templates/gameDatabase-filters.html',

        'views/addGameFormView',
        'views/gameView',
        'views/tagFilterView',
        'views/searchView'
        ],
    function($, _, Backbone, moment, deny, DynamicTable, Template, FiltersTemplate, AddGameFormView, GameView, TagFilterView, SearchView) {
        return Backbone.View.extend({
            events: {
                'click #gameTable .dt-row': 'showGame',
                'click #gameBox > .close': 'hideGame',
            },
            title: 'Games',
            icon: 'fa-database',
            initialize: function(options) {
                this.router = options.router;
                var self = this;

                this.listenTo(Backbone, "show-game", function() {
                    if (this.router.device === 'mobile') {
                        this.searchView.hide();
                        this.$('#gameBox').addClass('active scrollContent').parent().addClass('active');
                    } else {
                        this.$el.addClass("showGame");
                        setTimeout(function() {
                            self.reload();
                        }, 500);
                    }
                });
                this.listenTo(Backbone, "hide-game", function() {
                    var self = this;
                    if (this.router.device === 'mobile') {
                        var $box = this.$('#gameBox').removeClass('active');
                        setTimeout(function () {
                            $box.parent().removeClass('active');
                            self.searchView.show();
                        }, 500);
                    } else {
                        this.$el.removeClass("showGame");
                        this.gameView = false;
                        setTimeout(function() {
                            self.reload();
                        }, 500);
                    }
                    $('#btnAddGame').removeClass('active');
                });

                this.listenTo(this.router.tagGames, "add remove", function() {
                    self.reload();
                });
                this.listenTo(this.router.games, "sync add", function() {
                    self.reload();
                });

                this.addGameForm = new AddGameFormView({router: this.router});

                this.searchView = new SearchView({ router: this.router });

                this.listenTo(this.searchView, 'search-show', function () {
                    if (this.router.device !== 'mobile') {
                        this.$el.addClass('showSearch');
                        setTimeout(function () {
                            self.reload();
                        }, 500);
                    }
                });
                this.listenTo(this.searchView, 'search-hide', function () {
                    if (this.router.device !== 'mobile') {
                        this.$el.removeClass('showSearch');
                        setTimeout(function () {
                            self.reload();
                        }, 500);
                    }
                });

                this.listenTo(this.searchView, 'open-game', function (id) {
                    var game = this.router.games.get(id);
                    this.showGame(game);
                });

                this.listenTo(this.router, 'login logout', function () {
                    this.trigger('render-toolbar', this);
                });
            },

            registerTools: function () {
                var r = [
                    {
                        title: 'Filter Games',
                        id: 'btnFilters',
                        icon: 'fa-filter',
                        action: this.showFilters
                    },
                    {
                        title: 'Pick Random Game',
                        id: 'btnRandomGame',
                        icon: 'fa-random',
                        action: this.showRandomGame
                    }
                ];

                if (this.router.hasPermission('game_create')) {
                    r.push({
                        title: 'Add Game',
                        id: 'btnAddGame',
                        icon: 'fa-plus-circle',
                        action: this.showAddGame
                    });
                }
                return r;
            },

            reload: function () {
                clearTimeout(this._reloadTimer);
                var self = this;
                if (this.$('#gameTable').hasClass('intoggle')) {
                    this._reloadTimer = setTimeout(function () {
                        self.$('#gameTable').dynamictable('reload');
                    }, 100);
                }
            },

            show: function () {
                /*
                if (!this.page) {
                    this.page = 'Database';
                }
                this['show' + this.page]();
                */
                this.showDatabase();
            },
            hide: function () {
                this.hideGame();
                this.$('#gameTable').removeClass('intoggle').addClass('anim outtoggle');
                this.$('.text-content-page-wrapper').removeClass('intoggle').addClass('anim outtoggle');
                this.$toolbar.find('.sub .btn').removeClass('active');
            },

            showDatabase: function () {
                this.hide();
                this.$('#gameTable').removeClass('outtoggle').addClass('anim intoggle');
                this.$('#prevpage, #nextpage').show();
                this.page = 'Database';
            },
            showFilters: function () {
                if (!this.$('.game-filters').length) {
                    this.$el.append(_.template(FiltersTemplate));
                    this.$('.game-filters .text-content-page').on('click', function (e) { e.stopPropagation(); });
                }
                this.$('#prevpage, #nextpage').hide();

                // set up the filters
                this.$('#gameTable').dynamictable('renderFilterMenu', $('.game-filters .text-content-page .filters-go-here'));

                this.hide();
                this.$('.game-filters').removeClass('outtoggle').addClass('anim intoggle');
                this.$toolbar.find('#btnFilters').addClass('active');
                this.page = 'Filters';
                
                // for some reason this event doesn't work in the Backbone event object
                this.$('.game-filters .text-content-page .close').click($.proxy(this.showDatabase, this));

                return true;
            },

            render: function() {
                this.$el.html(_.template(Template)).show();

                this.$(".has-tooltip").tooltip();

                this.$("#pagesize").dropdown({width: "auto"});

                this.tagFilter = new TagFilterView({
                    collection: window.router.tags
                });

                this.$('#gameBox').before(this.searchView.el);
                this.searchView.render();

                var self = this;

                this.columns = [
                    {
                        header: '<i class="fa fa-futbol-o"></i> Name',
                        property: "Name"
                    },
                    {
                        header: '<i class="fa fa-tags"></i> Tags',
                        property: "Tags",
                        sortable: false,
                        filter: {
                            view: this.tagFilter,
                            property: 'tag'
                        },
                        hide: this.router.device === 'mobile'
                    },
                    {
                        header: '<i class="fa fa-clock-o"></i> Duration',
                        property: "Duration",
                        sortProperty: "DurationSort",
                        filter: {
                            collection: this.router.durations,
                            property: 'DurationID',
                            attributes: {
                                value: 'DurationID',
                                title: 'Description',
                                text: 'Name'
                            }
                        },
                        hide: this.router.device === 'mobile'
                    },
                    {
                        header: '<i class="fa fa-group"></i> Player Count',
                        property: "PlayerCount",
                        sortProperty: "PlayerCountSort",
                        filter: {
                            collection: this.router.playerCounts,
                            property: 'PlayerCountID',
                            attributes: {
                                value: 'PlayerCountID',
                                title: 'Description',
                                text: 'Name'
                            }
                        },
                        hide: this.router.device === 'mobile'
                    }/*,
                    {
                        header: "Last Modified",
                        property: "ModifiedDisplay",
                        sortProperty: "DateModified"
                    }*/
                ];

                this.$("#gameTable").dynamictable({
                    data: this.router.games,
                    pageindicator: this.$("#pageindicator"),
                    prevpagebutton: this.$("#prevpage"),
                    nextpagebutton: this.$("#nextpage"),
                    pagesizemenu: this.$("#pagesize"),
                    pageSize: 'auto',
                    onRender: function(table) {
                        table.find(".has-tooltip").tooltip();
                        if (self.selectedGame) {
                            table.find('#row' + self.selectedGame.id).addClass('active');
                        }
                    },
                    columns: this.columns
                });
                return this;
            },

            hideGame: function () {
                if (this.gameView) {
                    this.gameView.hide();
                } else {
                    this.addGameForm.hide();
                }
                this.$('nav').off('click.hidegame');
            },

            showAddGame: function() {
                if (this.$el.hasClass("showGame")) {
                    if (this.gameView) {
                        this.gameView.hide();
                    } else {
                        this.addGameForm.hide();
                    }
                } else {
                    $('#btnAddGame').addClass('active');
                    this.$('#gameBox').append(this.addGameForm.$el);
                    this.addGameForm.render();
                }
                this.selectedGame = false;
            },

            showGame: function(e) {
                var data;
                this.$('#gameTable .dt-row').removeClass('active');
                if (e.currentTarget) {
                    data = $(e.currentTarget).closest(".dt-row").addClass("active").data("data");
                } else {
                    data = e;
                }
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

                    this.gameView.$el.on('click', function (e) { e.stopPropagation(); });
                    this.$('nav').on('click.hidegame', $.proxy(this.hideGame, this));

                    this.gameView.render();
                    this.selectedGame = data;
                } else {
                    this.selectedGame = false;
                }
            },

            showRandomGame: function () {
                var filter = this.$('#gameTable').dynamictable('getFilter'),
                    self = this;
                
                this.router.games.getPage({
                        start: 0,
                        end: 0,
                        filter: filter
                    }, function (data) {
                        var item = data.data[Math.floor(Math.random() * data.data.length)];
                        self.showGame(item);
                    });
            }

        });
    });
