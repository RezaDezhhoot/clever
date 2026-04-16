import { Router } from "express";
import * as controller from "../controllers/user.controller.js";

const router = Router();

router.get("/", controller.index);
router.get("/:id", controller.show);
router.post("/", controller.store);
router.put("/:id", controller.update);
router.delete("/:id", controller.destroy);

export default router;
