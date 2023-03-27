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

//firebise cloud messaging
import messaging from "@react-native-firebase/messaging";

//EXPO
import Constants from "expo-constants";
//EXPO SECURE STORE
import * as SecureStore from "expo-secure-store";
//EXPO ICONS
import { Ionicons } from "@expo/vector-icons";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";

//NAVIGATION
import { useNavigation } from "@react-navigation/native";

//STATIC VARIABLES
import { ColorPrimaryGradientOne, TextSecondGray } from "../Static/static";

//AXIOS
import axios from "axios";

//ENV
import { API_LOGIN_URL } from "@env";

//context
import { LoggedContext } from "../context/LoggedContext";

const LoginPage = () => {
  //DECLARATIONS
  //DECLARING NAVIGATION
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

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }

  const getUserId = async (worker_id) => {
    const worker_id_quteless = worker_id.replace(`"`, ``);
    return await fetch(
      `https://api.my-rent.net/workers/get_user_id?id=${worker_id_quteless}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        return await getUserGuid(data);
      })
      .catch((err) => console.log(err));
  };

  const getUserGuid = async (user_id) => {
    console.log("USER_ID:" + user_id);
    const user_id_qless = user_id.replace(`"`, ``).replace(`"`, ``);
    return await fetch(`https://api.my-rent.net/users/guid/${user_id_qless}`)
      .then((response) => response.text())
      .then((data) => {
        return data;
      })
      .catch((err) => console.log(err));
  };

  //on login set login param to true
  const set_login_param_true = async (worker_id, token, user_guid) => {
    const is_logged_in = "Y";
    await fetch(
      `https://api.my-rent.net/mcm/update_login_state?worker_id=${worker_id}&key=${token}&is_logged_in=${is_logged_in}`,
      {
        headers: {
          user_guid: user_guid.replace(`"`, ``).replace(`"`, ``),
        },
      }
    )
      .then(() => console.log("SAMO UPDEJTAM STATE"))
      .catch((err) => console.log(err));
  };

  //add new device with key to that worker if device for that worker is not registred
  const add_new_key_to_db = async (worker_id, token, user_guid) => {
    await fetch(
      `https://api.my-rent.net/mcm/add_new_key_to_db?worker_id=${worker_id}&key=${token}`,
      {
        headers: {
          user_guid: user_guid.replace(`"`, ``).replace(`"`, ``),
        },
      }
    ).then(() => console.log("DODAN NOVI DEVICE"));
  };

  const checkIfWorkerExsist = async (worker_id, token, user_guid) => {
    //worker id (eliminate qutes)
    const worker_id_quteless = worker_id.replace(`"`, ``).replace(`"`, ``);

    const response = await fetch(
      `https://api.my-rent.net/mcm/check_if_device_is_new_for_specific_worker?key=${token}&worker_id=${worker_id_quteless}`,
      {
        headers: {
          user_guid: user_guid.replace(`"`, ``).replace(`"`, ``),
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (data) => {
        if (data[0].is_push_id === "N") {
          await add_new_key_to_db(worker_id_quteless, token, user_guid);
        } else {
          await set_login_param_true(worker_id_quteless, token, user_guid);
        }
      })
      .catch((err) => console.log(err));
  };

  const canUserLogin = async (guid, worker_id, user_guid) => {
    const push_token = await SecureStore.getItemAsync("push_token");
    if (guid && worker_id && user_guid && push_token) {
      setIsUserLoggedIn(true);
    } else {
      setUsername("");
      setPassword("");
      setIsCredentialsTrue(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
    }
  };

  //ON LOGIN BUTTON CLICK
  const handleSubmit = () => {
    axios
      .post(`${API_LOGIN_URL}`, {
        username: username,
        password: password,
      })
      .then(async (res) => {
        console.log(res.data);
        setIsCredentialsTrue(true);
        await save("guid", res.data.guid);
        await save("worker_id", res.data.id);
        //get user guid provided worker id
        const user_guid = await getUserId(res.data.id);
        await save("user_guid", user_guid);

        if (requestUserPermission()) {
          messaging()
            .getToken()
            .then(async (token) => {
              save("push_token", token);
              await checkIfWorkerExsist(res.data.id, token, user_guid);
            });
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
        canUserLogin(user_guid, res.data.guid, res.data.id);
      })
      .catch((err) => {
        console.log(err);
        setUsername("");
        setPassword("");
        setIsCredentialsTrue(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Error);
      });
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
                <Text style={styles.upperNavigationText}>Sign in</Text>
              </View>
              <View style={styles.cardContainer}>
                <Text style={styles.cardTitle}>Sign in</Text>
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
                  <Text style={styles.loginText}>Sign in</Text>
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
    backgroundColor: ColorPrimaryGradientOne,
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 4,
    elevation: 8,
    width: "100%",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 24,
  },
  loginText: {
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "white",
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

export default LoginPage;
