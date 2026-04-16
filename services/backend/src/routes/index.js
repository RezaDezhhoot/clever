import { Router } from "express";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import usersRoutes from "./users.routes.js";
import settingsRoutes from "./settings.routes.js";
import versionsRoutes from "./versions.routes.js";
import uploadRoutes from "./upload.routes.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use(authenticate);
router.use("/dashboard", dashboardRoutes);
router.use("/users", usersRoutes);
router.use("/settings", settingsRoutes);
router.use("/versions", versionsRoutes);
router.use("/uploads", uploadRoutes);

export default router;
