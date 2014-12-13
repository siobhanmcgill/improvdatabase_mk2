var connection = require('../connection'),
    
    formProperties = ['GameID', 'TagID', 'DurationID', 'PlayerCountID', 'Description', 'Public'];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties);
    data.AddedUserID = 1;
    data.ModifiedUserID = 1; // TODO: current user, whatever

    data.DateAdded = 'NOW';
    data.DateModified = 'NOW';

    var q = connection.getInsertQuery('note', data, 'NoteID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', {NoteID: response.rows[0].NoteID});
        }
    });
};
exports.getAll = function(req,res) {
    connection.query('SELECT * FROM note;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM note WHERE "NoteID"=$1;', [req.params.id], function(err, response) {
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

    var q = connection.getUpdateQuery('note', data, {NoteID: req.params.id});

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows[0]);
        }
    });
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM note WHERE "NoteID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', 'Duration Deleted');
        }
    });
};

