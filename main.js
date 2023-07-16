/* eslint-disable no-console */
const app = require('./server');
const dotenv = require('dotenv').config();
const socket = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('new connection:', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('socket disconnected:', reason);
  });
  socket.emit('message', 'welcome');

    // Custom event 'getdata' listener
    socket.on('getdata', (data) => {
        console.log('get data event with parameter:', data);
        // Sending the JSON data back to the client
        socket.emit('message', data);
    });
});
