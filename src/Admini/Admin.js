import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import jwtDecode from "jwt-decode";

const AdminPage = () => {
  const [email, setEmail] = useState("");
  const [admin, setAdmin] = useState("");

  const token = localStorage.getItem("token");
   const decodedToken = jwtDecode(token);

  useEffect(() => {
     //setEmail();
    setAdmin(decodedToken.admin);
  }, [decodedToken]);

  const handleAdminChange = async () => {
    try {
      const response = await axios.patch(
        process.env.REACT_APP_BACKEND_URL + "/users/admin",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (response.status === 200) {
        //sier ifra om konto er blitt slettet
        console.log("Du er blitt Admin Baby!");
      } else {
        //sier ifra om kontoen ikke har blitt slettet
        console.log("Du har ikke lov å bli Admin, ikke Poggers!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteKonto = async () => {
    try {
        const response = await axios.delete(
          process.env.REACT_APP_BACKEND_URL + "/users/admin",
            {
              data: {
                email: email,
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );

      if (response.status === 200) {
        //sier ifra om konto ble slettet
        console.log("konto ble slettet");
      } else {
        // sier ifra om kontoen ikke ble slettet
        console.log("Feil, konto ikke slettet");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Profilside-body">
        <div className="profil-container">
        <div>
          <label>
            Epost:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button onClick={handleAdminChange}>Gi admin rettigheter</button>
        </div>
        <div>
          <button onClick={handleDeleteKonto}>Slett konto</button>
        </div>
        </div>
      </div>
    
  );
};

export default AdminPage;
