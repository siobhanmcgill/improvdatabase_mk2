var connection = require("../connection"),
    tagApi  = require("./tag"),
    
    formProperties = ["Description", "DurationID", "PlayerCountID", "ParentGameID"];

exports.create = function(req,res) {
    var data = connection.getPostData(req.body, formProperties),
    UserID = 1;

    data.AddedUserID = UserID; //
    data.ModifiedUserID = UserID; //  TODO: current user, whatever
    
    data.DateModified = 'NOW';
    data.DateAdded = 'NOW';

    var q = connection.getInsertQuery('game', data, 'GameID');

    var tagIDs = req.body.Tags || [];

    connection.query(q.query, q.values, function(err, result) {
        if (err) {
            res.json("500", err);
        } else {
            var nameData = {
                GameID: result.rows[0].GameID,
                DateAdded: 'NOW',
                DateModified: 'NOW',
                Name: req.body.Name,
                Weight: 1,
                AddedUserID: UserID,
                ModifiedUserID: UserID
            };

            var nameq = connection.getInsertQuery('name', nameData, 'NameID');

            connection.query(nameq.query, nameq.values, function(err, nameResponse) {
                if (err) {
                    res.json("500", err);
                } else {
                    for(var t = 0, maxt = tagIDs.length; t < maxt; t++) {
                        tagApi.tagGame(nameData.GameID, tagIDs[t]);
                    }

                    res.json("200", {GameID: nameData.GameID, NameID: nameResponse.rows[0].NameID});
                }
            });

        }
    });
};
exports.getAll = function(req, res) {
    connection.query('SELECT * FROM game;', function(err, response) {
        if (err) {
            if (!res) {
                return err;
            } else {
                res.json("500", err);
            }
        } else {
            if (!res) {
                return response.rows;
            }else {
                res.json("200", response.rows);
            }
        }
    });
};
exports.get = function(req,res) {
    connection.query('SELECT * FROM game WHERE "GameID"=$1', [req.params.id], function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows);
        }
    });
};
exports.update = function(req,res) {
    var data = connection.getPostData(req.body, formProperties),
        UserID = 1;
    data.ModifiedUserID = UserID;
    
    var gameid;
    if (req.params.id) {
        gameid = req.params.id;
    } else {
        gameid = req.body.GameID;
    }

    var q = connection.getUpdateQuery('game', data, { GameID: gameid });

    connection.query(q.query, q.values, function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows[0]);
        }
    });
};
exports.delete = function(req, res) {
    // TODO: delete from other tables, too?
    connection.query('DELETE FROM game WHERE "GameID"=$1;', [req.params.id], function(err) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", "Game Deleted");
        }
    });
};

//unique things!
exports.getNames = function(req, res) {
    connection.query('SELECT * FROM name WHERE "GameID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows);
        }
    });
};
exports.getNotes = function(req,res) {
    connection.query('SELECT * FROM note WHERE "GameID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows);
        }
    });
};
exports.getTags = function(req,res) {
    connection.query('SELECT * FROM tag, taggame WHERE tag."TagID"=taggame."TagID" AND taggame."GameID"=$1;', [req.params.id], function(err, response) {
        if (err) {
            res.json("500", err);
        } else {
            res.json("200", response.rows);
        }
    });
};
exports.addTag = function(req, res) {
    var data = [
            req.params.id,
            req.params.toId,
            1
        ],
        query = 'INSERT INTO taggame ("GameID", "TagID", "AddedUserID") VALUES ($1, $2, $3);';
    connection.query(query, data, function(err) {
        if (err) {
            res.json("500", err);
        } else {
            res.send("200", "Tag applied");
        }
    });
};
exports.removeTag = function(req, res) {
    connection.query('DELETE FROM taggame WHERE "GameID"=$1 AND "TagID"=$2', [req.params.id, req.params.toId], function(err) {
        if (err) {
            res.json("500", err);
        } else {
            res.send("200", "Tag removed");
        }
    });
};
