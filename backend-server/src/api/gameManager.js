// gameManager.js

const games = {}; // Stores game state for each game

// Function to generate a unique game code
const generateUniqueCode = () => {
    // Ensure this generates a unique code for each game
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const createGame = (io, socket, playerName) => {
    const gameCode = generateUniqueCode();
    games[gameCode] = {
        players: {
            [socket.id]: {
                playerName: playerName,
                health: 40, // Starting health for each player
            },
        },
        turn: 1, // Track the turn number
    };
    socket.join(gameCode);
    socket.emit('gameCreated', { gameCode, state: games[gameCode] });
};

const joinGame = (io, socket, gameCode, playerName) => {
    if (games[gameCode]) {
        socket.join(gameCode);
        games[gameCode].players[socket.id] = {
            playerName: playerName,
            health: 40, // Starting health for each player
        };

        socket.emit('gameJoined', { gameCode, state: games[gameCode] });
        io.to(gameCode).emit('playerJoined', {
            playerId: socket.id,
            playerName: playerName,
            health: 40,
        });
    } else {
        socket.emit('error', 'Game not found');
    }
};

const updateHealth = (io, socket, gameCode, playerId, newHealthValue) => {
    try {
        if (games[gameCode] && games[gameCode].players[playerId]) {
            // Update the player's health
            games[gameCode].players[playerId].health = newHealthValue;

            // Broadcast the health change to all players in the game
            io.to(gameCode).emit('healthChanged', { playerId, newHealthValue });
        }
    } catch (error) {
        console.error(`Error handling healthUpdate for game ${gameCode}: ${error}`);
    }
};

const updateTurn = (io, gameCode) => {
    if (games[gameCode]) {
        // Increment the turn count
        games[gameCode].turn += 1;

        // Broadcast the turn change to all players in the game
        io.to(gameCode).emit('turnChanged', games[gameCode].turn);
    }
};

const disconnect = (io, socket) => {
    // Handle player disconnection, update game state if necessary
    console.log('Client disconnected');
    // Logic to handle disconnection and potentially clean up the game state
};

module.exports = {
    createGame,
    joinGame,
    updateHealth,
    updateTurn,
    disconnect,
    games
};
