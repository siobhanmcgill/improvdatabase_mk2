var connection = require('../connection'),
    auth        = require('../../auth'),
    
    formProperties = ['Name', 'Description'];

exports.create = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'meta_create')) {
        var data = connection.getPostData(req.body, formProperties),
            UserID = req.user.UserID;

        data.AddedUserID = UserID;
        data.ModifiedUserID = UserID;

        data.DateAdded = 'NOW';

        var q = connection.getInsertQuery('tag', data, 'TagID');

        connection.query(q.query, q.values, function(err, response) {
            if (err) {
                res.json('500', err);
            } else {
                if (req.body.GameID) {
                    var tagGameObj = {
                        GameID: req.body.GameID,
                        AddedUserID: UserID,
                        TagID: response.rows[0].TagID,
                        DateAdded: 'NOW'
                    };
                    var tq = connection.getInsertQuery('taggame', tagGameObj, 'TagGameID');
                    connection.query(tq.query, tq.values, function(err, tr) {
                        if (err) {
                            res.json('500', err);
                        } else {
                            res.json('200', {TagID: tagGameObj.TagID, TagGameID: tr.rows[0].TagGameID});
                        }
                    });
                } else {
                    res.json('200', {TagID: response.rows[0].TagID});
                }
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};

exports.getAll = function(req,res) {
    connection.query('SELECT * FROM tag;', function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};

exports.get = function(req,res) {
    connection.query('SELECT * FROM tag WHERE "TagID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json('500', err);
        } else {
            res.json('200', response.rows);
        }
    });
};
exports.update = function(req,res) {
    if (req.user && auth.hasPermission(req.user, 'meta_update')) {
        var data = connection.getPostData(req.body, formProperties);
        data.ModifiedUserID = req.user.UserID; 
        data.DateModified = 'NOW';

        var q = connection.getUpdateQuery('tag', data, {TagID: req.params.id});

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
    if (req.user && auth.hasPermission(req.user, 'meta_delete')) {
        connection.query('DELETE FROM tag WHERE "TagID"=$1;', [req.params.id], function(err) {
            if (err) {
                res.json('500', err);
            } else {
                res.json('200', 'Tag Deleted');
            }
        });
    } else {
        auth.unauthorized(req,res);
    }
};

exports.tagGame = function(GameID, TagID, UserID) {
    var tagGameObj = {
        GameID: GameID,
        TagID: TagID,
        AddedUserID: UserID,
        ModifiedUserID: UserID,
        DateAdded: 'NOW'
    };

    var q = connection.getInsertQuery('taggame', tagGameObj, 'TagGameID');

    console.log('Attach Tag', TagID, 'To Game', GameID);

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            return err;
        } else {
            return response.rows[0].TagGameID;
        }
    });
};

