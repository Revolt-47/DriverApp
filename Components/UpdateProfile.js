import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Avatar, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateProfileScreen = ({ route }) => {
  const [contactNumber, setContactNumber] = useState(
    route.params.user.contactNumber
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUpdateProfile = async () => {
    try {
      const result = await AsyncStorage.multiGet(["driverId", "driverToken"]);
      const [driverId, driverToken] = result;

      const driverIdValue = driverId[1];
      const driverTokenValue = driverToken[1];

      if (!driverTokenValue) {
        console.error("Authentication driverToken not found in local storage.");
        return;
      }

      const response = await fetch(
        `http://172.17.44.214:3000/driver/${driverIdValue}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: driverTokenValue,
            contactNumber: contactNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setSnackbarMessage("Profile Updated Successfully");
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Failed to update profile");
      setSnackbarVisible(true);
    }
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    <View style={styles.container}>
      <Avatar.Icon size={80} icon="account" style={styles.avatar} />

      <Text style={styles.label}>Name</Text>
      <TextInput
        mode="outlined"
        value={route.params.user.name}
        style={styles.input}
        disabled
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        mode="outlined"
        value={route.params.user.email}
        style={styles.input}
        disabled
      />

      <Text style={styles.label}>CNIC</Text>
      <TextInput
        mode="outlined"
        value={route.params.user.cnic}
        style={styles.input}
        disabled
      />

      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        mode="outlined"
        value={contactNumber}
        onChangeText={(text) => setContactNumber(text)}
        style={styles.input}
        placeholder="Enter Contact Number"
      />

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleUpdateProfile}
      >
        Update Profile
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000} // You can adjust the duration as needed
        action={{
          label: "OK",
          onPress: onDismissSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  avatar: {
    backgroundColor: "black",
    marginBottom: 20,
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "black",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "black",
  },
});

export default UpdateProfileScreen;
