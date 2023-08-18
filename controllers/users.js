const httpConstants = require("http2").constants;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const ServerError = require("../errors/ServerError");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

const getUsers = (req, res, next) => UserModel.find()
  .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
  .catch(() => next(new UnauthorizedError("Server Error")));

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return UserModel.findById(userId)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError("User not found"));
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new ValidationError("Incorrect data"));
      }
      next(new ServerError("Server Error"));
    });
};

const getCurrentUserInfo = (req, res, next) => UserModel.findById(req.user._id)
  .orFail()
  .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
  .catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError("User not found"));
    }
    next(new ServerError("Server Error"));
  });

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  if (!req.body.password) {
    next(new ValidationError("Пароль отсутствует"));
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(httpConstants.HTTP_STATUS_CREATED).send({
      name,
      about,
      avatar,
      email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError(err.message));
      }
      if (err.code === 11000) {
        next(new ConflictError("Данный email уже занят"));
      }
      next(new ServerError("Server Error"));
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, "some-secret-key"),
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError("User not found"));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError({
          message: `${Object.values(err.errors)
            .map(() => err.message)
            .join(", ")}`,
        }));
      }
      next(new ServerError("Server Error"))
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError("User not found"));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new ValidationError({
          message: `${Object.values(err.errors)
            .map(() => err.message)
            .join(", ")}`,
        }));
      }
      next(new ServerError("Server Error"))
    });
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUserInfo,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
