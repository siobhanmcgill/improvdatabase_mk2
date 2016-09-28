define(['jquery', 'underscore', 'backbone', 'store', 'views/mainView',
        
        'collections/durationCollection', 'collections/gameCollection', 'collections/groupCollection', 'collections/nameCollection',
        'collections/noteCollection', 'collections/playerCountCollection', 'collections/suggestionCollection', 'collections/suggestionTypeCollection', 
        'collections/suggestionTypeGameCollection', 'collections/tagCollection', 'collections/tagGameCollection',

        'models/user'
        ],
    function($,     _,           Backbone, store,   MainView,
    
        DurationCollection, GameCollection, GroupCollection, NameCollection, NoteCollection, PlayerCountCollection, SuggestionCollection, SuggestionTypeCollection,
        SuggestionTypeGameCollection, TagCollection, TagGameCollection, User) {

        var Router = Backbone.Router.extend({
            routes: {
                '': 'showView',
                ':key': 'showView',
            },
            initialize: function() {
                this.token = store.get('token');
                if (this.token) {
                    // store the current token, and refresh it in the background to update the expiration date
                    this._handleToken();
                    this.refreshToken();
                }
                
                this.device = $(window).width() > 700 ? 'full' : 'mobile';
                
                /*
                this.durations = new DurationCollection(window.database.duration);
                this.games = new GameCollection(window.database.game);
                this.groups = new GroupCollection(window.database.group);
                this.names = new NameCollection(window.database.name);
                
                this.games.names = this.names;
                //this.games.sort();

                this.notes = new NoteCollection(window.database.note);
                this.playerCounts = new PlayerCountCollection(window.database.playercount);
                this.suggestions = new SuggestionCollection(window.database.suggestion);
                this.suggestionTypes = new SuggestionTypeCollection(window.database.suggestiontype);
                this.suggestionTypeGames = new SuggestionTypeGameCollection(window.database.suggestiontypegame);
                this.tags = new TagCollection(window.database.tag);
                this.tagGames = new TagGameCollection(window.database.taggame);
                */
                this.games = new GameCollection();

                this.mainView = new MainView({router: this});

                this.listenTo(Backbone, "tag-add", function(tag) {
                    this.tags.add(tag);
                });
            },

            fetchGameDatabase: function () {
                var self = this;
                var deferred = $.Deferred();
                $.when(
                    this.durations.fetch(),
                    this.games.fetch(),
                    this.names.fetch(),
                    this.playerCounts.fetch(),
                    this.tags.fetch(),
                    this.tagGames
                    ).done(function () {
                        self.games.names = self.names;
                        deferred.resolve();
                    });

                return deferred;
            },

            _handleToken: function () {
                store.set('token', this.token);
                this.currentUser = new User(this.token.user);
                var exp = this.token.expires;
                if (exp > Date.now()) {
                    $.ajaxSetup({
                        headers: { 'x-access-token': this.token.token }
                    });
                } else {
                    this.token = false;
                    store.remove('token');
                }

                this.listenTo(this.currentUser, 'change', $.proxy(function () {
                    this.token.user = this.currentUser.toJSON();
                    store.set('token', this.token);
                }, this));

                // pledge to refresh the token every hour, as per Auth0's suggestions
                setTimeout($.proxy(this.refreshToken, this), 3600000);
            },

            login: function (email, pass, callback) {
                var self = this;
                Backbone.ajax({
                    url: '/login',
                    method: 'POST',
                    data: {
                        username: email,
                        password: pass
                    },
                    success: function (response) {
                        self.token = response;
                        self._handleToken();
                        
                        if (callback) {
                            callback(null, response);
                        }
                        self.trigger('login');
                    },
                    error: function (xhr) {
                        callback(xhr);
                    }
                });
            },
            logout: function (callback) {
                var self = this;
                Backbone.ajax({
                    url: '/logout',
                    method: 'POST',
                    success: function (response) {
                        store.clear();
                        self.token = null;
                        self.currentUser = null;
                        $.ajaxSetup({
                            headers: { 'x-access-token': false }
                        });
                        
                        if (callback) {
                            callback(response);
                        }
                        self.trigger('logout');
                    }
                });
            },
            refreshToken: function () {
                var exp = this.token ? this.token.expires : null;
                if (exp && exp > Date.now()) {
                    var self = this;
                    Backbone.ajax({
                        url: '/refreshToken',
                        method: 'POST',
                        success: function (response) {
                            self.token = response;
                            self._handleToken();
                        }
                    });
                }
            },

            hasPermission: function (key) {
                var perms = this.token && this.token.user ? this.token.user.Permissions : [];
                return _.indexOf(perms, key) > -1;
            },

            showView: function(key) {
                this.mainView.render(key);
            }
        });

        var router = new Router();
        window.router = router;
        Backbone.history.start({pushState: false});

        //turn all links into internal links
        $(document).on('click', 'a[href^="/"]', function (event) {
			var href = $(this).attr('href');
			event.preventDefault();
			router.navigate(href, {trigger: true});
		});

        return router;
    });
