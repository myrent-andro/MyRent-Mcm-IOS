import React, { useState } from "react";

export const LoggedContext = React.createContext();

export function LoggedProvider({ children }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [redirectPush, setRedirectPush] = useState(null);
  
  return (
    <LoggedContext.Provider
     value={{isUserLoggedIn, setIsUserLoggedIn, redirectPush, setRedirectPush}}
    >
      {children}
    </LoggedContext.Provider>
  );
}
