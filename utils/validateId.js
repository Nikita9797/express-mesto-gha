const mongoose = require("mongoose");

function validateId(value) {
  const isValid = mongoose.isValidObjectId(value);

  if (isValid) return value;

  throw new Error("Невалидный ID");
}

module.exports = { validateId };
