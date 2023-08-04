const CardModel = require("../models/card");

const getCards = (req, res) => {
  return CardModel.find()
    .then((cards) => {
      return res.status(200).send(cards);
    })
    .catch(() => res.status(500).send("Server Error"));
};

const createCard = (req, res) => {
  const ownerId = req.user._id;
  return CardModel.create({ ...req.body, owner: ownerId })
    .then((card) => {
      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
      }
      if (err.name === "CastError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
      }
      return res.status(500).send("Server Error");
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndRemove(cardId)
    .then((card) => {
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({ message: "Card not found" });
      }
      res.status(500).send("Server Error");
    });
};

const addLike = (req, res) => {
  const { cardId } = req.params;
  return CardModel.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Incorrect data" });
      }
      res.status(500).send("Server Error");
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: "Card not found" });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).send({ message: "Incorrect data" });
      }
      res.status(500).send("Server Error");
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
