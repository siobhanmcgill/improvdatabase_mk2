define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/aboutView.html',
        'text!templates/aboutView-credits.html',
        'text!templates/aboutView-contact.html',
        'text!templates/aboutView-contact-success.html',
        'text!templates/aboutView-changelog.html'
        ],
    function($, _, Backbone, moment, deny, Template, CreditsTemplate, ContactTemplate, ContactSuccessTemplate, ChangelogTemplate) {
        return Backbone.View.extend({
            events: {
                'input .about-contact [name=name]': 'contactName',
                'click .about-contact button': 'submitContact'
            },
            title: 'About',
            icon: 'fa-info-circle',
            initialize: function(options) {
                this.router = options.router;
                
            },

            registerTools: function () {
                return [
                    {
                        id: 'btnAboutMain',
                        title: 'A Word From Our Benefactor',
                        icon: 'fa-comment',
                        action: this.showMain
                    },
                    {
                        id: 'btnCredits',
                        title: 'Site Credits',
                        icon: 'fa-thumbs-up',
                        action: this.showCredits
                    },
                    {
                        id: 'btnContact',
                        title: 'Contact (or report a bug)',
                        icon: 'fa-envelope',
                        action: this.showContact
                    },
                    {
                        id: 'btnChangelog',
                        title: 'Change Log and Technobabble',
                        icon: 'fa-code-fork',
                        action: this.showChangelog
                    }
                ];
            },

            show: function () {
                if (!this.page) {
                    this.page = 'Main';
                }
                this['show' + this.page]();
            },
            hide: function () {
                this.$toolbar.find('.sub .btn').removeClass('active');
                this.$('.text-content-page-wrapper').removeClass('intoggle').addClass('anim outtoggle');
                var self = this;
                setTimeout(function () {
                    // remove the contact page every time so the form is reset
                    if (self.page !== 'Contact') {
                        self.$('.about-contact').remove();
                    }
                }, 500);
            },

            render: function() {
                this.showMain();

                return this;
            },

            showMain: function () {
                if (!this.$('.about-main').length) {
                    this.$el.html(_.template(Template));
                }
                this.hide();
                this.$('.about-main').removeClass('outtoggle').addClass('anim intoggle');
                this.$toolbar.find('#btnAboutMain').addClass('active');
                this.page = 'Main';
            },

            showCredits: function () {
                if (!this.$('.about-credits').length) {
                    this.$el.append(_.template(CreditsTemplate));
                }
                this.hide();
                this.$('.about-credits').removeClass('outtoggle').addClass('anim intoggle');
                this.$toolbar.find('#btnCredits').addClass('active');
                this.page = 'Credits';
            },

            showContact: function () {
                if (!this.$('.about-contact').length) {
                    this.$el.append(_.template(ContactTemplate));
                }
                this.hide();
                this.$('.about-contact .day').text(moment().format('Do'));
                this.$('.about-contact .month').text(moment().format('MMMM'));
                this.$('.about-contact .year').text(moment().format('YYYY'));

                this.$('.about-contact').removeClass('outtoggle').addClass('anim intoggle');
                this.$toolbar.find('#btnContact').addClass('active');
                this.page = 'Contact';
            },

            contactName: function () {
                var val = $.trim(this.$('.about-contact [name=name]').val().split(',')[0]);
                if (val) {
                    this.$('#contactSigOutput').text(val);
                } else {
                    this.$('#contactSigOutput').text('The Undersigned');
                }
            },

            showChangelog: function () {
                if (!this.$('.about-changelog').length) {
                    this.$el.append(_.template(ChangelogTemplate));
                }
                this.hide();
                this.$('.about-changelog').removeClass('outtoggle').addClass('anim intoggle');
                this.$toolbar.find('#btnChangelog').addClass('active');
                this.page = 'Changelog';
            },

            submitContact: function () {
                var data = {};
                data.name = this.$('[name=name]').val();
                data.email = this.$('[name=email]').val();
                data.wishto = this.$('[name=wishto]').val();
                data.caused = this.$('[name=caused]').val();
                data.seeking = this.$('[name=seeking]').val();
                data.demand = this.$('[name=demand]').val();
                data.message = this.$('[name=gordon]').val();
                data.jingers = this.$('[name=jingers]').val();
                
                this.$('.about-contact *').removeClass('notice');
                if (data.jingers === 'robot') {
                    var x = this.$('.about-contact .text-content-page').addClass('shake');
                    this.$('[name=jingers]').addClass('notice');
                    this.$('.about-contact .error').show().text('Sorry, no robots.');
                    setTimeout(function () {
                        x.removeClass('shake');
                    }, 300);
                } else if (!$.trim(data.message)) {
                    var y = this.$('.about-contact .text-content-page').addClass('shake');
                    this.$('[name=gordon]').addClass('notice');
                    this.$('.about-contact .error').show().text('We appreciate the attention, but you should actually add a message.');
                    setTimeout(function () {
                        y.removeClass('shake');
                    }, 300);
                } else {
                    this.$('.about-contact .error').hide();
                    this.$('.about-contact .btn').addClass('disabled').html('<i class="fa fa-circle-o-notch fa-spin"></i>');
                    
                    var self = this;
                    Backbone.ajax({
                        url: '/contact',
                        type: 'POST',
                        data: data,
                        success: function () {
                            self.showContactSuccess();
                        },
                        error: function (e) {
                            console.log('error', e);
                            self.$('.about-contact .error').show().text('Sorry, some sort of error happened. Feel free to contact us directly at contact@improvdatabase.com.');
                        }
                    });
                }
            },

            showContactSuccess: function () {
                if (!this.$('.about-contact-success').length) {
                    this.$el.append(_.template(ContactSuccessTemplate));
                }
                this.hide();
                var self = this;
                setTimeout(function () {
                    // remove the contact page every time so the form is reset
                    self.$('.about-contact').remove();
                }, 500);

                this.$('.about-contact-success').removeClass('outtoggle').addClass('anim intoggle');
                this.page = 'Contact';
            },

        });
    });
