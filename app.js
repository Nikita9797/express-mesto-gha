const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const MONGODB_URL = "mongodb://127.0.0.1:27017/mestodb";

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: "64cb9dee77af2bb8ad7b5458",
  };

  next();
});

app.use(bodyParser.json());

app.use(router);

app.listen(PORT);
