const httpConstants = require("http2").constants;
const mongoose = require("mongoose");
const CardModel = require("../models/card");

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send("Server Error"));
};

const createCard = (req, res) => {
  const ownerId = req.user._id;
  return CardModel.create({ ...req.body, owner: ownerId })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors)
            .map(() => err.message)
            .join(", ")}`,
        });
      }
      return res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send("Server Error");
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndRemove(cardId)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Card not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "Incorrect data" });
      }
      return res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send("Server Error");
    });
};

const addLike = (req, res) => {
  const { cardId } = req.params;
  return CardModel.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Card not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "Incorrect data" });
      }
      return res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send("Server Error");
    });
};

const deleteLike = (req, res) => {
  const { cardId } = req.params;

  return CardModel.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((card) => res.status(httpConstants.HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "Card not found" });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(httpConstants.HTTP_STATUS_BAD_REQUEST)
          .send({ message: "Incorrect data" });
      }
      return res
        .status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send("Server Error");
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
