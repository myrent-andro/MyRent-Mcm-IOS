import React, { useState } from "react";

export const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    rentId: "",
    name: "",
    surname: "",
    documentType: "",
    documentId: "",
    gender: "",
    country: "",
    address: "",
    city: "",
    birthCity: "",
    birthCountry: "",
    citizenship: "",
    birthDate: null,
    exprirationDate: null,
    birthCity: "",
    arrivalOrganisation: "",
    offeredServiceType: "",
    ttPaymentCategory: "",
    originalData:"",
    workerId:"",
  });
  
  return (
    <UserContext.Provider
     value={{userData, setUserData}}
    >
      {children}
    </UserContext.Provider>
  );
}
