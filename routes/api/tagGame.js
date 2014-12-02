var connection = require("../connection"),
    
    formProperties = ["TagID", "GameID"];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties);
    data.AddedUserID = 1;
    data.DateAdded = 'NOW';

    var q = connection.getInsertQuery('taggame', data, 'TagGameID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", {TagGameID: response.rows[0].TagGameID});
        }
    });
};
exports.getAll = function(req,res) {
    connection.query("SELECT * FROM taggame;", function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows);
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM taggame WHERE "TagGameID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows);
        }
    });
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM taggame WHERE "TagGameID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", "Tag removed from game");
        }
    });
};
