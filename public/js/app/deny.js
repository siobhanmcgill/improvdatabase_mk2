function scroll_to_top()
{
    var pos = $(window).scrollTop();
    $('html, body').stop(true, true).animate({scrollTop: 0}, pos + 500);
}

$.fn.pressEnter = function(fn) {  
    return this.each(function() {  
        $(this).bind('enterPress', fn);
        $(this).keyup(function(e){
            if(e.keyCode === 13)
            {
                $(this).trigger("enterPress");
            }
        });
    });  
}; 

//expandable content areas
$.fn.drawer = function(settings) {
    settings = jQuery.extend({
        selector: "",
    }, settings);
    var returnobj;
    if (settings.selector !== "") {
        returnobj = this.find(settings.selector);
    } else {
        returnobj = this;
    }
    return returnobj.each(function() {
        var handleObj = $("<div id='"+ $(this).attr("id") +"_handle' class='drawer-handle' title='Expand this menu'><span class='inline-block'></span></div>");
       
        $(this).append(handleObj);
        if ($(this).hasClass("top")) {
            handleObj.addClass("top").find("span").addClass("arrow-up");
        } else if ($(this).hasClass("right")) {
            handleObj.addClass("right").find("span").addClass("arrow-right");
        } else if ($(this).hasClass("left")) {
            handleObj.addClass("left").find("span").addClass("arrow-left");
        } else if ($(this).hasClass("bottom")) {
            handleObj.addClass("bottom").find("span").addClass("arrow-down");
        }
       
        var drw = $(this);
        var w = drw.hasClass("top") || drw.hasClass("bottom") ? drw.height() : drw.width();
        drw.data("openwidth", w);
        drw.addClass("close");

        if ($.cookie("drawer_" + drw.attr("id")) === undefined) {
            $.cookie("drawer_" + drw.attr("id"), "true");
        }
        setTimeout(function() {
            var w = drw.hasClass("top") || drw.hasClass("bottom") ? drw.height() : drw.width();
            drw.data("closewidth", w);
            if (!drw.hasClass("top")) {
                drw.addClass("ready");
                if ($.cookie("drawer_" + drw.attr("id")) === "true") {
                    drw.find(".drawer-handle").click();
                }
            } else {
                if ($.cookie("drawer_" + drw.attr("id")) === "true") {
                    drw.find(".drawer-handle").click();
                } else {
                    $(".drawer.right, .drawer.left, #main").css({
                        "top": drw.outerHeight(),
                        "height": $(window).height() - (drw.outerHeight() + $("#footer").outerHeight())
                    });
                }
                setTimeout(function() {
                    drw.addClass("ready");
                }, 100);
            }
        }, 100);
       
        drw.find(".drawer-handle").click(function() {
            var w = 0, title;
            if (drw.hasClass("close")) {
                w = drw.data("openwidth");
                title = "Collapse this menu";
            } else {
                w = drw.data("closewidth");
                title = "Expand this menu";
            }
            var prop = drw.hasClass("top") || drw.hasClass("bottom") ? "height" : "width";
            drw.css(prop, w + "px");
            drw.toggleClass("close").find(".drawer-handle").attr("title", title);
           
            if (drw.hasClass("top")) {
                $(".drawer.right, .drawer.left, #main").css({
                    "top": w,
                    "height": $(window).height() - (w + $("#footer").outerHeight())
                });
            } else if (drw.hasClass("right")) {
                var time = drw.hasClass("close") ? 0 : 500;
                setTimeout(function() {
                    $("#main").css("width", $(window).width() - w);
                }, time);
            }

            $.cookie("drawer_" + drw.attr("id"), !drw.hasClass("close"));
        });
    }); 
}; //end of drawers

//expandable menus
/*
    call .expandable() on the button you want to open the menu
    the button should have a data-menu attribute with the ID of the menu to expand
*/
$.fn.expandable = function(settings) {
    settings = jQuery.extend({
        selector: "",
    }, settings);
    var returnobj;
    if (settings.selector !== "") {
        returnobj = this.find(settings.selector);
    } else {
        returnobj = this;
    }
    return returnobj.each(function() {
        var id = $(this).attr("id");
        var menuId = $(this).data("menu");
        var menu = $("#" + menuId);
        var btn = $(this);

        menu.addClass("expanded").css("height", "auto");
        menu.data("expandedheight", menu.height()).css("height", menu.height());
        if (!btn.hasClass("active")) {
            menu.css("height", 0).removeClass("expanded");
        }

        menu.addClass("ready");

        btn.click(function() {
            btn.parent().find(".expandable.expanded").each(function() {
                $(this).css("height", 0).removeClass("expanded");
                $("#" + $(this).data("parent")).removeClass("active");
            });
            menu.find("a").removeClass("active");
            if (!menu.hasClass("expanded")) {
                menu.css("height", menu.data("expandedheight")).addClass("expanded");
            }
        });
        menu.find("a").each(function() {
            $(this).click(function() {

            });
        });
    });
};


