module.exports = function () {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return {
            "token": "fe73_yspk3g2i+6$nba6_p2zm$v0rz4ihdme*!z@++ej@^463p",
            "postgresql": "postgres://improv:alyson_19@localhost:5432/improv_2014",
            redis: {
                port: 6379,
                host: '127.0.0.1',
                auth: null
            },
            port: 1919
        };
    } else if (process.env.NODE_ENV === 'production') {
        var rtg = require('url').parse(process.env.REDISTOGO_URL);
        return {
            token: process.env.SECRET,
            postgresql: process.env.DATABASE_URL,
            redis: {
                port: rtg.port,
                host: rtg.hostname,
                auth: rtg.auth.split(':')[1]
            },
            port: process.env.PORT || 5000
        };
    }
};
