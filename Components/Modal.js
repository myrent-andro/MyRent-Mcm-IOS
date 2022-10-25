import { View, Text, StyleSheet, Dimensions, BackHandler } from "react-native";
import React from "react";

import { ColorPrimary } from "../Static/static";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const Modal = ({
  title,
  body = "Are You Sure You Want To Quit",
  setIsExitModalShown,
}) => {
  const onPrimaryButtonPress = () => {
    setIsExitModalShown(false);
  };
  const onSecondaryButtonPress = () => {
    setIsExitModalShown(false);
    BackHandler.exitApp();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <Text style={styles.bodyText}>{body}</Text>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <SecondaryButton
            text="Yes"
            color="black"
            onSecondaryButtonPress={onSecondaryButtonPress}
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            text="No"
            color="white"
            bgColor="#20baba"
            onPrimaryButtonPress={onPrimaryButtonPress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    left: 32,
    backgroundColor: "white",
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
    borderWidth: 1,
    borderColor: "lightgray",
    justifyContent: "space-around",
    width: Dimensions.get("window").width - 64,
    borderRadius: 16,
    elevation: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    height: Dimensions.get("window").height * 0.21,
  },
  titleContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
  },
  bodyText: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
  },
  buttonContainer: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Modal;
