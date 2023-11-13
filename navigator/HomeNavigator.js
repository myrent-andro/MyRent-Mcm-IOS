import React, { useEffect, useState } from "react";
//NAVIGATION IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//expo secure store
import * as SecureStore from "expo-secure-store";

//pages
import HomePage from "../Pages/HomePage";
import OwnerHome from "../Pages/owner/OwnerHome";
import ReceptionHome from "../Pages/reception/ReceptionHome";

const Stack = createStackNavigator();

const HomeNavigator = () => {
  const [appNavigate, setAppNavigate] = useState(false);
  //navigate to owner app or worker app
  useEffect(() => {
    const checkApp = async () => {
      try {
        const app = await SecureStore.getItemAsync("app");
        if (app.replace('"', "").replace('"', "") === "owner") {
          setAppNavigate("OwnerHome");
        } else if (app.replace('"', "").replace('"', "") === "worker") {
          setAppNavigate("HomePage");
        } else if (app.replace('"', "").replace('"', "") === "rec") {
          setAppNavigate("ReceptionHome");
        }
      } catch (error) {}
    };
    checkApp();
  }, []);
  return (
    <>
      {appNavigate && (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={appNavigate.toString()}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="OwnerHome" component={OwnerHome} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="ReceptionHome" component={ReceptionHome} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

export default HomeNavigator;
