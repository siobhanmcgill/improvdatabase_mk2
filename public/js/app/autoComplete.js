define(['jquery', 'backbone'],
    function($, Backbone) {

    //input autocomplete function that works with backbone collections!
    var AutoComplete = function(element, options) {
        this.$element = $(element);
        this.options = $.extend(true, {}, $.fn.autocomplete.defaults, options);
        
        this.data = this.options.data;
        if (this.options.data instanceof Backbone.Collection) {
            this.backbone = true;
        } else {
            this.backbone = false;
        }
        
        this.$menu = $("<div class='autocomplete-menu'><ul></ul></div>");
        this.$menu.addClass(this.options.menuClass);
        this.$item = $("<li></li>");
        this.shown = false;
        this.listen();

        this.$element.attr("autocomplete", "off");
    };

    AutoComplete.prototype = {
        constructor: AutoComplete,

        eventSupported: function(eventName) {
            var isSupported = eventName in this.$element;
            if (!isSupported) {
                this.$element.setAttribute(eventName, 'return;');
                isSupported = typeof this.$element[eventName] === 'function';
            }
            return isSupported;
        },

        listen: function() {
            this.$element
                .on('focus',    $.proxy(this.focus, this))
                //.on('blur',     $.proxy(this.blur, this))
                .on('keypress', $.proxy(this.keypress, this))
                .on('keyup',    $.proxy(this.keyup, this));

            if (this.eventSupported('keydown')) {
                this.$element.on('keydown', $.proxy(this.keydown, this));
            }

            this.$menu
                .on('click', $.proxy(this.click, this))
                .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
                .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
        },
        focus: function () {
            this.focused = true;
        },
        blur: function() {
            this.focused = false;
            if (!this.mousedover && this.shown) {
                this.hide();
            }
        },

        show: function() {
            var pos = $.extend({}, this.$element.offset(), {
                height: this.$element[0].offsetHeight
            });
            if (this.options.menuWidth) {
                this.$menu.css("width", this.options.menuWidth);
            }
            this.$menu.css({
                    top: pos.top + pos.height,
                    left: pos.left,
                    position: "absolute"
                }).show();
            $("body").append(this.$menu);
            this.shown = true;
            return this;
        },
        hide: function() {
            this.$menu.remove();
            this.$menu.find(".active").removeClass("active");
            this.shown = false;
            return this;
        },

        //selecting an item with arrow keys
        keypress: function(e) {
            if (this.suppressKeyPressRepeat) {
                return;
            }
            this.move(e);
        },
        keydown: function(e) {
            this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
            this.move(e);
        },
        move: function (e) {
            if (!this.shown) {
                return;
            }
            switch(e.keyCode) {
            case 9: // tab
            case 13: // enter
            case 27: // escape
                e.preventDefault();
                e.stopPropagation();
                break;
            case 38: // up arrow
                e.preventDefault();
                e.stopPropagation();
                this.prev();
                break;
            case 40: // down arrow
                e.preventDefault();
                e.stopPropagation();
                this.next();
                break;
            }
            e.stopPropagation();
        },
        next: function () {
            var active = this.$menu.find('.active').removeClass('active'),
                next = active.next();
            if (!next.length) {
                next = this.$menu.find('li').eq(0);
            }
            next.addClass('active');
        },
        prev: function () {
            var active = this.$menu.find('.active').removeClass('active'),
                prev = active.prev();

            if (!prev.length) {
                prev = this.$menu.find('li').eq(-1);
            }
            prev.addClass('active');
        },

        click: function(e) {
            this.select();
            this.$element.focus();
            e.stopPropagation();
            e.preventDefault();
        },
        mouseenter: function(e) {
            this.mousedover = true;
            this.$menu.find('.active').removeClass('active');
            $(e.currentTarget).addClass('active');
        },
        mouseleave: function() {
            this.mousedover = false;
            if (!this.focused && this.shown) {
                this.hide();
            }
        },
        
        //typing stuff into $element
        keyup: function(e) {
            switch(e.keyCode) {
            case 40: // down arrow
            case 38: // up arrow
            case 16: // shift
            case 17: // ctrl
            case 18: // alt
                break;
            
            case 188: // comma
            case 9: // tab
            case 13: // enter
                this.select();
                break;

            case 27: // escape
                if (!this.shown) {
                    return;
                }
                this.hide();
                break;

            default:
                this.lookup();
            }

            e.stopPropagation();
            e.preventDefault();
        },
        //pressing enter or tab
        select: function() {
            var val = this.$menu.find(".active").html();
            if (!val) {
                val = this.$element.val();
            }
            val = $.trim(val).replace(',','');
            this.$element.val(val).change().trigger("autoComplete.selection", [val, this.$menu.find(".active").data("val")]);
            return this.hide();
        },

        //every time a letter is pressed, look for the value
        lookup: function() {
            this.query = this.$element.val().toLowerCase();
            if (!this.query || this.query.length < this.options.minLength) {
                return this.shown ? this.hide() : this;
            }
            //items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
            var pattern = new RegExp("^" + this.query, "gi"),
                prop = this.options.property,
                items;
            
            if (this.backbone) {
                this.data.comparator = prop;
                items = this.data.filter(function(item) {
                    return pattern.test(item.get(prop));
                });
            } else {
                items = $.grep(items, function(item) {
                    if (typeof item === "object") {
                        return pattern.test(item[prop]);
                    } else {
                        return pattern.test(item);
                    }
                });
            }
            if (!items.length) {
                return this.shown ? this.hide() : this;
            }
            if (this.options.items > 0) {
                this.render(items.slice(0, this.options.items)).show();
            } else {
                this.render(items);
            }
        },
        render: function (items) {
            this.$menu.find("ul li").remove();
            for (var icnt = 0, max = items.length; icnt < max; icnt++) {
                var $item = this.$item.clone(),
                    dataval,
                    text;
                if (this.backbone) {
                    text = items[icnt].get(this.options.property);
                    dataval = items[icnt];
                } else if (typeof items[icnt] === "object") {
                    text = items[icnt][this.options.property];
                    dataval = items[icnt][this.options.idProperty];
                } else {
                    text = items[icnt];
                    dataval = text;
                }
                $item.text(text).data("val", dataval);
                if (icnt === 0) {
                    $item.addClass("active");
                }
                this.$menu.find("ul").append($item);
            }
            this.show();
        }
    };

    $.fn.autocomplete = function(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('autocomplete');
            var options = typeof option === 'object' && option;

            if (!data) {
                $this.data('autocomplete', (data= new AutoComplete(this, options)));
            }
            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.autocomplete.defaults = {
        source: [],
        items: 0,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        minLength: 1,
        property: "Name",
        idProperty: "ID",
        menuClass: ""
    };

    $.fn.autocomplete.Constructor = AutoComplete;

});
