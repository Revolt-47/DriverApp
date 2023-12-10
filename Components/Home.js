import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Avatar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SideMenu from './SideMenu';
import ChangePasswordScreen from './ChangePassword';
import UpdateProfileScreen from './UpdateProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentsScreen from './Students';

const HomeScreen = ({ navigation }) => {
  const Drawer = createDrawerNavigator();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverToken = await AsyncStorage.getItem('driverToken');
        const driverId = await AsyncStorage.getItem('driverId');

        const response = await fetch('http://192.168.18.51:3000/driver/getDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: driverToken,
            driverId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch driver details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching driver details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const CustomDrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <Image source={require('../assets/logo.jpeg')} style={{ width: 80, height: 80, borderRadius: 40 }} />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  };

  function MyDrawer() {
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <Drawer.Navigator initialRouteName="Students" drawerContent={(props) => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="lock" size={size} color={color} />
            ),
          }}
        />

<Drawer.Screen
          name="Students"
          component={StudentsScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-child" size={size} color={color} />
            ),
          }}
        />


        <Drawer.Screen
          name="UpdateProfile"
          component={UpdateProfileScreen}
          initialParams={{ user }}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-edit" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="Logout"
          component={SideMenu}
          options={{
            drawerIcon: ({ color, size }) => (
              <Avatar.Icon size={size} icon="logout" color={color} style={{ backgroundColor: 'white' }} />
            ),
          }}
        />
      </Drawer.Navigator>
    );
  }

  return <>{MyDrawer()}</>;
};

export default HomeScreen;
