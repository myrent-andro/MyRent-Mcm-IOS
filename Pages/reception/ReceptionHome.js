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
  return (
    <View>
      <Text>DODO</Text>
    </View>
  )
}

export default ReceptionHome;