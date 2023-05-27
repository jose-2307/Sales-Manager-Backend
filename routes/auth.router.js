const express = require("express");
const passport = require("passport");
const AuthService = require("../services/auth.service");
const validatorHandler = require("../middlewares/validator.handler");
const { changePasswordSchema, loginSchema, recoverySchema, refreshTokenSchema } = require("../schemas/auth.schema");

const router = express.Router();
const service = new AuthService();

router.post("/login",
  passport.authenticate("local", {session: false}), //Realiza la autenticación del usuario
  validatorHandler(loginSchema, "body"),
  async (req, res, next) => {
    try {
      const user = req.user;
      const resp = await service.signToken(user);
      res.json(resp);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/refresh-token",
  validatorHandler(refreshTokenSchema),
  async (req, res, next) => {
    try {
      const refreshToken = req.headers["refresh"];
      res.json(await service.signRefreshToken(refreshToken));
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/logout",
  validatorHandler(refreshTokenSchema),
  async (req, res, next) => {
    try {
      const refreshToken = req.headers["refresh"];
      res.json(await service.logout(refreshToken));
    } catch (error) {
      next(error);
    }
  }
);

router.post("/recovery-password",
  validatorHandler(recoverySchema, "body"),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      res.json(await service.sendRecovery(email));
    } catch (error) {
      next(error);
    }
  }
);

router.post("/change-password",
  validatorHandler(changePasswordSchema, "body"),
  async (req, res, next) => {
    try {
      const { password, token } = req.body;
      res.json(await service.changePassword(token, password));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
