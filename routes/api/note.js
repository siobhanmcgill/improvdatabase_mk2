var connection = require('../connection'),
    auth        = require('../../auth'),
    
    formProperties = ['GameID', 'TagID', 'DurationID', 'PlayerCountID', 'Description', 'Public'];

exports.create = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'note_public')) {
        var data = connection.getPostData(req.body, formProperties);
        data.AddedUserID = req.user.UserID;
        data.ModifiedUserID = req.user.UserID;

        data.DateAdded = 'NOW';
        data.DateModified = 'NOW';

        var q = connection.getInsertQuery('note', data, 'NoteID');

        connection.query(q.query, q.values, function(err, response) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('201', {NoteID: response.rows[0].NoteID});
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};

function getSelectQuery() {
    var q = 'SELECT "NoteID", "GameID", "Description", "Public", note."DateAdded", note."DateModified", ';
        q += '"AddedUserID", "ModifiedUserID", "TagID", "DurationID", "PlayerCountID", ';
        q += 'addeduser."FirstName" AS "AddedFirstName", addeduser."LastName" AS "AddedLastName", ';
        q += 'moduser."FirstName" AS "ModifiedFirstName", moduser."LastName" AS "ModifiedLastName" ';
        q += 'FROM note INNER JOIN users addeduser ON addeduser."UserID" = note."AddedUserID" ';
        q += 'INNER JOIN users moduser ON moduser."UserID" = note."ModifiedUserID"';
    return q;
}
exports.getSelectQuery = getSelectQuery;

exports.getAll = function(req,res) {
    var q = getSelectQuery() + ';';
    connection.query(q, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};

function getNote (id, callback) {
    var q = getSelectQuery() + 'WHERE "NoteID"=$1;';
    connection.query(q, [id], function(err, response) {
        callback(err, response);
    });
}

exports.get = function(req,res) {
    getNote(req.params.id, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.update = function(req,res) {
    if (req.user) {
        getNote(req.params.id, function (err, response) {
            if (!err && parseInt(response.rows.length && response.rows[0].AddedUserID) === parseInt(req.user.UserID)) {
                var data = connection.getPostData(req.body, formProperties);
                data.ModifiedUserID = req.user.UserID;
                data.DateModified = 'NOW';

                var q = connection.getUpdateQuery('note', data, {NoteID: req.params.id});

                connection.query(q.query, q.values, function(err, response) {
                    if (err) {
                        res.json('500', err);
                    } else {
                        res.json('200', response.rows[0]);
                    }
                });
                return true;
            } else {
                auth.unauthorized(req,res);
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};
exports.delete = function(req,res) {
    if (req.user) {
        getNote(req.params.id, function (err, response) {
            if (!err && parseInt(response.rows.length && response.rows[0].AddedUserID) === parseInt(req.user.UserID)) {
                connection.query('DELETE FROM note WHERE "NoteID"=$1;', [req.params.id], function(err) {
                    if (err) {
                        res.json('500', err);
                    } else {
                        res.json('200', 'Duration Deleted');
                    }
                });
                return true;
            } else {
                auth.unauthorized(req,res);
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};

