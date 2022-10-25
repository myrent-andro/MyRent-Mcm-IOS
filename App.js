import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
//NAVIGATION IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//EXPO STATUS BAR
import { StatusBar } from 'expo-status-bar';
//PAGES
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import OnBoardPage from "./Pages/OnBoardPage";
//EXPO SECURE STORE
import * as SecureStore from "expo-secure-store";
//SECURITY
import * as Device from "expo-device";
//CONTEXT
import { UserProvider } from "./context/ScannedContext";

//FONT
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const Stack = createStackNavigator();

export default function App() {
  //LOAD FONTS
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const [initialRoute, setInitialRoute] = useState("OnBoardPage");
  const [asyncOver, setAsyncOver] = useState(false);


  //CHECK IF GUID && WORKER_ID EXISTS (IF GUID EXISTS NAVIGATE TO HOMEPAGE ELSE STAY ON ONBOARDPAGE)
  useEffect(() => {
    async function checkGuidAndSetNavigation() {
      try {
        const guid = await SecureStore.getItemAsync("guid");
        const workerId = await SecureStore.getItemAsync("worker_id");
        if (guid && workerId) {
          setInitialRoute("HomePage");
          setAsyncOver(true);
        } else {
          setInitialRoute("OnBoardPage");
          setAsyncOver(true);
        }
      } catch (error) {
        setInitialRoute("OnBoardPage");
        setAsyncOver(true);
      }
    }
    checkGuidAndSetNavigation();
  }, []);

  //CHECKING FOR ROOTED/JAILBROKEN DEVICES
  useEffect(() => {
    async function checkSecurity() {
      try {
        const isDeviceRooted = await Device.isRootedExperimentalAsync();
        if (isDeviceRooted === true) {
          Alert.alert("HEY", "Your device is rooted/jailbroken ", [
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]);
        }
      } catch (err) {
        Alert.alert(
          "ERROR",
          "Error detecting if device is rooted/jailbroken device i ",
          [{ text: "YES", onPress: () => navigation.navigate("OnBoardPage") }]
        );
      }
    }
    checkSecurity();
  }, []);

  return (
    <>
    <UserProvider>
    <StatusBar style="light" />
      {asyncOver && (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={initialRoute.toString()}>
            <Stack.Screen
              options={{ headerShown: false }}
              name="OnBoardPage"
              component={OnBoardPage}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="LoginPage"
              component={LoginPage}
            />
            <Stack.Screen
              options={{ headerShown: false, gestureEnabled: false }}
              name="HomePage"
              component={HomePage}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </UserProvider>
    </>
  );
}
