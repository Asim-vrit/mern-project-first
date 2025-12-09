import db from "../../db";
import { NextFunction, Request, Response } from "express";
import { fileDelete, fileUpload } from "../../utils/fileService";
async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await db.product.findMany();
    next({
      success: true,
      data: products,
      message: "Products fetched successfully!",
    });
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
    const file = req.file;
    const title = req.body.title;
    const description = req.body.description || "";
    const price = parseInt(req.body.price) || 0;
    const rating = parseInt(req.body.rating) || 0;
    let filePath = null;
    const existingProduct = await db.product.findFirst({
      where: { title },
    });

    if (!!existingProduct) {
      res.status(400).json({ error: "Title already exists" });
      return;
    }
    if (file) {
      filePath = fileUpload(file, "products");
    }
    const product = await db.product.create({
      data: { title, description, price, rating, image: filePath },
    });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function udpateProduct(req: Request, res: Response) {
  try {
    const prodId = req.params.id;
    const products = await db.product.findUnique({
      where: { id: prodId },
    });
    if (!products) {
      res.status(404).json({ error: "Product not found" });
    }
    const file = req.file;
    let filePath = undefined;
    if (file) {
      filePath = fileUpload(file, "products");
      if (products?.image) fileDelete(products?.image);
    }
    const updated = await db.product.update({
      where: { id: prodId },
      data: { image: filePath, ...req.body },
    });
    res.json({ result: updated });
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
