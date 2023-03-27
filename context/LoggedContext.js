import React, { useState } from "react";

export const LoggedContext = React.createContext();

export function LoggedProvider({ children }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  
  return (
    <LoggedContext.Provider
     value={{isUserLoggedIn, setIsUserLoggedIn}}
    >
      {children}
    </LoggedContext.Provider>
  );
}
