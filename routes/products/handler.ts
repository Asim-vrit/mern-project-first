import db from "../../db";
import { Request, Response } from "express";
async function getAllProducts(req: Request, res: Response) {
  try {
    const products = await db.product.findMany();
    res.json({ result: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getProductById(req: Request, res: Response) {
  try {
    const products = await db.product.findMany();
    res.json({ result: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function postProduct(req: Request, res: Response) {
  try {
    const title = req.body.title;
    const description = req.body.description || "";
    const price = req.body.price || 0;
    const rating = req.body.rating || 0;

    const existingProduct = await db.product.findFirst({
      where: { title },
    });

    if (!!existingProduct) {
      res.status(400).json({ error: "Title already exists" });
      return;
    }
    const product = await db.product.create({
      data: { title, description, price, rating },
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function udpateProduct(req: Request, res: Response) {
  try {
    const products = await db.product.findMany();
    res.json({ result: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function deleteProduct(req: Request, res: Response) {
  try {
    const products = await db.product.findMany();
    res.json({ result: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export {
  getAllProducts,
  getProductById,
  postProduct,
  udpateProduct,
  deleteProduct,
};
