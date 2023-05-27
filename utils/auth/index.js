const passport = require("passport");

//Se definen las estrategias a usar
const LocalStrategy = require("./strategies/local.strategy");
const JwtStrategy = require("./strategies/jwt.strategy");

passport.use(LocalStrategy);
passport.use(JwtStrategy);
