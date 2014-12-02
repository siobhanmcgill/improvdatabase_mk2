var connection = require('../connection'),
    
    formProperties = ["Name", "Description", "Min", "Max"];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties),
        UserID = 1;
    data.AddedUserID = UserID;
    data.ModifiedUserID = UserID;

    data.DateAdded = 'NOW';
    data.DateModified = 'NOW';

    var q = connection.getInsertQuery('duration', data, 'DurationID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', {DurationID: response.rows[0].DurationID});
        }
    });
};
exports.getAll = function(req,res) {
    connection.query('SELECT * FROM duration;', function(err, response) {
        if (err) {
            if (!res) {
                return err;
            } else {
                res.json('500', err);
            }
        } else {
            if (!res) {
                return response.rows;
            }else {
                res.json('200', response.rows);
            }
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM duration WHERE "DurationID"=$1;', [req.params.id], function(err, response) {
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
    
    //req.params.id);

    var q = connection.getUpdateQuery('duration', data, { DurationID: req.params.id });

    connection.query(q.query, q.values, function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.send('200', 'Duration Updated ' + req.params.id);
        }
    });
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM duration WHERE "DurationID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', "Duration Deleted");
        }
    });
};
