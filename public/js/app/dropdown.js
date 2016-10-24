//dropdown menus
/*
    <div id="button1" class="dropdown-button">THIS IS THE TRIGGER <i class="arrow-down"></i></div>
    <div class="dropdown" data-button="button1">THIS IS THE DROPDOWN</div>

    $(".dropdown").dropdown();
*/
!function ($) {

    var Dropdown = function (element, options) {
        this.options = $.extend(true, {}, $.fn.dropdown.defaults, options);
        this.showing = false;
        if ($(element).data("menu")) {
            this.$btn = $(element);
            this.setMenu($("#" + $(element).data("menu")));
        } else {
            this.$btn = $("#" + $(element).data("button"));
            this.$menu = $(element);
        }
        if (!this.$btn.hasClass("dropdown-button")) {
            this.$btn.addClass("dropdown-button");
        }
        this.$home = this.$menu.parent();

        this.$btn.off('click.dropdown').on('click.dropdown', $.proxy(this.toggleDropdown, this));
        this.$menu.off('click.dropdown').on('click.dropdown', '.dropdown-option', $.proxy(this.select, this));
    };

    Dropdown.prototype = {
        constructor: Dropdown,

        setMenu: function ($menu) {
            this.$menu = $menu;
            if ($menu.hasClass('showing')) {
                this.showing = true;
                this._sethtmlclick();
            }

            if (this.options.selectable) {
                this.$menu.find('.dropdown-option').off("click.dropdown")
                    .on('click.dropdown', $.proxy(function(e) {
                        if (this.$btn.find(".value").length > 0) {
                            this.$btn.find(".value").text($(e.currentTarget).text());
                            this.$btn.data("value", $(e.currentTarget).data("value"));
                        }
                        this.$btn.trigger('change', e.currentTarget);
                        this.$menu.trigger('change', e.currentTarget);

                        e.stopPropagation();
                        return false;
                    }, this));
            }
        },

        trigger: function (e, data) {
            var evt = $.Event(e);
            this.$btn.trigger(evt, data);
            this.$menu.trigger(evt, data);
            return evt;
        },

        hide: function () {
            var self = this;
            this.$menu.removeClass("ready").css({
                height: "0px"
            });
            if (this.$menu.hasClass("up")) {
                this.$menu.css("top", this.$btn.position().top);
            }
            setTimeout(function() {
                self.$menu.appendTo(self.$home).css({
                    left: "-9999em"
                }).removeClass("showing").removeClass(self.options.activeClass);

                self.trigger('hidden.dropdown');
            }, 400);
            this.$btn.removeClass("dropdown-active");
            $("html").off("click.hidedropdowns");

            this.trigger('hide.dropdown');
            this.showing = false;
        },
        show: function () {
            var self = this;
            $('body').append(this.$menu);

            if (this.options.width === "auto") {
                this.$menu.css("width", this.$btn.outerWidth());
            } else if (this.options.width) {
                this.$menu.css('width', this.options.width);
            }

            var left = this.$btn.offset().left;
            if (left + this.$menu.outerWidth() > $(window).width() - 5 || this.$menu.hasClass('left')) {
                left = left + this.$btn.outerWidth() - this.$menu.outerWidth();//$(window).width() - (dropdown.outerWidth() + 5);
            }
            if (this.$menu.data("height") === undefined || this.$menu.data("height") === "") {
                this.$menu.css({
                    left: "-200%",
                    height: "auto",
                    display: "block"
                });
                if (this.$menu.hasClass("up")) {
                    this.$menu.css({
                        top: this.$btn.offset().top
                    });
                }
                var height = this.$menu.outerHeight();
                if (height + this.$btn.offset().top + this.$btn.outerHeight() > $(window).height()) {
                    height = $(window).height() - (this.$btn.offset().top + this.$btn.outerHeight() + 50);
                }
                this.$menu.data("height", height);
            }

            this.$menu.css({
                left: left,
                height: "0px"
            });
            if (!this.$menu.hasClass("up")) {
                this.$menu.css({
                    top: this.$btn.offset().top + this.$btn.outerHeight()
                });
            }
            var h = this.$menu.data('height');
            if (!this.$menu.hasClass('up') && h + this.$btn.offset().top > $(window).height()) {
                h = $(window).height() - (this.$btn.offset().top + 50);
                this.$menu.css('overflow', 'auto');
            }
            setTimeout(function() {
                self.$menu.addClass("showing arriving").css("height", h);
                if (self.$menu.hasClass("up")) {
                    self.$menu.css({
                        "top": self.$btn.offset().top - self.$menu.data("height")
                    });
                }
                setTimeout(function() {
                    self.$menu.removeClass("arriving").addClass("ready");
                }, 400);
            }, 50);
            this.$btn.addClass("dropdown-active").addClass(this.options.activeClass);

            this._sethtmlclick();

            this.showing = true;
        },
        _sethtmlclick: function () {
            $("html").off('click.hidedropdowns').one("click.hidedropdowns", $.proxy(function(e) {
                this.hide();
                e.stopPropagation();
                return false;
            }, this));
            this.$menu.off('click.hidedropdowns')
                .on('click.hidedropdowns', function (e) {
                    e.stopPropagation();
                    return false;
                });
        },

        toggleDropdown: function (e) {
            if (this.showing) { //hide the thing
                this.hide();
            } else {
                this.show();
            }
            e.stopPropagation();
        },

        select: function (e) {
            var $option = $(e.currentTarget),
                text = $option.html(),
                data = $option.data(),
                evt = this.trigger('change.dropdown', data);

            this.$btn.find('.name').html(text);
            if (!evt.isPropagationStopped()) {
                this.toggleDropdown(evt);
            }
            e.stopPropagation();
        }
    };

    $.fn.dropdown = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('dropdown'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('dropdown', (data = new Dropdown(this, options)));
            }
            if (typeof option === "string") {
                data[option]();
            }
        });
    };
    $.fn.dropdown.Constructor = Dropdown;
    $.fn.dropdown.defaults = {
        selector: "",
        width: "",
        activeClass: "",
        selectable: true
    };

}(window.jQuery);
