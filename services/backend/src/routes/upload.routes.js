import { Router } from "express";
import upload from "../config/multer.js";
import * as controller from "../controllers/upload.controller.js";

const router = Router();

router.post("/", upload.single("file"), controller.uploadFile);

export default router;
