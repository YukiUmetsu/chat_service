'use strict';

module.exports = (io, app) => {
  // chat and user info array
  let allrooms = app.locals.chatrooms;

  // Listen to roomslist channel
  io.of('/roomslist').on('connection', socket => {
    console.log('Socket.io Connected to Client! ');
  });
};