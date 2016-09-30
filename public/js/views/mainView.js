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
                this.views.game = new gameDatabaseView({ router: this.router });
                this.views.about = new aboutView({ router: this.router });
                this.views.user = new userView({ router: this.router });
                
                this.currentView = '';
                this.isRendered = {};

                this.$loader = this.$el.find('#siteLoader');
            },
            
            renderToolbar: function (view) {
                var key = view.key,
                    data = {
                        key: key === 'game' ? '' : key,
                        id: key + 'Tools',
                        icon: view.icon,
                        title: view.title,
                        tools: view.registerTools()
                    },
                    $existing = this.$('#toolbar').find('#' + data.id),
                    active = $existing.hasClass('active'),
                    $toolbar = $(_.template(toolbarTemplate, data)),
                    self = this;
                view.$toolbar = $toolbar;
                $toolbar.children('a').click(function (e) {
                    e.stopPropagation();
                    self.router.navigate($(this).attr('href'), {trigger: false});
                    self.render(key);
                    return false;
                });
                $toolbar.find('.sub .btn').each(function (i) {
                    $(this).on('click', function(e) {
                        //return true to close the toolbar on click
                        if (data.tools[i].action.call(view, e) && self.router.device === 'mobile') {
                            self.$('.showMenu a').click();
                        }
                    });
                });
                if ($existing.length) {
                    $existing.after($toolbar);
                    // remove any existing instance of this toolbar
                    $existing.remove();
                } else {
                    this.$('#toolbar').append($toolbar);
                }
                
                $toolbar.addClass('active');
                if (this.router.device === 'mobile') {
                    $toolbar.data('height', $toolbar.find('.sub').height());
                } else {
                    $toolbar.data('width', $toolbar.find('.sub').width() + 5);
                }
                $toolbar.removeClass('active');
                
                $toolbar.find(".has-tooltip").tooltip();
                
                if (active) {
                    setTimeout(function () {
                        var $tools = self.$('#' + key + 'Tools').addClass('active');
                        if (self.router.device === 'mobile') {
                            $tools.find('.sub').css('height', self.$('#' + key + 'Tools').data('height'));
                        } else {
                            $tools.find('.sub').css('width', self.$('#' + key + 'Tools').data('width'));
                        }
                    }, 100);
                }
            },

            render: function(key, key2) {
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
                    
                    // add the "show menu" and "fullscreen" buttons for mobile devices
                    if (this.router.device === 'mobile') {
                        var $showBtn = $(_.template(toolbarTemplate, {
                            id: 'showMenu',
                            key: '',
                            title: '',
                            icon: 'fa-bars'
                        }));
                        $showBtn.addClass('showMenu').find('a').on('click', $.proxy(function (e) {
                            this.$('#topnav').toggleClass('show');
                            if (this.$('#topnav').hasClass('show')) {
                                var $shade = $('<div id="topnavShade"></div>');
                                this.$('#topnav').after($shade);
                                $shade.on('click.hidemenu', function () {
                                    $showBtn.find('a').click();
                                });
                            } else {
                                this.$('#topnavShade').remove();
                            }
                            e.stopPropagation();
                            return false;
                        }, this));
                        this.$('#toolbar').prepend($showBtn);
                        
                        if (document.fullscreenEnabled || 
                            document.webkitFullscreenEnabled || 
                            document.mozFullScreenEnabled ||
                            document.msFullscreenEnabled) {

                            var $fullscreenBtn = $(_.template(toolbarTemplate, {
                                id: 'fullscreen',
                                key: '',
                                title: '',
                                icon: 'fa-expand'
                            }));
                            $fullscreenBtn.addClass('fullscreen').find('a').on('click', $.proxy(function () {
                                // are we full-screen?
                                if (document.fullscreenElement ||
                                    document.webkitFullscreenElement ||
                                    document.mozFullScreenElement ||
                                    document.msFullscreenElement) {
                                    
                                    // exit full-screen
                                    if (document.exitFullscreen) {
                                        document.exitFullscreen();
                                    } else if (document.webkitExitFullscreen) {
                                        document.webkitExitFullscreen();
                                    } else if (document.mozCancelFullScreen) {
                                        document.mozCancelFullScreen();
                                    } else if (document.msExitFullscreen) {
                                        document.msExitFullscreen();
                                    }

                                } else {
                                    var i = $('body')[0];
                                    // go full-screen
                                    if (i.requestFullscreen) {
                                        i.requestFullscreen();
                                    } else if (i.webkitRequestFullscreen) {
                                        i.webkitRequestFullscreen();
                                    } else if (i.mozRequestFullScreen) {
                                        i.mozRequestFullScreen();
                                    } else if (i.msRequestFullscreen) {
                                        i.msRequestFullscreen();
                                    }
                               }
                            }, this));
                            this.$('#toolbar').prepend($fullscreenBtn);

                        }
                    }

                    this.$('#toolbar').addClass('ready');

                    this.isRendered.main = true;
                }

                key = key || 'game';
                
                // if a view is currently showing, get rid of it
                if (this.views[this.currentView] && this.currentView !== key) {
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

                    this.$loader.hide();
                } else {
                    this.views[key].$el.show();
                }
                this.views[key].show(key2);
                
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
                    var $alltools = self.$('#toolbar .section').removeClass('active'),
                        $tools = self.$('#' + key + 'Tools').addClass('active');
                    if (self.router.device === 'mobile') {
                        $alltools.find('.sub').css('height', 0);
                        $tools.find('.sub').css('height', self.$('#' + key + 'Tools').data('height'));
                    } else {
                        $alltools.find('.sub').css('width', 0);
                        $tools.find('.sub').css('width', self.$('#' + key + 'Tools').data('width'));
                    }
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
