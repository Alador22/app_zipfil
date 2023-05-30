// dette er gjort med chat gpt, prøvde i mange timer først å få til stockfish.js biblioteket selv, men har blitt utdatert, prøvd også 3 andre AI. 

// Funksjon for å hente verdien til en sjakkbrikke
const getPieceValue = (piece) => {
  if (!piece) return 0;
  
  const values = {
  p: 1,
  r: 5,
  n: 3,
  b: 3,
  q: 9,
  k: 0,
  };
  
  return values[piece.type];
  };
  
  // Funksjon for å regne ut det beste trekket for AI
  export const calculateBestMove = (game, depth) => {
  const newGameMoves = game.moves({ verbose: true });
  const weightedMoves = [];
  
  newGameMoves.forEach((move) => {
  game.move(move);
  const capturedPiece = game.get(move.to);
  const score = capturedPiece && capturedPiece.color === 'w' ? getPieceValue(capturedPiece) : 0;
  weightedMoves.push({ move, score });
  game.undo();
  });
  
  if (weightedMoves.length > 0) {
  weightedMoves.sort((a, b) => b.score - a.score);
  const bestMoves = weightedMoves.filter(move => move.score === weightedMoves[0].score);
  return bestMoves[Math.floor(Math.random() * bestMoves.length)].move;
  }
  
  return null;
  };