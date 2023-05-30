import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import './style2.css';


//creator Torjus Lundefaret Steinsrud, Jeg startet med å lage selve divs å hente ut sjakkbrettet og sjakkbrikker, etter det ble noe stopp siden reglene fungerte ikke som det skulle, så la jeg det inn til slutt i chat gpt 
//slik at chat gpt tilpasse slik at Regler skulle passe og fungere. 
// øving sin index.js, Mesteparten av koden laget av ChatGpt, men også sett på sjakk biblotekene for å hente informasjon som chatGpt har gitt beskrivelse, tilpasset, feilsøket og endret og lagt inn.
// Alle tilstandene for øving. 
const Practice = () => {
  const [chess] = useState(new Chess());
  
  
  
// Her har chatGpt laget kode for AI skal gjrøe beste trekk.

 
    // eslint-disable-next-line
  

  // her har chatGpt lagt inn noe som manglet, å for å feilsøke etter en feil. SetCheckmateMessage(message) sin funksjon er å bare få teksten inn i meldingsboksen, ikke selve sjakkmatt melding.

  // Funksjon for å vise en melding og fjerne den etter 4 sekunder


    // brukt api, chat gpt 

    // Funksjon for å håndtere en spillers trekk
    
    // api, chat gpt, meg selv 

    // Utfør trekket i spillet
   

   // chat gpt kode.
   // Funksjon for å håndtere når en rute på brettet klikkes på
 
    
  // Funksjon for å håndtere oppstart av et nytt spill

  // laget først divsa, følgte tutorial for chessboard,jsx og sjakk,js apiet som chatGPT har gjort endringer og lagt inn slik at det passer til prosjektet.
  // divs med sjakkbord, trekklisten og åpninger og brikkene.
  return (
    <div className="practice-body">
      <div className="main-container">
        <div className="openings-container">
  
      </div>
        <div className="move-list-container">
          <h2>Move List</h2>
          <div>
            <h3>Black moves</h3>
           
          </div>
          <div>
            <h3>White moves</h3>
           
          </div>
        </div>
        <div className="chessboard-container">
            <button className="start-game-button" onClick={handleStartGame}>
              Start Game
            </button>
          )}
          {position && (
            <>
              <Chessboard
                position={position} />
               
                )}  
                
        </div>
      </div>
    </div>
  );
              

export default Practice;