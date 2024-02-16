import React, { useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Input,
  Layout,
  Text,
  Toggle,
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Snackbar } from "react-native-paper";

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSnackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const handleChangePassword = async () => {
    try {
      // Retrieve driverId and driverToken from AsyncStorage
      const result = await AsyncStorage.multiGet(["driverId", "driverToken"]);
      const [driverId, driverToken] = result;

      // Extract the values from the key-value pairs
      const driverIdValue = driverId[1];
      const driverTokenValue = driverToken[1];

      // Check if the authentication driverToken is available
      if (!driverTokenValue) {
        console.error("Authentication driverToken not found in local storage.");
        return;
      }

      // Prepare the request body
      const requestBody = {
        driverId: driverIdValue,
        token: driverTokenValue,
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      // Make a POST request to change password
      const response = await fetch(
        "http://172.17.44.214:3000/driver/changepw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      // Handle the response
      const responseData = await response.json();
      console.log("Password change response:", responseData);

      // Check if password change was successful
      if (responseData.message === "Password changed successfully.") {
        setSnackbarMessage("Password changed successfully.");
        setSnackbarVisible(true);
        setOldPassword("");
        setNewPassword("");
      } else {
        setSnackbarMessage(
          "Failed to change password. Please check your old password."
        );
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      {/* Logo */}
      <Image source={require("../assets/logo.jpeg")} style={styles.logo} />

      <Text category="h5" style={styles.title}>
        Change Password
      </Text>

      <Input
        style={styles.input}
        placeholder="Enter Old Password"
        secureTextEntry={!showPassword}
        value={oldPassword}
        onChangeText={setOldPassword}
      />

      <Input
        style={styles.input}
        placeholder="Enter New Password"
        secureTextEntry={!showPassword}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <Toggle
        style={styles.toggleButton}
        checked={showPassword}
        onChange={setShowPassword}
        text={showPassword ? "Hide Password" : "Show Password"}
      />

      <Button
        style={styles.submitButton}
        onPress={handleChangePassword}
        disabled={!oldPassword || !newPassword}
      >
        Change Password
      </Button>

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000} // Adjust the duration as needed
        style={{ backgroundColor: theme["background-basic-color-2"] }}
        action={{
          label: "Dismiss",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    alignSelf: "center",
  },
  toggleButton: {
    marginTop: 8,
    alignSelf: "center",
  },
  submitButton: {
    marginTop: 16,
    alignSelf: "center",
  },
});

export default ChangePasswordScreen;
