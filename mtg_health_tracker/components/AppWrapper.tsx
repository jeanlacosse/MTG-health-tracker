
// App.jsx
// import React from 'react';
// import { SafeAreaView } from 'react-native';
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import ReduxConnectedComponent from './ReduxConnectedComponent';

// function App(): JSX.Element {
//   return (
//     <Provider store={store}>
//       <SafeAreaView>
//         <Text>MTG Health Tracker</Text>
//         <ReduxConnectedComponent />
//       </SafeAreaView>
//     </Provider>
//   );
// }

// export default App;

import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import App from '../App';

function AppWrapper() {
  return (
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
}

export default AppWrapper;
