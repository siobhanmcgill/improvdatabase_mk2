var connection = require("../connection"),
    auth        = require('../../auth'),

    formProperties = ["TagID", "GameID"];

exports.create = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'game_edit')) {
        var data = connection.getPostData(req.body, formProperties);
        data.AddedUserID = req.user.UserID;
        data.ModifiedUserID = req.user.UserID;
        data.DateAdded = 'NOW';

        var q = connection.getInsertQuery('taggame', data, 'TagGameID');

        connection.query(q.query, q.values, function(err, response) {
            if (err) {
                res.json("500", err);
            } else {
                res.json("200", {TagGameID: response.rows[0].TagGameID});
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
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
    if (req.user && auth.hasPermission(req.user, 'game_edit')) {
        connection.query('DELETE FROM taggame WHERE "TagGameID"=$1;', [req.params.id], function(err) {
            if (err) {
                res.json("500", err);
            } else {
                res.json("200", "Tag removed from game");
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
