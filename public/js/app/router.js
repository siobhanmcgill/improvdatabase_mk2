define(['jquery', 'underscore', 'backbone', 'handlebars', 'views/mainView',
        
        'collections/durationCollection', 'collections/gameCollection', 'collections/groupCollection', 'collections/nameCollection',
        'collections/noteCollection', 'collections/playerCountCollection', 'collections/suggestionCollection', 'collections/suggestionTypeCollection', 
        'collections/suggestionTypeGameCollection', 'collections/tagCollection', 'collections/tagGameCollection', 'collections/userCollection'
        ],
    function($,     _,           Backbone,   Handlebars,   MainView,
    
        DurationCollection, GameCollection, GroupCollection, NameCollection, NoteCollection, PlayerCountCollection, SuggestionCollection, SuggestionTypeCollection,
        SuggestionTypeGameCollection, TagCollection, TagGameCollection, UserCollection) {

        var Router = Backbone.Router.extend({
            routes: {
                '': 'showMain',
                '/': 'showMain'
            },
            initialize: function() {
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
                this.users = new UserCollection(window.database.users);

                this.mainView = new MainView({router: this});

                this.listenTo(Backbone, "tag-add", function(tag) {
                    this.tags.add(tag);
                });
            },

            showMain: function() {
                this.mainView.render();
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
