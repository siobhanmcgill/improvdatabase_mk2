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

                this.idattr = options.idattr;
                this.idname = options.idname;
                this.attr = options.attr;
                this.model = options.model;
    
                this.listenTo(this.collection, "add", function(model) {
                    model.save({}, {
                        success: function(model, response, options) {
                            console.log(model, "saved");
                            self.renderDropdown();
                            self.$(".dropdown-button").turnover("hide");
                            self.$("#" + self.idattr + "_" + model.id).click();
                        }, 
                        error: function(model, xhr, options) {

                        }
                    });
                });
            },
            render: function() {
                var self = this;
                
                this.$el.html(Dropdown({
                    idattr: this.idattr,
                    idname: this.idname
                }));
                
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

                this.renderDropdown();
            },
            renderDropdown: function() {
                var self = this;
                this.$(".dropdown .dropdown-option:not(.new)").remove();

                this.collection.each(function(model) {
                    var oOpt = self.$(".dropdown .dropdown-option").eq(-1).clone();
                    oOpt.removeClass("new");
                    oOpt.attr("id", self.idattr + "_" + model.id);
                    oOpt.data("model", model);
                    oOpt.html(model.get("Name")).attr("title", model.get("Description"));
                    self.$(".dropdown-option.new").before(oOpt);
                });

                this.$(".dropdown").data("height", "").dropdown({
                    width: "auto"
                });
                this.$(".has-tooltip").tooltip({
                    direction: "left"
                });
            },
            selectOption: function(e) {
                var oOpt = $(e.currentTarget);
                if (oOpt.hasClass("new")) {
                    this.$(".dropdown-button").turnover("show");
                } else {
                    var model = oOpt.data("model");
                    this.$(".dropdown-button").data("val", model);
                    this.$(".dropdown-button .name").html(oOpt.html());
                    this.trigger("change", model);
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
