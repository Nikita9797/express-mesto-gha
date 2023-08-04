const router = require("express").Router();
const {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
} = require("../controllers/cards");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCardById);
router.put("/:cardId/likes", addLike);
router.delete("/:cardId/likes", deleteLike);

module.exports = router;
