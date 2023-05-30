//creator:alador/chatgpt
/** denne ble for det meste laget av chatgpt ved å gi den koden for user_controllers og opening_controllers.
 *  Jeg måtte ta ut mye unødvendig kode og jeg induserte litt logikk.
 *  jeg måtte slette nesten alt i const start game og skrive innholdet selv og jeg endret logikken for const getGames
 *  fra å bruke const getOpenings fra opening_controllers.
 *  const updateGame-funksjonen er kun mindre endret av meg og er for det meste laget av chatgpt*/
const Game = require("../models/game");
const createError = require("http-errors");

// får alle kampene fra brukeren
const getGames = async (req, res, next) => {
  const player1_id = req.userData.userId;
  let games;
  try {
    games = await Game.find({ player1_id: player1_id });
  } catch (err) {
    const error = createError(
      500,
      "kunne ikke hente spill, vennligst prøv igjen senere."
    );
    return next(error);
  }
  res.json({ games: games.map((game) => game.toObject({ getters: true })) });
};

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

//oppdaterer statusen for spillet som nye trekk eller resultatet
const updateGame = async (req, res, next) => {
  const gameId = req.params.gid;

  const { moves, result } = req.body;

  let game;
  try {
    game = await Game.findById(gameId);
  } catch (err) {
    const error = createError(500, "Noe gikk galt, kunne ikke finne spillet.");
    return next(error);
  }

  if (!game) {
    const error = createError(
      404,
      "Kunne ikke finne et spill med oppgitt spill ID."
    );
    return next(error);
  }

  if (moves) {
    const player = req.userData.userId;
    const computer = "6470f4fa49f2b2b868b3dc06";

    moves.forEach((move) => {
      if (move.player_id === "computer") {
        move.player_id = computer;
      } else {
        move.player_id = player;
      }
    });

    const validMoves = moves.every(
      (move) => move.player_id && move.from && move.to
    );

    if (!validMoves) {
      const error = createError(422, "Ugyldige inndata, vennligst prøv igjen.");
      return next(error);
    }

    game.moves.push(...moves);
  }
  if (result) {
    game.end_time = new Date();
    game.result = result;
  }

  try {
    await game.save();
  } catch (err) {
    const error = createError(500, "kunne ikke oppdatere kampen, prøv igjen.");
    return next(error);
  }

  res.status(200).json({ game: game.toObject({ getters: true }) });
};

exports.getGames = getGames;
exports.startGame = startGame;
exports.updateGame = updateGame;
