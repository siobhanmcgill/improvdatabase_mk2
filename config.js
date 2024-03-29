module.exports = function () {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        return {
            "token": "fe73_yspk3g2i+6$nba6_p2zm$v0rz4ihdme*!z@++ej@^463p",
            postgres: {
                host: 'localhost:5432',
                user: 'sdbuatyadcczhj',
                pass: 'password',
                db: 'd1ihmfmjooehcl'
            },
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
                url: process.env.REDISCLOUD_URL
            },
            port: process.env.PORT || 5000
        };
    }
};
