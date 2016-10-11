'use strict';

const passport = require('passport');
const config = require('../config');
const FacebookStrategy = require('passport-facebook').Strategy;
const helper = require('../helpers');

module.exports = () => {
  let authProcessor = (accessToken, refreshToken, profile, done) => {
    // Find a user in the local db using profile.id
    // If a user found in the local db, return user data with done function
    // If a user not found, create one in the local db
    helper.findOne(profile.id)
      .then(result => {
        if(result){
          done(null, result);
        } else {
          // create a user and return
          helper.createNewUser(profile)
            .then(newChatUser => done(null, newChatUser))
            .catch(error => console.log('Error, creating a new user: ', error));
        }
      });
  };

  passport.use(new FacebookStrategy(config.fb, authProcessor));
}