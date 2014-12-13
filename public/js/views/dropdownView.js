define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',

        'tmpl!templates/dropdownTemplate.html',
        'tmpl!templates/turnover.html',
        'tmpl!templates/turnover-dropdownAdd.html'
        ],
    function($, _, Backbone, moment, deny, DynamicTable, Dropdown, Turnover, TurnoverContents) {
        return Backbone.View.extend({
            events: {
                "click .dropdown-option": "selectOption"
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
                                console.log(model, "saved");
                                self.renderDropdown();
                                self.$(".dropdown-button").turnover("hide");
                                self.$("#" + self.idattr + "_" + model.id).click();
                            }
                        });
                    });
                } else if (options.data) {
                    this.data = options.data;
                }
            },
            render: function() {
                this.$el.html(Dropdown({
                    idattr: this.idattr,
                    idname: this.idname
                }));
                
                if (this._add) {
                    this.$(".dropdown-button").append(Turnover({
                        id: this.idattr + "_add",
                        content: TurnoverContents({
                            attr: this.attr,
                            id: this.idattr
                        })
                    }));
                    this.$(".dropdown-button").turnover({
                        trigger: "manual"
                    });

                    this.$(".dropdown-button .turnover").find(".btn").click($.proxy(this.addNew, this));
                }

                this.renderDropdown();
            },
            renderDropdown: function() {
                var self = this;
                this.$(".dropdown .dropdown-option:not(.new)").remove();
                
                if (this.collection) {
                    this.collection.each(function(model) {
                        var oOpt = self.$(".dropdown .dropdown-option").eq(-1).clone();
                        oOpt.removeClass("new");
                        oOpt.attr("id", self.idattr + "_" + model.id);
                        oOpt.data("model", model);
                        oOpt.html(model.get("Name")).attr("title", model.get("Description"));
                        self.$(".dropdown-option.new").before(oOpt);
                    });
                } else if (this.data) {
                    _.each(this.data, function (item) {
                        var oOpt = self.$(".dropdown .dropdown-option").eq(-1).clone();
                        oOpt.removeClass("new");
                        oOpt.attr("id", self.idattr + "_" + item.id);
                        if (item.data) {
                            oOpt.data(item.data);
                        }
                        oOpt.html(item.text).attr("title", item.description);
                        self.$(".dropdown-option.new").before(oOpt);
                    });
                }

                if (!this._new) {
                    this.$(".dropdown .dropdown-option").eq(-1).hide();
                }

                this.$(".dropdown").data("height", "").dropdown({
                    width: "auto"
                });
                this.$(".has-tooltip").tooltip({
                    direction: "left"
                });

                if (this.default !== undefined) {
                    this.$('.dropdown .dropdown-option').eq(this.default).click();
                }
            },
            selectOption: function(e) {
                var oOpt = $(e.currentTarget);
                if (oOpt.hasClass("new")) {
                    this.$(".dropdown-button").turnover("show");
                } else {
                    this.$(".dropdown-button .name").html(oOpt.html());
                    if (this.collection) {
                        var model = oOpt.data("model");
                        this.$(".dropdown-button").data("val", model);
                        this.trigger("change", model);
                    } else if (this.data) {
                        this.$(".dropdown-button").data("val", oOpt.data('val'));
                        this.trigger('change', oOpt.data());
                    }
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
