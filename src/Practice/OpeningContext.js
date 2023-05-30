import React from "react";
import jwtDecode from "jwt-decode";

const OpeningsContext = React.createContext();
const token = localStorage.getItem("token");
//const decodedToken = jwtDecode(token);
export default OpeningsContext;
