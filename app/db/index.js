'use strict';

const config = require('../config');
const Mongoose = require('mongoose').connect(config.dbURI);
const logger = require('../logger');

// Log out error if connection fails
Mongoose.connection.on('error', error => {
    logger.log('error', 'Mongoose DB Error: ' + error);
});

// Create Schema
const chatUser = new Mongoose.Schema({
  profileId: String,
  fullName: String,
  profilePic: String
});

// Turn a schema into a usable model
let userModel = Mongoose.model('chatUser', chatUser);

module.exports = {
  Mongoose,
  userModel
};