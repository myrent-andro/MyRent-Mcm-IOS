import React, { useEffect } from "react";
//EXPO STATUS BAR
import { StatusBar } from "expo-status-bar";

//CONTEXT
import { UserProvider } from "./context/ScannedContext";
import { LoggedProvider } from "./context/LoggedContext";
//navigators
import MainNavigator from "./navigator/MainNavigator";

//firebise cloud messaging
import messaging from "@react-native-firebase/messaging";

//FONT
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Alert } from "react-native";

export default function App() {
  //LOAD FONTS
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log("Authorization status:", authStatus);
    }
  }

  //Initialize push notifications
  useEffect(() => {
    if (requestUserPermission()) {
      // return fcm token for the device
      messaging()
        .getToken()
        .then(async (token) => {
          // console.log(token);
        });
    } else {
      console.log("Failed token status", authStatus);
    }

    //check whether an initail app is running
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          // console.log(
          //   "Hotification caused app to open from quit state: ",
          //   remoteMessage.notification
          // );
        }
      });

    //asume a message-notification contains a type property in data payload of the screen to open
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      // console.log(
      //   "Notification caused app to open from background state",
      //   remoteMessage.notification
      // );
    });

    //background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      // console.log("Message handled in the background!", remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage.notification.body);
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  return (
    <LoggedProvider>
      <UserProvider>
        <StatusBar style="light" />
        <MainNavigator />
      </UserProvider>
    </LoggedProvider>
  );
}
