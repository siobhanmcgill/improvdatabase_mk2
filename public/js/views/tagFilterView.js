define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'text!templates/tagFilter.html',
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
                e.stopPropagation();
                return false;
            },

            clickTag: function (e) {
                var tag = $(e.currentTarget).text(),
                    id = $(e.currentTarget).data('id');
                if (this.selected.indexOf(id) === -1) {
                    this.tagInput.addTag(e, tag, window.router.tags.get(id));
                }
                e.stopPropagation();
                return false;
            },

            addSelected: function (tag, id) {
                if (this.selected.indexOf(id) === -1) {
                    this.selected.push(id);
                    this.resize();
                }
                this.trigger('filter', 'tags', this.selected);
            },
            removeSelected: function (id) {
                if (this.selected.indexOf(id) > -1) {
                    this.selected = _.without(this.selected, id);
                }
                this.resize();
                this.trigger('filter', 'tags', this.selected);
            },

            resize: function () {
                this.$menu.css('height', 'auto').css('height', this.$menu.outerHeight()).data('height', this.$menu.outerHeight());
            },

            render: function() {
                this.$el.addClass('filter-button');
                this.full = false;
                this._render();

                this.$icon = $('<div id="tags_filter_toggle" data-menu="tags_filter" class="dropdown-button"><i class="fa fa-filter"></i></div>');
                this.$el.append(this.$icon);

                this.$icon.dropdown({
                    width: 440,
                    selectable: false
                });

                if (this._filter) {
                    this.$icon.addClass('active');
                } else {
                    this.$icon.removeClass('active');
                }
            },

            renderFull: function () {
                this.$el.removeClass('filter-button');
                this.full = true;
                this._render();

                this.$('.accordion').accordion();
            },

            _render: function () {
                if (this.$menu) {
                    this.$menu.remove();
                }
                if (this.$icon) {
                    this.$icon.remove();
                }

                this.$menu = $(_.template(TagFilterTemplate, this));

                this.$el.append(this.$menu);
                
                var left = false;
                this.$menu.find('.taglist .tag').each(function () {
                    //var size = Math.sqrt($(this).data('weight') / 3);
                    var weight = $(this).data('weight'),
                        size = ((weight / 10) * 0.7) + 0.63;
                    $(this).css('font-size', size + 'em');
                    if (size > 2.2) {
                        $(this).addClass(left ? 'left' : 'right');
                        left = !left;
                    }
                });

                this.tagInput = new TagInputView({
                    collection: window.router.tags,
                    refuseNew: true
                });
                this.$menu.find('.taginput').append(this.tagInput.$el);
                this.tagInput.render();

                this.$menu.on('click', '.taglist .tag', $.proxy(this.clickTag, this));

                this.listenTo(this.tagInput, 'tag.add', $.proxy(this.addSelected, this));
                this.listenTo(this.tagInput, 'tag.remove', $.proxy(this.removeSelected, this));
                
            }

        });
    });
