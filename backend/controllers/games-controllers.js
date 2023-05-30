//creator:alador/chatgpt
/** denne ble for det meste laget av chatgpt ved å gi den koden for user_controllers og opening_controllers.
 *  Jeg måtte ta ut mye unødvendig kode og jeg induserte litt logikk.
 *  jeg måtte slette nesten alt i const start game og skrive innholdet selv og jeg endret logikken for const getGames
 *  fra å bruke const getOpenings fra opening_controllers.
 *  const updateGame-funksjonen er kun mindre endret av meg og er for det meste laget av chatgpt*/
const Game = require("../models/game");
const createError = require("http-errors");

// opprette en ny kamp mot AI i databasen
const startGame = async (req, res, next) => {
  const newGame = new Game({
    player1_id: req.userData.userId,
    player2_id: "6470f4fa49f2b2b868b3dc06", //opprettet en bruker for AI
    start_time: new Date(),
    moves: [],
  });

  try {
    await newGame.save();
  } catch (err) {
    const error = createError(
      500,
      "kunne ikke opprette en kamp, vennligst prøv på nytt."
    );
    return next(error);
  }

  res.status(201).json({ game: newGame.toObject({ getters: true }) });
};

exports.getGames = getGames;
exports.startGame = startGame;
