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

    // create a room, listen to createNewRoom event from rooms.ejs
    socket.on('createNewRoom', newRoomInput => {
      // check if the same title chatroom exists or not
      if (!helpers.findRoomByName(allrooms, newRoomInput)){
        allrooms.push({
          room: newRoomInput,
          roomID: helpers.randomHex(),
          users: []
        });

        // Emit an updated list to the creator
        socket.emit('chatRoomsList', JSON.stringify(allrooms));
        // Emit an updated list to everyone connected to the rooms page
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    });
  });

  io.of('/chatter').on('connection', socket => {
    // listen to join event, and join a chat room
    socket.on('join', data => {
      let userList = helpers.addUserToRoom(allrooms, data, socket);

      // update the list of active users
      socket.emit('updateUsersList', JSON.stringify(userList.users));
      // update the list of active users to everyone in the room
      socket.broadcast.to(data.roomID).emit('updateUsersList', JSON.stringify(userList.users)) ;
    });

    // when a socket exits
    socket.on('disconnect', () => {
      let room = helpers.removeUserFromRoom(allrooms, socket);
      socket.broadcast.to(room.roomID).emit('updateUsersList', JSON.stringify(room.users));
    });

    // When a new message arrive
    socket.on('newMessage', data => {
      // same as socket.broadcast.to
      socket.to(data.roomID).emit('inMessage', JSON.stringify(data));
    });
  });
};