
define(['jquery',
        'underscore',
        'backbone',
        
        'text!templates/loader.html'
        ],
    function($, _, Backbone, LoaderTemplate) {
        return Backbone.View.extend({
            events: {

            },
            initialize: function(options) {
                this.total = options.total;
                this.loaded = 0;

                this.on("addLoad", this.doLoad);
            },
            render: function() {
                this.$el.append(_.template(LoaderTemplate));
            },
            doLoad: function(item) {
                this.loaded++;
                var percentage = (this.loaded / this.total) * 100;
                this.$(".bar").css("width", percentage + "%");
                this.$(".loader-output").append("<h5>" + item.length + " " + item.friendlyName + "s</h5>");
            }
        });
    });
