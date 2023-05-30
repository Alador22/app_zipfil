//creator:alador brukte udemy-kurs mongoose skjemaet som inspirasjon og deretter mongoose-biblioteket til å endre slik at det kan fungere på systemet vårt med validering
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;
//mongoose gir muligheten for å lage en skjema for hvordan bruker Collection skal se ut

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  elo: { type: Number },
  admin: { type: Boolean },
});

//vi bruker mongoose unique validator for å validere inndata
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

module.exports = User;
