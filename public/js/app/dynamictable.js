define(['jquery', 'backbone'],
    function($, Backbone) {

    var DynamicTable = function(element, options) {
        this.$container = $(element).addClass("dt-table-container");
        this.options = $.extend(true, {}, $.fn.dynamictable.defaults, options);

        if (this.options.pageindicator) {
            this.$pageindicator = this.options.pageindicator;
        } else {
            //TODO: create paging stuff if they aren't provided
            this.$pageindicator = $("<div class='dt-pageindicator'></div>");
        }

        if (this.options.nextpagebutton) {
            this.$nextbutton = this.options.nextpagebutton;
        } else {
            this.$nextbutton = $("<div></div>");
        }
        if (this.options.prevpagebutton) {
            this.$prevbutton = this.options.prevpagebutton;
        } else {
            this.$prevbutton = $("<div></div>");
        }

        if (this.options.pagesizemenu) {
            this.$pagesizemenu = this.options.pagesizemenu;
        } else {
            this.$pagesizemenu = $("<div></div>");
        }

        this.data = this.options.data;
        if (this.data instanceof Backbone.Collection) {
            this.options.dataType = "backbone";
        } 

        this.columns = this.options.columns;
        //figure out where the columns are defined, if they aren't in the init options
        if (this.columns.length === 0) {
            if (this.data.columns) { //your submitted data can have an array or function called columns
                this.columns = typeof(this.data.columns) === "function" ? this.data.columns() : this.data.columns;
            } else { //if you're using backbone, you don't have to specify columns and it will just show all of the attributes
                var use = this.options.dataType === "backbone" ? this.data.at(0).attributes : this.data[0];
                this.columns = [];
                for (var prop in use) {
                    if (prop.indexOf("_") === -1) {
                        this.columns.push(prop);
                    }
                }
            }
        }

        this._page = 0;
        this._start = 0;
        this._end = 0;
        this._pageCount = 0;
        this._sortBy = null;
        this._sortDir = "asc";

        this._sizes = [];

        this.render();
        
        $(window).resize($.proxy(this.heights, this));

        this.$pagesizemenu.on("change", $.proxy(this.pageSize, this));
        this.$nextbutton.click($.proxy(this.next, this));
        this.$prevbutton.click($.proxy(this.prev, this));

        this.$container.on("mouseover", ".dt-row", this.mouseoverRow);
        this.$container.on("mouseout", ".dt-row", this.mouseoutRow);
        this.$container.on("click", ".dt-table-head .sortable", $.proxy(this._clickSort, this));

        this._disablePrev();
    };

    DynamicTable.prototype = {
        constructor: DynamicTable,

        render: function() {
            var timer = (new Date()).getTime();

            this.$container.empty();

            this.$head = $("<div class='dt-table-head'><div class='dt-table-head-shadow'></div></div>");
            this.$table = this._tableBody();

            this.$container.append(this.$head);
            this.$container.append(this.$table);

            this.renderTableHeader();
            this.next();
        },
        reload: function() {
            console.log("Reloading Table", this.options.pageSize, this.data);
            var scroll = this.$table.scrollTop();

            //this._sizes = [];
            this._page = this.options.pageSize === 0 ? 0 : this._page - 1;
            this._end = this._start;
            this.refresh = true;
            this.render();

            this.$table.scrollTop(scroll);
        },
        _disablePrev: function() {
            this.options.prevpagebutton.addClass("disabled");
        },
        _enablePrev: function() {
            this.options.prevpagebutton.removeClass("disabled");
        },
        pageSize: function(e) {
            if ($(e.currentTarget).data("value") !== undefined) {
                this.options.pageSize = $(e.currentTarget).data("value");
                this.reload();
            }
        },
        prev: function(e, raw) {
            if (this._page > 1) {
                this._page--;
                this._end = this._start;
                this._start = this.options.pageSize === "auto" ? 0 : this._start - this.options.pageSize;

                var data = this.getDataArray();

                this._reverse = true;
                this.renderTableBody(data);
                this.resize();
                
                if (this._page > 1) {
                    this._enablePrev();
                } else {
                    this._disablePrev();
                }
                this.renderPageIndicator();
                
                if (raw) {
                    return data;
                } else {
                    this.resize();
                    if (typeof this.options.onRender === "function") {
                        this.options.onRender(this.$table, data);
                    }
                }
            }
        },
        next: function(e, raw) { //TODO: is raw necessary?
            this._page++;
            this._start = this._end;
            this._end = this.options.pageSize === "auto" || this.options.pageSize === 0 ? this.data.length : this._start + this.options.pageSize;

            //loop!
            if (this._start >= this.data.length) {
                this._page = 1;
                this._start = 0;
                this._end = this.options.pageSize === "auto" || this.options.pageSize === 0 ? this.data.length : this.options.pageSize;
            }
            
            var data = this.getDataArray();

            this._reverse = false;
            this.renderTableBody(data);
            this.resize();

            if (this._page > 1) {
                this._enablePrev();
            } else {
                this._disablePrev();
            }
            this.renderPageIndicator();
            
            if (raw) {
                return data;
            } else {
                this.resize();
                if (typeof this.options.onRender === "function") {
                    this.options.onRender(this.$table, data);
                }
            }
        },
        renderPageIndicator: function() {
            //this.$pageindicator.text(this._page + "/" + this._pageCount);
            var x = this._start / this.data.length;
            var w = 1 - (this._start + this.$rows.length) / this.data.length;
            this.$pageindicator.find("div").css({
                left: (x * 100) + "%",
                right: (w * 100) + "%"
            });
        },

        mouseoverRow: function(e) {
            $(e.currentTarget).addClass("dt-hover");
        },
        mouseoutRow: function(e) {
            $(e.currentTarget).removeClass("dt-hover");
        },

        _clickSort: function(e) {
            var data = $(e.currentTarget).data("column");
            var newsort = data.sortProperty ? data.sortProperty : data.property;
            if (newsort === this._sortBy) {
                this._sortDir = this._sortDir === "asc" ? "desc" : "asc";
            } else {
                this._sortDir = "asc";
            }
            this._sortBy = newsort;
            this.reload();
        },
        sort: function(callback) {
            var prop = this._sortBy,
                dir = this._sortDir,
                self = this;
            console.log("Table sortBy:", prop);

            this.$head.find(".dt-cell").removeClass("sorted asc desc");
            this._forEach(this.columns, function(column, index) {
                if (column === prop || column.property === prop || column.sortProperty === prop) {
                    setTimeout(function() {
                        self.$head.find(".dt-row > .dt-cell").eq(index).addClass("sorted " + dir);
                    }, 100);
                    return false;
                }
            });

            var comparator = function(a,b) { //make a comparator function, because Backbone is too dumb to sort properly
                var aval, bval;
                if (a[prop]) {
                    aval = typeof(a[prop]) === "function" ? a[prop]() : a[prop];
                } else if (a.get(prop)) {
                    aval = a.get(prop);
                }
                if (b[prop]) {
                    bval = typeof(b[prop]) === "function" ? b[prop]() : b[prop];
                } else if (b.get(prop)) {
                    bval = b.get(prop);
                }
                if (dir === "asc") {
                    return typeof(aval) === "string" ? aval.localeCompare(bval) : aval - bval;
                } else {
                    return typeof(bval) === "string" ? bval.localeCompare(aval) : bval - aval;
                }
            };

            if (this.options.dataType === "backbone") {
                this.data.comparator = comparator;
                this.data.sort();
                if (callback) {
                    callback();
                }
            }
        },

        getDataArray: function() {
            var data;
            this.sort();
            if (this.options.pageSize === 0) {
                this._pageCount = 1;
            } else if (this.options.pageSize !== "auto") {
                this._pageCount = Math.ceil(this.data.length / this.options.pageSize);
            }
            if (this.options.pageSize === 0) {
                return this.data.slice(0);
            } else if (this._end === -1 && this.options.pageSize === "auto") {
                return this.data.slice(this._start);
            } else {
                return this.data.slice(this._start, this._end);
            }
        },

        _createRow: function() {
            return $("<div class='dt-row'></div>");
        },
        _createCell: function() {
            return $("<div class='dt-cell'></div>");
        },

        _forEach: function(array, fn, reverse) {
            var cellCount = reverse ? array.length - 1 : 0,
                max = reverse ? -1 : array.length,
                res;
            if (reverse) {
                while (cellCount > max) {
                    res = fn(array[cellCount], cellCount);
                    if (res === false) {
                        break;
                    }
                    cellCount--;
                }
            } else {
                while (cellCount < max) {
                    res = fn(array[cellCount], cellCount);
                    if (res === false) {
                        break;
                    }
                    cellCount++;
                }
            }
        },

        renderTableHeader: function() {
            var tr = this._createRow(),
                self = this;
            this._forEach(this.columns, function(column) {
                var th = self._createCell();
                th.addClass("dt-header");
                if (typeof column === 'string') {
                    column = {property: column, sortable: true};
                }
                
                if (column.className) {
                    th.addClass(column.className);
                } else {
                    th.addClass(column.property.toLowerCase());
                }
                if (column.sortable !== false) {
                    th.addClass("sortable");
                }
                if (column.defaultSort) {
                    this._sortBy = column.property;
                }
                th.html(column.header ? column.header : column.property).data("column", column);
                tr.append(th);
            });
            if (!this._sortBy) {
                this._sortBy = this.columns[0].property ? this.columns[0].property : this.columns[0];
            }
            this.$head.append(tr);
        },

        _tableBody: function() {
            var obj = $("<div class='dt-table intoggle'></div>");
            obj.scroll($.proxy(this.scroll, this));
            return obj;
        },
        renderTableBody: function(data) {
            this.$rows = [];
            var self = this,
                $oldTable = this.$table.removeClass("intoggle outtoggle right anim"),
                reverse = this._reverse;
            
            this.$table = this._tableBody();
            if (reverse) {
                this.$table.addClass("right");
                $oldTable.addClass("right");
            }
            this.$container.append(this.$table);

            this._forEach(data, function(row, ri) {
                var tr = self._createRow();

                self._forEach(self.columns, function(column) {
                    var td = self._createCell(),
                        text,
                        className,
                        colObj;

                    if (typeof(column) === "string") {
                        colObj = {property: column};
                    } else {
                        colObj = column;
                    }
                    
                    if (typeof(colObj.property) === "function") {
                        text = colObj.property(row, data);
                    } else {
                        if (row[colObj.property]) {
                            text = typeof(row[colObj.property]) === "function" ? row[colObj.property](row, data) : row[colObj.property];
                        } else if (row.get) { //it's a backbone model and we're getting an attribute
                            text = row.get(colObj.property);
                        } else { //umm . . .
                            console.log("Couldn't find " + colObj.property + " on row " + ri);
                        }
                        className = colObj.property.toLowerCase();
                    }

                    if (colObj.className) {
                        className = colObj.className;
                    }

                    //try to parse some common data types
                    if (Date.parse(text) && String(text).length > 10) {
                        var date = new Date(text),
                            h = date.getHours(),
                            ampm = "AM",
                            m = date.getMinutes();

                        text = (date.getMonth() + 1) + "/" + (date.getDate()) + "/" + date.getFullYear();
                        
                        if (h > 0 || m > 0) {
                            if (h >= 12) {
                                ampm = "PM";
                            }
                            if (h === 0) {
                                h = 12;
                            } else if (h > 12) {
                                h -= 12;
                            }
                            if (m < 10) {
                                m = "0" + m;
                            }
                            text += " at " + h + ":" + m + " " + ampm;
                        }
                    }

                    td.append(text).addClass(className);
                    tr.append(td);
                });
                if (row.id) {
                    tr.attr("id", row.id);
                }
                tr.data("data", row);
                if (reverse) {
                    self.$table.prepend(tr);
                } else {
                    self.$table.append(tr);
                }
                
                if (self.options.paginate && self.options.pageSize === "auto" && self.getHeight() > self.getContainerHeight()) {
                    tr.remove();
                    self._autoPageCount();
                    return false;
                }

                if (reverse) {
                    self.$rows.unshift(tr);
                } else {
                    self.$rows.push(tr);
                }
            }, reverse);
            if (this.refresh) {
                $oldTable.remove();
                this.$table.removeClass("intoggle");
                this.refresh = false;
            } else {
                $oldTable.addClass("outtoggle anim");
                setTimeout(function() {
                    self.$table.addClass("anim");
                }, 250);
                setTimeout(function() {
                    $oldTable.remove();
                }, 500);
            }
        },
        _autoPageCount: function() {
            //try to figure out the page count
            var self = this;
            self._pageCount = Math.ceil(self.data.length / self.$rows.length);
            self.renderPageIndicator();
            if (self._reverse) {
                self._start = self._end - self.$rows.length;
            } else {
                self._end = self._start + self.$rows.length;
            }
        },
        resize: function() {
            var self = this,
                maxWidth = this.$container.width(),
                totalSize = 0;
            
            if (this._sizes.length === 0) {
                this._forEach(this.columns, function(column, ci) {
                    //find the widest cell in this column
                    var size = self.$head.find(".dt-cell").eq(ci).css({
                            width: "auto"
                        }).outerWidth();
                    self._forEach(self.$rows, function(row, ri) {
                        var $cell = row.find(".dt-cell").eq(ci);
                        $cell.css({
                            width: "auto"
                        });
                        
                        if ($cell.outerWidth() > size) {
                            size = $cell.outerWidth();
                        }
                    });
                    
                    var perc = Math.ceil((size / maxWidth) * 100);
                    if (perc > self.options.maxWidth) {
                        self._sizes.push(self.options.maxWidth);
                    } else {
                        self._sizes.push(perc);
                    }
                    totalSize += (perc);
                });
                //make sure all of the column widths add up to 100
                var diff = 100 - totalSize;
                var pad = diff / this.columns.length;
                var total = 0;
                this._forEach(this._sizes, function(size, i) {
                    if (i < self._sizes.length - 1) {
                        self._sizes[i] += pad;
                        total += self._sizes[i];
                    } else {
                        self._sizes[i] = 100 - total;
                    }
                });
            }

            this.setRowWidth(this.$head, this._sizes);
            this._forEach(this.$rows, function(row, ri) {
                self.setRowWidth(row, self._sizes);
            });

            this._setAllRowHeights();
        },
        setRowWidth: function(row, w) {
            row.find(".dt-cell").each(function(c) {
                if (c < row.find(".dt-cell").length - 1) {
                    $(this).css({
                        "width": w[c] + "%",
                    });
                } else {
                    $(this).css({
                        "width": "auto",
                        "float": "none"
                    });
                }
            });
        },
        _fixhead: function() {
            // align the header with the body, in case a scrollbar is throwing off the width
            this.$head.css("right", (this.$container.outerWidth() - this.$table.find(".dt-row").eq(0).outerWidth()) + "px");
            this.$table.css("top", this.$head.outerHeight());
        },

        heights: function() {
            clearTimeout(this._heightTimer);
            var self = this;
            this._heightTimer = setTimeout(function() {
                self._setAllRowHeights();
            }, 100);
        },
        _setAllRowHeights: function() {
            this._forEach(this.$rows, function(row, ri) {
                row.css("height", "auto");
            });
            
            var diff = this.getContainerHeight() - this.getHeight(),
                pad;
            if (diff < 0 && this.options.paginate && this.options.pageSize === "auto") {
                while (diff < 0) {
                    if (this._reverse) {
                        this.$rows.shift().remove();
                    } else {
                        this.$rows.pop().remove();
                    }
                    this._autoPageCount();
                    diff = this.getContainerHeight() - this.getHeight();
                }
            }
            
            if (diff > 0 && diff / this.$rows.length < this.$rows[0].outerHeight()) { //we'll pad each row, as long as it doesn't double their height
                pad = diff / this.$rows.length;
            } else {
                pad = 0;
            }

            this.$head.find(".dt-row").css("height", "auto");
            this.$head.find(".dt-row").css("height", this.$head.find(".dt-row").height());
            
            this._forEach(this.$rows, function(row, ri) {
                row.css("height", row.height() + pad);
            });
            
            this._fixhead();
        },

        scroll: function(e) {
            var h = $(e.currentTarget).scrollTop();
            var mh = e.currentTarget.scrollHeight - $(e.currentTarget).outerHeight();
            this.$head.find(".dt-table-head-shadow").css("opacity", h / mh);
        },

        getContainerHeight: function() {
            return this.$container.outerHeight() - this.$head.outerHeight();
        },
        getHeight: function() {
            this.$table.css("bottom", "auto");
            var r = this.$table.outerHeight();
            this.$table.css("bottom", "0px");
            return r;
        }


    };

    $.fn.dynamictable = function(option) {
        var ret;
        this.each(function() {
            var $this = $(this);
            var data = $this.data('dynamictable');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('dynamictable', (data= new DynamicTable(this, options)));
            }
            if (typeof option === 'string') {
                ret = data[option]();
            } else if (!option) { //just call .dynamictable() on something to expose all of these methods and whatnot
                ret = data;
            }
        });
        if (!ret) {
            ret = this;
        }
        return ret;
    };

    $.fn.dynamictable.defaults = {
        dataParser: {},
        data: [],
        columns: [],
        pageSize: "auto",
        dataType: "array",
        paginate: true,
        maxWidth: 50
    };

    $.fn.dynamictable.Constructor = DynamicTable;

});
