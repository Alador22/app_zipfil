//creator: alador brukte udemy-kurset som er referert i rapporten for denne siden og bygget opp fra det ved å legge til flere ruter og biblioteker
//hovedbibliotekene som brukes på backend
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//ruter til alle filene
const usersRoutes = require("./routes/users-routes");
const openingsRoutes = require("./routes/openings-routes");
const gamesRoutes = require("./routes/games-routes");
const userLimiter = require("./middleware/requestLimiter");
const createError = require("http-errors");

//biblioteker for å koble sammen frontend og backend
const cors = require("cors");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join("public")));

//cors brukes kun på produksjonssiden av koden for å gjøre det enklere å teste kode, men webserveren trenger det ikke siden vi har en "Combined App"
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//vår 3 hovedruter med Request Limiter for å kontrollere hvor mange forespørsler en bruker sender i hver rute
app.use("/api/users", userLimiter.userInteractionLimiter, usersRoutes);
app.use("/api/openings", userLimiter.userInteractionLimiter, openingsRoutes);
app.use("/api/games", userLimiter.matchesLimiter, gamesRoutes);

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.use((req, res, next) => {
  const error = createError(404, "Could not find this route.");
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

//kobling til databasen og port nummer
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.en1kinu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
