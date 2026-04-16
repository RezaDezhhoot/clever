import bcrypt from "bcryptjs";
import { Child, User } from "../db/models/index.js";
import { signToken } from "../services/token.service.js";
import { serializeUser } from "../utils/serializers.js";

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Child, as: "child" }]
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.json({
      token: signToken(user),
      user: serializeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.json({ user: serializeUser(req.user) });
}

export {
  login,
  me
};
