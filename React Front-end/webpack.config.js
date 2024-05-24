const path = require('path');

module.exports = {
    resolve: {
        fallback: {
            util: require.resolve('util'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            zlib: require.resolve('browserify-zlib'),
            stream: require.resolve('stream-browserify'),
        },
    },
};
