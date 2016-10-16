'use strict';

const passport = require('passport');
const config = require('../config');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const helper = require('../helpers');

module.exports = () => {
  // Store unique user _id from mongodb to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  // when a request was received, it will run this code.
  passport.deserializeUser((id, done) => {
    // find user using the _id
    helper.findById(id)
      .then(user => done(null, user))
      .catch(error => console.log('error desirializing user', error));
  });


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
  passport.use(new TwitterStrategy(config.twitter, authProcessor));
}