const db = require("../../db");

async function getAllUsers(req, res) {
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
async function getUserById(req, res) {}
async function postUser(req, res) {}
async function udpateUser(req, res) {}
async function deleteUser(req, res) {}

module.exports = {
  getAllUsers,
  getUserById,
  postUser,
  udpateUser,
  deleteUser,
};
