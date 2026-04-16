import { Router } from "express";
import * as controller from "../controllers/version.controller.js";

const router = Router();

router.get("/", controller.index);
router.put("/", controller.store);

export default router;
