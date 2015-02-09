define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',

        'text!templates/aboutView.html',
        'text!templates/aboutView-credits.html',
        'text!templates/aboutView-contact.html',
        'text!templates/aboutView-changelog.html'
        ],
    function($, _, Backbone, moment, deny, dynamictable, Template, CreditsTemplate, ContactTemplate, ChangelogTemplate) {
        return Backbone.View.extend({
            events: {
            },
            title: 'About',
            icon: 'fa-info-circle',
            initialize: function(options) {
                this.router = options.router;
                
            },

            registerTools: function () {
                return [
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
                this.$('.about-main').removeClass('outtoggle').addClass('anim intoggle');
            },
            hide: function () {
                this.$('.text-content-page-wrapper').removeClass('intoggle').addClass('anim outtoggle');
            },

            render: function() {
                this.$el.html(_.template(Template));

                return this;
            },

            showCredits: function () {
                if (!this.$('.about-credits').length) {
                    this.$el.append(_.template(CreditsTemplate));
                }
                this.hide();
                this.$('.about-credits').removeClass('outtoggle').addClass('anim intoggle');
            },

            showContact: function () {
                if (!this.$('.about-credits').length) {
                    this.$el.append(_.template(ContactTemplate));
                }
                this.hide();
                this.$('.about-contact .day').text(moment().format('Do'));
                this.$('.about-contact .month').text(moment().format('MMMM'));
                this.$('.about-contact .year').text(moment().format('YYYY'));

                this.$('.about-contact').removeClass('outtoggle').addClass('anim intoggle');
            },

        });
    });
