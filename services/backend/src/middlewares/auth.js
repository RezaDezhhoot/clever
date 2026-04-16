import { Child, User } from "../db/models/index.js";
import { verifyToken } from "../services/token.service.js";

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const payload = verifyToken(token);
    const user = await User.findByPk(payload.sub, {
      include: [{ model: Child, as: "child" }]
    });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export {
  authenticate
};
