var connection = require('../connection'),
    auth        = require('../../auth'),
    
    formProperties = ["Name', 'SuggestionTypeID"];

exports.create = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'suggestion_create')) {
        var data = connection.getPostData(req.body, formProperties);
        data.AddedUserID = 1;
        data.ModifiedUserID = 1; // TODO: current user, whatever
        
        data.DateModified = 'NOW';
        data.DateAdded = 'NOW';

        var q = connection.getInsertQuery('suggestion', data, 'SuggestionID');

        connection.query(q.query, q.values, function(err, response) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('200', {SuggestionID: response.rows[0].SuggestionID});
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
exports.getAll = function(req,res) {
    connection.query('SELECT * FROM suggestion;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM suggestion WHERE "SuggestionID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.update = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'suggestion_update')) {
        var data = connection.getPostData(req.body, formProperties);
        data.ModifiedUserID = 1; // TODO: current user, whatever
        data.DateModified = 'NOW';

        var q = connection.getUpdateQuery('suggestion', data, {SuggestionID: req.params.id});

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
    if (req.user && auth.hasPermission(req.user, 'suggestion_delete')) {
        connection.query('DELETE FROM suggestion WHERE "SuggestionID"=$1;', [req.params.id], function(err) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('200', 'Suggestion Deleted');
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
