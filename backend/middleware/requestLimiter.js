//creator: alador brukte express rate limit biblioteket og laget disse funksjonene som er som eksportert og brukt i app.js-filen
const rateLimit = require("express-rate-limit");
//vi brukte express rate limit for å begrense mengden forespørsler sendt av en enkelt bruker for å forhindre utilsiktede høyfrekvent forespørsler fra brukere
const userInteractionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutt
  max: 15, // Begrenser hver IP adresse til 15 forespørsler per minutt
  message:
    "For mange forespørsler sendt fra denne IP-adressen, prøv igjen om 1 minutt",
  standardHeaders: true,
  legacyHeaders: false,
});

const matchesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutt
  max: 30, // Begrenser hver IP adresse til 30 forespørsler per minutt
  message:
    "For mange forespørsler sendt fra denne IP-adressen, prøv igjen etter 1 minutt",
  standardHeaders: true,
  legacyHeaders: false,
});
exports.userInteractionLimiter = userInteractionLimiter;
exports.matchesLimiter = matchesLimiter;
