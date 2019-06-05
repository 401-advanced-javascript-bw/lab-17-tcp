'use strict';
require('dotenv').config;
const port = process.env.PORT || 3000;

const net = require('net');
const server = net.createServer();

server.listen(port, () => console.log(`Server up on ${port}`));

const socketPool = {};
const allowedCommands = ['save', 'error'];

const dispatchEvent = buffer => {
  let text = buffer.toString().trim();
  const [command, bufferData] = text.split(':');
  if (allowedCommands.includes(command)) {
    const messageToSocket = { command, bufferData };
    console.log(`Sending ${messageToSocket.bufferData} to everyone`);
    for (let socket in socketPool) {
      socketPool[socket].write(JSON.stringify(messageToSocket));
    }
  } else {
    console.log(`Ignoring ${command}`);
  }
};

server.on('connection', socket => {
  const id = `Socket-${Math.random()}`;
  socketPool[id] = socket;
  socket.on('data', buffer => dispatchEvent(buffer));
  socket.on('close', () => {
    delete socketPool[id];
  });
});
