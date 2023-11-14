
const { createGame, joinGame, updateHealth, updateTurn, disconnect, games } = require('../../src/api/gameManager');

// Mocking socket.io functionality
const socketMock = {
    id: 'socket-id',
    join: jest.fn(),
    emit: jest.fn(),
    to: jest.fn(() => socketMock),
};

const ioMock = {
    to: jest.fn(() => ioMock),
    emit: jest.fn(),
};


// can have multiple describe, one for each test, or could have multiple 'it' for each function, if there are not many tests and the functions are all related to each other
describe('GameManager', () => {
    let gameCode;
    beforeEach(() => {
        // Reset the games object before each test
        Object.keys(games).forEach(key => delete games[key]);

        socketMock.emit.mockClear(); // Clear previous emit calls
        socketMock.join.mockClear(); // Clear previous join calls

        // Setup a new game before each test in this describe block
        createGame(ioMock, socketMock, 'PlayerOne');
        gameCode = socketMock.emit.mock.calls[0][1].gameCode;
    });

    describe('Start and Join game', () => {

        it('should create a game and join the player', () => {
            expect(socketMock.join).toHaveBeenCalled();
            expect(socketMock.emit).toHaveBeenCalledWith('gameCreated', expect.any(Object));
        });

        it('should allow a player to join an existing game', () => {
            joinGame(ioMock, socketMock, gameCode, 'PlayerTwo');

            expect(socketMock.join).toHaveBeenCalledWith(gameCode);

            // Check if 'gameJoined' and 'playerJoined' events are emitted
            expect(socketMock.emit).toHaveBeenCalledWith('gameJoined', expect.any(Object));
            expect(ioMock.emit).toHaveBeenCalledWith('playerJoined', expect.any(Object));
        });
    });


    describe('updateHealth', () => {
        it('should update the health of a player', () => {
            // Setup
            const playerId = socketMock.id;
            const newHealthValue = 30;

            // Test
            updateHealth(ioMock, socketMock, gameCode, playerId, newHealthValue);

            // Assertions
            expect(games[gameCode].players[playerId].health).toBe(newHealthValue);
            expect(ioMock.to).toHaveBeenCalledWith(gameCode);
            expect(ioMock.emit).toHaveBeenCalledWith('healthChanged', { playerId, newHealthValue });
        });
    });

    describe('updateTurn', () => {
        it('should increment the game turn and emit the new turn', () => {

            const initialTurn = games[gameCode].turn;

            // Test
            updateTurn(ioMock, gameCode);

            // Assertions
            expect(games[gameCode].turn).toBe(initialTurn + 1);
            expect(ioMock.to).toHaveBeenCalledWith(gameCode);
            expect(ioMock.emit).toHaveBeenCalledWith('turnChanged', initialTurn + 1);
        });
    });

});