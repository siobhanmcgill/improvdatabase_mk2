define(['backbone', 'jquery', 'underscore', 'models/game'],
    function(Backbone, $, _, Game) {
        return Backbone.Collection.extend({
            url: '/api/game',
            parse: function(response) {
                return response;
            },
            initialize: function() {
                this.on("sync", function() {
                    Backbone.trigger("data-load", this);
                });
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

            //for the dynamic table
            columns: function() {
                return [
                    "Name",
                    {
                        property: "Tags",
                        sortable: false
                    },
                    {
                        property: "Duration",
                        sortProperty: "DurationSort"
                    },
                    {
                        header: "Number of Players",
                        property: "PlayerCount",
                        sortProperty: "PlayerCountSort"
                    },
                    {
                        header: "Last Modified",
                        property: "DateModified"
                    }
                ];
            }
        });
    });
