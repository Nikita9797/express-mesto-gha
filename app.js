const express = require("express");
const mongoose = require("mongoose");
const { errors, celebrate, Joi } = require("celebrate");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const { createUser, login } = require("./controllers/users");

const { PORT = 3000 } = process.env;
const MONGODB_URL = "mongodb://127.0.0.1:27017/mestodb";
const auth = require("./middlewares/auth");
const handleError = require("./middlewares/handleError");

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
    password: Joi.string().required(),
    avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));

app.use(errors());

app.use(cookieParser);

app.use(router);

app.use(handleError);

app.listen(PORT);
