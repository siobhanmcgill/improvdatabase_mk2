define(['jquery',
        'underscore',
        'backbone',
        'moment',
        'deny',

        'text!templates/searchView.html',
        'text!templates/search-results.html'
        ],
    function($, _, Backbone, moment, deny, SearchViewTemplate, ResultsTemplate) {
        return Backbone.View.extend({
            events: {
                'keyup input': 'typeSearch',
                'click .fa-close': 'clearSearch',
                'click .fa-search': 'showSearch',

                'click .search-section .game-result': 'openGame'
            },
            initialize: function(options) {
                this.router = options.router;
                this.collection = this.router.games;

                this.$el.addClass('pod').attr('id', 'gameSearch');
            },
            render: function() {
                this.$el.append(_.template(SearchViewTemplate));
            },

            showSearch: function (force) {
                if (this.router.device === 'mobile') {
                    if (this.$el.hasClass('active') && force !== true) { // hide it
                        this.$el.removeClass('active');
                        var $item = this.$el.parent().off('click.hidesearch');
                        setTimeout(function () {
                            $item.removeClass('active');
                        }, 500);
                        this.clearSearch();
                        this.$('[name=search]').blur();
                    } else { // show it
                        this.$el.addClass('active').parent().addClass('active');
                        this.$el.removeClass('dim');
                        var self = this;
                        setTimeout(function () {
                            // clicking outside the search will close it
                            self.$el.parent().on('click.hidesearch', $.proxy(self.showSearch, self));
                            self.$el.on('click', function (e) { e.stopPropagation(); });
                            
                            // force is true if we're returning from a game, so we don't need to re-focus in the search box
                            // it's a slightly smoother UX this way
                            if (force !== true) {
                                setTimeout(function () {
                                    self.$('[name=search]').focus();
                                }, 500);
                            }
                        }, 100);
                    }
                }
            },

            openGame: function (e) {
                var id = $(e.currentTarget).data('gameid');
                this.trigger('open-game', id);

                if (this.router.device === 'mobile') {
                    this.$el.addClass('dim');
                    this.$el.parent().off('click.hidesearch');
                }
            },

            hide: function () {
                this.$el.removeClass('show');
            },
            show: function () {
                this.$el.addClass('show');
            },

            typeSearch: function (e) {
                var key = e.keyCode, // 13 is enter
                    val = $.trim(this.$('input').val()).toLowerCase(),
                    data = [],
                    self = this;
                
                if (key === 13) {
                    console.log('ENTER');
                    return false;
                }
                if (val) {
                    if (!this.val) {
                        this.trigger('search-show');
                    }
                    this.$el.addClass('open');

                    this.$('.results').empty();

                    this.collection.names.each(function (name) {
                        if (name.get('Name').toLowerCase().indexOf(val) > -1) {
                            var regex = new RegExp('(' + val + ')', 'gi');
                            var text = name.get('Name').replace(regex, '<strong>$1</strong>');

                            data.push({
                                id: name.get('GameID'),
                                name: text,
                                type: 'name'
                            });
                        }
                    });
                    
                    this.$('.results').append(_.template(ResultsTemplate, {
                        data: data,
                        type: 'games',
                        term: this.$('input').val(),
                        icon: 'fa-futbol-o'
                    }));
                    
                    /*
                    data = [];
                    this.collection.tags.each(function (tag) {
                        if (tag.get('Name').toLowerCase().indexOf(val) > -1) {
                            var regex = new RegExp('(' + val + ')', 'gi');
                            var text = tag.get('Name').replace(regex, '<strong>$1</strong>');

                            data.push({
                                id: tag.get('TagID'),
                                name: text,
                                type: 'tag'
                            });
                        }
                    });
                    
                    this.$('.results').append(_.template(ResultsTemplate, { data: data }));
                    */

                    this.boxHeight();

                    this.$('.fa-search').removeClass('fa-search').addClass('fa-close');
                } else {
                    // nothing has been entered
                    if (this.val && this.router.device !== 'mobile') {
                        this.$('.results').removeClass('scroll');
                        this.$el.removeClass('noTransition').css('height', '40px');
                        setTimeout(function () {
                            self.$el.removeClass('open');
                            self.trigger('search-hide');
                        }, 500);
                    } else {
                        this.$('.results').empty();
                        this.$('[name=search]').focus();
                    }
                    this.$('.fa-close').addClass('fa-search').removeClass('fa-close');
                }

                this.val = val;
            },
            clearSearch: function () {
                this.$('input').val('').keyup();
            },

            boxHeight: function() { //Bruce Boxheigtner
                if (this.router.device !== 'mobile') {
                    this.$('.results').removeClass('scroll');

                    var h = this.$('.results').outerHeight() + 40,
                        time = 10,
                        self = this;

                    if (h > $(window).height()) {
                        h = $(window).height();
                    }

                    clearTimeout(this.heightTimer);
                    if (this.transTimer) {
                        clearTimeout(this.transTimer);
                        this.$el.addClass('noTransition');
                    }
                    if (!this.$el.hasClass('noTransition')) {
                        time = 500;
                    }
                    this.heightTimer = setTimeout(function () {
                        self.$el.css('height', h + 'px');
                        self.$('.results').addClass('scroll');
                        self.transTimer = setTimeout(function () {
                            self.$el.addClass('noTransition');
                        }, 500);
                    }, time);
                }
            }

        });
    });
