// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginStatus, setLoginStatus] = useState("failure");
  const [name, setName] = useState(null);
  const [pass, setPass] = useState(null);
  // const [data, setData] = useState(null);


  const value = {
    loginStatus,
    setLoginStatus,pass,setPass,name,setName,
  };
  // const value1 = {
  //   loginStatus,
  //   setLoginStatus,
  // };
  // const value2 = {
  //   loginStatus,
  //   setLoginStatus,
  // };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
