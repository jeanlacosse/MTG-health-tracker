// ######### ATTEMPT ONE ###########

// import { BleManager } from 'react-native-ble-plx';
// import React, { useState, useEffect, useRef } from 'react';
// import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { Alert, Linking } from 'react-native';


// function BluetoothManager({ onDeviceDiscovered, onDeviceConnected, onDeviceDisconnected, onUnexpectedDisconnect, onError }) {

//     const [manager] = useState(new BleManager());
//     const [devices, setDevices] = useState([]); // list of discovered devices
//     const [connectedDevice, setConnectedDevice] = useState(null) // current connected device
//     const [bluetoothState, setBluetoothState] = useState(null);

//     const onErrorRef = useRef(onError);
//     const SCAN_DURATION = 7000;
//     useEffect(() => {
//         const requestBluetoothPermissions = async () => {
//             const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
//             console.log("Permission result:", result);
//             if (result === RESULTS.DENIED) {
//                 const requestResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

//                 if (requestResult === RESULTS.GRANTED) {
//                     console.log("Permission granted, you can proceed with Bluetooth operations")
//                     if (bluetoothState === 'PoweredOn') {
//                         scanDevices();
//                     }
//                 } else {
//                     console.log("Permission denied")
//                     promptUserForBluetoothConditions();
//                 }
//             } else if (result === RESULTS.GRANTED) {
//                 console.log("Permission already granted, you can proceed with Bluetooth operations")
//                 if (bluetoothState === 'PoweredOn') {
//                     scanDevices();
//                 }
//             } else if (result === RESULTS.BLOCKED) {
//                 console.log("Permission blocked");
//                 promptUserForBluetoothConditions();
//             }
//         };

//         requestBluetoothPermissions();
//     }, []);


//     useEffect(() => {
//         onErrorRef.current = onError;
//     }, [onError]);

//     // Check that BT is on nad listen for state changes
//     useEffect(() => {
//         const subscription = manager.onStateChange((state) => {
//             setBluetoothState(state);
//             console.log('Bluetooth state is:', state)

//             switch (state) {
//                 case 'PoweredOn':
//                     scanDevices();
//                     break;
//                 case 'PoweredOff':
//                     // Cleanup operations
//                     setDevices([]);
//                     setConnectedDevice(null);
//                     // Show a message to the user
//                     onErrorRef.current && onErrorRef.current(new Error('Bluetooth is powered off. Please turn it on.'));
//                     break;
//                 case 'Unauthorized':
//                     // Cleanup operations
//                     setDevices([]);
//                     setConnectedDevice(null);
//                     // Inform the user
//                     onErrorRef.current && onErrorRef.current(new Error('The app is not authorized to use Bluetooth. Please grant permissions from system settings.'));
//                     break;
//                 case 'Unsupported':
//                     // Cleanup or disable Bluetooth features
//                     setDevices([]);
//                     setConnectedDevice(null);
//                     // Inform the user
//                     onErrorRef.current && onErrorRef.current(new Error('Bluetooth Low Energy is not supported on this device.'));
//                     break;
//                 case 'Resetting':
//                     // Optionally pause Bluetooth operations
//                     // Inform the user
//                     onErrorRef.current && onErrorRef.current(new Error('Bluetooth is in an unknown/resetting state.'));
//                     break;
//                 default:
//                     break;
//             }

//         }, true);

//         return () => {
//             subscription.remove();
//             manager.stopDeviceScan();

