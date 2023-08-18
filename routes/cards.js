const { celebrate, Joi } = require("celebrate");
const router = require("express").Router();
const { validateId } = require("../utils/validateId");
const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require("../controllers/cards");

const validatorConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateId),
  }),
};

router.get("/", getCards);
router.post("/", celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
  }),
}), createCard);

router.delete("/:cardId", celebrate(validatorConfig), deleteCardById);
router.put("/:cardId/likes", celebrate(validatorConfig), addLike);
router.delete("/:cardId/likes", celebrate(validatorConfig), deleteLike);

module.exports = router;
