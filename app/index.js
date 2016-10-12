'use strict';

// Social Authentication login
require('./auth')();

module.exports = {
    router: require('./routes')(),
    session: require('./session')
};