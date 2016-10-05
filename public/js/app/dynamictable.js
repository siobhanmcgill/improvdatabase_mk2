define(['jquery', 'backbone', 'underscore'],
    function($, Backbone, _) {

    var DynamicTable = function(element, options) {
        this.$container = $(element).addClass("dt-table-container");
        this.options = $.extend(true, {}, $.fn.dynamictable.defaults, options);

        if (this.options.pageindicator) {
            this.$pageindicator = this.options.pageindicator;
        } else {
            //TODO: create paging stuff if they aren't provided
            this.$pageindicator = $("<div class='dt-pageindicator'></div>");
        }
        this.$pageindicator.tooltip();

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

        if (this.options.loader) {
            this.$loader = this.options.loader;
        } else {
            this.$loader = $("<div></div>");
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

        // figure out the defalt sort property
        this._forEach(this.columns, function(column) {
            if (column.defaultSort) {
                this._sortBy = column.property;
            }
        });
        if (!this._sortBy && this.columns.length > 0) {
            this._sortBy = this.columns[0].property ? this.columns[0].property : this.columns[0];
        }


        this._page = 0;
        this._start = 0;
        this._end = 0;
        this._total = 0;
        this._pageCount = 0;
        this._sortDir = "asc";
        this._filter = {};
        this._refresh = false;

        this.rows = [];
        this._sizes = [];

        this.render();
        
        //$(window).resize($.proxy(this.heights, this));

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
            //var timer = (new Date()).getTime();

            this.$container.empty();

            this.$table = $("");
            this.$head = $("<div class='dt-table-head'><div class='dt-table-head-shadow'></div></div>");

            this.$container.append(this.$head);
            this.$container.append(this.$table);

            if (!this.options.paginate) {
                this.$prevbutton.hide();
                this.$nextbutton.hide();
            }

            this.next();
        },
        reload: function() {
            var scroll = this.$table.scrollTop();

            //this._sizes = [];
            this._page = this.options.pageSize === 0 ? 0 : this._page - 1;
            this._end = this._start;
            //this._refresh = true;
            this.next();

            this.$table.scrollTop(scroll);
        },

        refresh: function () {
            this._refresh = true;
            this.reload();
        },

        reloadWithHeader: function () {
            this._redoheader = true;
            this.$head.hide();
            this.reload();
        },

        _disablePrev: function() {
            this.$prevbutton.addClass("disabled");
        },
        _enablePrev: function() {
            this.$prevbutton.removeClass("disabled");
        },
        _disableNext: function() {
            this.$nextbutton.addClass("disabled");
        },
        _enableNext: function() {
            this.$nextbutton.removeClass("disabled");
        },

        pageSize: function(e) {
            if ($(e.currentTarget).data("value") !== undefined) {
                this.options.pageSize = $(e.currentTarget).data("value");
                this.reload();
            }
        },

        _showLoader: function () {
            /*
            this.$loader.css({
                left: this.$container.position().left,
                right: this.$container.position().right
            });
            */
            this.$loader.show();
        },
        _hideLoader: function () {
            this.$loader.hide();
        },

        prev: function(e) {
            if (this._page > 1) {

                this._page--;
                this._reverse = true;

                var renderDelay = this._renderBeforeData();
                
                setTimeout($.proxy(function () {
                    this.data.getPage({
                        //page: this.options.pageSize === 'auto' ? 0 : this._page,
                        //pageSize: this.options.pageSize === 'auto' ? 0 : this.options.pageSize,
                        start: this.options.pageSize === 'auto' || this.options.pageSize === 0 ? 0 : this._start - this.options.pageSize,
                        end: this._start,
                        sort: {
                            property: this._sortBy,
                            dir: this._sortDir
                        },
                        filter: this._filter
                    }, $.proxy(function (data) {

                        this._total = data.total;
                        this._end = this._start;
                        this._start = this.options.pageSize === "auto" ? 0 : this._start - this.options.pageSize;
                        
                        this._renderAfterData(data, renderDelay);

                    }, this));
                }, this), renderDelay);
            }
            
            if (e) {
                e.stopPropagation();
                return false;
            }
        },
        next: function(e) {
            // ignore the "next" button if there isn't a next page
            if (this.$nextbutton.hasClass('disabled') && !this._refresh) {
                return false;
            }

            this._page++;
            this._reverse = false;

            var renderDelay = this._renderBeforeData();
            
            setTimeout($.proxy(function () {
                this.data.getPage({
                    start: this._end,
                    end: this.options.pageSize === 'auto' || this.options.pageSize === 0 ? 0 : this._end + this.options.pageSize,
                    sort: {
                        property: this._sortBy,
                        dir: this._sortDir
                    },
                    filter: this._filter
                }, $.proxy(function (data) {

                    this._start = this._end;
                    this._total = data.total;
                    this._end = this.options.pageSize === "auto" || this.options.pageSize === 0 ? this._total : this._start + this.options.pageSize;
                    
                    // the "next" page is really the first page, so loop around to the beginning
                    if (this._start >= data.total) {
                        this._page = 1;
                        this._start = 0;
                        this._end = this.options.pageSize === "auto" || this.options.pageSize === 0 ? this._total : this.options.pageSize;
                    }

                    this._renderAfterData(data, renderDelay);

                }, this));
            }, this), renderDelay);
            
            if (e) {
                e.stopPropagation();
                return false;
            }
        },

        _renderBeforeData: function () {
            window.datatimerstart = (new Date()).getTime();
            
            var renderDelay = 1;
            if (!this._refresh) {
                // animate out the currently showing table
                if (this.$table && this.$table.length > 0) {
                    var $oldTable = this.$table.removeClass("intoggle outtoggle right anim");
                    if (this._reverse) {
                        $oldTable.addClass('right');
                    }
                    $oldTable.addClass("outtoggle anim");
                    setTimeout(function() {
                        $oldTable.remove();
                    }, 350);
                    renderDelay = 100;
                } else {
                    this.$head.hide();
                }
                    
                // show the spinner, just in case this takes a sec
                this._showLoader();
            }

            return renderDelay;
        },

        _renderAfterData: function (data, renderDelay) {
            /*
            // debug
            console.log('********* data time:', (new Date()).getTime() - window.datatimerstart, ' - ' + renderDelay);
            window.rendertimerstart = (new Date()).getTime();
            */
            
            this.renderTableHeader();
            
            if (this.options.pageSize === 0) {
                this._pageCount = 1;
            } else if (this.options.pageSize !== "auto") {
                this._pageCount = Math.ceil(data.total / this.options.pageSize);
            }
            
            /*
            // debug
            var headertime = (new Date()).getTime() - window.rendertimerstart;
            console.log('header render time:', headertime);
            window.rendertimerstart = (new Date()).getTime();
            */

            setTimeout($.proxy(function () {
                this.$head.show();

                this.renderTableBody(data.data);
            
                this._hideLoader();

                /*
                // debug
                var bodytime = (new Date()).getTime() - window.rendertimerstart;
                console.log('render body time:', bodytime, ' - ' + renderDelay);
                window.rendertimerstart = (new Date()).getTime();
                */

                this.resize();

                /*
                // debug
                var resizetime = (new Date()).getTime() - window.rendertimerstart;
                console.log('resize time:', resizetime);
                window.rendertimerstart = (new Date()).getTime();
                */
                
                if (this._page > 1) {
                    this._enablePrev();
                } else {
                    this._disablePrev();
                }

                if (this._total <= this.rows.length) {
                    this._disableNext();
                } else {
                    this._enableNext();
                }
                this.renderPageIndicator();
                
                /*
                // debug
                var finaltime = (new Date()).getTime() - window.rendertimerstart;
                var totaltime = headertime + bodytime + resizetime + finaltime;
                console.log('extra time: ', finaltime);
                console.log('**** total render time:', totaltime);
                */
            }, this), renderDelay);
        },

        renderPageIndicator: function() {
            var x = this._start / this._total,
                w = 1 - (this._start + this.rows.length) / this._total,
                $indicator = this.$pageindicator.find('div').tooltip();

            if ($indicator.length === 0) {
                $indicator = $(document.createElement('div')).appendTo(this.$pageindicator).tooltip();
            }
            
            this.$pageindicator.find('span').remove();
            if (this.$pageindicator.width() < 400) {
                this.$pageindicator.append('<span class="heightener"></span><span class="page">Showing ' + (this._start + 1) + ' - ' + this._end + '</span> <span class="total">of ' + this._total + '</span>');
                if(this.filterCount() > 0) {
                    this.$pageindicator.append(' <span class="filter-status">(' + this.data.length + ')</span>');
                }
            } else {
                var tooltip = 'Showing ' + this.options.items + ' ' + (this._start + 1) + ' to ' + this._end + ' of ' + this._total;
                
                if(Object.keys(this._filter).length) {
                    tooltip += ' (Filtered from ' + this.data.length + ')';
                }

                $indicator.attr('title', tooltip).html('<span class="page">' + (this._start + 1) + ' - ' + this._end + '</span><span class="total">' + this._total + '</span>');
            }
            $indicator.css({
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

        _createDiv: function(className) {
            var div = document.createElement('div');
            div.className = className;
            return div;
        },
        _createRow: function() {
            return this._createDiv('dt-row');
        },
        _createCell: function() {
            return this._createDiv('dt-cell');
        },

        _forEach: function(array, fn, reverse) {
            var index,
                res;

            for (var i = 0, max = array.length - 1; i <= max; i++) {
                index = reverse ? max - i : i;
                res = fn(array[index], index);
                if (res === false) {
                    i = array.length;
                }
            }
        },

        renderTableHeader: function() {
            var self = this;

            if (this._redoheader) {
                this.$head.find('.dt-row').remove();
                this._redoheader = false;
            }

            // if the header already exists, we don't have to render it again
            if (this.$head.find('.dt-header').length === 0) {
                var tr = this._createRow(),
                    visible = 0;
                
                // render the column headers
                this._forEach(this.columns, function(column, i) {
                    if (!column.hide) {
                        var th = self._createCell();
                        var className = th.className += ' dt-header ';

                        // if just a property name was passed, turn it into an object
                        if (typeof column === 'string') {
                            column = {property: column, sortable: true};
                        }
                        
                        if (column.className) {
                            className += column.className;
                        } else {
                            className += column.property.toLowerCase();
                        }

                        if (column.sortable !== false) {
                            className += ' sortable';

                            if (self._sortBy === column.property) {
                                className += ' sorted ' + self._sortDir;
                            }
                        }

                        th.className = className;

                        // the actual column header text
                        th.innerHTML = column.header ? column.header : column.property;
                        $(th).data("column", column);

                        visible++;

                        // include the filter menu
                        if (column.filter) {
                            if (column.filter.view) {
                                column.filter.view.setFilter(self._filter[column.filter.property]);
                                $(th).append(column.filter.view.$el);
                            } else {
                                $(th).append(self._createFilterMenu(column));
                            }
                        }

                        th.setAttribute('data-index', i);
                        tr.appendChild(th);
                    }
                });
                this.headRow = tr;
                this.$head.append(tr);
                
                // set up the filter events
                this._forEach(this.columns, function(column, i) {
                    // add a "filtered" indicator to a column that is filtered (or the only column showing if only one is showing)
                    if ((visible === 1 && self.filterCount() > 0) ||
                        (column.filter && self._filter[column.filter.property] && self._filter[column.filter.property].length > 0)) {
                        
                        $(tr).find('[data-index=' + i + ']').append('<span class="filter-status">(filtered)</span>');
                    }

                    if (column.filter) {
                        if (column.filter.view) {
                            column.filter.view.off('filter');
                            column.filter.view.on('filter', function (prop, sel) {
                                self._filter[prop] = sel;
                                self.reloadWithHeader();
                            });
                            column.filter.view.render();
                        } else {
                            self.$head.find('.dt-header').eq(i).find('.dropdown-button').dropdown()
                                        .off('change')
                                        .on('change', $.proxy(self._clickFilterDropdown, self))
                                        .find('.has-tooltip').tooltip({ direction: "left" });
                        }
                    }
                });

            }// end of if $header.find('.dt-header').length === 0
            
            // set up the sort details
            var prop = this._sortBy,
                dir = this._sortDir;
            this.$head.find(".dt-cell").removeClass("sorted asc desc");
            this._forEach(this.columns, function(column, index) {
                if (column === prop || column.property === prop || column.sortProperty === prop) {
                    self.$head.find(".dt-row > .dt-cell").eq(index).addClass("sorted " + dir);
                    return false;
                }
            });

        },
        
        // this method renders a comprehensive filter screen for all of the filterable columns in the table
        renderFilterMenu: function ($container) {
            var self = this;
            this.$filterMenuContainer = $container;
            $container.empty();
            this._forEach(this.columns, function(column) {
                if (column.filter) {
                    var selection = self._filter[column.filter.property];
                    if (column.filter.view) {
                        column.filter.view.setFilter(selection);
                        $container.append(column.filter.view.$el);
                        column.filter.view.off('filter');
                        column.filter.view.on('filter', function (prop, sel) {
                            self._filter[prop] = sel;
                            self.$container.trigger('filter.dynamictable', self._filter);
                        });
                        column.filter.view.renderFull();
                    } else {
                        var $menu = self._createFilterMenu(column, true),
                            $sel = $('<div class="filter-selections"></div>'),
                            $lab = $('<label>' + column.header + '</label>'),
                            $acc = $('<div class="accordion"></div>');
                        $acc.append($menu);
                        $sel.append($acc);
                        $container.append($lab, $sel);
                        $acc.accordion();
                        $acc.find('.has-tooltip').tooltip();
                        /*
                            .off('change')
                            .on('change', $.proxy(self._clickFilterMenu, self))
                            .find('.has-tooltip').tooltip({ direction: 'left' });
                            */
                        if (selection && selection.length && column.filter.collection) {
                            var col = column.filter.collection,
                                attrs = column.filter.attributes;
                            self._forEach(selection, function (id) {
                                var item = col.get(id),
                                    text = item.get(attrs.text),
                                    val = item.get(attrs.value),
                                    title = attrs.title ? item.get(attrs.title) : '',
                                    $obj;

                                $obj = $('<div class="btn has-tooltip active" title="' + title + '" data-value="' + val + '">' + text + '</div>');
                                $obj.data('btn', $menu.find('[data-value="' + val + '"]'));
                                $menu.find('.filter-output').append($obj);
                            });
                        }
                        $acc.find('.accordion-body .btn').on('click', $.proxy(self._clickFilterMenu, self));
                    }
                }
            });
        },

        _createFilterMenu: function (column, expand) {
            var iconClass = this._filter[column.filter.property] ? 'active' : '',
                btnhtml, objhtml;

            if (expand) {
                btnhtml = '<div class="accordion-toggle">';
            } else {
                btnhtml = '<div id="' + column.property + '_filter_toggle" class="';
                btnhtml += 'filter-button dropdown-button" ';
                btnhtml += 'data-menu="' + column.property + '_selection">';
            }

            if (expand) {
                btnhtml += '<div class="filter-output"></div><em class="closed">+ Add filter</em><em class="open">Done</em>';
            } else {
                btnhtml += '<i class="fa fa-filter ' + iconClass + '"></i>';
            }
            btnhtml += '</div>';
            
            var $obj, itemclass;
            
            if ($('body > #' + column.property + '_selection.showing').length) {
                if (expand) {
                    // the dropdown is showing, but we want to draw the accordion style menu, so we have to MURDER IT
                    $('body > #' + column.property + '_selection.showing').remove();
                } else {
                    $obj = $(btnhtml);
                    $obj.addClass('dropdown-active');
                    return $obj; // the menu is already drawn, so let's get out of here
                }
            } 
            
            objhtml = '';
            if (expand) {
                objhtml += '<div class="accordion-body"><div class="filter-menu" data-property="' + column.filter.property + '">';
                itemclass = 'btn has-tooltip';
            } else {
                objhtml += '<div class="dropdown left shadow4" id="' + column.property + '_selection" data-property="' + column.filter.property + '" data-button="' + column.property + '_filter_toggle">';
                itemclass = 'dropdown-option has-tooltip';
            }
            
            objhtml += '<div class="' + itemclass + ' filter-all checked" data-value="all">';
            if (expand) {
                objhtml += 'Clear Filter';
            } else {
                objhtml += '<i class="fa fa-check-circle-o"></i> Show All';
            }
            objhtml += '</div>';
            
            if (column.filter.collection) {
                var col = column.filter.collection,
                    attrs = column.filter.attributes;
                col.each(function (item) {
                    var text = item.get(attrs.text),
                        val = item.get(attrs.value),
                        title = attrs.title ? item.get(attrs.title) : '';
                    objhtml += '<div class="' + itemclass + '" title="' + title + '" data-value="' + val + '">';
                    if (!expand) {
                        objhtml += '<i class="fa fa-circle-o"></i> ';
                    }
                    objhtml += text + '</div>';
                });
            }
            if (expand) {
                objhtml += '<div class="accordion-toggle"><i class="fa fa-caret-up"></i></div>';
            }
            objhtml += '</div></div>';
            $obj = $(btnhtml + objhtml);
            
            if (this._filter && this._filter[column.filter.property]) {
                this._uncheckOption($obj.find('.filter-all'));
                var self = this;
                _.each(this._filter[column.filter.property], function (id) {
                    self._checkOption($obj.find('[data-value="' + id + '"]'));
                });
            }

            if (expand) {
                $obj.on('click', '.filter-output .btn', $.proxy(this._clickFilterOutput, this));
            }

            return $obj;
        },
        _checkOption: function ($option) {
            $option.addClass('checked').find('i').removeClass('fa-circle-o').addClass('fa-check-circle-o');
        },
        _uncheckOption: function ($option) {
            $option.removeClass('checked').find('i').removeClass('fa-check-circle-o').addClass('fa-circle-o');
        },
        _clickFilterDropdown: function (e, option) {
            var $option = $(option), //$(e.currentTarget),
                checked = $option.hasClass('checked'),
                value = $option.data('value'),
                $menu = $option.parent(),
                prop = $menu.data('property'),
                self = this;
            
            if (checked) {
                this._uncheckOption($option);
                if ($menu.find('.checked').length === 0) {
                    this._checkOption($menu.find('.filter-all'));
                }
            } else {
                if (value === 'all') {
                    this._uncheckOption($menu.find('.dropdown-option'));
                } else {
                    this._uncheckOption($menu.find('.filter-all'));
                }
                this._checkOption($option);
            }

            if ($menu.find('.filter-all').hasClass('checked')) {
                this._filter[prop] = false;
            } else {
                this._filter[prop] = [];
                $menu.find('.checked').each(function () {
                    self._filter[prop].push($(this).data('value'));
                });
            }

            this.$container.trigger('filter.dynamictable', self._filter);

            this.reloadWithHeader();

            e.stopPropagation();
            return false;
        },
        _clickFilterMenu: function (e) {
            var $btn = $(e.currentTarget),
                $accordion = $btn.closest('.accordion'),
                $output = $accordion.find('.accordion-toggle .filter-output'),
                active = $btn.hasClass('active'),
                value = $btn.data('value'),
                prop = $btn.parent().data('property'),
                self = this;

            if (value === 'all') {
                $output.find('.btn').remove();
                $btn.parent().find('.btn').removeClass('active');
                this._filter[prop] = [];
            } else {
                if (active) {
                    $output.find('[data-value=' + value + ']').remove();
                    $btn.removeClass('active');
                } else {
                    $btn.addClass('active');
                    $output.append($btn.clone().data('btn', $btn));
                }
                this._filter[prop] = [];
                $btn.parent().find('.btn.active').each(function () {
                    self._filter[prop].push($(this).data('value'));
                });
            }
            
            this.$container.trigger('filter.dynamictable', self._filter);
        },
        _clickFilterOutput: function (e) {
            var $btn = $(e.currentTarget).data('btn');
            $btn.click();
            e.stopPropagation();
        },

        clearFilters: function () {
            var self = this;
            this._filter = {};
            this._forEach(this.columns, function(column) {
                if (column.filter) {
                    if (column.filter.view) {
                        column.filter.view.clearFilter();
                    } else {
                        // if there's a filter menu screen somewhere
                        if (self.$filterMenuContainer) {
                            // find this column's menu
                            var $menu = self.$filterMenuContainer.find('[data-property="' + column.filter.property + '"]');
                            // remove all active buttons
                            $menu.find('.btn').removeClass('active');
                            // remove selection from the output
                            $menu.closest('.accordion').find('.accordion-toggle .filter-output .btn').remove();
                            // make sure the accordion is closed
                            $menu.closest('.accordion.open').find('.open').click();
                        }
                    }
                }
            });
        },

        _tableBody: function() {
            var obj = $("<div class='dt-table intoggle'></div>");
            obj.scroll($.proxy(this.scroll, this));
            return obj;
        },

        renderTableBody: function(data) {
            var self = this,
                reverse = this._reverse,
                autoPage = self.options.paginate && self.options.pageSize === "auto",
                $oldtable = this.$table;
            
            this.rows = [];
            
            this.$table = this._tableBody();
            if (reverse) {
                this.$table.addClass("right");
            }

            if (data.length === 0) {
                // there are no items!
                var emptyRow = self._createRow();
                emptyRow.className += ' dt-no-items';
                emptyRow.innerHTML = "<h5>No " + self.options.items + " were found that match your chosen filters.</h5>";
                
                this.$table.append(emptyRow);
            }
            
            this.$container.append(this.$table);
            
            this._forEach(data, function(row, ri) {
                var tr = self._createRow();

                self._forEach(self.columns, function(column) {
                    if (!column.hide) {
                        var td = self._createCell(),
                            text,
                            className = '',
                            colObj;
                        
                        // make sure we're dealing with an object
                        if (typeof(column) === "string") {
                            colObj = {property: column};
                        } else {
                            colObj = column;
                        }
                        
                        // get the text figured out
                        if (typeof(colObj.property) === "function") {
                            text = colObj.property(row, data);
                        } else {
                            if (row[colObj.property]) {
                                text = typeof(row[colObj.property]) === "function" ? row[colObj.property](row, data) : row[colObj.property];
                            } else if (row.get) {
                                //it's a backbone model and we're getting an attribute
                                text = row.get(colObj.property);
                            } else { //umm . . .
                                console.warn("Couldn't find " + colObj.property + " on row " + ri);
                            }
                            className = colObj.property.toLowerCase();
                        }

                        if (colObj.className) {
                            className += ' ' + colObj.className;
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
                        
                        if (typeof text === 'string') {
                            td.innerHTML = text;
                        } else {
                            td.appendChild(text);
                        }

                        td.className = td.className += ' ' + className;
                        tr.appendChild(td);
                    } // end of if !column.hide
                }); //end of foreach column

                if (row.id) {
                    tr.id = self.options.idPrefix + row.id;
                }

                //$(tr).data("data", row);
                tr.setAttribute('data-gameid', row.get('GameID'));
                
                if (reverse) {
                    self.$table.prepend(tr);
                } else {
                    self.$table.append(tr);
                }

                if (autoPage && self.getHeight() > self.getContainerHeight()) {
                    $(tr).remove();
                    self._autoPageCount();
                    return false;
                }

                if (reverse) {
                    self.rows.unshift(tr);
                } else {
                    self.rows.push(tr);
                }

            }, reverse); // end of foreach data item

            if (this._refresh) {
                $oldtable.remove();
                this.$table.removeClass("intoggle");
                this._refresh = false;
                setTimeout(function () {
                    self.options.onRender(self.$table, data.data);
                    self.$container.trigger('render.dynamictable', self);
                }, 50);
            } else {
                setTimeout(function() {
                    self.$table.addClass("anim");
                    setTimeout(function() {
                        self.options.onRender(self.$table, data.data);
                        self.$container.trigger('render.dynamictable', self);
                    }, 300);
                }, 250);
            }
        },

        _autoPageCount: function() {
            //try to figure out the page count
            var self = this;
            self._pageCount = Math.ceil(self._total / self.rows.length);
            self.renderPageIndicator();
            if (self._reverse) {
                self._start = self._end - self.rows.length;
            } else {
                self._end = self._start + self.rows.length;
            }
        },

        resize: function() {
            var self = this,
                maxWidth = this.$container.width(),
                totalSize = 0;
            
            if (this._sizes.length === 0) {
                var headChildren = self.headRow.childNodes;

                this._forEach(this.columns, function(column, ci) {

                    if (!column.hide) {
                        //find the widest cell in this column
                        var headCell = headChildren[ci];
                        headCell.style.width = 'auto';

                        var size = headCell.offsetWidth;
                        
                        self._forEach(self.rows, function(row) {
                            var cell = row.childNodes[ci];
                            cell.style.width = 'auto';
                            size = Math.max(size, cell.offsetWidth);
                        });
                        
                        var perc = Math.ceil((size / maxWidth) * 100);
                        self._sizes.push(Math.min(perc, self.options.maxWidth));
                        totalSize += (perc);
                    }

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
                        // the last cell gets all the rest
                        self._sizes[i] = 100 - total;
                    }
                });
            }

            // now we can set all the sizes on things
            this.setRowWidth(this.headRow, this._sizes);
            this._forEach(this.rows, function(row) {
                self.setRowWidth(row, self._sizes);
            });

            this._setAllRowHeights();
        },

        setRowWidth: function(row, widths) {
            var cells = row.childNodes;
            this._forEach(cells, function(cell, ci) {
                if (ci < cells.length - 1) {
                    cell.style.width = widths[ci] + '%';
                } else {
                    cell.style.width = 'auto';
                    cell.style.float = 'none';
                }
            });
        },

        _fixhead: function() {
            // align the header with the body, in case a scrollbar is throwing off the width
            var rightvalue;
            if (this.getHeight() > this.getContainerHeight()) {
                rightvalue = (this.$container.width() - this.rows[0].offsetWidth) + "px";
            } else {
                rightvalue = '0px';
            }
            this.$head.css('right', rightvalue);
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
            this._fixhead();

            this.headRow.style.height = 'auto';
            this.headRow.style.height = this.headRow.offsetHeight + 'px';

            this._forEach(this.rows, function(row) {
                row.style.height = 'auto';
            });
            
            var diff = this.getContainerHeight() - this.getHeight(),
                pad, mod;
            
            if (diff < 0 && this.options.paginate && this.options.pageSize === "auto") {
                // if the page size is auto, and we have more rows than will fit, we have to remove rows until it does fit
                while (diff < 0) {
                    var row;
                    if (this._reverse) {
                        row = this.rows.shift();
                    } else {
                        row = this.rows.pop();
                    }
                    row.parentElement.removeChild(row);
                    this._autoPageCount();
                    diff = this.getContainerHeight() - this.getHeight();
                }
            }

            if (this.rows.length > 0) {

                if (diff > 0 && diff / this.rows.length < this.rows[0].offsetHeight) {
                    //we'll pad each row with the leftover space, as long as it doesn't double their height
                    pad = Math.floor(diff / this.rows.length);
                    mod = diff % this.rows.length;
                } else {
                    pad = 0;
                    mod = 0;
                }

                this._forEach(this.rows, function(row) {
                    row.style.height = (row.offsetHeight + pad) + 'px';
                });

                //give any remainder to the last row
                if (mod > 1) {
                    var lastRow = this.rows[this.rows.length - 1];
                    lastRow.style.height = (lastRow.offsetHeight + (diff % this.rows.length)) + 'px';
                }
            }

            this._fixhead();
        },

        scroll: function(e) {
            var h = $(e.currentTarget).scrollTop();
            var mh = e.currentTarget.scrollHeight - $(e.currentTarget).outerHeight();
            this.$head.find(".dt-table-head-shadow").css("opacity", h / mh);
        },

        getContainerHeight: function() {
            return this.$container.height() - this.$head.outerHeight();
        },
        getHeight: function() {
            if (this.rows.length > 0) {
                var lastRow = this.rows[this.rows.length - 1];
                return lastRow.offsetTop + lastRow.offsetHeight;
            } else {
                return 0;
            }
        },

        getFilter: function () {
            return this._filter;
        },
        filterCount: function () {
            var cnt = 0;
            for (var key in this._filter) {
                if (this._filter[key].length !== undefined) {
                    cnt += this._filter[key].length;
                }
            }
            return cnt;
        }

    };

    $.fn.dynamictable = function(option, param) {
        var ret;
        this.each(function() {
            var $this = $(this);
            var data = $this.data('dynamictable');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('dynamictable', (data= new DynamicTable(this, options)));
            }
            if (typeof option === 'string' && typeof(data[option]) === 'function') {
                ret = data[option](param);
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
        maxWidth: 50,
        idPrefix: 'row',
        item: 'item',
        items: 'items',
        onRender: function() {}
    };

    $.fn.dynamictable.Constructor = DynamicTable;

});
