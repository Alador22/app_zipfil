//creator: perry stendal og jørgen tinnesand combinert, brukt chatGpt for å feilsøke
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import OpeningsContext from '../Practice/OpeningContext';


const Openings = () => {
  const [opening, setOpening] = useState({
    name: "",
    moves: "",
    description: "",
  });
  

  const token = localStorage.getItem("token");
  const [dataChanged, setDataChanged] = useState(false);

 //perry stendal lagde valideringen, resten av koden endre vi med å bruke for det meste jørgen sin kode, prøvde å løse problemet samtidig.
 // her brukte jeg en kombinasjon av meg selv, emne stoffet og chat gpt for å komme fram til slutt produktet.
 //chat gpt, ble brukt til å fin pusse og komme med forslag utifra feil meldinger
// godkjenner at strukturen/moves som blir prøvd å lagret er skrever på riktig måte
  const validateMoves = (moves) => {
    const movePattern = /^[a-h][1-8][a-h][1-8]$/;
    const movesArray = moves.toLowerCase().split(",");// hvis noen skriver med store bokstaver blir de gjort til små og hvert move skal skilles med et komma.
    if (movesArray.length > 10) {
      return "Du kan maks legge til 10 trekk i en åpning";
    }
    for (let move of movesArray) {
      if (!movePattern.test(move)) {
        return "Trekk skal skrives som 'bokstav-tall-bokstav-tall, sånn som e2e4 og skilt med komma e2e4, b2b4";
      }
    }
    return "";
  };

 


  const handleButtonClick = async () => {
    const errorMessage = validateMoves(opening.moves);
    if(errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/openings/save",
        opening,// sender riktig format til databasen
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
  
      console.log(response.data, "Du fikk lagret");
      setDataChanged(!dataChanged);
    } catch (error) {
      console.error("Error fikk ikke lagret:", error);
    }
  };
  
  const patchOpenings = async () => {
    try {
      const response = await axios.patch(
        process.env.REACT_APP_BACKEND_URL + "/openings/" + selectedOpeningId,
        opening,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
  
      // Reset the opening state to its initial state
      setOpening({
        name: "",
        moves: "",
        description: "",
      });
      setDataChanged(!dataChanged);
    } catch (error) {
      console.error("Error while fetching openings:", error);
    }
  };
  

  const [openings, setOpenings] = useState([]);

  const fetchOpenings = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_URL + "/openings",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
  
      const data = response.data;

      // Combine the default and custom openings into one array
      const allOpenings = [...data.customOpenings];

      // Update the state with the fetched openings
      setOpenings(allOpenings);
    } catch (error) {
      console.error('Failed to fetch openings:', error);
    }
  };
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);

  const handleOpeningClick = (opening) => {
    if (opening._id !== selectedOpeningId) {
      setSelectedOpeningId(opening._id);
      console.log(opening._id);
    }
  };

  const deleteOpening = async () => {
    const confirmDelete = window.confirm("Sikker på at du vil slette åpeningen, det er umulig å få den tilbake");
  
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          process.env.REACT_APP_BACKEND_URL + "/openings/" + selectedOpeningId,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
  
        // You might want to remove the deleted opening from your state here
        // so it disappears from the UI without needing to refresh the page
        setOpenings(openings.filter(opening => opening._id !== selectedOpeningId));
  
        console.log("Sletting gjennomført:", response);
        setDataChanged(!dataChanged);
      } catch (error) {
        console.error("Error during deletion:", error);
      }
    } else {
      // User clicked Cancel, do nothing
      console.log("Sletting kanselert.");
    }
  };
  
  useEffect(() => {
    fetchOpenings();
  }, [dataChanged]);

  return (
    <OpeningsContext.Provider value={openings}>
    <div className="Profilside-body">
      <div className="profil-container">
        <h1>Lag dine egne åpningstrekk</h1>
        <div>
          <label>
            Navn på åpning:
            <input
              type="text"
              value={opening.name}
              onChange={(e) => setOpening({ ...opening, name: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Trekk:
            <input
              type="text"
              value={opening.moves}
              placeholder="skriv på denne måten: e2e4,e7e6"
              onChange={(e) => setOpening({ ...opening, moves: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Forklaring:
            <input
              type="text"
              value={opening.description}
              onChange={(e) => setOpening({ ...opening, description: e.target.value })}
            />
          </label>
        </div>
        <div className="knapperOpe">
        <div>
          <button onClick={handleButtonClick}>Lagre åpninger</button>
        </div>
        <div>
          <button onClick={patchOpenings}>Endre på Åpninger</button>
        </div>
        <div>
          <button onClick={fetchOpenings}>Henter alle åpninger</button>
        </div>
        <div>
          <button onClick={deleteOpening}>Slett Åpning</button>
        </div>
        </div>
        <div className="Ope">
  {openings.map((opening) => (
    <div 
      key={opening._id} 
      onClick={() => handleOpeningClick(opening)}
    >
      <h2>{opening.name}</h2>
      <p>{opening.moves}</p>
      <p>{opening.description}</p>
    </div>
  ))}
</div>

      </div>
    </div>
    </OpeningsContext.Provider>
  );
}

export default Openings;
