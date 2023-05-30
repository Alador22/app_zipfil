//creator:Alador brukte chatgpt for å lage skjelettet og deretter fjernet og lagt til noen linjer slik at det kan være enklere for vår bruk
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//schema på hvordan en kamp skal se ut i databasen
const gameSchema = new Schema({
  player1_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  player2_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  start_time: { type: Date, required: true },
  end_time: Date,
  moves: [
    {
      player_id: { type: String, required: true },
      from: { type: String, required: true },
      to: { type: String, required: true },
    },
  ],
  result: { type: String, enum: ["won", "lost", "draw"] },
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
