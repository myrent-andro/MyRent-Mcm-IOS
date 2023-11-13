import React from "react";
//EXPO STATUS BAR
import { StatusBar } from "expo-status-bar";

//CONTEXT
import { UserProvider } from "./context/ScannedContext";
import { LoggedProvider } from "./context/LoggedContext";
//navigators
import MainNavigator from "./navigator/MainNavigator";

//FONT
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function App() {
  //LOAD FONTS
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  return (
    <LoggedProvider>
      <UserProvider>
        <StatusBar style="light" />
        <MainNavigator />
      </UserProvider>
    </LoggedProvider>
  );
}
