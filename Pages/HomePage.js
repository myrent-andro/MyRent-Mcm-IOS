import React, { useState, useRef, useEffect, useContext } from "react";
import {
  StyleSheet,
  BackHandler,
  View,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  NativeEventEmitter,
  Text,
  Dimensions,
} from "react-native";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";

//EXPO STATUS BAR
import { StatusBar } from 'expo-status-bar';

//CONTEXT
import { UserContext } from "../context/ScannedContext";

//KeyboardAwareScrollView
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//REGULA
import DocumentReader, {
  Enum,
  DocumentReaderCompletion,
  DocumentReaderScenario,
  RNRegulaDocumentReader,
  ScenarioIdentifier,
} from "@regulaforensics/react-native-document-reader-api";

//RNFS (READ FILE FROM BUNDLE)
import * as RNFS from "react-native-fs";

//STATIC
import {
  ColorPrimary,
  ColorPrimaryGradientOne,
  ColorPrimaryGradientTwo,
} from "../Static/static";

//REACT NATIVE WEB VIEW
import { WebView } from "react-native-webview";
//EXPO SECURE STORE
import * as SecureStore from "expo-secure-store";
//NAVIGATION
import { useNavigation, useFocusEffect } from "@react-navigation/native";
//COMPONENTS
import ScanButton from "../Components/ScanButton";
import ShowScannedData from "../Components/ShowScannedData";

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

const windowHeight = Dimensions.get("window").height;

//LICENSE LOCATION
var licPath =
  Platform.OS === "ios"
    ? RNFS.MainBundlePath + "/regula.license"
    : "regula.license";
//READ LICENSE (IOS/ANDROID)
var readFile = Platform.OS === "ios" ? RNFS.readFile : RNFS.readFileAssets;

const HomePage = () => {
  //LOAD FONTS
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const { userData, setUserData } = useContext(UserContext);

  //NAVIGATION
  const navigation = useNavigation();

  //DECLARATIONS
  const [urlState, setUrlState] = useState("");
  const [backButtonEnabled, setBackButtonEnabled] = useState(false);
  const [showScanButton, setShowScanButton] = useState(false);
  const [isDatabseConnected, setIsDatabseConnected] = useState(false);

  //SHOW FULL PAGE MODAL AFTER REGULA SCAN
  const [showScanInfo, setShowScanInfo] = useState(false);

  const WEBVIEW = useRef();

  useEffect(() => {});

  //INITIALIZE REGULA
  useEffect(() => {
    //LISTENER
    eventManager.addListener("completionEvent", (e) =>
      handleCompletion(DocumentReaderCompletion.fromJson(JSON.parse(e["msg"])))
    );
    DocumentReader.prepareDatabase(
      "Full",
      (respond) => {
        console.log(respond);
        readFile(licPath, "base64")
          .then((res) => {
            DocumentReader.initializeReader(
              {
                license: res,
              },
              (respond) => {
                console.log(respond);
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

  //HANDLE COMPLETION
  function handleCompletion(completion) {
    if (completion.action === Enum.DocReaderAction.COMPLETE) {
      handleResults(completion.results);
    }
  }

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

  //ON CANCEL BUTTON PRESS
  const onCancelButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowScanInfo(false);
    const redirectTo =
      'window.location="/#rents/messages"; window.location = "/#rents/guests"';
    WEBVIEW.current.injectJavaScript(redirectTo);
  };

  //ON MAIN SCREEN HANDLE IF THE BACK BUTTON IS CLICKED TO EXIT APP
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

  //GETTING GUID AND WORKER_ID FROM EXPO SECURE STORE
  useEffect(() => {
    async function getGuidFromExpoSecureStore() {
      try {
        const guid = await SecureStore.getItemAsync("guid");
        const worker_id = await SecureStore.getItemAsync("worker_id");
        //ADDING WORKER_ID TO USER CONTEXT
        setUserData((existingValues) => ({
          ...existingValues,
          workerId: worker_id.replace('"', "").replace('"', ""),
        }));
        //GENERATING URL
        setUrlState(
          `https://m.my-rent.net/?id=${guid.replace('"', "").replace('"', "")}`
        );
      } catch (error) {
        console.log("Getting guid and worker id from expo store error");
      }
    }
    getGuidFromExpoSecureStore();
  }, []);

  //DELETING GUID ON LOGOUT
  function deleteGuid() {
    SecureStore.deleteItemAsync("guid")
      .then(() => navigation.navigate("OnBoardPage"))
      .catch((err) => console.log(err));
    SecureStore.deleteItemAsync("worker_id")
      .then(() => navigation.navigate("OnBoardPage"))
      .catch((err) => console.log(err));
  }

  // WEBVIEW NAVIGATION STATE CHANGE LISTENER && TRACE URL FROM WEBVIEW
  function onNavigationStateChange(navState) {
    setBackButtonEnabled(navState.canGoBack);
    //TRACE URL FROM WEBVIEW
    //IS RESERVATION CLICKE SHOW SCAN BUTTON THAT STARTS MRT SCANNER
    if (
      navState.url.split("?")[0]
        ? navState.url.split("?")[0] === "https://m.my-rent.net/#edit"
        : navState.url === "https://m.my-rent.net/#edit"
    ) {
      if (navState.url.split("?")[1]) {
        const extractRentId = navState.url.split("?")[1].split("=")[1];
        setUserData((existingValues) => ({
          ...existingValues,
          rentId: extractRentId,
        }));
      }
      setShowScanButton(true);
    } else if (navState.url === "https://m.my-rent.net/#rents/guests") {
      setUserData((existingValues) => ({
        ...existingValues,
      }));
      setShowScanButton(true);
    } else {
      setShowScanButton(false);
    }
    if (
      navState.url === urlState + "#" ||
      navState.url == "https://m.my-rent.net/#"
    ) {
      deleteGuid();
    }
    // console.log(userData);
  }

  function openGuestList() {
    const redirectTo =
      'window.location="/#rents/messages"; window.location = "/#rents/guests"';
    WEBVIEW.current.injectJavaScript(redirectTo);
  }

  //HANDLE GO BACK BUTTON
  useEffect(() => {
    // Handle back event
    function backHandler() {
      if (backButtonEnabled) {
        WEBVIEW.current.goBack();
        return true;
      }
    }

    // Subscribe to back state vent
    BackHandler.addEventListener("hardwareBackPress", backHandler);

    // Unsubscribe
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backHandler);
  }, [backButtonEnabled]);

  function IndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={ColorPrimary}
        size="large"
        style={styles.indicatorStyle}
      />
    );
  }

  return (
    <>
   {Platform.OS==='ios' ? <SafeAreaView style={{flex: 0, backgroundColor:( urlState && isDatabseConnected) ? ColorPrimaryGradientOne : "white"}}/> : null}
    <SafeAreaView
      style={{
        zIndex: 6,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {urlState && isDatabseConnected ? (
        <>
          <View style={{ display: showScanInfo ? "none" : "flex", flex: 1 }}>
            <WebView
              ref={WEBVIEW}
              onNavigationStateChange={onNavigationStateChange}
              source={{ uri: urlState }}
              allowsBackForwardNavigationGestures
              //Enable Javascript support
              javaScriptEnabled={true}
              //For the Cache
              domStorageEnabled={true}
              renderLoading={IndicatorLoadingView}
              startInLoadingState={true}
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
                />
              </KeyboardAwareScrollView>
            </View>
          )}
        </>
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
    bottom: Platform.OS==='ios' ? 120 : 90,
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
  btnLogin: {
    marginTop: 16,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
    elevation: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: 104,
  },
  loginText: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
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

export default HomePage;