//             if (connectedDevice) {
//                 connectedDevice.disconnect();
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (connectedDevice) {
//             const disconnectSubscription = connectedDevice.onDisconnected((error, device) => {
//                 // Device got disconnected
//                 setConnectedDevice(null);
//                 if (error) {
//                     onErrorRef.current && onErrorRef(new Error('Device got disconnected unexpectedly.'));
//                 }
//                 onUnexpectedDisconnect && onUnexpectedDisconnect();
//             });

//             return () => {
//                 disconnectSubscription.remove();
//             };
//         }
//     }, [connectedDevice, onError, onDeviceDisconnected]);


//     // Scan for devices
//     const scanDevices = () => {
//         console.log("starting device scan...");
//         if (bluetoothState !== 'PoweredOn') {
//             onErrorRef.current && onErrorRef.current(new Error('Bluetooth is not turned on.'));
//             return;
//         }

//         manager.startDeviceScan(null, null, (error, device) => {
//             if (error) {
//                 // Handle error
//                 onErrorRef.current && onErrorRef.current(error);
//                 return;
//             }

//             console.log("Discovered device:", device.name || 'Unknown Device');

//             // Add the discovered device to the list
//             setDevices(prevDevices => [...prevDevices, device]);

//             // notify the parent component
//             onDeviceDiscovered && onDeviceDiscovered(device);
//         });

//         setTimeout(() => {
//             manager.stopDeviceScan();
//         }, SCAN_DURATION);
//     };

//     // Connection to a new device
//     const MAX_RETRIES = 3;
//     let retryCount = 0;

//     const connectToDevice = (deviceId) => {
//         manager.connectToDevice(deviceId)
//             .then((device) => {
//                 setConnectedDevice(device);
//                 onDeviceConnected && onDeviceConnected(device);
//             })
//             .catch((error) => {
//                 if (retryCount < MAX_RETRIES) {
//                     retryCount++;
//                     setTimeout(() => connectToDevice(deviceId), 5000); // Retry after 5 seconds
//                 } else {
//                     onErrorRef.current && onErrorRef.current(error);
//                     retryCount = 0;
//                 }
//             });
//     };

//     // turn on settings for nearby devices
//     const promptUserForBluetoothConditions = () => {
//         Alert.alert(
//             "Bluetooth Permissions Needed",
//             "To use Bluetooth features, please ensure that 'Nearby Devices' is enabled in your device settings.",
//             [
//                 {
//                     text: "Open Settings",
//                     onPress: () => Linking.openSettings() // this will open your app's settings
//                 },
//                 {
//                     text: "Cancel",
//                     style: "cancel"
//                 }
//             ]
//         );
//     }


//     // Disconnected device
//     const disconnectDevice = () => {
//         if (connectedDevice) {
//             connectedDevice.disconnect();
//             setConnectedDevice(null);
//             onDeviceDisconnected && onDeviceDisconnected();
//         }
//     };

//     return null;
// }

// export default BluetoothManager;

// import React, { useState, useEffect } from 'react';
// import { Modal, View, Text, Button, FlatList } from 'react-native';
// import BluetoothManager from '../BluetoothManager';


// function BluetoothLobby() {
//     const [discoveredDevices, setDiscoveredDevices] = useState([]);
//     const [currentDevice, setCurrentDevice] = useState(null);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [isDisconnectModalVisible, setDisconnectModalVisible] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         console.log("discovered devices are", discoveredDevices);
//     }, [discoveredDevices]);

//     const handleDeviceDiscovered = (device) => {
//         setDiscoveredDevices(prevDevices => {
//             // Check if the device is already in the list
//             if (prevDevices.some(d => d.id === device.id)) {
//                 return prevDevices; // Return the previous state if the device is already in the list
//             }
//             return [...prevDevices, device]; // Append the new device if it's not in the list
//         });
//     };


//     const handleDeviceConnected = (device) => {
//         setCurrentDevice(device);
//     };

//     const handleDeviceDisconnected = () => {
//         setCurrentDevice(null);
//     };

//     const handleDeviceError = (error) => {
//         console.error("Bluetooth Error:", error);
//         setError(error);
//         setModalVisible(true);
//     };

//     return (
//         <View style={{ flex: 1, padding: 20 }}>
//             <BluetoothManager
//                 onDeviceDiscovered={handleDeviceDiscovered}
//                 onDeviceConnected={handleDeviceConnected}
//                 // intentional disconnect
//                 onDeviceDisconnected={handleDeviceDisconnected}
//                 // unintentional disconnect
//                 onUnexpectedDisconnect={() => setDisconnectModalVisible(true)}
//                 onError={handleDeviceError}
//             />

//             {currentDevice ? (
//                 <View>
//                     <Text>Connected to: {currentDevice.name}</Text>
//                     <Button title="Disconnect" onPress={() => setCurrentDevice(null)} />
//                 </View>
//             ) : (
//                 <FlatList
//                     data={discoveredDevices}
//                     keyExtractor={(item) => item.id}
//                     renderItem={({ item }) => (
//                         <View style={{ marginVertical: 10 }}>
//                             <Text>{item.name || 'Unknown Device'}</Text>
//                             <Button title="Connect" onPress={() => setCurrentDevice(item)} />
//                         </View>
//                     )}
//                 />
//             )}
//             {/* Modal is for error handling popup for BT connection */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isModalVisible}
//                 onRequestClose={() => {
//                     setModalVisible(false);
//                 }}
//             >
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
//                         <Text>Error: {error ? error.message : ''}</Text>
//                         <Button title="Close" onPress={() => setModalVisible(false)} />
//                     </View>
//                 </View>
//             </Modal>
//             {/* Modal for unexpected device disconnection */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isDisconnectModalVisible}
//                 onRequestClose={() => {
//                     setDisconnectModalVisible(false);
//                 }}
//             >
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
//                         <Text style={{ fontSize: 18, marginBottom: 20 }}>Device Disconnected</Text>
//                         <Text style={{ marginBottom: 20 }}>The Bluetooth device has been unexpectedly disconnected.</Text>
//                         <Button title="Okay" onPress={() => setDisconnectModalVisible(false)} />
//                     </View>
//                 </View>
//             </Modal>

//         </View>

//     );
// }

// export default BluetoothLobby;