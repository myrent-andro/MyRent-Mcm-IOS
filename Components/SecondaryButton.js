import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const SecondaryButton = ({ text, color, onSecondaryButtonPress }) => {
  return (
    <Pressable
      onPress={onSecondaryButtonPress}
      style={styles.primaryButtonContainer}
    >
      <Text style={[{ color: color }, styles.buttonText]}>{text}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  primaryButtonContainer: {
    width: 144,
    height: 42,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SecondaryButton;
