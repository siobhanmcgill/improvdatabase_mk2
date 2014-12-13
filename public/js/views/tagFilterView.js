define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'tmpl!templates/tagFilter.html',
        'views/tagInputView'
        ],
    function($, _, Backbone, moment, TagFilterTemplate, TagInputView) {
        return Backbone.View.extend({
            events: {
            },
            initialize: function(options) {
                this.options = options;
                this.collection = options.collection;
                this.selected = [];
            },
            
            clickDropdown: function (e) {
                console.log('click dropdown');
                e.stopPropagation();
                return false;
            },

            clickTag: function (e) {
                var tag = $(e.currentTarget).text();
                this.tagInput.addTag(e, tag, window.router.tags.get($(e.currentTarget).data('id')));
                e.stopPropagation();
                return false;
            },

            addSelected: function (tag) {
                if (this.selected.indexOf(tag) === -1) {
                    this.selected.push(tag);
                    this.$menu.css('height', 'auto').data('height', false);
                }
                console.log('add selected', this.selected);
                this.trigger('filter', 'tags', this.selected);
            },
            removeSelected: function (id) {
                var model = window.router.tags.get(id),
                    tag = model.get('Name');
                if (this.selected.indexOf(tag) > -1) {
                    this.selected = _.without(this.selected, tag);
                }
                this.trigger('filter', this.selected);
            },

            render: function() {
                this.$el.addClass('filter-button');

                if (!this.$menu) {
                    this.$menu = $(TagFilterTemplate(this));

                    this.$el.append(this.$menu);

                    this.tagInput = new TagInputView({
                        collection: window.router.tags
                    });
                    this.$menu.find('.taginput').append(this.tagInput.$el);
                    this.tagInput.render();

                    this.$menu.on('click', $.proxy(this.clickDropdown, this));
                    this.$menu.on('click', '.taglist .tag', $.proxy(this.clickTag, this));
                    this.listenTo(this.tagInput, 'tag.add', $.proxy(this.addSelected, this));
                    this.listenTo(this.tagInput, 'tag.remove', $.proxy(this.removeSelected, this));
                }
                if (!this.$icon) {
                    this.$icon = $('<div id="tags_filter_toggle" data-menu="tags_filter" class="dropdown-button"><span class="icon-filter"></span></div>');
                    this.$el.append(this.$icon);
                }
                this.$icon.dropdown({
                    width: 300
                });
                
                if (this._filter) {
                    this.$icon.addClass('active');
                } else {
                    this.$icon.removeClass('active');
                }

            }
        });
    });
