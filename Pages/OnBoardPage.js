import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  BackHandler,
  Alert,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import React, { useState } from "react";
//COMPONENTS
import Modal from "../Components/Modal";

//firebise cloud messaging
import messaging from "@react-native-firebase/messaging";

//NAVIGATION
import { useNavigation, useFocusEffect } from "@react-navigation/native";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";

//ASSETS
import Logo from "../assets/myrent-mobile-logo.png";

//FONT
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

//STATIC
import { ColorPrimaryGradientOne, TextSecondGray } from "../Static/static";

const OnBoardPage = () => {
  //LOAD FONTS
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  //DECLARATIONS
  const [isExitModalShown, setIsExitModalShown] = useState(false);

  //NAV DECLARATION
  const navigation = useNavigation();

  //HANDLE LOGIN BUTTON
  const loginButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("LoginPage");
  };

  //HANDLE OWNER LOGIN BUTTON PRESS
  const ownerLoginButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("OwnerLogin");
  };

  const receptionistButtonPress = () =>{
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("ReceptionLogin");
  }

  //HANDLE EXIT APP
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to Exit?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return (
    <>
      {fontsLoaded ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.blueContainer} />
          <TouchableWithoutFeedback onPress={() => setIsExitModalShown(false)}>
            <View style={styles.onBoardPageContainer}>
              <View style={styles.imgContainer}>
                <Image
                  source={Logo}
                  style={{
                    resizeMode: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
              <Text style={styles.header}>Welcome to myRent</Text>
              <Text style={styles.subHeader}>Channel Manager & PMS system</Text>
              <View style={styles.cardContainer}>
                <Pressable
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1 },
                    styles.btnLogin,
                  ]}
                  title="Submit"
                  onPress={loginButtonPress}
                >
                  <Text style={styles.loginText}>Login to MyRent</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1 },
                    styles.btnLoginOwner,
                  ]}
                  title="Sign In"
                  onPress={ownerLoginButtonPress}
                >
                  <Text style={styles.loginTextOwner}>Login to Owner Portal</Text>
                </Pressable>
                {/* <Pressable
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1 },
                    styles.btnLoginOwner,
                  ]}
                  title="Sign In"
                  onPress={receptionistButtonPress}
                >
                  <Text style={styles.loginTextOwner}>Login as Receptionist</Text>
                </Pressable> */}
              </View>
              {/* <View
                style={[
                  styles.cardContainer,
                  {
                    marginTop: 12,
                    backgroundColor: ColorPrimaryGradientOne,
                    alignItems: "flex-end",
                    paddingHorizontal: 0,
                    paddingVertical: 0,
                  },
                ]}
              > */}
                {/* <View style={styles.cardInnerContainer}>
                  <Text style={styles.secondCardTitle}>
                    Stay Awhile and Listen
                  </Text>
                  <Text style={styles.secondCardBody}>
                    There is no one right way. Just figure out what works for
                    you!
                  </Text>
                  <Text style={styles.secondCardAuthor}>Lorii Myers</Text>
                </View> */}
              {/* </View> */}
              <View style={styles.bottomTextContainer}>
                <Text style={styles.bottomText}>
                  Thank you for working with myRent Powered by: MyRent Channel
                  Manager
                </Text>
              </View>
              {/* <View style={styles.pushNotificationsContainer}>
                <Text style={styles.pushNotificationsText}>
                  Allow push notifications?
                </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isPushEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isPushEnabled}
                />
              </View> */}
              {isExitModalShown ? (
                <Modal
                  title="Exit app?"
                  setIsExitModalShown={setIsExitModalShown}
                />
              ) : (
                ""
              )}
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#292a44" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  onBoardPageContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 6,
    backgroundColor: "transparent",
  },
  blueContainer: {
    height: Dimensions.get("window").height * 0.42,
    top: 0,
    left: 0,
    borderBottomLeftRadius: 56,
    borderBottomRightRadius: 56,
    width: Dimensions.get("window").width,
    position: "absolute",
    zIndex: 1,
    backgroundColor: ColorPrimaryGradientOne,
  },
  imgContainer: {
    marginTop: 48,
    marginBottom: 16,
    width: 75,
    height: 75,
    aspectRatio: 1,
    display: "flex",
    alignItems: "center",
  },
  pushNotificationsText: {
    fontFamily: "Poppins_700Bold",
    marginRight: 16,
  },
  pushNotificationsContainer: {
    marginTop: 64,
    display: "flex",
    width: "100%",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    color: "white",
    fontFamily: "Poppins_700Bold",
  },
  subHeader: {
    fontSize: 16,
    color: "white",
    marginBottom: 24,
    fontFamily: "Poppins_300Light",
  },
  cardContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    height: "auto",
    justifyContent: "flex-start",
    elevation: 7,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    color: "#023a64",
    fontFamily: "Poppins_700Bold",
  },
  btnLogin: {
    backgroundColor: ColorPrimaryGradientOne,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 4,
    elevation: 8,
    width: "100%",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginText: {
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "white",
  },
  postFormContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  signUpText: {
    color: TextSecondGray,
    fontSize: 14,
  },
  SignUpButtonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  SignUpButton: {
    color: "#023a64",
    fontSize: 15,
    fontFamily: "Poppins_500Medium",
  },
  cardInnerContainer: {
    width: "98%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "flex-start",
    paddingVertical: 12,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    alignItems: "flex-start",
    paddingHorizontal: 12,
  },
  secondCardTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "#023a64",
    fontSize: 15,
    marginBottom: Platform.Os === "android" ? 0 : 4,
  },
  secondCardBody: {
    fontFamily: "Poppins_400Regular",
    color: "#023a64",
    fontSize: 13,
  },
  secondCardAuthor: {
    alignSelf: "flex-end",
    fontFamily: "Poppins_600SemiBold",
    color: "#023a64",
    fontSize: 14,
  },
  bottomTextContainer: {
    width: "100%",
    paddingHorizontal: 40,
    display: "flex",
    alignItems: "center",
    marginTop: 32,
  },
  bottomText: {
    textAlign: "center",
    color: "#023a64",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
  },
  bottomLink: {
    color: TextSecondGray,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
  btnLoginOwner: {
    borderColor: ColorPrimaryGradientOne,
    backgroundColor: "white",
    elevation: 8,
    borderWidth: 2,
    borderStyle: "solid",
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 4,
    width: "100%",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginTextOwner: {
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: ColorPrimaryGradientOne,
  },
});

export default OnBoardPage;
