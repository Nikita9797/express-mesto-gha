const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { createUser, login } = require("../controllers/users");
const auth = require("../middlewares/auth");
const usersRouter = require("./users");
const cardsRouter = require("./cards");
const NotFoundError = require("../errors/NotFoundError");

router.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
router.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use("/users", auth, usersRouter);
router.use("/cards", auth, cardsRouter);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Invalid request address"));
});

module.exports = router;
