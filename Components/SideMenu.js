import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';


const SideMenu = ({ navigation }) => {


  useEffect(()=>{
    handleLogout();
  })


  const handleLogout = async () => {
    const driverId = await AsyncStorage.getItem('driverId');
    // Perform logout logic, such as clearing the AsyncStorage and navigating to the login screen.
    unregisterIndieDevice(driverId, 19959, 'tOGmciFdfRxvdPDp3MiotN');
    await AsyncStorage.removeItem('driverToken');
    await AsyncStorage.removeItem('driverId');
    navigation.navigate('Login');
  };

  return (
    <>
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
      />
      {/* Add other DrawerItems as needed */}
</>
  );
};



export default SideMenu;
