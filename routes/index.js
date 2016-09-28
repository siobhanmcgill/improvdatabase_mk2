var _   = require("underscore"),
    connection = require("./connection");

/*
 * GET home page.
 */
exports.renderIndex = function(req, res) {
    res.render('layout', {
        title: 'Improv Comedy Database'
    });
};

 /* DEPRECATED: bootstraps all the data, which makes the page load super slow
exports.renderIndex = function(req, res){
    var data = {};
    var tables = [
        "duration",
        "game",
        "name",
        "note",
        "playercount",
        "tag",
        "taggame"
    ];
    var cnt = 0;
    _.each(tables, function(table) {
        var q = connection.getSelectQuery(table);
        connection.query(q, function(err, result) {
            data[table.toLowerCase()] = err || result.rows;
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
*/
