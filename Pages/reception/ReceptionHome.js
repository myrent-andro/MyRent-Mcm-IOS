import {
  StyleSheet,
  BackHandler,
  View,
  SafeAreaView,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
  NativeEventEmitter,
  Text,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
//EXPO SECURE STORE
import * as SecureStore from "expo-secure-store";
//context
import { LoggedContext } from "../../context/LoggedContext";
import { UserContext } from "../../context/ScannedContext";
//REACT NATIVE WEB VIEW
import { WebView } from "react-native-webview";
import { useFocusEffect } from "@react-navigation/native";
//colors
import { ColorPrimaryGradientOne } from "../../Static/static";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";
import ScanButton from "../../Components/ScanButton";
import ShowScannedData from "../../Components/ShowScannedData";
//EXPO STATUS BAR
import { StatusBar } from "expo-status-bar";

//RNFS (READ FILE FROM BUNDLE)
import * as RNFS from "react-native-fs";

//KeyboardAwareScrollView
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//REGULA
import DocumentReader, {
  Enum,
  DocumentReaderCompletion,
  RNRegulaDocumentReader,
  ScenarioIdentifier,
} from "@regulaforensics/react-native-document-reader-api";

//FONT
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const eventManager = new NativeEventEmitter(RNRegulaDocumentReader);

//LICENSE LOCATION
var licPath =
  Platform.OS === "ios"
    ? RNFS.MainBundlePath + "/regula.license"
    : "regula.license";
//READ LICENSE (IOS/ANDROID)
var readFile = Platform.OS === "ios" ? RNFS.readFile : RNFS.readFileAssets;

const ReceptionHome = () => {
  const WEBVIEW = useRef();

  const [shouldRender, setShouldRender] = useState(true);
  const [isDatabseConnected, setIsDatabseConnected] = useState(false);
  const [showScanButton, setShowScanButton] = useState(false);
  const [rentId, setRentId] = useState();

  //SHOW FULL PAGE MODAL AFTER REGULA SCAN
  const [showScanInfo, setShowScanInfo] = useState(false);

  const { userData, setUserData } = useContext(UserContext);
  const { setIsUserLoggedIn } = useContext(LoggedContext);

  //LOAD FONTS
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  //DECLARATIONS
  const [urlState, setUrlState] = useState("");
  const [loadingOver, setLoadingOver] = useState(false);

  //generate url
  useEffect(() => {
    const generateUrl = async () => {
      const rec_guid = await SecureStore.getItemAsync("rec_guid");
      var url = "https://rec.my-rent.net/" + rec_guid;
      setUrlState(url.replace('"', "").replace('"', ""));
      setLoadingOver(true);
    };
    generateUrl();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setShouldRender(true);
      return () => {
        setShouldRender(false);
      };
    }, [])
  );

  useEffect(() => {
    //LISTENER
    eventManager.addListener("completionEvent", (e) =>
      handleCompletion(DocumentReaderCompletion.fromJson(JSON.parse(e["msg"])))
    );
    DocumentReader.prepareDatabase(
      "Full",
      (response) => {
        readFile(licPath, "base64")
          .then((res) => {
            DocumentReader.initializeReader(
              {
                license: res,
              },
              (response) => {
                console.log(response);
                setIsDatabseConnected(true);
              },
              (error) => console.log(error)
            );
          })
          .catch((error) => {
            console.log("Error reading the license");
          });
      },
      (error) => {
        Alert.alert("Error", "Error initialzing Regula document scanner sdk", [
          { text: "OK", onPress: () => true },
        ]);
      }
    );
  }, []);

  async function openGuestList() {
    const redirectTo = `window.loacation="${
      "https://ow.my-rent.net/scan/scan/" + rentId
    }"; window.loacation="${"https://ow.my-rent.net/scan/scan/" + rentId}";`;
    WEBVIEW.current.injectJavaScript(redirectTo);
  }
  3;

  //ON SCAN BUTTON PRESS
  const onScanButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    DocumentReader.setConfig(
      {
        functionality: {
          videoCaptureMotionControl: true,
        },
        customization: {
          showResultStatusMessages: true,
          showStatusMessages: true,
        },
        processParams: {
          scenario: ScenarioIdentifier.SCENARIO_MRZ,
        },
      },
      (e) => {},
      (error) => {}
    );

    DocumentReader.showScanner(
      (s) => console.log(s),
      (e) => {}
    );
  };

  //HANDLE COMPLETION
  function handleCompletion(completion) {
    if (completion.action === Enum.DocReaderAction.COMPLETE) {
      handleResults(completion.results);
    }
  }

  // handle results from scanning
  function handleResults(results) {
    var initialBirthDate = results.getTextFieldValueByType({
      fieldType: Enum.eVisualFieldType.FT_DATE_OF_BIRTH,
    });
    const newDate = initialBirthDate;

    setUserData((existingValues) => ({
      ...existingValues,
      name: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_GIVEN_NAMES,
      }),
      surname: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_SURNAME,
      }),
      gender: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_SEX,
      }),
      country: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_NATIONALITY,
      }),
      documentId: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_DOCUMENT_NUMBER,
      }),
      documentType: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_DOCUMENT_CLASS_CODE,
      }),
      originalData: results.textResult,
      citizenship: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_NATIONALITY,
      }),
      birthDate: newDate,
      exprirationDate: results.getTextFieldValueByType({
        fieldType: Enum.eVisualFieldType.FT_DATE_OF_EXPIRY,
      }),
    }));
    setShowScanInfo(true);
    setShowScanButton(false);
  }

  //ON CANCEL BUTTON PRESS
  const onCancelButtonPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowScanInfo(false);
  };

  //if navigation state changes execute this function
  const onNavigationStateChange = (navState) => {
    var current_url = navState.url;
    setUrlState(current_url);
    var s_array = current_url.split('/');
    var s_array2 = s_array[3]?.split("?");
    console.log(s_array2);
    if (
      s_array2[0] === "rent_details"
    ) {

      //extract rent_id from url
      var rent_id = s_array2[1]?.split("=")[1];

      setUserData((existingValues) => ({
        ...existingValues,
        rentId: rent_id,
      }));
      setShowScanButton(true);
      setRentId(rent_id);
    } else {
      setShowScanButton(false);
    }
  };

  //on logout button press
  const hanldeOnLogoutPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await SecureStore.deleteItemAsync("rec_guid");
    await SecureStore.deleteItemAsync("app");
    setIsUserLoggedIn(false);
  };

  return (
    <>
      <StatusBar backgroundColor="#0B1727" style="light" />
      {Platform.OS === "ios" ? (
        <SafeAreaView
          style={{
            flex: 0,
            backgroundColor:
              urlState && isDatabseConnected && loadingOver
                ? "#f5f5f5"
                : "white",
          }}
        />
      ) : (
        <View
          style={{
            paddingTop: Platform.OS === "ios" ? null : 32,
            backgroundColor:
              urlState && isDatabseConnected && loadingOver
                ? "#f5f5f5"
                : "white",
          }}
        />
      )}
      <SafeAreaView
        style={{
          zIndex: 6,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        {urlState && loadingOver && isDatabseConnected ? (
          <View style={{ flex: 1 }}>
            <View style={{ display: showScanInfo ? "none" : "flex", flex: 1 }}>
              <WebView
                ref={WEBVIEW}
                source={{ uri: urlState }}
                onNavigationStateChange={onNavigationStateChange}
                startInLoadingState={true}
                //Enable Javascript support
                javaScriptEnabled={true}
                //For the Cache
                domStorageEnabled={true}
              />
            </View>
            {showScanButton && (
              <View style={styles.scanButtonContainer}>
                <ScanButton onPress={onScanButtonPress} />
              </View>
            )}
            {showScanInfo && (
              <View style={styles.scanInfoContainer}>
                <View style={styles.scannedDataContainer}>
                  <Text style={styles.headerText}>Scanned Data</Text>
                </View>
                <KeyboardAwareScrollView
                  style={{
                    backgroundColor: "transparent",
                    flex: 1,
                    width: "100%",
                  }}
                >
                  <ShowScannedData
                    openGuestList={openGuestList}
                    userData={userData}
                    setUserData={setUserData}
                    setShowScanInfo={setShowScanInfo}
                    onScanButtonPress={onScanButtonPress}
                    onCancelButtonPress={onCancelButtonPress}
                    setShowScanButton={setShowScanButton}
                  />
                </KeyboardAwareScrollView>
              </View>
            )}
            {showScanInfo ? null : (
              <Pressable
                style={({ pressed }) => [
                  { opacity: pressed ? 0.8 : 1 },
                  styles.btnLogin,
                ]}
                title="Submit"
                onPress={hanldeOnLogoutPress}
              >
                <Text style={styles.loginText}>Logout</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <StatusBar style="dark" />
            {fontsLoaded && (
              <Text style={styles.loadingText}>Setting up your app...</Text>
            )}
            <ActivityIndicator size="large" color="#292a44" />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  btnLogin: {
    borderColor: ColorPrimaryGradientOne,
    backgroundColor: "#0B1727",
    borderStyle: "solid",
    paddingVertical: 4,
    elevation: 4,
    paddingHorizontal: 24,
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
  bottomTabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    justifyContent: "space-around",
    flexDirection: "row",
    elevation: 5,
    backgroundColor: "white",
    paddingTop: 4,
    height: 64,
    zIndex: 99,
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  loadingText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: "#292a44",
    marginBottom: 12,
    width: "100%",
  },
  scanButtonContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 120 : 90,
    right: 20,
    elevation: 4,
  },
  indicatorStyle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scanInfoContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    zIndex: 6,
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
  scannedDataContainer: {
    width: "100%",
    marginBottom: 16,
    marginTop: 24,
  },
  headerText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    marginBottom: 16,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

export default ReceptionHome;
