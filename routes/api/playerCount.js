var connection = require('../connection'),
    
    formProperties = ['Name', 'Description', 'Min', 'Max'];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties),
        UserID = 1;
    data.AddedUserID = UserID;
    data.ModifiedUserID = UserID; 

    data.DateAdded = 'NOW';
    data.DateModified = 'NOW';

    var q = connection.getInsertQuery('playercount', data, 'PlayerCountID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', {PlayerCountID: response.rows[0].PlayerCountID});
        }
    });
};
exports.getAll = function(req,res) {
    connection.query('SELECT * FROM playercount;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM playercount WHERE "PlayerCountID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.update = function(req,res) {
    var data = connection.getPostData(req.body, formProperties),
        UserID = 1;
    data.ModifiedUserID = UserID;
    data.DateModified = 'NOW';

    var q = connection.getUpdateQuery('playercount', data, {PlayerCountID: req.params.id});

    connection.query(q.query, q.values, function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.send('200', 'PlayerCount Updated', req.params.id);
        }
    });
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM playercount WHERE "PlayerCountID"=$1', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', 'PlayerCount Deleted');
        }
    });
};
