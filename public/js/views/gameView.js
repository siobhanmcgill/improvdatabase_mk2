define(['jquery',
        'underscore',
        'backbone',
        'moment',

        'deny',

        'text!templates/gameView.html',

        'views/dropdownView',
        'views/tagInputView',

        'models/game',
        'models/name',
        'models/note'
        ],
    function($, _, Backbone, moment, deny, GameViewTemplate, DropdownView, TagInputView, Game, Name, Note) {
        return Backbone.View.extend({
            events: {
                "click #saveItUp" : "doSave",
                
                "click .description .edit": "showEditDescription",
                "click #duration_dropdown .edit": "showDurationDropdown",
                "click #playerCount_dropdown .edit": "showPlayerCountDropdown",

                'click .altNameLink': 'showAltNames',
                'click .altNames .close': 'hideAltNames',
                
                'click .altNames .weightUp': 'addNameWeight',
                'click .altNames .weightDown': 'removeNameWeight',

                'click .altNames .addName': 'showAddName',
                'click .altNames .alternateNameSubmit': 'saveAlternateName',

                'keyup .altNames input': 'keyupName',
                
                'click .showNotes': 'toggleNoteList',

                'click .addNoteLink': 'showAddNote',
                'click .saveNote': 'saveNote'
            },
            initialize: function(options) {
                this.router = options.router;
                this.GameID = options.GameID;
            },
            setGame: function (data) {
                this.GameID = data.id;
                this.model = data;
            },
            render: function() {
                var gameName = this.model.Name();
                this.names = this.router.names.where({GameID: this.model.id});
                this.notes = this.router.notes.where({GameID: this.model.id});

                this.notes = this.notes.concat(
                    this.router.notes.where({ DurationID: this.model.get('DurationID') }),
                    this.router.notes.where({ PlayerCountID: this.model.get('PlayerCountID') })
                );
                _.each(this.router.tagGames.where({ GameID: this.model.id} ), $.proxy(function (tagGame) {
                    this.notes = this.notes.concat(this.router.notes.where({ TagID: tagGame.get('TagID') }));
                }, this));

                _.each(this.notes, $.proxy(function (note) {
                    note.time = moment(note.get('DateModified')).fromNow();
                    if (note.get('GameID')) {
                        note.regarding = 'this particular game.';
                    } else if (note.get('TagID')) {
                        note.regarding = 'the "' + this.router.tags.get(note.get('TagID')).get('Name') + '" tag.';
                    } else if (note.get('PlayerCountID')) {
                        note.regarding = 'the number of players in this game.';
                    } else if (note.get('DurationID')) {
                        note.regarding = 'the duration of this game.';
                    }
                }, this));
                var templateData = {
                        altNamesShow: this.names.length > 1,
                        altNames: this.names.reverse(),
                        nameCount: this.names.length - 1,
                        namePlural: this.names.length - 1 > 1,
                        mainName: gameName,
                        Description: this.model.get("Description"),
                        durationName: this.router.durations.get(this.model.get("DurationID")).get("Name"),
                        durationDescription: this.router.durations.get(this.model.get("DurationID")).get("Description"),
                        playerCountName: this.router.playerCounts.get(this.model.get("PlayerCountID")).get("Name"),
                        playerCountDescription: this.router.playerCounts.get(this.model.get("PlayerCountID")).get("Description"),
                        
                        hasNotes: this.notes.length > 0,
                        noteCount: this.notes.length,
                        notePlural: this.notes.length > 1,
                        notes: this.notes,

                        canAddNotes: this.router.hasPermission('note_public'),
                        canAddName: this.router.hasPermission('name_submit'),
                        canVoteName: this.router.hasPermission('name_vote'),
                        canEdit: this.router.hasPermission('game_edit')
                    };

                this.$el.addClass("content").html(_.template(GameViewTemplate, templateData)).show();

                this.$el.parent().find("#btnAddGame").show().addClass("active");

                this.tagInput = new TagInputView({
                    el: "#tags",
                    collection: this.router.tags,
                    GameID: this.GameID,
                    TagGameCollection: this.router.tagGames,
                    refuseAdd: !this.router.hasPermission('game_edit'),
                    refuseNew: !this.router.hasPermission('meta_create'),
                    refuseRemove: !this.router.hasPermission('game_edit')
                });
                this.tagInput.render();

                this.listenTo(this.tagInput, "resize", this.boxHeight);
                this.listenTo(this.tagInput, "tag.add tag.remove", this.boxHeight);
                /*

                */
                
                this.boxHeight();
                this.$(".has-tooltip").tooltip();

                this.noteDropdown = false;
                this.noteData = false;
            },

            showAltNames: function (e) {
                this.$('.altNameLink').hide();
                this.$('.altNames').show();
                this.boxHeight();
                if (this.names.length > 1) {
                    this.hideAddName(e);
                }

                e.stopPropagation();
                return false;
            },

            hideAltNames: function (e) {
                this.$('.altNameLink').show();
                this.$('.altNames').hide();
                this.boxHeight();
                e.stopPropagation();
            },
            
            addNameWeight: function (e) {
                if (!this.router.hasPermission('name_vote')) {
                    return false;
                }

                var NameID = $(e.currentTarget).parent().data('nameid'),
                    nameModel = this.router.names.get(NameID),
                    self = this;
                $(e.currentTarget).text('Wait...');
                this.listenToOnce(nameModel, 'sync', function () {
                    self.render();
                    setTimeout(function () {
                        self.$('.altNameLink').click();
                    }, 100);
                });
                nameModel.addWeight();
                e.stopPropagation();
                return false;
            },

            showAddName: function (e) {
                this.$('.addName').hide();
                this.$('input[name="alternateName"]').show();
                this.$('.alternateNameSubmit').show();
                e.stopPropagation();
                return false;
            },
            hideAddName: function (e) {
                this.$('.addName').show();
                this.$('input[name="alternateName"]').hide();
                this.$('.alternateNameSubmit').hide();
                e.stopPropagation();
                return false;
            },

            saveAlternateName: function (e) {
                var name = this.$('input[name="alternateName"]').val(),
                    self = this;
                if (!name) {
                    $.toast('You call this game <em>nothing</em>? I don\'t think so.');
                    return;
                }
                self.$('.alternateNameSubmit').text('Wait');
                var nameModel = new Name({
                    GameID: this.model.id,
                    Name: name,
                    Weight: 1
                });
                this.$('input[name="alternateName"]').val('');
                nameModel.save({}, {
                    success: function () {
                        self.router.names.add(nameModel);
                        self.render();
                        setTimeout(function () {
                            self.$('.altNameLink').click();
                        }, 100);
                    },
                    error: function (model, error) {
                        if (error.status === 401) {
                            self.render();
                            $.toast('You don\'t have permission to add names.');
                        } else {
                            console.log('error', error);
                        }
                    }
                });

                e.stopPropagation();
                return false;
            },

            keyupName: function (e) {
                if(e.keyCode === 13) {
                    this.saveAlternateName(e);
                }
            },

            toggleNoteList: function (e) {
                if (this.$('.notelist').is(':visible')) {
                    this.$('.notelist').hide();
                    this.$('.showNotes').text(this.$('.showNotes').data('text'));
                } else {
                    this.$('.notelist').show();
                    this.$('.showNotes').data('text', this.$('.showNotes').text()).text('Don\'t show notes');
                }
                this.boxHeight();

                e.stopPropagation();
                return false;
            },

            showAddNote: function (e) {
                if (this.$('.addNote').is(':visible')) {
                    this.$('.addNote').hide();
                    this.$('.addNote textarea').val('');
                    this.$('.addNoteLink').text('Add Note');
                } else {
                    this.$('.addNote').show();
                    this.$('.addNoteLink').text('Cancel Note');
                    
                    if (!this.noteDropdown) {
                        var dddata = [
                                {
                                    id: 'game_' + this.model.id,
                                    text: 'Game "' + this.model.Name() + '"',
                                    description: 'Game recognize game. That is, you have comments that apply to this game specifically.',
                                    data: {
                                        attr: 'GameID',
                                        val: this.model.id
                                    }
                                },
                                {
                                    id: 'duration_' + this.model.get('DurationID'),
                                    text: 'Duration "' + this.router.durations.get(this.model.get('DurationID')).get('Name') + '"',
                                    description: 'You have comments for this duration type, which will be shown for all games with this duration. Apparently somebody do got time for that.',
                                    data: {
                                        attr: 'DurationID',
                                        val: this.model.get('DurationID')
                                    }
                                },
                                {
                                    id: 'playercount_' + this.model.get('PlayerCountID'),
                                    text: 'Player Count "' + this.router.playerCounts.get(this.model.get('PlayerCountID')).get('Name') + '"',
                                    description: 'You don\'t hate the playah, but you do have some comments on them. This comment will be shown for all games with this many players.',
                                    data: {
                                        attr: 'PlayerCountID',
                                        val: this.model.get('PlayerCountID')
                                    }
                                }
                            ];
                        this.$('#tagOutput .tag:not(.hide)').each(function () {
                            var $t = $(this);
                            dddata.push({
                                id: 'tag_' + $t.data('tagid'),
                                text: 'Tag "' + $t.text() + '"',
                                description: 'This comment will show on every single game with this tag. Soapbox much?',
                                data: {
                                    attr: 'TagID',
                                    val: $t.data('tagid')
                                }
                            });
                        });

                        this.noteDropdown = new DropdownView({
                            data: dddata, // look out, Scooby, it's a d-d-d-data!
                            idattr: "noteDest",
                            attr: "For",
                            idname: 'Regarding',
                            default: 0,
                            add: false
                        });
                        this.$('.addNote').prepend(this.noteDropdown.$el.addClass('noteDropdown'));
                        this.listenTo(this.noteDropdown, 'change', this.noteDropdownChange);
                        this.noteDropdown.render();
                    }
                }
                this.boxHeight();

                e.stopPropagation();
                return false;
            },
            noteDropdownChange: function (data) {
                this.noteData = data;
            },
            saveNote: function (e) {
                var note = new Note(),
                    self = this,
                    noteData = {
                        Description: this.$('.addNote textarea').val(),
                        Public: 1
                    };
                noteData[this.noteData.attr] = this.noteData.val;
                note.save(noteData, {
                    success: function () {
                        self.router.notes.add(note);
                        self.render();
                        self.$('.showNotes').click();
                    }
                });
                e.stopPropagation();
                return false;
            },

            showEditDescription: function (e) {
                if ($(e.currentTarget).data('mode') === 'save') {
                    var desc = this.$('.description textarea').val();
                    this.$('.description textarea').hide();
                    this.$('.description p').html(desc).show();
                    this.model.set({"Description": desc});
                    this.model.save();
                    
                    $(e.currentTarget).text('Change').data('mode', '');
                } else {
                    var $p = this.$('.description p').hide(),
                        $box = this.$('.description textarea').show(),
                        h = $p.height(),
                        lh = $p.css('line-height').replace('px', ''),
                        rows = h / lh;
                    $box.attr('rows', Math.ceil(rows > 8 ? rows : 8));

                    $(e.currentTarget).text('Save').data('mode', 'save');
                }

                this.boxHeight();
                e.stopPropagation();
                return false;
            },

            showDurationDropdown: function(e) {
                this.durationDropdown = new DropdownView({
                    el: "#duration_dropdown",
                    collection: this.router.durations,
                    idattr: "duration",
                    idname: "Duration",
                    attr: "(Minutes)",
                    add: this.router.hasPermission('meta_create')
                });
                this.durationDropdown.render();
                this.boxHeight();

                this.listenToOnce(this.durationDropdown, "change", function(model) {
                    this.model.set({"DurationID": model.get("DurationID")});
                    this.model.save();
                    this.render();
                });

                if (e) {
                    e.stopPropagation();
                }
            },
            showPlayerCountDropdown: function(e) {
                this.playerCountDropdown = new DropdownView({
                    el: "#playerCount_dropdown",
                    collection: this.router.playerCounts,
                    idattr: "playerCount",
                    idname: "Player Count",
                    attr: "Players",
                    add: this.router.hasPermission('meta_create')
                });
                this.playerCountDropdown.render();
                this.boxHeight();

                this.listenToOnce(this.playerCountDropdown, "change", function(model) {
                    this.model.set({"PlayerCountID": model.get("PlayerCountID")});
                    this.model.save();
                    this.render();
                });

                if (e) {
                    e.stopPropagation();
                }
            },

            hide: function() {
                var self = this;
                if (this.router.device === 'mobile') {
                    this.$el.parent().removeClass('scrollContent');
                    this.trigger("hide-game");
                    setTimeout(function () {
                        self.destroy();
                    }, 500);
                } else {
                    this.$el.parent().removeAttr("style").css("overflow", "hidden").removeClass('scrollContent');
                    this.$el.parent().find("#btnAddGame").removeClass("active");

                    this.hideTimer = setTimeout(function() {
                        self.$el.parent().removeClass("open");
                        self.destroy();
                        self.trigger("hide-game");
                    }, 500);
                }
            },
            destroy: function () {
                this.undelegateEvents();
                this.$el.removeData().unbind();
                this.remove();
                clearTimeout(this.hideTimer);
                clearTimeout(this.openTimer);
            },

            titleSize: function (count) {
                count = count || 1;

                var h5width;

                if (this.router.device === 'mobile') {
                    h5width = this.$el.parent().width() - this.$el.parent().children('.close').outerWidth() - 20;
                } else {
                    h5width = this.$el.parent().width() - this.$el.parent().find('#btnAddGame').outerWidth() - 20;
                }

                this.$el.children('h5').css('width', (h5width) + 'px');

                if (count > 50) {
                    return false;
                } else if (this.$el.children('h5').offset().top > 2 || this.$el.children('h5').height() > 41) {
                    this.$el.children('h5').css({
                        'font-size': (27 - (count * 2)) + 'px',
                        'line-height': '40px'
                    });
                    
                    // if this is two lines, the line heights should be smaller
                    if (this.$el.children('h5').height() > 41) {
                        this.$el.children('h5').css({
                            'line-height': (27 - (count * 2)) + 'px'
                        });
                    }

                    this.titleSize(count + 1);
                } else {
                    return;
                }
            },

            boxHeight: function() { //Bruce Boxheigtner
                // fit the title into the space
                this.titleSize();

                if (this.router.device === 'mobile') {
                    this.$el.parent().addClass('scrollContent');
                    this.trigger("show-game");
                } else {
                    var self = this;
                    this.$el.parent().removeClass('scrollContent');
                    var h = this.$el.outerHeight();
                    if (h > $(window).height()) {
                        h = $(window).height();
                    }
                    this.$el.parent().css("overflow", "hidden");
                    setTimeout(function() {
                        self.trigger("show-game");
                        self.$el.parent().css("height", h);
                    }, 10);

                    var time;
                    if (this.$el.closest('#main').hasClass('showGame')) {
                        time = 500;
                    } else {
                        time = 1000;
                    }
                    this.openTimer = setTimeout(function() {
                        self.$el.parent().addClass("open").addClass('scrollContent');
                        self.trigger('shown-game');
                    }, time);
                }
            },

            clearForm: function() {
                this.$("input[name=Name]").val("");
                this.$("textarea").val("");
                this.$("#tagOutput").empty();
                this.boxHeight();
            },
            doSave: function() {
                var tags = [];
                var self = this;
                this.$(".tag").each(function() {
                    if ($(this).text()) {
                        tags.push(self.router.tags.findWhere({"Name": $(this).text()}).get("TagID"));
                    }
                });
                var data = {
                    Name: this.$("input[name=Name]").val(),
                    //Description: this.$("textarea").val(),
                    DurationID: this.$("#duration_toggle").data("val").get("DurationID"),
                    PlayerCountID: this.$("#playerCount_toggle").data("val").get("PlayerCountID"),
                    Tags: tags
                };
                this.$("#saveItUp").addClass("wait");
                var newModel = new Game();
                newModel.save(data, {
                    success: function(model, response) {
                        var newName = new Name({
                            "NameID": response.NameID,
                            "GameID": response.GameID,
                            "Name": model.get("Name")
                        });
                        _.each(tags, function(tag) {
                            self.router.tagGames.add({TagID: tag, GameID: response.GameID});
                        });
                        self.router.names.add(newName);
                        self.router.games.add(model);
                        
                        self.$("#saveItUp").removeClass("wait");
                        $.toast("<em>" + model.get("Name") + "</em> added.");

                        self.clearForm();
                    }, 
                    error: function() {

                    }
                });
            }
        });
    });
