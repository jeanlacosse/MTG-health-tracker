const { createGame, joinGame } = require('../../src/api/gameManager');

// Mocking socker.io functionality
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
    it('should create a game and join the player', () => {
        createGame(ioMock, sockerMock, 'PlayerOne');
        expect(socketMock.join).toHaveBeenCalled();
        expect(socketMock.emit).toHaveBeenCalledWith('gameCreated', expect.any(Object));
    });

    it('should allows a player to join an existing game', () => {
        const gameCode = 'testCode';
        joinGame(ioMock, socketMock, gameCode, 'PlayerTwo');
        expect(socketMock.join).toHaveBeenCalledWith(gameCode);
        expect(ioMock.emit).toHaveBeenCalledWith('playerJoined', expect.any(Object));
    });
});