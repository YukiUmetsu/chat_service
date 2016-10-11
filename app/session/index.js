'use strict';

const config = require('../config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const db = require('../db');

if (process.env.NODE_ENV === 'production'){
  // Initialize Session with setting for production
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db.Mongoose.connection
    })
  });
} else {
  // Initialize Session with setting for development
  module.exports = session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  });
}