//slightly less delicious toast!
$.toast = function(message, settings) {
    settings = jQuery.extend({
        selector: "",
    }, settings);
    var $toast = $("<div class='toast inner-shadow2'>" + message + "</div>");
    $toast.css("margin-top", "200%");
    $("body").append($toast);
    var l = -($toast.outerWidth() / 2);
    $toast.css({
        "left": l + 50,
        "margin-top": 0
    });
    setTimeout(function() {
        $toast.addClass("show").css("left", l);
        setTimeout(function() {
            $toast.removeClass("show").addClass("done");
        }, 350);
    }, 10);
};


//set an the position on an element with CSS animation
jQuery.fn.offsetLeft = function(x) {
    return this.each(function() {
        var pos = $(this).data("goto-x") === undefined ? $(this).position().left : $(this).data("goto-x");
        pos = parseInt(pos, 10) + x;
        $(this).css("left", pos + 'px').data("goto-x", pos);
    });
};

jQuery.fn.offsetTop = function(y) {
    return this.each(function() {
        var pos = $(this).data("goto-y") === undefined ? $(this).position().top : $(this).data("goto-y");
        pos = parseInt(pos, 10) + y;
        if (pos + $(this).parent().offset().top < $("#topnav").offset().top + $("#topnav").outerHeight() + 10) {
            pos = ($("#topnav").offset().top + $("#topnav").outerHeight() + 10) - $(this).parent().offset().top;
        } else if (pos + $(this).parent().offset().top + $(this).outerHeight() > $("#footer").offset().top - 10) {
            pos = ($("#footer").offset().top - 10) - $(this).outerHeight();
        }
        
        if ($(this).hasClass("turnover")) {
            var bearer = $(this).data("btn");
            if ($(this).data("direction") === "left" || $(this).data("direction") === "right") {
                var bearerTop = bearer.data("goto-y") === undefined ? bearer.offset().top : parseInt(bearer.data("goto-y"), 10);
                bearerTop += y;
                var arrowTop = (bearerTop + (bearer.outerHeight() / 2)) - pos;
                var arrowBottom = (pos + $(this).outerHeight()) - (bearerTop + (bearer.outerHeight() / 2));
                bearer.data("goto-y", bearerTop);
                $(this).find("[class*='arrow-']").css({
                    "border-left-width": $(this).data("direction") === "right" ? arrowBottom : arrowTop,
                    "border-right-width": $(this).data("direction") === "right" ? arrowTop : arrowBottom,
                    "border-bottom-width": ($(this).outerHeight() / 20) + "px",
                    "top": "-" + ($(this).outerHeight() / 20) + "px"
                });
            }
            //TODO: adjust turnover arrow if it's a top or bottom style turnover
        }

        $(this).css("top", pos + 'px').data("goto-y", pos);
    });
};

function feature_test() {
    var m = Modernizr;

    if (!m.rgba || !m.borderradius || !m.boxshadow || !m.cssanimations || !m.cssgradients || !m.csstransforms || !m.csstransitions || !m.fontface || !m.opacity) {
        document.getElementById("contingency").style.display="block";
        var agent = navigator.userAgent;
        var updatehref;
        if (agent.indexOf("MSIE") > -1) {
            updatehref = "http://windows.microsoft.com/en-us/internet-explorer/ie-10-worldwide-languages";
        } else {
            updatehref = "http://www.mozilla.org/en-US/firefox/new/";
        }

        $("#browser_update_link").attr("href", updatehref);
    }
}

// KEEP THIS FANCY PANTS STUFF AT THE END
function getUniqueColor(id) {
    //whatup quadratic equations?
    var r = Math.abs(~~(((0.16272 * (id * id)) - (0.52738 * id) + 0.81957) * 255));
    var g = Math.abs(~~(((-0.09803 * (id * id)) + (0.25487 * id) + 0.4863) * 255));
    var b = Math.abs(~ ~(((-0.35486 * (id * id)) + (1.52332 * id) - 0.81936) * 255));
    return "#" + ("00" + (r).toString(16)).slice(-2) + ("00" + (g).toString(16)).slice(-2) + ("00" + (b).toString(16)).slice(-2);
}

