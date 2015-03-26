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
exports.ops = ops;

exports.testDb = function(req,res) {
    connection.query("SHOW TABLES", function(err, rows, fields) {
        res.json("200", {rows: rows, fields: fields});
    });
};

exports.create = function(req,res) {
    if (ops[req.params.op]) {
        console.log("CREATE " + req.params.op);
        ops[req.params.op].create(req,res);
    } else {
        res.send('404', 'Not Found');
    }
};
exports.getAll = function(req,res) {
    if (ops[req.params.op]) {
        console.log("GET ALL " + req.params.op);
        ops[req.params.op].getAll(req,res);
    } else {
        res.send('404', 'Not Found');
    }
};
exports.get = function(req,res) {
    if (ops[req.params.op]) {
        console.log("GET " + req.params.op, req.params.id);
        ops[req.params.op].get(req,res);
    } else {
        res.send('404', 'Not Found');
    }
};
exports.update = function(req,res) {
    if (ops[req.params.op]) {
        console.log("UPDATE " + req.params.op, req.params.id);
        ops[req.params.op].update(req,res);
    } else {
        res.send('404', 'Not Found');
    }
};
exports.delete = function(req,res) {
    if (ops[req.params.op]) {
        console.log("DELETE " + req.params.op, req.params.id);
        ops[req.params.op].delete(req,res);
    } else {
        res.send('404', 'Not Found');
    }
};
exports.method = function(req,res) {
    if (ops[req.params.op] && ops[req.params.op][req.params.method]) {
        console.log(req.params.method + " " + req.params.op, req.params.id);
        ops[req.params.op][req.params.method](req,res);
    } else {
        res.send('404', 'Not Found');
    }
};
