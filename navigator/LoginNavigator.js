import { View, Text } from "react-native";
import React from "react";
//NAVIGATION IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//pageds
import OnBoardPage from "../Pages/OnBoardPage";
import LoginPage from "../Pages/LoginPage";

const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnBoardPage" screenOptions={{headerShown: false}}>
        <Stack.Screen name="OnBoardPage" component={OnBoardPage} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoginNavigator;
