import express from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "node:fs";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error-handler.js";
import env from "./config/env.js";
import createCorsOptions from "./middlewares/cors.js";

fs.mkdirSync(env.uploadDir, { recursive: true });

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(createCorsOptions)
app.use("/uploads", express.static(env.uploadDir));
app.use("/api/v1", routes);
app.use(errorHandler);

export default app;
