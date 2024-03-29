
import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input, Text, Layout } from "@ui-kitten/components";
import { Snackbar } from "react-native-paper";

const logoImage = require("../assets/logo.jpeg");


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] =
    useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    // Retrieve guardianId and driverToken from AsyncStorage
    AsyncStorage.multiGet(["driverId", "driverToken"]).then((result) => {
      const [driverId, driverToken] = result;

      // Extract the values from the key-value pairs
      const driverIdValue = driverId[1];
      const driverTokenValue = driverToken[1];


      if(driverIdValue && driverTokenValue){
        registerIndieID(driverIdValue, 19959, 'tOGmciFdfRxvdPDp3MiotN');
          navigation.navigate('Home')

      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      console.log(email, password);

      const response = await fetch("http://172.17.44.214:3000/driver/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        // Handle non-successful response
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log(responseData);
      const token = responseData.token;
      const driverId = responseData.driverId;

      registerIndieID(driverId, 19959, 'tOGmciFdfRxvdPDp3MiotN');
// Store the driverToken and guardianId in local storage
await AsyncStorage.setItem('driverToken', token);
await AsyncStorage.setItem('driverId', driverId);

      // Store the driverToken and guardianId in local storage
      await AsyncStorage.setItem("driverToken", token);
      await AsyncStorage.setItem("driverId", driverId);

      // Display a success snackbar
      setSnackbarMessage("Login Successful");
      setSnackbarVisible(true);

      // Navigate to the Home screen
      navigation.navigate("Home");
    } catch (error) {
      console.error("Login failed:", error);

      // Display an error snackbar
      setSnackbarMessage(
        "Login Failed. Please check your credentials and try again."
      );
      setSnackbarVisible(true);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Layout style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text category="h4" style={styles.heading}>
          Driver App
        </Text>
        <View style={styles.formShapeContainer}>
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            placeholder="Enter your password"
          />
          <Button
            onPress={handleLogin}
            style={styles.button}
            appearance="filled"
          >
            Login
          </Button>
          <Text
            style={styles.forgotPasswordLink}
            onPress={handleForgotPassword}
          >
            Forgot Password?
          </Text>
        </View>
        <Text style={styles.credentialsText}>
          Your credentials were sent to your email by the School Administrator
          when you signed up your child.
        </Text>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
        >
          {snackbarMessage}
        </Snackbar>
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formShapeContainer: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
  },
  heading: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    borderRadius: 25,
  },
  button: {
    marginTop: 16,
    borderRadius: 25,
    borderColor: "#7e7e7e",
    backgroundColor: "#7e7e7e",
  },
  credentialsText: {
    marginTop: 16,
    textAlign: "center",
    fontStyle: "italic",
    fontSize: 10,
  },
  forgotPasswordLink: {
    textAlign: "center",
    color: "#000000",
    textDecorationLine: "underline",
    marginTop: 8,
  },
});

export default LoginScreen;
