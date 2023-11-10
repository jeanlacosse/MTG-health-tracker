const { createGame, joinGame } = require('../../src/api/gameManager');

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

describe('GameManager', () => {
    let emittedGameCode;

    it('should create a game and join the player', () => {
        createGame(ioMock, socketMock, 'PlayerOne');
        expect(socketMock.join).toHaveBeenCalled();
        expect(socketMock.emit).toHaveBeenCalledWith('gameCreated', expect.any(Object));

        // Capture the emitted game code
        emittedGameCode = socketMock.emit.mock.calls[0][1].gameCode;
    });

    it('should allows a player to join an existing game', () => {
        joinGame(ioMock, socketMock, emittedGameCode, 'PlayerTwo');
        expect(socketMock.join).toHaveBeenCalledWith(emittedGameCode);
        expect(ioMock.emit).toHaveBeenCalledWith('playerJoined', expect.any(Object));
    });
});