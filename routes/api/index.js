var connection = require("../connection"),
    
    ops     = {
        "user": require('./user'),
        "game": require('./game'),
        "duration": require('./duration'),
        "playerCount": require('./playerCount'),
        "name": require("./name"),
        "note": require("./note"),
        "tag": require("./tag"),
        "suggestion": require("./suggestion"),
        "suggestionType": require("./suggestionType"),
        "suggestionTypeGame": require("./suggestionTypeGame"),
        "tagGame": require("./tagGame")
    };


exports.testDb = function(req,res) {
    connection.query("SHOW TABLES", function(err, rows, fields) {
        res.json("200", {rows: rows, fields: fields});
    });
};

exports.create = function(req,res) {
    console.log("CREATE " + req.params.op);
    ops[req.params.op].create(req,res);
};
exports.getAll = function(req,res) {
    console.log("GET ALL " + req.params.op);
    ops[req.params.op].getAll(req,res);
};
exports.get = function(req,res) {
    console.log("GET " + req.params.op, req.params.id);
    ops[req.params.op].get(req,res);
};
exports.update = function(req,res) {
    console.log("UPDATE " + req.params.op, req.params.id);
    ops[req.params.op].update(req,res);
};
exports.delete = function(req,res) {
    console.log("DELETE " + req.params.op, req.params.id);
    ops[req.params.op].delete(req,res);
};
exports.method = function(req,res) {
    console.log(req.params.method + " " + req.params.op, req.params.id);
    ops[req.params.op][req.params.method](req,res);
};
