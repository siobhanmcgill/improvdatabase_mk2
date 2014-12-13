var config  = require("config"),
    url     = require("url"),
    _       = require("underscore"),
    pg      = require("pg"),

    conString = 'postgres://improv:alyson_19@localhost/improv_2014';

exports.query = function(query, values, callback) {
    /*
    var connection = mysql.createConnection(conObj);

    connection.connect();

    var q = connection.query(query, callback);

    connection.end();

    return q;
    */
    pg.connect(conString, function (err, client, done) {
        if (err) {
            // TODO: handle errors
            console.error('PostgreSQL error', err);
            return err;
        }
        var queryobj;
        if (typeof(values) === 'function') {
            callback = values;
            queryobj = query;
        } else {
            queryobj = {
                text: query,
                values: values
            }
        }
        client.query(queryobj, function (err, result) {
            done();
            if (err) {
                return console.error('error running query', queryobj, err);
            }
            callback(err, result);
        });
    });
};

/*
exports.insert = function(query, obj, callback) {
    var connection = mysql.createConnection(conObj);

    connection.connect();

    // Q!
    var q = connection.query(query, obj, callback);
    console.log(q.sql);

    connection.end();
};
*/

exports.getPostData = function(postData, names) {
    var obj = [];
    _.each(names, function(name) {
        if (postData[name]) {
            obj[name] = postData[name];
        }
    });
    return obj;
};

exports.getInsertQuery = function (table, data, id) {
    var query, values = [];

    query = 'INSERT INTO ' + table + '(';

    _.each(_.keys(data), function (item, i) {
        if (i > 0) {
            query += ', ';
        }
        query += '"' + item + '"';
    });

    query += ') VALUES (';

    _.each(_.values(data), function (item, i) {
        if (!item) {
            item = '';
        }

        var qval = item[1] === 'NOW' ? 'CURRENT_TIMESTAMP' : '$' + (i + 1);
        
        if (i > 0) {
            query += ', ';
        }
        query += qval;
        values.push(item);
    });

    query += ') RETURNING "' + id + '";';

    return { query: query, values: values};
};

exports.getUpdateQuery = function (table, data, where) {

    var query, columns, values = [], cnt = 1;

    query = 'UPDATE ' + table + ' SET ';
    columns = '';

    _.each(_.pairs(data), function (item) {
        if (item[1]) {
            var qval = item[1] === 'NOW' ? 'CURRENT_TIMESTAMP' : '$' + cnt;
            
            if (cnt > 1) {
                query += ', ';
            }
            query += '"' + item[0] + '"=' + qval;

            if (item[1] !== 'NOW') {
                values.push(item[1]);
                cnt++;
            }
        }
    });
    
    query += ' WHERE ';

    _.each(_.pairs(where), function (item, i) {
        if (i > 0) {
            query += ' AND ';
        }
        query += '"' + item[0] + '"=$' + cnt;
        values.push(item[1]);
        cnt++;
    });

    query += ' RETURNING *;';

    return {query: query, values: values};
};
