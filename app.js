const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cookieParser = require("cookie-parser");
const router = require("./routes");

const { PORT = 3000 } = process.env;
const MONGODB_URL = "mongodb://127.0.0.1:27017/mestodb";
const handleError = require("./middlewares/handleError");

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(router);

app.use(errors());

app.use(handleError);

app.listen(PORT);
