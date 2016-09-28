define(['backbone', 'jquery', 'underscore', 'models/game',
        'collections/durationCollection',
        'collections/nameCollection',
        'collections/playerCountCollection',
        'collections/tagCollection',
        'collections/tagGameCollection',
        'collections/noteCollection'],
    function(Backbone, $, _, Game,
        DurationCollection,
        NameCollection,
        PlayerCountCollection,
        TagCollection,
        TagGameCollection,
        NoteCollection) {

        return Backbone.Collection.extend({
            url: '/api/game',
            parse: function(response) {
                return response;
            },
            initialize: function() {

                this.durations = new DurationCollection();
                this.names = new NameCollection();
                this.playerCounts = new PlayerCountCollection();
                this.tags = new TagCollection();
                this.tagGames = new TagGameCollection();
                
                // TODO: load notes on demand
                this.notes = new NoteCollection();

                this._fetched = false;
                /*
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
                */
            },
            /*
            comparator: function(a,b) {
                if (this.names) {
                    var a_name = this.names.findWhere({"GameID": a.id}).get("Name");
                    var b_name = this.names.findWhere({"GameID": b.id}).get("Name");
                    return a_name.localeCompare(b_name);
                } else {
                    return 1;
                }
            },
            */
            model: Game,
            friendlyName: "Game",

            fetch: function (options) {
                options = _.extend({parse: true}, options);
                var success = options.success;
                var self = this;

                options.success = function(resp) {
                    var method = options.reset ? 'reset' : 'set';
                    self._fetched = true;
                    self[method](resp, options);
                    self.trigger('sync', self, resp, options);
                };
                
                return $.when(
                    this.durations.fetch(),
                    this.names.fetch(),
                    this.playerCounts.fetch(),
                    this.tags.fetch(),
                    this.tagGames.fetch(),
                    this.sync('read', this, options)
                    ).done(function () {
                        // TODO: load notes on demand
                        self.notes.fetch();
                        if (success) {
                            success.call(options.context, self, options);
                        }
                    });
            },

            //for the dynamic table
            getPage: function(options, callback) {
                var self = this;
                if (this._fetched) {
                    callback(self._data(options));
                } else {
                    this.fetch({
                        success: function () {
                            setTimeout(function () {
                                callback(self._data(options));
                            }, 500);
                        }
                    });
                }
            },

            _data: function (options) {
                var self = this,
                    filter = options.filter,
                    tagFilter,
                    data,
                    returnObject = {};
                
                // first filter the data
                if (filter && _.keys(filter).length) {
                    // filter tags later, because it might be more difficult
                    tagFilter = filter.tags;
                    filter = _.omit(filter, 'tags');
                    data = this.filter(function (game) {
                        var include = true;
                        _.find(_.pairs(filter), function (pair) {
                            var key = pair[0],
                                value = pair[1],
                                prop = game.get(key);
                            if (value && value.length) {
                                if (prop) {
                                    if (typeof(prop) === 'object') {
                                        if (prop.length) {
                                            if (!_.intersection(value, prop).length) {
                                                include = false;
                                            }
                                        }
                                    } else if (value.indexOf(prop) === -1) {
                                        include = false;
                                    }
                                }
                            }
                            return include; // this will stop looping through the filters as soon as it fails
                        });
                        return include;
                    });
                    if (tagFilter) {
                        data = _.filter(data, function (game) {
                            var taglist = _.map(self.tagGames.where({"GameID": game.id}), function (item) {
                                return item.get('TagID');
                            });
                            return _.intersection(tagFilter, taglist).length === tagFilter.length;
                        });
                    }
                } else {
                    data = this.models;
                }

                // then split it into pages
                returnObject.total = data.length;

                var start = options.start,
                    end = options.end === 0 ? data.length : options.end;
                
                //loop!
                if (start >= data.length) {
                    start = 0;
                    end = start + end;
                }
                
                if (options.pageSize === 0) {
                    data = data.slice(0);
                } else if (end === -1 && options.pageSize === "auto") {
                    data = data.slice(start);
                } else {
                    data = data.slice(start, end);
                }
                returnObject.data = data;

                return returnObject;
            }
        
        /*
        getFilteredData: function () {
            this.sort();
            var data = this.data.models;
            $.each(this._filter, function (f, a) {
                var subdata = [];
                if (a && a.length) {
                    console.log('filtering', f, 'by', a);
                    _.each(data, function (item) {
                        var b = item.get(f),
                            pass = false;
                        if (b) {
                            if (typeof(b) === 'object') {
                                if (b.length) { // b is an array
                                    if (_.intersection(a, b).length) {
                                        pass = true;
                                    }
                                }
                            } else if (a.indexOf(b) > -1) {
                                pass = true;
                            }
                        }
                        if (pass) {
                            subdata.push(item);
                        }
                    });
                } else {
                    subdata = [].concat(data);
                }
                data = subdata;
            });
            return data;
        },
        getDataPage: function(data) {
            if (this.options.pageSize === 0) {
                this._pageCount = 1;
            } else if (this.options.pageSize !== "auto") {
                this._pageCount = Math.ceil(data.length / this.options.pageSize);
            }
            if (this.options.pageSize === 0) {
                return data.slice(0);
            } else if (this._end === -1 && this.options.pageSize === "auto") {
                return data.slice(this._start);
            } else {
                return data.slice(this._start, this._end);
            }
        },
        */
        });
    });
