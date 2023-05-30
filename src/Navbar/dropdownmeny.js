//creator: perry stendal
// hele denne siden er lagd med hjelp av å se på koden fra de andre på gruppen, sånn at jeg fulgte det samme mønsteret
// hoved delen av koden lærte jeg av emne boken og moduler. mens jeg da jobbet ble det sendt inn til chat gpt
// når feil meldingen kom opp eller ting ikke fungerte riktig og den kom med forslag til hvordan å hvordan å fikse problemet eller hva som manglet.
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

const DropdownMeny = ({ isLoggedIn, setIsLoggedIn, authData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const trykkapen = () => {
    setIsOpen(!isOpen);
  };

  const handleTrykketUtenfor = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleTrykketUtenfor);
    return () => {
      document.removeEventListener("mousedown", handleTrykketUtenfor);
    };
  }, []);

  return (
    <div className={`dropdown-meny ${isOpen ? "show" : ""}`} ref={ref}>
      <button onClick={trykkapen}>{isLoggedIn ? authData.name : "Meny"}</button>
      {isLoggedIn}
      <div className={`dropdown-innhold ${isOpen ? "open" : ""}`}>
        <NavLink to="/Profilside">Profilside</NavLink>
        <NavLink to="/">
          <button
            onClick={() => {
              if (isLoggedIn) {
                setIsLoggedIn(false);
              }
            }}
          >
            {isLoggedIn ? "Log Out" : "Log In"}
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default DropdownMeny;
