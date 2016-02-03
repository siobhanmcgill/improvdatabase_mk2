define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/userView.html',
        'text!templates/userView-login.html'
        ],
    function($, _, Backbone, moment, deny, Template, LoginTemplate) {
        return Backbone.View.extend({
            events: {
                'submit #loginform': 'login',

                'click .genderoptions .onecolumn': 'selectGender',
                'click .save-user': 'saveUser'
            },
            title: 'Account',
            icon: 'fa-lock',
            initialize: function(options) {
                this.router = options.router;
                this.emptyFormSubmissionCount = 0;

                if (this.router.token) {
                    this.icon = 'fa-user';
                }
            },

            registerTools: function () {
                if (this.router.token) {
                    return [{
                        id: 'btnLogout',
                        title: 'Log Out',
                        icon: 'fa-user-times',
                        action: this.logout
                    }];
                } else {
                    return [];
                }
            },

            show: function () {
                var $pod;
                if (this.router.token) {
                    $pod = this.$('.user-main');
                } else {
                    $pod = this.$('.user-login');
                }
                $pod.removeClass('outtoggle').addClass('anim intoggle');
            },
            hide: function () {
                this.$('.text-content-page-wrapper').removeClass('intoggle').addClass('anim outtoggle');
            },

            render: function() {
                var template;
                if (this.router.token) {
                    template = _.template(Template, this.router.token.user);
                } else {
                    template = _.template(LoginTemplate);
                }
                this.$el.html(template);

                return this;
            },

            selectGender: function (e) {
                this.$('.genderoptions .onecolumn .fa-dot-circle-o').removeClass('fa-dot-circle-o').addClass('fa-circle-o');

                $(e.currentTarget).find('.fa-circle-o').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
                this.$('[name=Gender]').val($(e.currentTarget).data('gender'));
            },

            saveUser: function (e) {
                var data = _.object(this.$('#editAccount').serializeArray().map(function (d) { return [d.name, d.value]; })),
                    empties = this.$('.user-main .required').filter(function () { return $.trim(this.value) === ''; });
                this.$('input, textarea').removeClass('notice');

                this.$('.success, .error').hide();

                if (data.Password !== data.confirmpassword) {
                    this.shakeUserEdit('Those passwords don\'t match.', this.$('.user-main [name=Password], .user-main [name=confirmpassword]'));
                } else if (empties.length) {
                    this.shakeUserEdit('These things are required, I\'m afraid.', empties);
                } else {
                    if (!data.Password) {
                        delete data.Password;
                    }
                    delete data.confirmpassword;
                    this.$('.btn').addClass('disabled').html('<i class="fa fa-circle-o-notch fa-spin"></i>');

                    var self = this;
                    this.router.currentUser.save(data, {
                        success: function () {
                            self.$('.btn').removeClass('disabled').text('Save');
                            self.$('.success').show().text('Information saved!');
                        }, error: function (error) {
                            self.$('.btn').removeClass('disabled').text('Save');
                            self.$('.error').show().text(error);
                        }
                    });
                }

                e.stopPropagation();
                return false;
            },
            shakeUserEdit: function (error, $notice) {
                if (error) {
                    this.$('.user-main .error').html(error).show();
                }
                var $form = this.$('.user-main .text-content-page').removeClass('shake');
                setTimeout(function () {
                    $form.addClass('shake');
                }, 10);
                $notice.addClass('notice');
            },


            login: function (e) {
                var email = this.$('input[name=email]').val(),
                    pass  = this.$('input[name=password]').val();

                if (!email || !pass) {
                    this.emptyFormSubmissionCount++;
                    var cnt = this.emptyFormSubmissionCount;
                    if (cnt < 5) {
                        this.shakeLogin('You really need to fill out all the things.');
                    } else if (cnt < 10) {
                        this.shakeLogin('Seriously. Put in your username and password before clicking there.');
                    } else if (cnt === 10) {
                        this.shakeLogin('What is your problem. Stop that.');
                    } else if (cnt === 11) {
                        this.shakeLogin('I\'m not kidding around here. Quit it.');
                    } else if (cnt === 12) {
                        this.shakeLogin('What is wrong with you? Stop doing that thing.');
                    } else if (cnt === 13) {
                        this.shakeLogin('What, you just like watching this thing shake at you?');
                    } else if (cnt === 14) {
                        this.shakeLogin('That\'s pretty lame, dude. This isn\'t <em>that</em> cool.');
                    } else if (cnt === 15) {
                        this.shakeLogin('Holy crap, cut it out.');
                    } else if (cnt === 16) {
                        this.shakeLogin('Do you realize this physically hurts me every time you do that?');
                    } else if (cnt === 19) {
                        this.shakeLogin('You are torturing me. Seriously, that is what you are doing right now.');
                    } else if (cnt === 22) {
                        this.shakeLogin('Do you have no compassion? Are you some sort of evil maniac?');
                    } else if (cnt === 24) {
                        this.shakeLogin('I said Ouch!');
                    } else if (cnt < 24) {
                        this.shakeLogin('Ouch.');
                    } else {
                        this.shakeLogin('That\'s it, I\'m outta here!');
                        this.$('#btnLogin').attr('id', '');
                        var $box = this.$('.user-login .text-content-page');
                        $box.after('<i class="fa fa-star"></i>');
                        var $star = this.$('.fa-star').css('top', ($box.outerHeight() / 2) - 33);
                        setTimeout(function () {
                            $star.addClass('starburst');
                        }, 10);

                        $box.addClass('runaway');
                        setTimeout(function () {
                            $box.remove();
                        }, 5000);
                    }
                    return false;
                } else {
                    this.$('.user-login .btn').hide().after('<i class="fa fa-cog fa-spin"></i>');
                    this.router.login(email, pass, $.proxy(function (error) {
                        if (error) {
                            this.shakeLogin('<a href="' + window.location.origin + '/images/password-incorrect.png" target="_blank">Die wanna wanga!</a>');
                            this.$('.fa-cog').remove();
                            this.$('.user-login .btn').show();
                        } else {
                            this.icon = 'fa-user';
                            this.trigger('render-toolbar', this);
                            var $pod = this.$('.user-login').removeClass('intoggle').addClass('anim outtoggle');
                            this.render().show();
                            setTimeout(function () {
                                $pod.remove();
                            }, 500);
                        }
                    }, this));
                }

                e.stopPropagation();
                return false;
            },
            shakeLogin: function (error) {
                if (error) {
                    this.$('.user-login .error').html(error).show();
                }
                var $form = this.$('.user-login .text-content-page').removeClass('shake');
                setTimeout(function () {
                    $form.addClass('shake');
                }, 10);
            },

            logout: function () {
                this.router.logout($.proxy(function () {
                    this.icon = 'fa-lock';
                    this.trigger('render-toolbar', this);
                    var $pod = this.$('.user-main').removeClass('intoggle').addClass('anim outtoggle');
                    this.render().show();
                    setTimeout(function () {
                        $pod.remove();
                    }, 500);
                }, this));
            }

        });
    });
