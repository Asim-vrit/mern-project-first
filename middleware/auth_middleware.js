var jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
  try {
    const token = req.headers?.authorization;
    if (!token) {
      res.status(401).json({ error: "Authorization header is required!!" });
      return;
    }
    const bearerToken = token.split(" ")?.[1];
    if (!bearerToken) {
      res.status(401).json({ error: "Token is invalid!!" });
      return;
    }
    const decodedToken = jwt.verify(bearerToken, process.env.JWT_SECRET);
    console.log(decodedToken);
    req.role = decodedToken.role;
    req.user_id = decodedToken.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authorization Token is invalid" });
    return;
  }
}

function superUserOnly(req, res, next) {
  try {
    if (!req.role) {
      res.status(401).json({ error: "Valid token not found" });
      return;
    }
    if (req.role === "SUPERUSER") {
      next();
      return;
    }
    res.status(403).json({ error: "Forbidden request" });
    return;
  } catch (error) {
    res.status(500).json({ error: "Forbidden request" });
    return;
  }
}

module.exports = { validateToken, superUserOnly };
