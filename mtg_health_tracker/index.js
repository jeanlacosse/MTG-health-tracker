/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import App from './App';
import AppWrapper from './components/AppWrapper';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppWrapper);
