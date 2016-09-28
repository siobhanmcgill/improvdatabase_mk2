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
                    this.tagInput.addTag(null, tag, this.collection.tags.get(id));
                } else {
                    //remove it
                    var $output = this.full ? this.$('.accordion-toggle .filter-output') : this.$menu.find('.taginput');
                    $output.find('.tag:contains("' + tag + '")').click();
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
                this.$menu.find('.tag[data-id="' + id + '"]').addClass('active');
            },
            removeSelected: function (id) {
                if (this.selected.indexOf(id) > -1) {
                    this.selected = _.without(this.selected, id);
                }
                this.resize();
                this.trigger('filter', 'tags', this.selected);
                this.$menu.find('.tag[data-id="' + id + '"]').removeClass('active');
            },

            resize: function () {
                if (!this.full) {
                    this.$menu.css('height', 'auto').css('height', this.$menu.outerHeight()).data('height', this.$menu.outerHeight());
                }
            },

            setFilter: function (filter) {
                this.selected = filter || [];
            },
            clearFilter: function () {
                this.selected = [];
                // deactivate all tags in the list
                this.$menu.find('.tag').removeClass('active');
                // remove tags from the output
                var $output = this.full ? this.$('.accordion-toggle .filter-output') : this.$menu.find('.taginput');
                $output.find('.tag').remove();
            },

            render: function() {
                this.$el.addClass('filter-button');
                this.full = false;
                this._render();

                this.$icon = $('<div id="tags_filter_toggle" data-menu="tags_filter" class="dropdown-button"><i class="fa fa-filter"></i></div>');
                if (this.selected && this.selected.length) {
                    this.$icon.addClass('active');
                } else {
                    this.$icon.removeClass('active');
                }
                if (this.$menu && this.$menu.hasClass('showing')) {
                    this.$icon.addClass('dropdown-active');
                }
                this.$el.append(this.$icon);

                this.$icon.dropdown({
                    width: 440,
                    selectable: false
                });
            },

            renderFull: function () {
                if (this.$menu && this.$menu.hasClass('showing')) {
                    var $oldMenu = this.$menu;
                    this.$menu = false;
                    $oldMenu.on('hidden.dropdown', function () {
                        $oldMenu.remove();
                    });
                }

                this.$el.removeClass('filter-button');
                this.full = true;
                this._render();

                this.$('.accordion').accordion();
            },

            _render: function () {
                if (this.$menu && !this.$menu.hasClass('showing')) {
                    this.$menu.remove();
                    this.$menu = false;
                }
                if (this.$icon) {
                    this.$icon.remove();
                }

                if (!this.$menu) {
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
                        collection: this.collection.tags,
                        refuseNew: true,
                        output: this.full ? this.$('.accordion-toggle .filter-output') : false
                    });
                    this.$menu.find('.taginput').append(this.tagInput.$el);
                    this.tagInput.render();

                    if (this.selected && this.selected.length) {
                        _.each(this.selected, $.proxy(function (id) {
                            var tag = this.$('.taglist [data-id="' + id + '"]').addClass('active').text();
                            this.tagInput.addTag(null, tag, this.collection.tags.get(id));
                        }, this));
                    }

                    this.$menu.on('click', '.taglist .tag', $.proxy(this.clickTag, this));

                    this.listenTo(this.tagInput, 'tag.add', $.proxy(this.addSelected, this));
                    this.listenTo(this.tagInput, 'tag.remove', $.proxy(this.removeSelected, this));
                }
                
            }

        });
    });
