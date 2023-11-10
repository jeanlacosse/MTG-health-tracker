import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    code: null,
    players: []
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameCode: (state, action) => {
            state.code = action.payload;
        },
        addPlayer: (state, action) => {
            state.players.push(action.payload);
        },
        updatePlayerHealth: (state, action) => {
            const player = state.players.find(p => p.id === action.payload.id);
            if (player) {
                player.health = action.payload.health;
            }
        }
        // ... other reducers as needed
    }
});

export const { setGameCode, addPlayer, updatePlayerHealth } = gameSlice.actions;

export default gameSlice.reducer;
