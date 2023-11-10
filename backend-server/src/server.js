// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const gameManager = require('./api/gameManager'); // Import the game logic module

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 4000;

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('createGame', () => gameManager.createGame(io, socket));
    socket.on('joinGame', (gameCode) => gameManager.joinGame(io, socket, gameCode));
    socket.on('healthUpdate', (gameCode, playerId, newHealthValue) => gameManager.updateHealth(io, socket, gameCode, playerId, newHealthValue));
    socket.on('disconnect', () => gameManager.disconnect(io, socket));
});

server.listen(port, () => console.log(`Server running on port ${port}`));
