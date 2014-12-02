var connection = require("../connection"),
    
    formProperties = ["FirstName", "LastName", "Gender", "Email", "URL", "GroupID"];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties);

    data.DateAdded = 'NOW';
    data.DateModified = 'NOW';

    var q = connection.getInsertQuery('users', data, 'UserID');

    connection.query(q.query, q.values, function(err, result) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", result.rows[0].UserID);
        }
    });
};
exports.getAll = function(req,res) {
    connection.query("SELECT * FROM users;", function(err, result) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", result.rows);
        }
    });
};
exports.get = function(req, res) {
    // (mysql) connection.query("SELECT * FROM users WHERE UserID="+req.params.id+";", function(err,rows,fields) {
    connection.query('SELECT * FROM users WHERE "UserID"=$1;', [req.params.id], function (err, result) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", result.rows);
        }
    });
};
exports.update = function(req, res) {
    var data = connection.getPostData(req.body, formProperties);

    data.DateModified = 'NOW';

    var q = connection.getUpdateQuery('users', data, { UserID: req.params.id });

    connection.query(q.query, q.values, function(err) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", "User Updated");
        }
    });
};
exports.delete = function(req, res) {
    //connection.query("DELETE FROM users WHERE UserID="+req.params.id+";", function(err,rows,fields) {
    connection.query('DELETE FROM users WHERE "UserID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", "User Deleted");
        }
    });
};

