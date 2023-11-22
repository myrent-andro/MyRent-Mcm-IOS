import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
//AXIOS
import axios from "axios";
//EXPO SECURE STORE
import * as SecureStore from "expo-secure-store";
//CONTEXT
import { UserContext } from "../context/ScannedContext";

//EXPO HAPTICS
import * as Haptics from "expo-haptics";

//ENV
import { REGULA_API } from "@env";

const ShowScannedData = ({
  setShowScanInfo,
  openGuestList,
  onCancelButtonPress,
  isOwnerApp = false,
  isReceptionApp = false,
  setShowScanButton = { setShowScanButton },
}) => {
  const { userData } = useContext(UserContext);
  const [userDataCopy, setUserDataCopy] = useState({});

  useEffect(() => {
    setUserDataCopy(userData);
  }, []);

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
    residenceCity,
    originalData,
    workerId,
  } = userDataCopy;

  useEffect(() => {}, []);

  const [isFormValid, setIsFormValid] = useState(true);

  const onSaveFormButtonClick = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isOwnerApp === false && isReceptionApp) {
      if (
        name === "" ||
        surname === "" ||
        gender === "" ||
        country === "" ||
        documentId === "" ||
        citizenship === "" ||
        residenceCity === ""
      ) {
        setIsFormValid(false);
      } else {
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
            residence_city: residenceCity,
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
            setUserDataCopy({});
            openGuestList();
          });
      }
    }
    //if scanning is from owner app add owner id to json
    else if (isOwnerApp === true && isReceptionApp === false) {
      const owner_id = await SecureStore.getItemAsync("owner_id");
      if (
        name === "" ||
        surname === "" ||
        gender === "" ||
        country === "" ||
        documentId === "" ||
        citizenship === "" ||
        residenceCity === ""
      ) {
        setIsFormValid(false);
      } else {
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
            residence_city: residenceCity,
            birth_country: "",
            citizenship: country,
            birth_city: "",
            arrival_organisation: "",
            offered_service_type: "",
            birth_date: birthDate,
            tt_payment_category: "",
            original_data: JSON.stringify(originalData),
            worker_id: workerId,
            owner_id: owner_id,
          })
          .then((res) => {
            setShowScanInfo(false);
            setShowScanButton(true);
            setUserDataCopy({});
            openGuestList();
          });
      }
    }
    else if(isReceptionApp === true && isOwnerApp === false){
      //send reception_id with request
    }
  };

  const onChangeName = (value) => {
    setUserDataCopy((existingValues) => ({ ...existingValues, name: value }));
  };
  const onChangeSurname = (value) => {
    setUserDataCopy((existingValues) => ({
      ...existingValues,
      surname: value,
    }));
  };
  const onChangeGender = (value) => {
    setUserDataCopy((existingValues) => ({ ...existingValues, gender: value }));
  };
  const onChangeCountry = (value) => {
    setUserDataCopy((existingValues) => ({
      ...existingValues,
      country: value,
    }));
  };
  const onChangeDocumentId = (value) => {
    setUserDataCopy((existingValues) => ({
      ...existingValues,
      documentId: value,
    }));
  };
  const onChangeCitizenship = (value) => {
    setUserDataCopy((existingValues) => ({
      ...existingValues,
      citizenship: value,
    }));
  };
  const onResidenceCityChange = (value) => {
    setUserDataCopy((existingValues) => ({
      ...existingValues,
      residenceCity: value,
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
        <Text style={{ width: 110 }}>City: </Text>
        <TextInput
          value={residenceCity}
          onChangeText={onResidenceCityChange}
          placeholder="City of residence"
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
      {isFormValid ? null : (
        <Text
          style={{
            marginVertical: 12,
            textAlign: "center",
            color: "black",
            fontSize: 16,
          }}
        >
          Molimo unesite sve podatke!
        </Text>
      )}
      <Text style={{ marginVertical: 12, textAlign: "center", color: "red" }}>
        Molimo detaljno provjerite skenirane podatke, jer ovisno o uvijetima
        skeniranja, svijetlosti, nagibu ili modelu vašeg mobilnog uređaja, može
        se dogoditi da neki podatak nije ispravno prepoznat
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
    justifyContent: "center",
  },
  loginText: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
  },
  btnLogin: {
    marginTop: 16,
    paddingVertical: 10,
    marginHorizontal: 12,
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
