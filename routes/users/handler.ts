import { Request, Response } from "express";
import db from "../../db";

async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      select: {
        email: true,
        id: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
    res.json({ result: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
async function getUserById(req: Request, res: Response) {}
async function postUser(req: Request, res: Response) {}
async function udpateUser(req: Request, res: Response) {}
async function deleteUser(req: Request, res: Response) {}

export { getAllUsers, getUserById, postUser, udpateUser, deleteUser };
