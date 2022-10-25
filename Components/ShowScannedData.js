import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useContext } from "react";
//COLORS
import { ColorPrimaryGradientOne } from "../Static/static";
//AXIOS
import axios from "axios";
//CONTEXT
import { UserContext } from "../context/ScannedContext";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";

//ENV
import { REGULA_API } from "@env";

const ShowScannedData = ({
  setShowScanInfo,
  onScanButtonPress,
  openGuestList,
  onCancelButtonPress,
}) => {
  const { userData, setUserData } = useContext(UserContext);

  const {
    rentId,
    name,
    surname,
    documentType,
    gender,
    country,
    documentId,
    citizenship,
    birthDate,
    exprirationDate,
    originalData,
    workerId,
  } = userData;

  const onSaveFormButtonClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    axios
      .post(`${REGULA_API.toString()}`, {
        rent_id: rentId,
        name_first: name,
        name_last: surname,
        document_type: documentType,
        document_number: documentId,
        gender: gender,
        residence_country: country,
        residence_adress: "",
        residence_city: "",
        birth_country: "",
        citizenship: country,
        birth_city: "",
        arrival_organisation: "",
        offered_service_type: "",
        birth_date: birthDate,
        tt_payment_category: "",
        original_data: JSON.stringify(originalData),
        worker_id: workerId,
      })
      .then((res) => {
        setShowScanInfo(false);
        openGuestList();
      });
  };

  const onChangeName = (value) => {
    setUserData((existingValues) => ({ ...existingValues, name: value }));
  };
  const onChangeSurname = (value) => {
    setUserData((existingValues) => ({ ...existingValues, surname: value }));
  };
  const onChangeGender = (value) => {
    setUserData((existingValues) => ({ ...existingValues, gender: value }));
  };
  const onChangeCountry = (value) => {
    setUserData((existingValues) => ({ ...existingValues, country: value }));
  };
  const onChangeDocumentId = (value) => {
    setUserData((existingValues) => ({ ...existingValues, documentId: value }));
  };
  const onChangeCitizenship = (value) => {
    setUserData((existingValues) => ({
      ...existingValues,
      citizenship: value,
    }));
  };
  const onChangeBirthDate = (value) => {
    setUserData((existingValues) => ({ ...existingValues, birthDate: value }));
  };
  const onChangeExpirationDate = (value) => {
    setUserData((existingValues) => ({
      ...existingValues,
      exprirationDate: value,
    }));
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.inputAndLabelContainer}>
        <Text style={{ width: 110 }}>First Name: </Text>
        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="First Name"
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputAndLabelContainer}>
        <Text style={{ width: 110 }}>Last Name: </Text>
        <TextInput
          value={surname}
          onChangeText={onChangeSurname}
          placeholder="Last Name"
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputAndLabelContainer}>
        <Text style={{ width: 110 }}>Gender: </Text>
        <TextInput
          value={gender}
          onChangeText={onChangeGender}
          placeholder="Gender"
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputAndLabelContainer}>
        <Text style={{ width: 110 }}>Country: </Text>
        <TextInput
          value={country}
          onChangeText={onChangeCountry}
          placeholder="Country"
          style={styles.textInput}
        />
      </View>

      <View style={styles.inputAndLabelContainer}>
        <Text style={{ width: 110 }}>Document ID: </Text>
        <TextInput
          value={documentId}
          onChangeText={onChangeDocumentId}
          placeholder="Document ID"
          keyboardType="numeric"
          style={styles.textInput}
        />
      </View>
      <View style={styles.inputAndLabelContainer}>
        <Text style={{ width: 110 }}>Citizenship: </Text>
        <TextInput
          value={citizenship}
          onChangeText={onChangeCitizenship}
          placeholder="Citizenship"
          style={styles.textInput}
        />
      </View>
      <Text style={{ marginVertical: 12, textAlign: "center", color: "red" }}>
        Molimo detaljno provjerite skenirane podatke, jer ovisno o uvijetima
        skeniranja, svijetlosti, nagibu ili modelu vašeg mobilnog uređaja, može
        se desitit da neki podatak nije ispravno prepoznat
      </Text>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={[styles.btnLogin, { backgroundColor: "red" }]}
          title="Submit"
          onPress={onCancelButtonPress}
        >
          <Text style={[styles.loginText, { color: "white" }]}>CANCEL</Text>
        </Pressable>
        <Pressable
          style={[
            styles.btnLogin,
            { backgroundColor: ColorPrimaryGradientOne },
          ]}
          title="Submit"
          onPress={onScanButtonPress}
        >
          <Text style={[styles.loginText, { color: "white" }]}>TRY AGAIN</Text>
        </Pressable>
        <Pressable
          style={[styles.btnLogin, { backgroundColor: "green" }]}
          title="Submit"
          onPress={onSaveFormButtonClick}
        >
          <Text style={[styles.loginText, { color: "white" }]}>SAVE</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 16,
    width: "65%",
    fontSize: 14,
    height: 42,
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 7,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputAndLabelContainer: {
    marginBottom: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loginText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  btnLogin: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 4,
    elevation: 8,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: "30%",
  },
});

export default ShowScannedData;
