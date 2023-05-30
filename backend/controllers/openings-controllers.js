//creator: alador
/**
 *  strukturen ligner på user controllers fordi jeg prøvde å gjenbruke det meste av logikken derfra til denne filen.
 *  Jeg hadde en gammel funksjon som hentet alle brukerne fra databasen som jeg tok fra udemy-kurset  jeg endret det til
 *  const getOpenings av endre innholdet fullstendig, men logikken er lik. const signup ble createOpenings
 *  ved å endre logikken for validering og opprettelse av dokumentet.
 *  jeg gjorde lignende ting med de andre ved å bruke deleteuser for å lage deleteOpeing
 */
const { validationResult } = require("express-validator");
const Opening = require("../models/opening");
const createError = require("http-errors");

// Får alle åpninger av brukeren
const getOpenings = async (req, res, next) => {
  const creatorId = req.userData.userId;
  let customOpenings;
  let defaultOpenings;
  try {
    defaultOpenings = await Opening.find({
      creator_id: "64617a3fe26a437d1c0978e9", //creatorID til Admin konto som er brukt for å lagre defaultOpenings
    });
    customOpenings = await Opening.find({ creator_id: creatorId });
  } catch (err) {
    const error = createError(
      500,
      "Henting av åpninger mislyktes, Prøv igjen senere."
    );
    return next(error);
  }
  const response = {
    defaultOpenings: defaultOpenings.map((defaultOpenings) =>
      defaultOpenings.toObject()
    ),
    customOpenings: customOpenings.map((customOpenings) =>
      customOpenings.toObject()
    ),
  };
  res.json(response);
};

// Oppretter en ny åpning
const createOpening = async (req, res, next) => {
  const name = req.body.name;
  const moves = req.body.moves;
  const description = req.body.description;
  const creator_id = req.userData.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(422, "Ugyldige inndata! vennligst prøv igjen."));
  }
  // Sjekker om åpning allerede eksisterer

  let findingOpening = await Opening.findOne().and([
    { name: name },
    { creator_id: creator_id },
  ]);

  if (findingOpening) {
    const error = createError(
      409,
      "Åpningen eksisterer allerede, prøv igjen med et annet navn."
    );
    return next(error);
  }

  // tilordne verdiene for den nye åpningen
  const createdOpening = new Opening({
    name,
    moves,
    description,
    creator_id,
  });

  //add authorization to make sure that users can only save openings on their accounts*
  try {
    await Opening.create(createdOpening);
  } catch (err) {
    const error = createError(
      500,
      "kunne ikke opprette åpning, prøv igjen senere."
    );
    return next(error);
  }
  res.status(201).json({ opening: createdOpening.toObject({ getters: true }) });
};

// Oppdaterer en eksisterende åpning
const updateOpening = async (req, res, next) => {
  const _id = req.params._id;
  const name = req.body.name;
  const moves = req.body.moves;
  const description = req.body.description;
  const creator_id = req.userData.userId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(422, "Ugyldige inndata, vennligst prøv igjen."));
  }

  let opening = await Opening.findOne().and([
    { _id: _id },
    { creator_id: creator_id },
  ]);

  if (!opening) {
    const error = createError(
      404,
      "Kunne ikke finne åpningen for det angitte navnet."
    );
    return next(error);
  }
  //
  opening.name = name;
  opening.moves = moves;
  opening.description = description;

  try {
    await Opening.create(opening);
  } catch (err) {
    const error = createError(
      500,
      "Noe gikk galt, kunne ikke oppdatere åpningen."
    );
    return next(error);
  }

  res.status(200).json({ opening: opening.toObject({ getters: true }) });
};

//sletting av en åpning
const deleteOpening = async (req, res, next) => {
  const _id = req.params._id;
  const creator_id = req.userData.userId;

  let deleteOpening = await Opening.findOne().and([
    { _id: _id },
    { creator_id: creator_id },
  ]);

  if (!deleteOpening) {
    const error = createError(
      404,
      "Kunne ikke finne åpningen for det angitte navnet."
    );
    return next(error);
  }

  try {
    deleteOpening = await Opening.deleteOne({ _id });
  } catch (err) {
    const error = createError(
      500,
      "Noe gikk galt, kunne ikke slette åpningen."
    );
    return next(error);
  }
  res.status(200).json("åpningen er slettet!");
};

exports.getOpenings = getOpenings;
exports.createOpening = createOpening;
exports.updateOpening = updateOpening;
exports.deleteOpening = deleteOpening;
