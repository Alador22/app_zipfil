import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import './style2.css';
import { calculateBestMove } from './ChessAi';
import Openings from './SideOpenings';

//creator Torjus Lundefaret Steinsrud, Jeg startet med å lage selve divs å hente ut sjakkbrettet og sjakkbrikker, etter det ble noe stopp siden reglene fungerte ikke som det skulle, så la jeg det inn til slutt i chat gpt 
//slik at chat gpt tilpasse slik at Regler skulle passe og fungere. 
// øving sin index.js, Mesteparten av koden laget av ChatGpt, men også sett på sjakk biblotekene for å hente informasjon som chatGpt har gitt beskrivelse, tilpasset, feilsøket og endret og lagt inn.
// Alle tilstandene for øving. 
const Practice = () => {
  const [chess] = useState(new Chess());
  const [position, setPosition] = useState(null);
  const [activeSquares, setActiveSquares] = useState([]);
  const [showStartButton, setShowStartButton] = useState(true);
  const [checkmateMessage, setCheckmateMessage] = useState('');
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [messageBoxClass, setMessageBoxClass] = useState('message-box message-box-hidden');
  const [whiteMoves, setWhiteMoves] = useState([]);
  const [blackMoves, setBlackMoves] = useState([]);
  const [showOpenings, setShowOpenings] = useState(false);

// Her har chatGpt laget kode for AI skal gjrøe beste trekk.

  useEffect(() => {
    const makeBestMove = () => {  // Funksjon som gjør AI-trekk
      if (chess.turn() === 'b') {  // Hvis det er AI-ens tur
        const bestMove = calculateBestMove(chess, 2);  // Beregn det beste trekket
        if (bestMove) {  // Hvis det finnes et best trekk
          const move = chess.move(bestMove);  // Gjør trekket
          if (move) {  // Hvis trekket er gyldig
            setPosition(chess.fen());  // Oppdater tilstanden med den nye stillingen
            showMessage('AI made a move');  // Vis en melding om at AI har gjort et trekk
            addMoveToList(move);  // Legg til trekket i listen over trekk
          }
        }
      }
    };

    if (position) {  // Hvis det er en gjeldende stilling
      setTimeout(makeBestMove, 1000);  // Gjør AI-trekk etter ett sekund
    }
    // eslint-disable-next-line
  }, [position, chess]);  

  // her har chatGpt lagt inn noe som manglet, å for å feilsøke etter en feil. SetCheckmateMessage(message) sin funksjon er å bare få teksten inn i meldingsboksen, ikke selve sjakkmatt melding.

  // Funksjon for å vise en melding og fjerne den etter 4 sekunder
  const showMessage = (message) => {
    setCheckmateMessage(message);
    clearTimeout(messageTimeout);
    setMessageTimeout(
      setTimeout(() => {
        setCheckmateMessage('');
      }, 4000)
    );
  };

    // brukt api, chat gpt 

    // Funksjon for å håndtere en spillers trekk
    const handleMove = ({ sourceSquare, targetSquare }) => {
    // Hent alle mulige trekk for gjeldende spiller
    const moves = chess.moves({ verbose: true });
    // Finn trekket som matcher kilde- og målfeltet til spillerens trekk
    const move = moves.find((m) => m.from === sourceSquare && m.to === targetSquare);

    if (move === undefined) {
      return;
    }

    // api, chat gpt, meg selv 

    // Utfør trekket i spillet
    chess.move(move);
    // Sett posisjonen til den nye spilltilstanden
    setPosition(chess.fen());
    // Fjern aktive felter på brettet
    setActiveSquares([]);
    // Legg til trekket i trekklisten og vis en melding
    addMoveToList(move);
    showMessage(`${move.piece} moves from ${move.from} to ${move.to}`);
  };
    // Funksjon for å legge til et trekk i trekklisten
    const addMoveToList = (move) => {
    if (chess.turn() === 'w') {
      setWhiteMoves([...whiteMoves, move]);
    } else {
      setBlackMoves([...blackMoves, move]);
    }
  };

   // chat gpt kode.
   // Funksjon for å håndtere når en rute på brettet klikkes på
  const handleSquareClick = (square) => {
    const piece = chess.get(square);
    // Hvis det ikke er en brikke på ruten eller det ikke er spillerens tur, gjør ingenting
    if (!piece || piece.color !== chess.turn()) {
      return;
    }
    // Hent alle mulige trekk for brikken på den klikkede ruten
    const moves = chess.moves({ square, verbose: true });
    // Hent målfeltene for de lovlige trekkene
    const legalSquares = moves.map((move) => move.to);
    // Sett de aktive rutene til den klikkede ruten og de lovlige målfeltene
    setActiveSquares([square, ...legalSquares]);
  };
  // Funksjon for å håndtere oppstart av et nytt spill
  const handleStartGame = () => {
    // Sett posisjonen til startposisjonen
    setPosition('start');
    // Skjul startknappen og vis åpningsmenyen
    setShowStartButton(false);
    setShowOpenings(true);
    setCheckmateMessage('');
    // Vis meldingsboksen
    setMessageBoxClass('message-box');
    chess.reset();
  };

  // laget først divsa, følgte tutorial for chessboard,jsx og sjakk,js apiet som chatGPT har gjort endringer og lagt inn slik at det passer til prosjektet.
  // divs med sjakkbord, trekklisten og åpninger og brikkene.
  return (
    <div className="practice-body">
      <div className="main-container">
        <div className="openings-container">
          <Openings
  chess={chess}
  setPosition={setPosition}
  addMoveToList={addMoveToList}
  showOpenings={showOpenings}
/>
      </div>
        <div className="move-list-container" style={{ display: showStartButton ? 'none' : 'block' }}>
          <h2>Move List</h2>
          <div>
            <h3>Black moves</h3>
            {whiteMoves.map((move, index) => (
              <div key={index}>{`${move.piece} moves from ${move.from} to ${move.to}`}</div>
            ))}
          </div>
          <div>
            <h3>White moves</h3>
            {blackMoves.map((move, index) => (
              <div key={index}>{`${move.piece} moves from ${move.from} to ${move.to}`}</div>
            ))}
          </div>
        </div>
        <div className="chessboard-container">
          <div className={messageBoxClass}>{checkmateMessage}</div>
          {showStartButton && (
            <button className="start-game-button" onClick={handleStartGame}>
              Start Game
            </button>
          )}
          {position && (
            <>
              <Chessboard
                position={position}
                onDrop={({ sourceSquare, targetSquare }) =>
                  handleMove({ sourceSquare, targetSquare })
                }
                onMouseOverSquare={handleSquareClick}
                onMouseOutSquare={() => setActiveSquares([])}
                onDragStart={({ sourceSquare }) => {
                  const piece = chess.get(sourceSquare);
                  if (piece && piece.color !== chess.turn()) {
                    return false;
                  }
                }}
                boardStyle={{
                  borderRadius: '5px',
                  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
                }}
                squareStyles={{
                  ...activeSquares.reduce(
                    (obj, square) => ({
                      ...obj,
                      [square]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
                    }),
                    {}
                  ),
                }}
                showNotation={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
              }

export default Practice;