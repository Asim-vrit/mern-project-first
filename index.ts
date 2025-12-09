import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { router as auth } from "./routes/auth";
import { router as cart } from "./routes/cart";
import { router as products } from "./routes/products";
import { router as users } from "./routes/users";
import { response_handler } from "./middleware/response_handler";
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

app.use(response_handler);

app.use("/uploads", express.static("uploads"));
app.listen(port, () => {
  console.log("App running in port " + port);
});
