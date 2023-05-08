const boom = require("@hapi/boom");

/**
 * Objetivo: Validar los datos de entrada con su respectivo Schema.
 */
const validatorHandler = (schema, property) => {
  return (req, res, next) => {
    const data = req[property]; //obtiene los datos según la propiedad utilizada (params, body o query)
    const { error } = schema.validate(data, { abortEarly: false }); //"abortEarly: false" permite que, en caso de haber más de un error en los datos, te entregue todos los errores y no solo el primero
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  }
}

module.exports = validatorHandler;
