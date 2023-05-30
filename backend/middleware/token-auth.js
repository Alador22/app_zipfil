//creator : Alador brukte udemy course-måten for å autentisere token. jeg endret bare fra linje 15 til 21 og hvordan feilhåndteringen fungerer
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//her bruker vi jsonwebtoken-biblioteket til å autentisere brukeren ved å sjekke den tokenen de sender med hver request
const checkToken = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw createError(422, "Ugyldige inndata, vennligst prøv igjen.");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userData = {
      userId: decodedToken.userId,
      email: decodedToken.email,
      elo: decodedToken.elo,
      admin: decodedToken.admin,
    };
    next();
  } catch (err) {
    const error = createError(401, "autentisering mislyktes");
    return next(error);
  }
};

exports.checkToken = checkToken;
