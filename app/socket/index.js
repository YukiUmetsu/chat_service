'use strict';
const helpers = require('../helpers');

module.exports = (io, app) => {
  // chat and user info array
  let allrooms = app.locals.chatrooms;

  // Listen to roomslist channel
  io.of('/roomslist').on('connection', socket => {
    // Listen to getChatrooms Event
    socket.on('getChatrooms', () => {
      // Emit an event with allrooms info in JSON
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });

    // create a room
    socket.on('createNewRoom', newRoomInput => {
      // check if the same title chatroom exists or not
      if (!helpers.findRoomByName(allrooms, newRoomInput)){
        allrooms.push({
          room: newRoomInput,
          roomID: helpers.randomHex(),
          users: []
        });

        // Emit an updated list to the creator
        socket.emit('chatRoomList', JSON.stringify(allrooms));
        // Emit an updated list to everyone connected to the rooms page
        socket.broadcast.emit('chatRoomList', JSON.stringify(allrooms));
      }
    });
  });
};