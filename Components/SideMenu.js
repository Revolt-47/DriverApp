import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Drawer,
  DrawerItem,
  useTheme,
  IndexPath,
  Text,
} from "@ui-kitten/components";

const SideMenu = ({ navigation }) => {
  const theme = useTheme(); // Access the theme

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    // Perform logout logic, such as clearing the AsyncStorage and navigating to the login screen.
    await AsyncStorage.removeItem("driverToken");
    await AsyncStorage.removeItem("driverId");
    navigation.navigate("Login");
  };

  return (
    <Drawer
      header={() => (
        <View style={styles.header}>
          <Text category="h6" style={styles.headerText}>
            Menu
          </Text>
        </View>
      )}
      selectedIndex={new IndexPath(0)}
      onSelect={(index) => {
        if (index.row === 0) {
          handleLogout();
        }
        // Add logic for other menu items as needed
      }}
      appearance="noDivider"
      style={styles.drawer}
    >
      <DrawerItem
        title="Logout"
        onPress={handleLogout}
        style={styles.drawerItem}
        titleStyle={{ color: theme["text-basic-color"] }} // Use theme color for text
      />
      {/* Add other DrawerItems as needed */}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  headerText: {
    fontWeight: "bold",
  },
  drawer: {
    backgroundColor: "transparent", // Set the background color of the drawer
  },
  drawerItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
});

export default SideMenu;
