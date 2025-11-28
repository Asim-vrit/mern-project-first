import db from "../../db";
import { Request, Response } from "express";
import { AuthRequest } from "../../types/global-types";
("express");
async function getAllCarts(req: Request, res: Response) {
  try {
    const cart = await db.userCart.findMany({
      include: { user: true, product: true },
    });
    res.json({ results: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
    return;
  }
}
async function getMyCart(req: AuthRequest, res: Response) {
  try {
    const cart = await db.userCart.findMany({
      where: { user_id: req.user_id },
      include: { product: true },
      orderBy: { updated_at: "desc" },
    });
    res.json({ results: cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
    return;
  }
}
async function addToCart(req: AuthRequest, res: Response) {
  try {
    const userid = req.user_id || "";
    const productId = req.body?.productId;
    if (!productId) {
      res.status(400).json({ error: "Product id is required" });
      return;
    }
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.status(400).json({ error: "Product id is invalid" });
      return;
    }
    const oldCart = await db.userCart.findFirst({
      where: { user_id: userid, product_id: productId },
    });
    if (oldCart) {
      await db.userCart.update({
        where: { id: oldCart.id },
        data: { count: oldCart.count + 1 },
      });
      res.status(200).json({ result: "Product added to cart" });
      return;
    }
    await db.userCart.create({
      data: { user_id: userid, product_id: productId },
    });
    res.status(200).json({ result: "Product added to cart" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
    return;
  }
}

export { getAllCarts, addToCart, getMyCart };
