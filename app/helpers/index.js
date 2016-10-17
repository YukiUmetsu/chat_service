'use strict';

const router = require('express').Router();
const db = require('../db');
const crypto = require('crypto');

// Iterate through the routes object and mount the routes
let _registerRoutes = (routes, method) => {
  for (let key in routes) {
    if (typeof routes[key] === 'object' && routes[key] !== null && !(routes[key] instanceof Array)) {
      _registerRoutes(routes[key], key);
    } else {
      // Register the routes
      if (method === 'get') {
        router.get(key, routes[key]);
      } else if (method === 'post') {
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
    }
  }
};

let route = routes => {
  _registerRoutes(routes);
  return router;
};


// Find a user based on a key
let findOne = profileID => {
  return db.userModel.findOne({
    'profileId': profileID
  });
};

// Create a new user
let createNewUser = profile => {
  return new Promise((resolve, reject) => {
    let newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ''
    });

    newChatUser.save(error => {
      if(error){
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
};

// ES6 promisified version of findById
let findById = (id) => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if (error){
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};

// check if user is logged in or not
let isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()){
    next();
  } else {
    res.redirect('/');
  }
};

// find room that has the same title
let findRoomByName = (allrooms, room) => {
  let findRoom = allrooms.findIndex((element, index, array) => {
    if(element.room === room){
      return true;
    } else {
      return false;
    }
    return findRoom > -1 ? true : false;
  });
};

// Function that returns a random room ID
let randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
}

module.exports = {
  route,
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
  findRoomByName,
  randomHex
};