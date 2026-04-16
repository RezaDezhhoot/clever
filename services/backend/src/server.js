import app from "./app.js";
import env from "./config/env.js";
import { sequelize } from "./db/models/index.js";

async function start() {
  await sequelize.authenticate();

  app.listen(env.port, () => {
    console.log(`Backend listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});