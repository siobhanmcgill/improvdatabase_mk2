var jwt = require('jwt-simple'),
    userApi = require('./routes/api/user'),
    config  = require('config').get('token'),
    redis   = require('redis'),
    client  = redis.createClient(6379);

exports.login = function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username === '' || password === '') {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid credentials"
        });
        return;
    }

    // Fire a query to your DB and check if the credentials are valid
    userApi.validateUser(username, password, function (err, user) {
        if (err) {
            res.json('500', { 'message': 'Server error', 'error': err });
        } else {
            if (user) {
                genToken(user, function (err, token) {
                    if (err) {
                        console.error('REDIS ERROR', err);
                    }
                    res.json('200', token);
                });
            } else {
                res.json('401', { 'message': 'Invalid login' });
            }
        }
    });
};

exports.logout = function (req, res) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        // instantly expire the token
        client.expire(token, 0, function (err, response) {
            if (err) {
                res.json('500', { message: 'Server Error', error: err });
            } else if (response) {
                res.json('200', { message: 'Logout' });
            }
        });
    }
};
 
function genToken(user, callback) {
    var expires = expiresIn(60), // one hour
        token = jwt.encode({
            exp: expires,
            iss: user.UserID
        }, config.secret),
        multi = client.multi();

    multi.set(token, user.UserID);
    multi.expire(token, 60 * 60); // one hour in seconds

    multi.exec(function (err) {
        callback(err, {
            token: token,
            expires: expires,
            user: user
        });
    });
}
 
function expiresIn(numMinutes) {
    var dateObj = new Date();
    return dateObj.setMinutes(dateObj.getMinutes() + numMinutes);
}

exports.checkToken = function (req, res, next) {

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    
    req.user = false;
    if (token) {
        try {
            var decoded = jwt.decode(token, config.secret);
            
            // first make sure the token hasn't expired
            if (decoded.exp > Date.now()) {
                // now make sure the user exists
                // The iss parameter would be the logged in user's UserID
                userApi.findUser(decoded.iss, null, function (err, user) {
                    if (user) {
                        // now make sure the token exists
                        client.get(token, function (err, response) {
                            // the stored ID should be the supplied User ID
                            if (response && response === user.UserID) {
                                req.user = user;
                                console.log('USER FOUND', user);
                            }
                            next();
                        });
                    } else {
                        next();
                    }
                }); 
            } else {
                next();
            }
        } catch (err) {
            return next();
        }
    } else {
        return next();
    }
};

function unauthorized (req, res) {
    res.status(401);
    res.json({
        "message": "Unauthorized"
    });
}
exports.unauthorized = unauthorized;

exports.hasPermission = function (user, key) {
    var perms = user.Permissions;
    if (!perms) {
        return false;
    }
    return perms.indexOf(key) > -1;
};
