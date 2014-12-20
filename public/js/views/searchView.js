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
                'keyup input': 'typeSearch'
            },
            initialize: function(options) {
                this.router = options.router;

                this.$el.addClass('pod').attr('id', 'gameSearch');
            },
            render: function() {
                this.$el.append(_.template(SearchViewTemplate));
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

                    this.router.names.each(function (name) {
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
                    
                    this.$('.results').append(_.template(ResultsTemplate, { data: data }));
                    
                    data = [];
                    this.router.tags.each(function (tag) {
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

                    this.boxHeight();
                } else {
                    if (this.val) {
                        this.$('.results').removeClass('scroll');
                        this.$el.removeClass('noTransition').css('height', '40px');
                        setTimeout(function () {
                            self.$el.removeClass('open');
                            self.trigger('search-hide');
                        }, 500);
                    }
                }

                this.val = val;
            },

            boxHeight: function() { //Bruce Boxheigtner
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

        });
    });
