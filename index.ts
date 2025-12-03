import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { router as auth } from "./routes/auth";
import { router as cart } from "./routes/cart";
import { router as products } from "./routes/products";
import { router as users } from "./routes/users";
import { upload } from "./uploads";
import fs from "fs";
import path from "path";
import db from "./db";
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

app.post("/file-example", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const uploadFolder = "uploads";
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    const d = new Date();
    const timestamp = d.getTime();
    if (file) {
      const fileName = timestamp + "-" + file?.originalname;
      const filePath = path.join(uploadFolder, fileName);
      fs.writeFileSync(filePath, file.buffer);
      await db.fileUploads.create({
        data: { file: uploadFolder + "/" + fileName },
      });
    }
    res.json("ok");
  } catch (error) {
    console.log(error);
    res.status(500).json("error");
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Its working" });
});
app.use("/uploads", express.static("uploads"));
app.listen(port, () => {
  console.log("App running in port " + port);
});
