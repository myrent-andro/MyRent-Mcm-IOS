import { View, Text } from "react-native";
import React from "react";
//NAVIGATION IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//pageds
import OnBoardPage from "../Pages/OnBoardPage";
import LoginPage from "../Pages/LoginPage";
import OwnerLogin from "../Pages/owner/OwnerLogin";
import ReceptionLogin from "../Pages/reception/ReceptionLogin";

const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="OnBoardPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="OnBoardPage" component={OnBoardPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="OwnerLogin" component={OwnerLogin} />
        <Stack.Screen name="ReceptionLogin" component={ReceptionLogin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginNavigator;
