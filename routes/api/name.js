var connection = require('../connection'),
    
    formProperties = ['Name', 'Weight'];

exports.create = function(req, res) {
    var nameObj = {
        Name: req.body.Name,
        Weight: 1,
        AddedUserID: 1,
        ModifiedUserID: 1,
        GameID: req.params.id || req.body.GameID,
        DateAdded: 'NOW',
        DateModified: 'NOW'
    };

    var q = connection.getInsertQuery('name', nameObj, 'NameID');

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', {"NameID": response.rows[0].NameID});
        }
    });
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
};
exports.delete = function(req,res) {
    connection.query('DELETE FROM name WHERE "NameID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', 'Name Deleted');
        }
    });
};
exports.addWeight = function(req,res) {
    connection.query('UPDATE name SET "Weight"="Weight"+1 WHERE "NameID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', 'Weight added');
        }
    });
};
