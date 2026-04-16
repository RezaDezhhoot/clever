import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const backendRoot = path.resolve(currentDir, "../..");
const serviceEnv = path.resolve(backendRoot, ".env");

dotenv.config({ path: serviceEnv, override: false });

const defaultCorsOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173"
];

const configuredCorsOrigins = String(process.env.CORS_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const corsOrigins = Array.from(new Set([...defaultCorsOrigins, ...configuredCorsOrigins]));

const env = {
  nodeEnv: process.env.APP_ENV || process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || process.env.BACKEND_PORT || 3000),
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_DATABASE || "cleverquest",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
  },
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: corsOrigins[0],
  corsOrigins,
  uploadDir: path.resolve(backendRoot, "storage", "uploads")
};

export default env;
