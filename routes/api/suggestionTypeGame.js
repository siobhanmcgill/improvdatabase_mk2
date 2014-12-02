var connection = require('../connection'),
    
    formProperties = ["SuggestionTypeID', 'GameID', 'Description"];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties);
    data.AddedUserID = 1;
    data.ModifiedUserID = 1; // TODO: current user, whatever
    
    data.DateModified = 'NOW';
    data.DateAdded = 'NOW';

    var q = connection.getInsertQuery('suggestiontypegame', data, 'SuggestionTypeGameID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', {SuggestionTypeGameID: response.rows[0].SuggestionTypeGameID});
        }
    });
};

exports.getAll = function(req,res) {
    connection.query('SELECT * FROM suggestiontypegame;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};

exports.get = function(req,res) {
    connection.query('SELECT * FROM suggestiontypegame WHERE "SuggestionTypeGameID"=$1;', [req.params.id], function(err, response) {
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

    var q = connection.getUpdateQuery('suggestiontypegame', data, {SuggestionTypeGameID: req.params.id});

    connection.query(q.query, q.values, function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.send('200', 'Suggestion Type for Game Updated', req.params.id);
        }
    });
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM suggestiontypegame WHERE "SuggestionTypeID"=$1', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', 'Suggestion Type Removed from Game');
        }
    });
};