function disco() {
    var disco = $("<div />");
    disco.css({
        position: "fixed",
        top: "0px",
        left: "0px",
        "z-index": "0",
        width: "100%",
        height: "100%",
        overflow: "hidden"
    }).attr("id", "disco");
    
    $("body").append(disco);

    var maxw = $(window).width();
    var maxh = $(window).height();
    var xcount = Math.ceil(maxw / 120);
    var ycount = Math.ceil(maxh / 120);

    var total = xcount * ycount;

    var item = $("<div />");
    item.css({
        width: "100px",
        height: "100px",
        display: "inline-block",
        margin: "0 20px 20px 0",
        position: "absolute",
        "transition": "background 400ms"
    });
    var xpos = 0;
    var ypos = 0;
    for (var count = 0; count < total; count++) {
        var px = xpos * 120;
        var py = ypos * 120 + 20;
        xpos++;
        if (xpos >= xcount) {
            xpos = 0;
            ypos++;
        }
        var thisId = "disco"+count;
        var thisitem = item.clone();
        thisitem.attr("id", thisId);
        thisitem.css({
            "background" : "#FFFFFF",
            "left": px + "px",
            "top": py + "px"
        });
        disco.append(thisitem);
    }
    $("#disco *").each(function(i) {
        var that = $(this);
        setTimeout(function() {
            var rand = Math.floor(Math.random() * total);
            that.css("background", getUniqueColor(rand));
            that.addClass("in");
        }, 10);
    });
    var mmm = true;
    setInterval(function() {
        if (mmm) {
            mmm = false;
        } else {
            mmm = true;
        }
        var randid = Math.floor(Math.random() * total);
        var rand = Math.floor(Math.random() * total);
        $("#disco" + randid).css("background", getUniqueColor(rand)).addClass("in");
    }, 100);
}

/*
//delicious turnovers!
$.fn.turnover = function(settings) {
    settings = jQuery.extend({
        selector: "",
    }, settings);
    var returnobj;
    if (settings.selector !== "") {
        returnobj = this.find(settings.selector);
    } else {
        returnobj = this;
    }
    return returnobj.each(function() {
        $(this).unbind("click").click(function(e) {
            var btn = $(this);
            var turnover;

            //first get the object
            turnover = btn.data("turnover");
            if (turnover === undefined) {
                turnover = btn.find(".turnover");
                if (turnover.attr("id") === "") {
                    turnover.attr("id", "turnover_" + new Date().getTime());
                }

                btn.data("turnover", turnover);
                $("body").append(turnover);
            }
            if (!btn.hasClass("turnover-active")) {
                
            } else {
                
            }
        });
    });
};
*/

!function ($) {

    var Accordion = function (element, options) {
        this.$el = $(element);
        this.$toggle = this.$('.accordion-toggle');
        this.$body = this.$('.accordion-body');

        if (!this.$toggle.length || !this.$body.length) {
            console.error('accordion initialized without accordion-toggle and accordion-body elements');
            return;
        }

        this.$body.show().css('height', 'auto');
        this.bodyheight = this.$body.height();
        this.$body.css('height', '0px');
        this.$body.addClass('ready');

        this.$toggle.on('click', $.proxy(this.toggle, this));
    };

    Accordion.prototype = {
        $: function (selector) {
            return this.$el.find(selector);
        },

        toggle: function () {
            if (this.$el.hasClass('open')) {
                this.$body.css('height', '0px');
                this.$el.removeClass('open');
            } else {
                this.$body.css('height', this.bodyheight);
                this.$el.addClass('open');
            }
        }
    };

    $.fn.accordion = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('accordion'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('accordion', (data = new Accordion(this, options)));
            }
            if (typeof option === "string") {
                data[option]();
            }
        });
    };
    $.fn.accordion.Constructor = Accordion;
    $.fn.accordion.defaults = {
        trigger: "click"
    };

}(window.jQuery);

