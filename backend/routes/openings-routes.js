//creator: alador brukte koden fra user-routes og express biblioteket for å lage denne filen
const express = require("express");
const { check } = require("express-validator");
const tokenCheck = require("../middleware/token-auth");
const openingsController = require("../controllers/openings-controllers");

const router = express.Router();

//Route for å få alle åpninger etter creator ID
router.get("/", tokenCheck.checkToken, openingsController.getOpenings);

//Route for å lage en ny åpning
router.post(
  "/save",
  [
    check("name").not().isEmpty(),
    check("moves").not().isEmpty(),
    check("description").isString(),
  ],
  tokenCheck.checkToken,
  openingsController.createOpening
);
//Route for å oppdatere en eksisterende åpning med navn
router.patch(
  "/:_id",
  [
    check("name").not().isEmpty(),
    check("moves").not().isEmpty(),
    check("description").isString(),
  ],
  tokenCheck.checkToken,
  openingsController.updateOpening
);
//Route for å slette en åpning
router.delete("/:_id", tokenCheck.checkToken, openingsController.deleteOpening);

module.exports = router;
