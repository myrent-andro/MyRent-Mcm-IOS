import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  Platform,
} from "react-native";

//nav
import { useNavigation } from "@react-navigation/native";
//context
import { LoggedContext } from "../../context/LoggedContext";
//EXPO
import Constants from "expo-constants";
//EXPO SECURE STORE
import * as SecureStore from "expo-secure-store";
//EXPO ICONS
import { Ionicons } from "@expo/vector-icons";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";

import { ColorPrimaryGradientOne, TextSecondGray } from "../../Static/static";

//AXIOS
import axios from "axios";

const OwnerLogin = () => {
  const navigation = useNavigation();
  const { setIsUserLoggedIn } = useContext(LoggedContext);

  //FOR TEXT INPUTS
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //CHANGE SHOW HIDE PASSWORD ICON
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  //ARE LOGIN CREDENTIALS TRUE
  const [isCredentialsTrue, setIsCredentialsTrue] = useState(true);

  //ON CHANGE FUNCTIONS FOR INPUT FIELDS
  const onChangeUsername = (text) => setUsername(text);
  const onChangePassword = (text) => setPassword(text);

  //SET PASSWORD VISIBILITY
  const handlePasswordVisibility = () => {
    if (passwordVisibility) {
      setPasswordVisibility(!passwordVisibility);
    } else if (!passwordVisibility) {
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const handleSubmit = async () => {
    axios
      .get(
        `https://api.my-rent.net/owners_app/get_id?u=${username}&p=${password}`
      )
      .then((res) => {
        setIsCredentialsTrue(true);
        const credentials_array = res.data;
        if (credentials_array.length === 0) {
          resetFields();
          setIsCredentialsTrue(false);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
        } else {
          save("owner_id", credentials_array[0].id);
          save("user_id", credentials_array[0].user_id);
          save("app", "owner");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
          setIsUserLoggedIn(true);
        }
      })
      .catch((err) => {
        resetFields();
        setIsCredentialsTrue(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
      });
  };

  //SAVE GUID AND WORKER_ID AND USRE_ID IN EXPO SECURE STORE
  async function save(key, value) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch {
      Alert.alert("Error", "Error saving your credidentials", [
        { text: "YES", onPress: () => null },
      ]);
    }
  }

  const resetFields = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <SafeAreaView style={styles.loginPageContainer}>
        <View
          style={{
            height: Platform.OS === "android" ? Constants.statusBarHeight : 0,
            backgroundColor: "#FFFFFF",
          }}
        />
        <View style={styles.blueContainer} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginPageInnerContainer}>
              <View style={styles.upperNavigation}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Keyboard.dismiss();
                    navigation.navigate("OnBoardPage");
                  }}
                >
                  <Ionicons name="arrow-back" size={28} color="white" />
                </Pressable>
                <Text style={styles.upperNavigationText}>Login as Owner</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Login as Owner</Text>
                <View
                  style={[
                    styles.inputContainer,
                    isCredentialsTrue
                      ? { borderWidth: 0 }
                      : { borderWidth: 1, borderColor: "#cc0000" },
                  ]}
                >
                  <Text
                    style={{
                      position: "absolute",
                      zIndex: 99,
                      top: 1,
                      fontSize: 10,
                      fontFamily: "Poppins_600SemiBold",
                      color: isCredentialsTrue
                        ? ColorPrimaryGradientOne
                        : "#cc0000",
                      marginLeft: 12,
                    }}
                  >
                    Username
                  </Text>
                  <TextInput
                    value={username}
                    onChangeText={onChangeUsername}
                    placeholder="Type Your Username"
                    style={styles.textInput}
                  />
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    isCredentialsTrue
                      ? { borderWidth: 0 }
                      : { borderWidth: 1, borderColor: "#cc0000" },
                  ]}
                >
                  <Text
                    style={{
                      position: "absolute",
                      zIndex: 99,
                      top: 1,
                      fontSize: 10,
                      fontFamily: "Poppins_600SemiBold",
                      color: isCredentialsTrue
                        ? ColorPrimaryGradientOne
                        : "#cc0000",
                      marginLeft: 12,
                    }}
                  >
                    Password
                  </Text>
                  <TextInput
                    secureTextEntry={passwordVisibility}
                    value={password}
                    autoCorrect={false}
                    onChangeText={onChangePassword}
                    placeholder="Type your password"
                    style={styles.textInput}
                  />
                  <Pressable
                    style={{ padding: 4 }}
                    onPress={handlePasswordVisibility}
                  >
                    {passwordVisibility ? (
                      <Ionicons name="eye" size={24} color="black" />
                    ) : (
                      <Ionicons name="eye-off" size={24} color="black" />
                    )}
                  </Pressable>
                </View>
                {isCredentialsTrue ? (
                  ""
                ) : (
                  <View style={styles.WrongEmailPasswordContainer}>
                    <Text style={styles.WrongEmailPasswordText}>
                      Your username or password are wrong. Try again!
                    </Text>
                  </View>
                )}
                <Pressable
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.8 : 1 },
                    styles.btnLogin,
                  ]}
                  title="Submit"
                  onPress={handleSubmit}
                >
                  <Text style={styles.loginText}>Login as Owner</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  loginPageContainer: {
    zIndex: 6,
    flex: 1,
    backgroundColor: "white",
  },
  blueContainer: {
    height: Dimensions.get("window").height * 0.42,
    top: 0,
    left: 0,
    borderBottomLeftRadius: 56,
    borderBottomRightRadius: 56,
    width: Dimensions.get("window").width,
    position: "absolute",
    zIndex: 0,
    backgroundColor: ColorPrimaryGradientOne,
  },
  loginPageInnerContainer: {
    paddingHorizontal: 20,
    width: "100%",
    height: "100%",
  },
  upperNavigation: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    alignItems: "center",
  },
  upperNavigationText: {
    color: "white",
    marginLeft: 8,
    fontSize: 17,
    fontWeight: "500",
  },
  cardTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: "#023a64",
    marginBottom: 24,
    textAlign: "center",
  },
  cardContainer: {
    backgroundColor: "white",
    width: "100%",
    height: "auto",
    elevation: 7,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    paddingHorizontal: 16,
    paddingVertical: 32,
    marginTop: 32,
    borderRadius: 8,
  },
  textInput: {
    paddingHorizontal: 4,
    fontSize: 14,
    height: 50,
    backgroundColor: "white",
    width: "90%",
  },
  inputContainer: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    width: "100%",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 7,
    marginBottom: 16,
    borderRadius: 4,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 4,
  },
  btnLogin: {
    borderColor: ColorPrimaryGradientOne,
    backgroundColor: "white",
    elevation: 8,
    borderWidth: 2,
    borderStyle: "solid",
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
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
    color: ColorPrimaryGradientOne,
  },
  signUpText: {
    color: TextSecondGray,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },
  WrongEmailPasswordContainer: {
    marginVertical: 4,
    width: "100%",
  },
  WrongEmailPasswordText: {
    color: "#cc0000",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  forgotAndBtnContainer: {
    marginTop: 16,
    width: 44,
    height: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 8,
  },
  btnForgotPassword: {},
  forgotPasswordText: {
    fontWeight: "700",
    fontSize: 12,
    color: ColorPrimaryGradientOne,
  },
});

export default OwnerLogin;
