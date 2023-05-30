import React, {useContext} from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
import DropdownMeny from "./dropdownmeny"
import { AuthContext } from "../AuthContext";
import jwtDecode from "jwt-decode";

//fulgt tutorials for å lage navbar(kilde https://www.youtube.com/watch?v=SLfhMt5OUPI).

function Navbar({ isLoggedIn, setIsLoggedIn }) {

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const {authData} =useContext(AuthContext);
  const {admin} = authData;
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" exact >Hjem</NavLink>
        </li>
        <li>
          <NavLink to="/Practice">Øving</NavLink>
        </li>
        <li>
          <NavLink to="/Profilside/Openings">Åpninger</NavLink>
        </li>
        <li>
  {admin ? <NavLink to="/AdminPage">Administrator</NavLink> : <></>}
</li>
      </ul>
      <DropdownMeny isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} authData={authData} />
    </nav>
  );
}
export default Navbar;