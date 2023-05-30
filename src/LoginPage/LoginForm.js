import React, { useState, useContext } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../shared/util/validators";
import { AuthContext } from "../AuthContext";


//creator Torjus Lundefaret Steinsrud
// her har vi skrevet alle tildstandene vi trenger for login og registrering, så først på en LoginForm tutorial om hva som typisk skal være med (React User login and Authentication with Axios)
// Definerer tilstander login / registrering 
const LoginForm = ({ onLogin }) => {
  const { setAuthData } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);
  const navigate = useNavigate();

  // her følgte jeg også en tutorial med endringer av meg selv for å passe backend. (kilde i rapport: React User login and Authentication with Axios).
  // Funksjon for å sende innloggingen 
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/users/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Jørgen, Her så blir det lagret en JWT i lokal fil som da kan brukes på resten
      // Av nettsiden
      console.log(response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      setAuthData(decodedToken); // Plasserer JWT
      onLogin(); // Oppdater innloggingsstatus til App-komponenten
      if (decodedToken)
        // Sørger for at du har en token føre den sender deg vidre
        navigate("HomePage"); // etter vellykket innlogging, så blir brukeren omderigert til HomePage.
    } catch (error) {
      console.error(error);
    }
  };

  // her så kopierte vi koden fra koden over. Byttet inn backend url slik at det passer, la inn også navn, også med error meldinger om brukeren registrer blankt.
  // Funksjon for å sende registreringen
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage("Fyll inn alle feltene vær så snill");
      return;
    }
    if (typeof password !== "string") {
      setErrorMessage("Passordet må være 6 karakterer langt");
      return;
    }
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/users/signup",
        { name, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
       
     // Etter du har registrert deg så lagres JWT lokalt
      localStorage.setItem("token", response.data.token);

      console.log(response.data);
      setRegistrationSuccessful(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Funksjon for å vise registreringsskjemaet
  const handleRegisterClick = () => {
    setShowRegisterForm(true);
    setRegistrationSuccessful(false);
    setErrorMessage("");
  };
  // Funksjon for å avbryte registreringen
  const handleBackToLoginClick = () => {
    setShowRegisterForm(false);
    setRegistrationSuccessful(false);
    setErrorMessage("");
  };

  // loginformet, registerformet, her så jeg først på fler youtube tutorials (referanse: https://www.youtube.com/watch?v=Y-XW9m8qOis) om forskjellige typer. Så på hovedstruktur å begynte å lage divs, form, label og input, knappene. 
  // Deretter puttet jeg hele login og register form i ChatGpt for å få med alt av nødvendigheter slik at den endret litt struktur å la til ting som manglet.  
  // Returnerer det faktiske skjemaet med input-felt, knapper og validering

  return (
    <div className="container">
      <form
        className="form"
        onSubmit={showRegisterForm ? handleRegisterSubmit : handleLoginSubmit}
      >
        {showRegisterForm && (
          <div>
            <label>
              Navn:
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <br />
          </div>
        )}
        <label>
          Epost:
          <input
            type="email"
            name="email"
            value={email}
            validators={[VALIDATOR_EMAIL()]}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Passord:
          <input
            type="password"
            name="password"
            value={password}
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Vær så snill og lag passordet 6 karakterer langt!"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        {registrationSuccessful ? (
          <div>
            <p>Registrering gjennomført! Logg deg inn!.</p>
            <button
              onClick={handleBackToLoginClick}
              className="register-btn-small"
            >
              Tilbake til Logg inn siden
            </button>
          </div>
        ) : (
          <div>
            <button
              type="submit"
              className={showRegisterForm ? "cancel-btn" : "login-btn"}
            >
              {showRegisterForm ? "Register now" : "Log In"}
            </button>
            {showRegisterForm ? (
              <button
                onClick={handleBackToLoginClick}
                className="register-btn-small"
              >
                Tilbake til LoginSiden
              </button>
            ) : (
              <p>
                Har du ikke en konto?{" "}
                <button
                  onClick={handleRegisterClick}
                  className="register-btn-small"
                >
                  Registrer deg her!
                </button>
              </p>
            )}
          </div>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};
export default LoginForm;
