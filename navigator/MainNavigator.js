import React, { useContext, useState, useEffect } from "react";
//expo secure store
import * as SecureStore from "expo-secure-store";

//navigators
import HomeNavigator from "./HomeNavigator";
import LoginNavigator from "./LoginNavigator";
//context
import { LoggedContext } from "../context/LoggedContext";

const MainNavigator = () => {
  const { isUserLoggedIn, setIsUserLoggedIn } = useContext(LoggedContext);

  //CHECK IF GUID && WORKER_ID EXISTS (IF GUID EXISTS NAVIGATE TO HOMEPAGE ELSE STAY ON ONBOARDPAGE)
  useEffect(() => {
    async function checkGuidAndSetNavigation() {
      try {
        const owner_id = await SecureStore.getItemAsync("owner_id");
        const user_id = await SecureStore.getItemAsync("user_id");
        const guid = await SecureStore.getItemAsync("guid");
        const workerId = await SecureStore.getItemAsync("worker_id");
        const push_token = await SecureStore.getItemAsync("push_token");
        const user_guid = await SecureStore.getItemAsync("user_guid");
        const rec_guid = await SecureStore.getItemAsync("rec_guid");
        if (
          rec_guid ||
          (owner_id && user_id) ||
          (guid && workerId && push_token && user_guid)
        ) {
          setIsUserLoggedIn(true);
        } else {
          setIsUserLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setIsUserLoggedIn(false);
      }
    }
    checkGuidAndSetNavigation();
  }, []);

  return <>{isUserLoggedIn ? <HomeNavigator /> : <LoginNavigator />}</>;
};

export default MainNavigator;