!function ($) {

    var Turnover = function (element, options) {
        this.$bearer = $(element);
        this.$turnover = this.$bearer.find(".turnover");
        if (this.$turnover.attr("id") === "") {
            this.$turnover.attr("id", "turnover_" + (new Date()).getTime());
        }

        this.options = $.extend(true, {}, $.fn.turnover.defaults, options);


        this.init('turnover', element, options);
    };

    Turnover.prototype = {
        constructor: Turnover,
        init: function(element, options) {
            var turnover = this;
            if (this.options.trigger === "click") {
                this.$bearer.unbind("click").click(function(e) {
                    turnover.toggle();
                });
            }
        },
        toggle: function() {
            if (this.$bearer.hasClass("turnover-active")) {
                this.show();
            } else {
                this.hide();
            }
        },
        show: function(e) {
            var self = this;
            $("body").append(this.$turnover);

            this.$turnover.removeClass("hide-left hide-right").addClass("prep");
            var turnoverWidth = this.$turnover.outerWidth();
            var turnoverHeight = this.$turnover.outerHeight();

            //default settings will show the turnover to the right of the object, with the arrow pointing left X<[ ]
            var y = this.$bearer.offset().top + (this.$bearer.outerHeight() / 2) - (turnoverHeight / 2);
            var x = this.$bearer.offset().left + this.$bearer.outerWidth() + turnoverWidth + 6 + (turnoverHeight / 40);

            var arrowClass = "arrow-left";
            var showClass = "show-right";

            this.$turnover.data({
                "direction": "right",
                "btn": this.$bearer
            });

            if (x > $(window).width() - 30) { //if it's too close to the right side of the window, switch the turnover to the left, and the arrow to the right [ ]>X
                x = (this.$bearer.offset().left - (turnoverWidth)) - (turnoverHeight / 20);
                arrowClass = "arrow-right";
                showClass = "show-left";
                this.$turnover.data("direction", "left");
            }

            //TODO: If the turnover is now past the left side of the window, make it centered

            /*
            if (y < $("#topnav").outerHeight() + $("#topnav").offset().top + 10) { //if the turnover is on top of the topnav, move it down
                y = $("#topnav").outerHeight() + $("#topnav").offset().top + 10;
            }
            */

            //TODO: Catch if the bearer is near the top or bottom, and make it an up or down arrow
            
            //now set up the arrow object!
            var arrowTop = (this.$bearer.offset().top + (this.$bearer.outerHeight() / 2)) - y;
            var arrowBottom = (y + this.$turnover.outerHeight()) - (this.$bearer.offset().top + (this.$bearer.outerHeight() / 2));

            var arrowObj = $("<div class='" + arrowClass + "'></div>").css({
                "border-left-width": arrowClass === "arrow-left" ? arrowBottom : arrowTop,
                "border-right-width": arrowClass === "arrow-left" ? arrowTop : arrowBottom,
                "border-bottom-width": (turnoverHeight / 20),
                "top": "-" + (turnoverHeight / 20) + "px"
            });
            this.$turnover.find("[class*='arrow-']").remove();
            this.$turnover.append(arrowObj);

            //now we begin the process of showing the thing
            this.$bearer.addClass("turnover-active");

            this.$turnover.removeClass("prep")
                .css({
                    "left": x,
                    "top": y
                })
                .data("goto-y", y)
                .data("goto-x", x);

            //wait to apply 'ready' so it doesn't animate the position awkwardly
            this.$turnover.removeClass("outtoggle anim left right").addClass("intoggle " + showClass);
            setTimeout(function() {
                self.$turnover.addClass("ready anim");
            }, 50);
            
            //call the callback function, if specified in the data-callback attribute of the turnover object
            var callback = window[this.$turnover.data("callback")];
            if (typeof(callback) === "function") {
                callback(this.$turnover, this.$bearer);
            }

            //click anywhere to hide the thang
            setTimeout(function() {
                $("html").click(function() {
                    self.hide();
                });
                self.$turnover.click(function(e) {
                    e.stopPropagation();
                });
            }, 500);
            if (e) {
                e.stopPropagation();
            }
        },
        hide: function() {
            var self = this,
                hideClass;
            this.$turnover.removeClass("intoggle anim").addClass("outtoggle");
            switch(this.$turnover.data("direction")) {
            case "left":
                this.$turnover.addClass("right");
                break;
            default:
                this.$turnover.addClass("left");
                break;
            }
            setTimeout(function() {
                self.$turnover.addClass("anim");
                //hide the turnover after it's done animating away
                setTimeout(function() {
                    self.$turnover.removeClass("ready");
                    self.$bearer.append(self.$turnover);
                }, 500);
            }, 50);

            $("html").unbind("click");
            
            this.$bearer.removeClass("turnover-active");
        }
    };

    $.fn.turnover = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('turnover'),
                options = typeof option === 'object' && option;
            if (!data) {
                $this.data('turnover', (data = new Turnover(this, options)));
            }
            if (typeof option === "string") {
                data[option]();
            }
        });
    };
    $.fn.turnover.Constructor = Turnover;
    $.fn.turnover.defaults = {
        trigger: "click"
    };

}(window.jQuery);
