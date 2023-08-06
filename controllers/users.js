const httpConstants = require("http2").constants;
const mongoose = require("mongoose");
const UserModel = require("../models/user");

const getUsers = (req, res) => UserModel.find()
  .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
  .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send("Server Error"));

const getUserById = (req, res) => {
  const { userId } = req.params;

  return UserModel.findById(userId)
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "User not found" });
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

const createUser = (req, res) => UserModel.create({ ...req.body })
  .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
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

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new mongoose.Error.DocumentNotFoundError())
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "User not found" });
      }
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

const updateAvatar = (req, res) => {
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
        return res
          .status(httpConstants.HTTP_STATUS_NOT_FOUND)
          .send({ message: "User not found" });
      }
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
