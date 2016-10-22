'use strict';

const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');

// Social Authentication login
require('./auth')();

// Create an IO server instance
let ioServer = app => {
  app.locals.chatrooms = [];
  const server = require('http').Server(app);
    const io = require('socket.io')(server);
    // force socket.io to use only websocket not long-poring
    io.set('transports', ['websocket']);
    // redis client interface
    // interface to send data
    let pubClient = redis(config.redis.port, config.redis.host, {
      auth_pass: config.redis.password
    });
    // interface to get data
    let subClient = redis(config.redis.port, config.redis.host, {
      // return_buffers is default false and return string version of data
      return_buffers: true,
      auth_pass: config.redis.password
    });
    io.adapter(adapter({
      pubClient,
      subClient
    }));

    io.use((socket, next) => {
        // let socket.io to access user profile in the session
        require('./session')(socket.request, {}, next);
    });
    require('./socket')(io, app);
    return server;
};

module.exports = {
    router: require('./routes')(),
    session: require('./session'),
    ioServer,
    logger: require('./logger')
};