const db = require("../../db");
var jwt = require("jsonwebtoken");

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
    const passwordMatch = password === existingUser.password;
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

module.exports = { login };
