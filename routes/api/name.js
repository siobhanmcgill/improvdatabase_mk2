var connection = require('../connection'),
    auth        = require('../../auth'),
    
    formProperties = ['Name', 'Weight'];

exports.create = function(req, res) {
    if (req.user && auth.hasPermission(req.user, 'name_submit')) {
        var nameObj = {
            Name: req.body.Name,
            Weight: 1,
            AddedUserID: req.user.UserID,
            ModifiedUserID: req.user.UserID,
            GameID: req.params.id || req.body.GameID,
            DateAdded: 'NOW',
            DateModified: 'NOW'
        };

        var q = connection.getInsertQuery('name', nameObj, 'NameID');

        connection.query(q.query, q.values, function(err, response) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('201', {"NameID": response.rows[0].NameID});
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
exports.getAll = function(req,res) {
    connection.query('SELECT * FROM name;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM name WHERE "NameID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.update = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'name_update')) {
        var data = connection.getPostData(req.body, formProperties);
        data.ModifiedUserID = 1;
        data.DateModified = 'NOW';

        var q = connection.getUpdateQuery('name', data, {NameID: req.params.id});
        
        connection.query(q.query, q.values, function(err, response) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('200', response.rows[0]);
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
exports.delete = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'name_delete')) {
        connection.query('DELETE FROM name WHERE "NameID"=$1;', [req.params.id], function(err) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('200', 'Name Deleted');
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
exports.addWeight = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'name_vote')) {
        connection.query('UPDATE name SET "Weight"="Weight"+1 WHERE "NameID"=$1;', [req.params.id], function(err) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('200', 'Weight added');
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
