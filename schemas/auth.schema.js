const Joi = require("joi");

const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "cl"] }});
const password = Joi.string().alphanum().min(8).max(12);
const token = Joi.string();

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

const refreshTokenSchema = Joi.object({
  token: token.required()
});

const recoverySchema = Joi.object({
  email: email.required()
});

const changePasswordSchema = Joi.object({
  password: password.required(),
  token: token.required()
});


module.exports = { loginSchema,refreshTokenSchema, recoverySchema, changePasswordSchema }
