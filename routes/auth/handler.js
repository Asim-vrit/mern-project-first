const db = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  try {
    if (!req.body?.email || !req.body?.password) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { password, email } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      res.status(401).json({ error: "Email/Password doesnt match" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Email/Password doesnt match" });
      return;
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        email: existingUser.email,
        id: existingUser.id,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
    );
    res.json({
      result: "Login Successful",
      token: token,
    });
  } catch (error) {}
}

async function staffRegister(req, res) {
  try {
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { password, email, name } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      res.status(401).json({ error: "User with this email already exists!!!" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({ data: { email, name, password: hashedPassword } });

    res.json({
      result: "Registration Successful",
    });
  } catch (error) {}
}
async function register(req, res) {
  try {
    if (!req.body?.email || !req.body?.password || !req.body?.name) {
      res.status(400).json({ error: "Bad request" });
      return;
    }
    const { password, email, name } = req.body;
    const existingUser = await db.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      res.status(401).json({ error: "User with this email already exists!!!" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { email, name, password: hashedPassword, role: "USER" },
    });

    res.json({
      result: "Registration Successful",
    });
  } catch (error) {}
}

async function getMe(req, res) {
  try {
    const id = req.user_id;
    const user = await db.user.findUnique({
      where: { id: id },
      select: {
        email: true,
        id: true,
        name: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
async function changePassword(req, res) {
  try {
    const id = req.user_id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    if (!oldPassword || !newPassword) {
      res
        .status(400)
        .json({ error: "Both old and new password are required!!" });
      return;
    }
    const user = await db.user.findUnique({ where: { id: id } });
    const doesOldPasswordMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );
    if (!doesOldPasswordMatch) {
      res.status(400).json({ error: "Your old password does not match!!!" });
      return;
    }
    if (oldPassword === newPassword) {
      res.status(400).json({ error: "Old and new password cannot be same" });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({ where: { id: id }, data: { password: newHash } });
    res.json({ result: "Password is successfully changed!!!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong!" });
    return;
  }
}

module.exports = { login, register, staffRegister, getMe, changePassword };
