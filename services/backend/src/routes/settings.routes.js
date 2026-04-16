import { Router } from "express";
import * as controller from "../controllers/settings.controller.js";

const router = Router();

router.get("/", controller.index);
router.put("/", controller.store);

export default router;
