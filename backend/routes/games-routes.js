//creator: alador. skjelettet ble laget av chatgpt, så la jeg til rutene og token-sjekken
const express = require("express");
const tokenCheck = require("../middleware/token-auth");
const gamesController = require("../controllers/games-controllers");

const router = express.Router();

// får alle kampene fra brukeren
router.get("/", tokenCheck.checkToken, gamesController.getGames);

// opprette en ny kamp mot AI i databasen
router.post("/start", [], tokenCheck.checkToken, gamesController.startGame);

//oppdaterer statusen for kampen som nye trekk eller resultatet
router.patch("/:gid", [], tokenCheck.checkToken, gamesController.updateGame);

module.exports = router;
