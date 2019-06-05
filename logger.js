'use strict';
require('dotenv').config;
const PORT = process.env.PORT || 3000;
const CLIENT_NAME = 'localhost';

const net = require('net');
const socket = new net.Socket();

socket.connect(PORT, CLIENT_NAME, () => {
  console.log('socket.connect');
});

socket.on('data', data => {
  console.log('this is the data', JSON.parse(data.toString()));
});

socket.on('error', error => {
  console.log('error:', error);
});
