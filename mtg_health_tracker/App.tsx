// App.jsx
import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import ReduxConnectedComponent from './components/ReduxConnectedComponent';



function App(): JSX.Element {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Text>MTG Health Tracker</Text>
            </View>
        </SafeAreaView>
    );
}

export default App;