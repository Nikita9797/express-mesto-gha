const { ObjectId } = require("mongoose").Types.ObjectId;

function validateId(value) {
  const isValid = ObjectId.isValid(value);

  if (isValid) return value;

  throw new Error("Невалидный ID");
}

module.exports = { validateId };
