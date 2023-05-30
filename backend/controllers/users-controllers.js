//creator: Alador
/**const signup og const login er inspirert av udemy-kurset,
 * men innholdet deres har blitt endret som feil håndteringen for alle filene i backned med alle passende statuskoder.
 * Jeg skrev om loggiken til token med å bruke jsonwebtoken-biblioteket og User formatet i const user = new user.
 * bycrpt-koden ble direkte kopiert fra kurset med kun endringer i feilhåndteringen. */
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Opening = require("../models/opening");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

//koden som kjøres for å opprette en bruker på databasen
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(422, "Ugyldige inndata, vennligst prøv igjen."));
  }

  const { name, email, password } = req.body;

  let alreadyUser = await User.findOne({ email: email });

  if (alreadyUser) {
    const error = createError(
      409,
      "Brukeren eksisterer allerede, vennligst logg på i stedet."
    );
    return next(error);
  }

  //passordet er saltet og hashet før det sendes til databasen
  let hashedPassword;
  const rounds = 12;
  try {
    hashedPassword = await bcrypt.hash(password, rounds);
  } catch (err) {
    const error = createError(500, "Kunne ikke opprette bruker, prøv igjen.");
    return next(error);
  }

  //denne strukturen sendes som et json format til databasen slik at brukeren kan lagres
  const newUser = new User({
    name,
    email,
    image: "https://web01.usn.no/~lonnesta/Tor_Lonnestad.jpg",
    password: hashedPassword,
    elo: 1000,
    admin: false,
  });

  try {
    await User.create(newUser);
  } catch (err) {
    const error = createError(500, "noe gikk galt, vennligst prøv igjen.");
    return next(error);
  }
  //oppretter en token som vil bli sendt og lagret på klienten/frontend
  let token;
  try {
    token = jwt.sign(
      {
        name: newUser.name,
        userId: newUser.id,
        email: newUser.email,
        elo: newUser.elo,
        admin: newUser.admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    const error = createError(
      500,
      "kunne ikke registrere deg,vennligst prøv igjen"
    );
    return next(error);
  }
  res.status(201).json({ token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //sjekker om brukeren finnes i databasen
  let alreadyUser = await User.findOne({ email: email });

  if (!alreadyUser) {
    const error = createError(
      404,
      "Ugyldig inndata, kunne ikke logge deg på nå."
    );
    return next(error);
  }

  //vi bruker bcrypt-biblioteket for å sjekke om passordet som er gitt samsvarer med den hashed passordet som er lagret i databasen
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, alreadyUser.password);
  } catch (err) {
    const error = createError(
      500,
      "Kunne ikke logge deg på, vennligst prøv igjen."
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = createError(
      401,
      "Ugyldig inndata, kunne ikke logge deg på nå."
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      {
        name: alreadyUser.name,
        userId: alreadyUser.id,
        email: alreadyUser.email,
        elo: alreadyUser.elo,
        admin: alreadyUser.admin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" },
      { algorithm: "RS256" }
    );
  } catch (err) {
    const error = createError(
      500,
      "kunne ikke logge deg på,vennligst prøv igjen."
    );
    return next(error);
  }
  res.status(201).json({ token: token });
};

//slette brukeren ved først å autentisere
const deleteUser = async (req, res, next) => {
  const email = req.userData.email;
  const password = req.body.password;
  const creator_id = req.userData.userId;

  let findUser = await User.findOne({ email: email });

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, findUser.password);
  } catch (err) {
    const error = createError(500, "Noe gikk galt, vennligst prøv igjen.");
    return next(error);
  }

  if (!isValidPassword) {
    const error = createError(
      401,
      "Ugyldig inndata, kunne ikke slette kontoen"
    );
    return next(error);
  }

  try {
    await User.deleteOne({ email: findUser.email });
    await Opening.deleteMany({ creator_id });
  } catch (err) {
    const error = createError(
      500,
      "Noe gikk galt, vennligst prøv igjen senere."
    );
    return next(error);
  }
  res.status(200).json("kontoen har blitt slettet!");
};

//kode for at brukeren skal endre passordet sitt. vi sjekker først om det gamle passordet er riktig og validerer det nye passordet før vi lar dem endre det
const changePass = async (req, res, next) => {
  const email = req.userData.email;
  const oldPassword = req.body.password;
  const newPass = req.body.newPass;

  let findUser = await User.findOne({ email: email });

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(oldPassword, findUser.password);
  } catch (err) {
    const error = createError(500, "Noe gikk galt, vennligst prøv igjen.");
    return next(error);
  }
  if (!isValidPassword) {
    const error = createError(401, "Ugyldig inndata, kunne ikke endre passord");
    return next(error);
  }

  let isSamePassword = false;
  try {
    isSamePassword = await bcrypt.compare(newPass, findUser.password);
  } catch (err) {
    const error = createError(500, "Noe gikk galt, vennligst prøv igjen.");
    return next(error);
  }
  if (isSamePassword) {
    const error = createError(401, "du har allerede dette som passord!");
    return next(error);
  }

  let rounds;
  let password;
  try {
    rounds = 12;
    password = await bcrypt.hash(newPass, rounds);
    await User.updateOne({ email }, { password: password });
  } catch (err) {
    const error = createError(
      500,
      "Noe gikk galt, vennligst prøv igjen senere."
    );
    return next(error);
  }
  res.status(200).json("passordet er oppdatert!");
};

//en admin-funksjon som sjekker om brukeren er en admin, og lar dem gi admin-rollen til andre brukere
const updateAdminRole = async (req, res, next) => {
  const email = req.body.email;
  const isAdmin = req.userData.admin;

  if (!isAdmin) {
    const error = createError(
      401,
      "du trenger en administratorrolle for å gjøre denne endringen "
    );
    return next(error);
  }

  let findUser = await User.findOne({ email: email });

  if (!findUser) {
    const error = createError(404, "Ugyldig inndata, kunne ikke finne kontoen");
    return next(error);
  }

  let response;
  if (findUser.admin === true) {
    try {
      await User.updateOne({ email }, { admin: false });
    } catch (err) {
      const error = createError(500, "Noe gikk galt, vennligst prøv igjen.");
      return next(error);
    }
    response = "administrator rollen er fjernet";
  } else {
    try {
      await User.updateOne({ email }, { admin: true });
    } catch (err) {
      const error = createError(500, "Noe gikk galt, vennligst prøv igjen.");
      return next(error);
    }
    response = "brukeren er nå administrator";
  }
  res.status(200).json(response);
};
//en admin-funksjon som sjekker om brukeren er en admin, og lar dem slette brukere
const adminDeleteUser = async (req, res, next) => {
  const email = req.body.email;
  let creator_id;
  const isAdmin = req.userData.admin;

  if (!isAdmin) {
    const error = createError(
      401,
      "du trenger en administratorrolle for å gjøre denne endringen "
    );
    return next(error);
  }

  let findUser = await User.findOne({ email: email });

  if (!findUser) {
    const error = createError(404, "Ugyldig inndata, kunne ikke finne kontoen");
    return next(error);
  }

  creator_id = findUser.id;

  try {
    await User.deleteOne({ email: findUser.email });
    await Opening.deleteMany({ creator_id });
  } catch (err) {
    const error = createError(
      500,
      "Noe gikk galt, vennligst prøv igjen senere."
    );
    return next(error);
  }
  res.status(200).json("kontoen har blitt slettet!");
};
exports.signup = signup;
exports.login = login;
exports.deleteUser = deleteUser;
exports.updateAdminRole = updateAdminRole;
exports.adminDeleteUser = adminDeleteUser;
exports.changePass = changePass;
