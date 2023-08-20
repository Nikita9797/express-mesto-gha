const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { validateId } = require("../utils/validateId");
const { regexUrl } = require("../utils/regexUrl");
const {
  getUsers,
  getUserById,
  getCurrentUserInfo,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUserInfo);
router.get("/:userId", celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validateId),
  }),
}), getUserById);
router.patch("/me", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch("/me/avatar", celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regexUrl),
  }),
}), updateAvatar);

module.exports = router;
