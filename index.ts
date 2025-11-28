import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { router as users } from "./routes/users";
import { router as auth } from "./routes/auth";
import { router as products } from "./routes/products";
import { router as cart } from "./routes/cart";

const app = express();

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
app.use(cart);

app.get("/", (req, res) => {
  res.json({ message: "Its working" });
});

app.listen(port, () => {
  console.log("App running in port " + port);
});
