define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',
        'dynamictable',
        'autocomplete',

        'text!templates/tagInput.html',

        'models/tag'
        ],
    function($, _, Backbone, moment, deny, DynamicTable, AutoComplete, tagInputTemplate, Tag) {
        return Backbone.View.extend({
            events: {
                "click .tag": "removeTag",
                "autoComplete.selection input": "addTag",
                "click #addTagLink": "showAddTag"
            },
            initialize: function(options) {
                this.GameID = options.GameID;
                this.TagGameCollection = options.TagGameCollection;
                this.refuseNew = options.refuseNew;
                this.refuseAdd = options.refuseAdd;
            },
            render: function() {
                var self = this;

                this.$el.html(_.template(tagInputTemplate, { refuseAdd: this.refuseAdd }));

                if (this.GameID) {
                    _.each(this.TagGameCollection.where({GameID: this.GameID}), function(tagGame) {
                        var tag = self.collection.findWhere({TagID: tagGame.get("TagID")});
                        self.addTag(null, tag.get("Name"), tag);
                    });
                    this.$("label").hide();
                    this.$("a").removeClass("hide");
                    this.$("input").addClass("hide");
                } else {
                    this.showAddTag();
                }
            },
            showAddTag: function(e) {
                this.$("a").addClass("hide");
                this.$("input").removeClass("hide");
                Backbone.trigger("resize");

                this.$("input").autocomplete({
                    data: this.collection,
                    property: "Name",
                    idProperty: "TagID",
                    menuClass: "shadow3",
                    menuWidth: this.$("input").outerWidth()
                });

                if (e) {
                    this.$("input").focus();
                }

                if (e) {
                    e.stopPropagation();
                    return false;
                }
            },
            removeTag: function(e) {
                var tagid = $(e.currentTarget).data("tagid");
                $(e.currentTarget).remove();
                this.trigger("tag.remove", tagid);

                if (this.GameID) {
                    this.TagGameCollection.removeTagFromGame(tagid, this.GameID);
                }

                e.stopPropagation();
                return false;
            },
            addTag: function(e, name, model) {
                if (this.refuseNew && !model) {
                    $.toast('You do not have permission to create tags.');
                    return false;
                }
                var $tag = this.$("#tagTemplate").clone();

                if (name) {
                    $tag.html(name).attr("id", "").removeClass("hide");
                    this.$(".tags .tag").eq(-1).after($tag);
                    this.$("input").val("");

                    if (this.TagGameCollection.length > 0) {
                        this.$('#tagOutput').show();
                    }

                    if (!model) {
                        this.trigger("tag.add", name);
                        var newTag = new Tag();
                        var self = this;
                        var tagData = {Name: name};
                        if (this.GameID) {
                            tagData.GameID = this.GameID;
                        }
                        newTag.save({Name: name}, {
                            success: function(model, response) {
                                Backbone.trigger("tag-add", model);
                                $tag.data("tagid", model.get("TagID"));
                                if (self.TagGameCollection) {
                                    self.TagGameCollection.addTagToGame(model.get("TagID"), self.GameID, response.TagGameID);
                                }
                            }, 
                            error: function() {

                            }
                        });
                    } else {
                        this.trigger("tag.add", name, model.get('TagID'));
                        $tag.data("tagid", model.get("TagID"));

                        if (e && this.GameID) {
                            this.TagGameCollection.addTagToGame(model.get("TagID"), this.GameID);
                        }
                    }
                }
            }
        });
    });
