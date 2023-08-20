const httpConstants = require("http2").constants;
const mongoose = require("mongoose");
const CardModel = require("../models/card");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const ServerError = require("../errors/ServerError");
const ForbiddenError = require("../errors/ForbiddenError");

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => res.status(httpConstants.HTTP_STATUS_OK).send(cards))
    .catch(() => next(new ServerError("Server Error")));
};

const createCard = (req, res, next) => {
  const ownerId = req.user._id;
  return CardModel.create({ ...req.body, owner: ownerId })
    .then((card) => res.status(httpConstants.HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError({
          message: `${Object.values(err.errors)
            .map(() => err.message)
            .join(", ")}`,
        }));
      }
      return next(new ServerError("Server Error"));
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;

  return CardModel.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return CardModel.findByIdAndRemove(cardId)
          .then((deletedCard) => res.status(httpConstants.HTTP_STATUS_OK).send(deletedCard))
          .catch(() => next(new ServerError("Server Error")));
      }
      return next(new ForbiddenError("Нельзя удалять чужую карточку"));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError("Card not found"));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Incorrect data"));
      }
      return next(new ServerError("Server Error"));
    });
};

const addLike = (req, res, next) => {
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
        return next(new NotFoundError("Card not found"));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Incorrect data"));
      }
      return next(new ServerError("Server Error"));
    });
};

const deleteLike = (req, res, next) => {
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
        return next(new NotFoundError("Card not found"));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new ValidationError("Incorrect data"));
      }
      return next(new ServerError("Server Error"));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  addLike,
  deleteLike,
};
