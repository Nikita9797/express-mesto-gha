const UserModel = require("../models/user");

const getUsers = (req, res) => {
  return UserModel.find()
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(() => res.status(500).send("Server Error"));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  return UserModel.findById(userId)
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(404).send({ message: "User not found" });
      }
      res.status(500).send("Server Error");
    });
};

const createUser = (req, res) => {
  return UserModel.create({ ...req.body })
    .then((user) => {
      return res.status(201).send(user);
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

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
      }
      res.status(500).send("Server Error");
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return UserModel.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: `${Object.values(err.errors)
            .map((err) => err.message)
            .join(", ")}`,
        });
      }
      res.status(500).send("Server Error");
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
