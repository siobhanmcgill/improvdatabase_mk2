define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/dropdownTemplate.html',
        'text!templates/turnover.html',
        'text!templates/turnover-dropdownAdd.html'
        ],
    function($, _, Backbone, moment, deny, Dropdown, Turnover, TurnoverContents) {
        return Backbone.View.extend({
            events: {
            },
            initialize: function(options) {
                var self = this;

                options = _.extend({ add: true }, options);

                this.idattr = options.idattr;
                this.idname = options.idname;
                this.attr = options.attr;
                this.model = options.model;
                this._add = options.add;
                this.default = options.default;

                if (options.collection) {
                    this.collection = options.collection;
                    this.listenTo(this.collection, "add", function(model) {
                        model.save({}, {
                            success: function(model) {
                                self._renderModelOption(model);
                                self.$dropdown.data('height', '');
                                self.$(".dropdown-button").turnover("hide");
                                self.$dropdown.find("#" + self.idattr + "_" + model.id).click();
                            }
                        });
                    });
                } else if (options.data) {
                    this.data = options.data;
                }
            },
            render: function() {
                this.$el.html(_.template(Dropdown, {
                        idattr: this.idattr,
                        idname: this.idname
                    })
                );
                
                if (this._add) {
                    this.$(".dropdown-button").append(_.template(Turnover, {
                            id: this.idattr + "_add",
                            content: _.template(TurnoverContents, {
                                attr: this.attr,
                                id: this.idattr
                            })
                        })
                    );
                    this.$(".dropdown-button").turnover({
                        trigger: "manual"
                    });

                    this.$(".dropdown-button .turnover").find(".btn").click($.proxy(this.addNew, this));
                }

                this.renderDropdown();
            },
            _renderModelOption: function (model) {
                var oOpt = this.$dropdown.find(".dropdown-option").eq(-1).clone();
                oOpt.removeClass("new");
                oOpt.attr("id", this.idattr + "_" + model.id);
                oOpt.data({
                    "model": model,
                    "new": false
                });
                oOpt.html(model.get("Name")).attr("title", model.get("Description"));
                this.$dropdown.find(".dropdown-option.new").before(oOpt);
            },
            renderDropdown: function() {
                var self = this;
                this.$dropdown = this.$('.dropdown');
                this.$(".dropdown .dropdown-option:not(.new)").remove();
                
                if (this.collection) {
                    this.collection.each($.proxy(this._renderModelOption, this));
                } else if (this.data) {
                    _.each(this.data, function (item) {
                        var oOpt = self.$(".dropdown .dropdown-option").eq(-1).clone();
                        oOpt.removeClass("new").data('new', false);
                        oOpt.attr("id", self.idattr + "_" + item.id);
                        if (item.data) {
                            oOpt.data(item.data);
                        }
                        oOpt.html(item.text).attr("title", item.description);
                        self.$(".dropdown-option.new").before(oOpt);
                    });
                }

                if (!this._add) {
                    this.$(".dropdown .dropdown-option").eq(-1).hide();
                } else {
                    this.$(".dropdown .dropdown-option").eq(-1).data('new', true);
                }

                this.$(".dropdown").data("height", "").dropdown({
                    width: "auto"
                }).on('change.dropdown', $.proxy(this.selectOption, this));

                this.$(".has-tooltip").tooltip({
                    direction: "left"
                });

                if (this.default !== undefined) {
                    this.$('.dropdown .dropdown-option').eq(this.default).click();
                }
            },
            selectOption: function(e, data) {
                if (data.new) {
                    // the "new" option was selected
                    this.$(".dropdown-button").turnover("show");
                    e.stopPropagation();
                } else {
                    // an item was selected
                    this.$(".dropdown-button").turnover("hide");
                    this.trigger('change', data);
                }
            },
            addNew: function(e) {
                var form = $(e.currentTarget).closest("form");
                var data = {};
                data.Name = form.find("[name=Name]").val();
                data.Description = form.find("[name=Description]").val();
                data.Min = form.find("[name=Min]").val();
                data.Max = form.find("[name=Max]").val();
                data.Description = form.find("[name=Description]").val();

                this.collection.add(data);
            }
        });
    });
