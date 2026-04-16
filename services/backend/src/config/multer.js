import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import env from "./env.js";

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, env.uploadDir);
  },
  filename: (_req, file, callback) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-");
    callback(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    const allowed = /jpg|jpeg|png|gif|webp|svg|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    callback(null, allowed.test(ext));
  }
});

export default upload;
