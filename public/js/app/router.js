define(['jquery', 'underscore', 'backbone', 'store', 'views/mainView',
        
        'collections/durationCollection', 'collections/gameCollection', 'collections/groupCollection', 'collections/nameCollection',
        'collections/noteCollection', 'collections/playerCountCollection', 'collections/suggestionCollection', 'collections/suggestionTypeCollection', 
        'collections/suggestionTypeGameCollection', 'collections/tagCollection', 'collections/tagGameCollection'
        ],
    function($,     _,           Backbone, store,   MainView,
    
        DurationCollection, GameCollection, GroupCollection, NameCollection, NoteCollection, PlayerCountCollection, SuggestionCollection, SuggestionTypeCollection,
        SuggestionTypeGameCollection, TagCollection, TagGameCollection) {

        var Router = Backbone.Router.extend({
            routes: {
                '': 'showView',
                ':key': 'showView',
            },
            initialize: function() {
                this.token = store.get('token');
                if (this.token) {
                    var exp = this.token.expires;
                    if (exp > Date.now()) {
                        $.ajaxSetup({
                            headers: { 'x-access-token': this.token.token }
                        });
                    } else {
                        this.token = false;
                        store.remove('token');
                    }
                }

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

                this.mainView = new MainView({router: this});

                this.listenTo(Backbone, "tag-add", function(tag) {
                    this.tags.add(tag);
                });
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
                        store.set('token', response);
                        $.ajaxSetup({
                            headers: { 'x-access-token': response.token }
                        });
                        
                        if (callback) {
                            callback(response);
                        }
                        self.trigger('login');
                    }
                });
            },
            logout: function (callback) {
                var self = this;
                console.log('logout');
                Backbone.ajax({
                    url: '/logout',
                    method: 'POST',
                    success: function (response) {
                        store.clear();
                        self.token = null;
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
			console.log('LINK', href);
			router.navigate(href, {trigger: true});
		});

        return router;
    });
