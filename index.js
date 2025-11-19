const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const products = require("./routes/products");
const auth = require("./routes/auth");
const app = express();
const cors = require("cors");

const parser = bodyParser.json();
const port = 3000;

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(parser);

app.use(users);
app.use(products);
app.use(auth);

app.get("/", (req, res) => {
  res.json({ message: "Its working" });
});

app.listen(port, () => {
  console.log("App running in port " + port);
});
