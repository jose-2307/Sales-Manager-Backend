const { Strategy, ExtractJwt } = require("passport-jwt");
const { config } = require("../../../config/config");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Se extrae el token
  secretOrKey: config.jwtSecretLogin
}

//Chequea que se ingrese con un token
const JwtStrategy = new Strategy(options,(payload, done) => {
  return done(null, payload); //Retorna la información en caso de la firma sea correcta
});

module.exports = JwtStrategy;
