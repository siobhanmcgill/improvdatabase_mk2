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
        return {
            token: process.env.SECRET,
            postgres: {
                host: process.env.POSTGRES_HOST,
                user: process.env.POSTGRES_USER,
                pass: process.env.POSTGRES_PASS,
                db: process.env.POSTGRES_DB
            },
            redis: {
                port: 6379,
                host: process.env.REDIS_HOST
            },
            port: process.env.PORT || 5000
        };
    }
};
