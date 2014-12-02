var _   = require("underscore"),
    connection = require("./connection");

/*
 * GET home page.
 */
exports.renderIndex = function(req, res){
    var data = {};
    var tables = [
        "duration",
        "game",
        "comedygroup",
        "name",
        "note",
        "playercount",
        "suggestion",
        "suggestiontype",
        "suggestiontypegame",
        "tag",
        "taggame",
        "users"
    ];
    var cnt = 0;
    _.each(tables, function(table) {
        connection.query("SELECT * FROM " + table, function(err, result) {
            data[table] = err || result.rows;
            cnt++;
            if (cnt === tables.length) {
                res.render('layout', { 
                    title: 'Improv Comedy Database',
                    data: JSON.stringify(data)
                });
            }
        });
    });
};
