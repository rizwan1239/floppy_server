/* eslint-disable no-console */
const app = require('./server');
const http = require('http');
const WebSocket = require('ws');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('new connection:', ws._socket.remoteAddress, ws._socket.remotePort);

  ws.on('message', (message) => {
    console.log('received message:', message);
    // Handle incoming messages from the Unreal client here
  });

  ws.on('close', () => {
    console.log('socket disconnected');
  });

  ws.send('welcome');
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
