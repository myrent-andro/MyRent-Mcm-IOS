import { StyleSheet, Platform, Pressable } from "react-native";
import React from "react";

import { ColorPrimaryGradientOne } from "../Static/static";

//EXPO ICONS
import { Ionicons } from "@expo/vector-icons";

const ScanButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressable }) => [
        { opacity: pressable ? 0.8 : 1 },
        styles.buttonPressableConttainer,
      ]}
    >
      <Ionicons name="person-add-sharp" size={24} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonPressableConttainer: {
    borderRadius: 100,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: ColorPrimaryGradientOne,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
});

export default ScanButton;
