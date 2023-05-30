//creator: alador brukte udemy-kursets user.js og mongoose-biblioteket for å lage denne modellen for åpninger
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
//schema på hvordan en åpning skal se ut i databasen
const openingSchema = new Schema({
  name: { type: String, required: true, trim: true },
  moves: { type: String, required: true },
  description: String,
  creator_id: { type: mongoose.Types.ObjectId, ref: "User" },
});

openingSchema.index({ name: 1, creator_id: 1 }, { unique: true }); //brukt chatgpt for å finne denne løsning sånn at en bruker kan ikke gjenbruke navn for en åpning
const Opening = mongoose.model("Opening", openingSchema);

module.exports = Opening;
