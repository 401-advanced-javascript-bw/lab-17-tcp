'use strict';
//gives ability to use TCP
require('dotenv').config;
const PORT = process.env.PORT || 3000;
const CLIENT_NAME = 'localhost';

const fs = require('fs');
const util = require('util');

const net = require('net');
const socket = new net.Socket();
socket.connect(PORT, CLIENT_NAME, () => {
  console.log('socket.connect');
});

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const read = file => readFile(file);
const toUppercase = data => Buffer.from(data.toString().toUpperCase());
const write = (file, data) => writeFile(file, data);

const alterFile = file => {
  return read(file)
    .then(data => toUppercase(data))
    .then(data => write(file, data))
    .then(() => socket.write('save:file data sent from client'))
    .catch(error => socket.write('error:an error occurred'));
};

let file = process.argv.slice(2).shift();
alterFile(file);
