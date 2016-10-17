'use strict';

module.exports = (io, app) => {
  // chat and user info array
  let allrooms = app.locals.chatrooms;

  allrooms.push({
    room: 'Good Food',
    roomID: '0001',
    users: []
  });

  allrooms.push({
    room: 'Cloud Computing',
    roomID: '0002',
    users: []
  });

  // Listen to roomslist channel
  io.of('/roomslist').on('connection', socket => {
    // Listen to getChatrooms Event
    socket.on('getChatrooms', () => {
      // Emit an event with allrooms info in JSON
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });
  });
};