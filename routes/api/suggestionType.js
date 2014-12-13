var connection = require('../connection'),
    
    formProperties = ['Name', 'Description'];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties);
    data.AddedUserID = 1;
    data.ModifiedUserID = 1; // TODO: current user, whatever
    
    data.DateModified = 'NOW';
    data.DateAdded = 'NOW';

    var q = connection.getInsertQuery('suggestiontype', data, 'SuggestionTypeID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', {SuggestionTypeID: response.rows[0].SuggestionTypeID});
        }
    });
};

exports.getAll = function(req,res) {
    connection.query('SELECT * FROM suggestiontype;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM suggestiontype WHERE "SuggestionTypeID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.update = function(req,res) {
    var data = connection.getPostData(req.body, formProperties);
    data.ModifiedUserID = 1; // TODO: current user, whatever
    data.DateModified = 'NOW';

    var q = connection.getUpdateQuery('suggestiontype', data, {SuggestionTypeID: req.params.id});

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows[0]);
        }
    });
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM suggestiontype WHERE "SuggestionTypeID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', 'Suggestion Type Deleted');
        }
    });
};
