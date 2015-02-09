define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/mainView.html',
        'text!templates/mainView-toolbar.html',

        'views/gameDatabaseView',
        'views/aboutView',
        'views/userView'
        ],
    function($, _, Backbone, moment, deny, Template, toolbarTemplate, gameDatabaseView, aboutView, userView) {
        return Backbone.View.extend({
            el: "body",
            events: {
            },
            initialize: function(options) {
                this.router = options.router;
                
                this.views = {};
                this.views.gamedb = new gameDatabaseView({ router: this.router });
                this.views.about = new aboutView({ router: this.router });
                this.views.user = new userView({ router: this.router });
                
                this.currentView = '';
                this.isRendered = {};
            },
            
            renderToolbar: function (view) {
                var key = view.key,
                    data = {
                        key: key === 'gamedb' ? '' : key,
                        id: key + 'Tools',
                        icon: view.icon,
                        title: view.title,
                        tools: view.registerTools()
                    },
                    $existing = this.$('#toolbar').find('#' + data.id),
                    active = $existing.hasClass('active'),
                    $toolbar = $(_.template(toolbarTemplate, data));
                view.$toolbar = $toolbar;
                $toolbar.find('.sub .btn').each(function (i) {
                    $(this).on('click', $.proxy(data.tools[i].action, view));
                });
                if ($existing.length) {
                    $existing.after($toolbar);
                    // remove any existing instance of this toolbar
                    $existing.remove();
                } else {
                    this.$('#toolbar').append($toolbar);
                }

                $toolbar.addClass('active');
                $toolbar.data('width', $toolbar.find('.sub').width() + 5);
                $toolbar.removeClass('active');
                
                $toolbar.find(".has-tooltip").tooltip();
                
                if (active) {
                    var self = this;
                    setTimeout(function () {
                        self.$('#' + key + 'Tools').addClass('active').find('.sub').css('width', self.$('#' + key + 'Tools').data('width'));
                    }, 100);
                }
            },

            render: function(key) {
                if (!this.isRendered.main) {
                    this.$el.append(_.template(Template));
                    this.$views = this.$el.children('#views');
                    this.$nav = this.$el.children('nav');
                    
                    _.each(_.keys(this.views), $.proxy(function (thiskey) {
                        var view = this.views[thiskey];
                        view.key = thiskey;
                        this.renderToolbar(view);
                        this.listenTo(view, 'render-toolbar', $.proxy(this.renderToolbar, this));
                    }, this));
                    this.$('#toolbar').addClass('ready');


                    this.isRendered.main = true;
                }

                key = key || 'gamedb';
                
                // if a view is currently showing, get rid of it
                if (this.views[this.currentView]) {
                    var oldView = this.views[this.currentView];
                    oldView.hide();
                    setTimeout(function () {
                        oldView.$el.hide();
                    }, 600);
                    // float away all the topnav pods for the old view
                    oldView.$el.find('#topnav > .pod').each(function (i) {
                        var $obj = $(this);
                        setTimeout(function () {
                            $obj.removeClass('show');
                        }, 500 - (i * 250));
                    });
                }
                this.currentView = key;
                
                if (!this.isRendered[key]) {
                    this.$views.append(this.views[key].$el.addClass('view'));
                    this.views[key].render();
                    this.isRendered[key] = true;
                } else {
                    this.views[key].$el.show();
                }
                this.views[key].show();
                
                var self = this,
                    title = this.views[key] ? this.views[key].title : '',
                    delay = 200,
                    $oldHeader = this.$el.children('h1'),
                    $newHeader = $('<h1>' + title.toUpperCase() + '</h1>').removeAttr('style').appendTo(this.$el),
                    headerscale = this.$el.outerWidth() / ($newHeader.outerWidth() - 4);
                
                // float in all the topnav pods for the new view
                if (this.views[key]) {
                    this.views[key].$el.find('#topnav > .pod').each(function () {
                        var $obj = $(this);
                        setTimeout(function () {
                            $obj.addClass('show');
                        }, delay);
                        delay += 250;
                    });
                }
                
                // close the old toolbar, and open the new one
                setTimeout(function () {
                    self.$('#toolbar .section').removeClass('active').find('.sub').css('width', 0);
                    self.$('#' + key + 'Tools').addClass('active').find('.sub').css('width', self.$('#' + key + 'Tools').data('width'));
                }, 100);

                $oldHeader.css('top', -(20 * $oldHeader.data('scale')));
                $newHeader.data('scale', headerscale).css({
                    'transform': 'scale(' + headerscale + ')',
                    'top': -(20 * headerscale)
                }).addClass('ready');
                setTimeout(function () {
                    $oldHeader.remove();
                    $newHeader.css('top', '4px');
                }, $oldHeader.length ? 500 : 100);
            }

        });
    });
