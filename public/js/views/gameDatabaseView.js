define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/gameDatabaseView.html',
        'text!templates/gameDatabase-filters.html',

        'views/addGameFormView',
        'views/gameView',
        'views/tagFilterView',
        'views/searchView'
        ],
    function($, _, Backbone, moment, deny, Template, FiltersTemplate, AddGameFormView, GameView, TagFilterView, SearchView) {
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

                this.listenTo(this.router.tagGames, "add remove", $.proxy(this.reload, this));
                this.listenTo(this.router.games, "sync add", $.proxy(this.reload, this));

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

                $(window).on('resize', $.proxy(this.reload, this));
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
                if (this.page && this.page !== 'Database') {
                    this.reload();
                }
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
                
                // for some reason these events doesn't work in the Backbone event object
                this.$('.game-filters .text-content-page .close, .game-filters .text-content-page .btn-return').click($.proxy(this.showDatabase, this));
                this.$('.game-filters .text-content-page .close, .game-filters .text-content-page .btn-clear').click($.proxy(function () {
                    this.$('#gameTable').dynamictable('clearFilters');
                }, this));

                this.onFilter(null, this.$('#gameTable').dynamictable('getFilter'));

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
                            property: 'tags'
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
                    item: 'Game',
                    items: 'Games',
                    onRender: function(table) {
                        table.find(".has-tooltip").tooltip();
                        if (self.selectedGame) {
                            table.find('#row' + self.selectedGame.id).addClass('active');
                        }
                    },
                    columns: this.columns
                }).on('filter.dynamictable', $.proxy(this.onFilter, this));
                return this;
            },

            onFilter: function (e, filter) {
                if (e) {
                    console.log('filter!', filter);
                }
                var cnt = this.$('#gameTable').dynamictable('filterCount');
                if (cnt > 0) {
                    this.$('.game-filters .btn-clear').show();
                } else {
                    this.$('.game-filters .btn-clear').hide();
                }
            },

            hideGame: function () {
                if (this.gameView) {
                    this.gameView.hide();
                } else if (this.addGameForm) {
                    this.addGameForm.hide();
                }
                this.$('nav').off('click.hidegame');
            },

            showAddGame: function() {
                if (!this.addGameForm) {
                    this.addGameForm = new AddGameFormView({router: this.router});
                    this.listenTo(this.addGameForm, 'show-game', $.proxy(this.onShowGame, this));
                    this.listenTo(this.addGameForm, 'shown-game', $.proxy(this.reload, this));
                    this.listenTo(this.addGameForm, 'hide-game', $.proxy(this.onHideGame, this));
                }
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
                    if (this.addGameForm) {
                        this.addGameForm.destroy();
                    }
                    if (!this.gameView) {
                        this.gameView = new GameView({
                            GameID: data.id,
                            router: this.router,
                            model: data
                        });
                        this.listenTo(this.gameView, 'show-game', $.proxy(this.onShowGame, this));
                        this.listenTo(this.gameView, 'shown-game', $.proxy(this.reload, this));
                        this.listenTo(this.gameView, 'hide-game', $.proxy(this.onHideGame, this));
                    } else {
                        this.gameView.destroy();
                        this.gameView.setGame(data);
                    }
                    
                    this.$('#gameBox').append(this.gameView.$el);

                    this.gameView.$el.on('click', function (e) { e.stopPropagation(); });

                    this.gameView.render();
                    this.selectedGame = data;
                        
                    if (this.router.device === 'mobile') {
                        // closes the game box when you click outside it
                        this.$('nav').on('click.hidegame', $.proxy(this.hideGame, this));
                    }
                } else {
                    this.selectedGame = false;
                }
            },

            onShowGame: function() {
                if (this.router.device === 'mobile') {
                    this.searchView.hide();
                    this.$('#gameBox').addClass('active scrollContent').parent().addClass('active');
                } else {
                    this.$el.addClass("showGame");
                }
            },
            onHideGame: function() {
                var self = this;
                // deselect all games in the row
                this.$('#gameTable .dt-row').removeClass('active');
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
            },

            showRandomGame: function () {
                var filter = this.$('#gameTable').dynamictable('getFilter'),
                    self = this;
                
                this.router.games.getPage({
                        start: 0,
                        end: 0,
                        filter: filter
                    }, function (data) {
                        var time = 0;
                        if (self.page === 'Filters') {
                            self.showDatabase();
                            time = 500;
                        }
                        setTimeout(function () {
                            var item = data.data[Math.floor(Math.random() * data.data.length)];
                            self.showGame(item);
                        }, time);
                    });
            }

        });
    });
