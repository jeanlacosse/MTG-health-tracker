// ReduxConnectedComponent.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGameCode } from '../redux/slices/gameSlice';
import { Text, TouchableOpacity } from 'react-native';

function ReduxConnectedComponent() {
    const gameCode = useSelector((state) => state.game.code);
    const dispatch = useDispatch();

    const handleSetGameCode = () => {
        dispatch(setGameCode('TEST123'));
    };

    return (
        <>
            <TouchableOpacity onPress={handleSetGameCode}>
                <Text>Set Dummy Game Code</Text>
            </TouchableOpacity>
            <Text>Game Code: {gameCode || "Not yet set"}</Text>
        </>
    );
}

export default ReduxConnectedComponent;