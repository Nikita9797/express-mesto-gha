const express = require("express");
const mongoose = require("mongoose");
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

app.post("/signin", login);
app.post("/signup", createUser);

app.use(auth);
app.use("/cards", require("./routes/cards"));
app.use("/users", require("./routes/users"));

app.use(router);

app.use(handleError);

app.listen(PORT);
