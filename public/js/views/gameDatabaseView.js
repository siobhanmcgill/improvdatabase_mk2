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
                this.collection = this.router.games;
                var self = this;

                //this.listenTo(this.router.tagGames, "add remove", $.proxy(this.reload, this));
                //this.listenTo(this.router.games, "sync add", $.proxy(this.reload, this));

                this.searchView = new SearchView({ router: this.router });

                this.listenTo(this.searchView, 'search-show', function () {
                    if (this.router.device !== 'mobile') {
                        this.$el.addClass('showSearch');
                        setTimeout(function () {
                            self.refreshTable();
                        }, 500);
                    }
                });
                this.listenTo(this.searchView, 'search-hide', function () {
                    if (this.router.device !== 'mobile') {
                        this.$el.removeClass('showSearch');
                        setTimeout(function () {
                            self.refreshTable();
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

                $(window).on('resize', $.proxy(this.refreshTable, this));
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
                this._queueTableFunction('reloadWithHeader');
            },

            refreshTable: function () {
                this._queueTableFunction('refresh');
            },

            _queueTableFunction: function (func) {
                clearTimeout(this._funcTimer);
                var self = this;
                if (this.$('#gameTable').hasClass('intoggle')) {
                    this._funcTimer = setTimeout(function () {
                        self.$('#gameTable').dynamictable(func);
                    }, 100);
                }
            },

            show: function (GameID) {
                if (GameID) {
                    if (GameID === 'filters') {
                        this.showFilters();
                        return;
                    }

                    this.$('#gameTable').one('render.dynamictable', $.proxy(function () {
                        var game;
                        // this is expirimental, and doesn't really work
                        if (isNaN(Number(GameID))) {
                            this.collection.names.forEach(function (name) {
                                if (name.get('Name').toLowerCase().indexOf(GameID) > -1) {
                                    game = this.collection.get(name.get('GameID'));
                                    return;
                                }
                            });
                        } else {
                            game = this.collection.get(GameID);
                        }
                        if (game) {
                            this.showGame(game);
                        } else {
                            console.error('Yo dude, game ' + GameID + ' doesn\'t exist. Check yoself.');
                            this.router.navigate('', {replace: true});
                        }
                    }, this));
                }

                this.showDatabase();
            },
            hide: function () {
                this.hideGame();
                this.$('#gameTable').removeClass('intoggle').addClass('anim outtoggle');
                this.$('.text-content-page-wrapper').removeClass('intoggle').addClass('anim outtoggle');
                this.$toolbar.find('.sub .btn').removeClass('active');
                this.shown = false;
            },

            showDatabase: function () {
                this.hide();
                this.$('#gameTable').removeClass('outtoggle').addClass('anim intoggle');
                this.$('#prevpage, #nextpage').show();
                
                if (this.page && this.page !== 'Database') {
                    this.reload();
                } else if (this.page) {
                    this.$('#gameTable').trigger('render.dynamictable');
                }
                this.page = 'Database';
                this.shown = true;
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
                var self = this;

                var gameDb = this.router.games;

                this.$el.html(_.template(Template)).show();

                this.$(".has-tooltip").tooltip();

                this.$("#pagesize").dropdown({width: "auto"});

                this.tagFilter = new TagFilterView({
                    collection: gameDb
                });

                this.$('#gameBox').before(this.searchView.el);
                this.searchView.render();


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
                            collection: gameDb.durations,
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
                            collection: gameDb.playerCounts,
                            property: 'PlayerCountID',
                            attributes: {
                                value: 'PlayerCountID',
                                title: 'Description',
                                text: 'Name'
                            }
                        },
                        hide: this.router.device === 'mobile'
                    }
                ];

                var $loader = $('#siteLoader').clone().attr('id', 'gameTableLoader');
                this.$('#gameTable').after($loader);

                this.$("#gameTable").dynamictable({
                    data: gameDb,
                    pageindicator: this.$("#pageindicator"),
                    prevpagebutton: this.$("#prevpage"),
                    nextpagebutton: this.$("#nextpage"),
                    pagesizemenu: this.$("#pagesize"),
                    loader: $loader,
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

                if (this.shown) {
                    this.router.navigate('');
                }
            },

            showAddGame: function() {
                if (!this.addGameForm) {
                    this.addGameForm = new AddGameFormView({router: this.router});
                    this.listenTo(this.addGameForm, 'show-game', $.proxy(this.onShowGame, this));
                    this.listenTo(this.addGameForm, 'shown-game', $.proxy(this.refreshTable, this));
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
                    // the user clicked on a row of the table
                    var GameID = $(e.currentTarget).closest('.dt-row').addClass('active').data('gameid');
                    data = this.collection.findWhere({GameID: GameID});
                } else {
                    // we were passed a game to show
                    data = e;
                }

                if (data) {
                    if (this.addGameForm) {
                        this.addGameForm.destroy();
                    }
                    if (this.gameView) {
                        this.gameView.destroy();
                    }
                    
                    this.gameView = new GameView({
                        GameID: data.id,
                        router: this.router,
                        collection: this.collection,
                        model: data
                    });
                    this.listenTo(this.gameView, 'show-game', $.proxy(this.onShowGame, this));
                    this.listenTo(this.gameView, 'shown-game', $.proxy(this.refreshTable, this));
                    this.listenTo(this.gameView, 'hide-game', $.proxy(this.onHideGame, this));
                    
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

                this.router.navigate('game/' + this.selectedGame.id);
            },

            onShowGame: function() {
                if (this.router.device === 'mobile') {
                    //this.searchView.hide();
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
                        // deactivate the topnav
                        // but if a search is active, we will just return to it
                        if (self.searchView.val) {
                            self.searchView.showSearch(true);
                        } else {
                            $box.parent().removeClass('active');
                        }
                        //self.searchView.show();
                    }, 500);
                } else {
                    this.$el.removeClass("showGame");
                    this.gameView = false;
                    setTimeout(function() {
                        self.refreshTable();
                    }, 500);
                }
                $('#btnAddGame').removeClass('active');
                
                this.selectedGame = false;
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
