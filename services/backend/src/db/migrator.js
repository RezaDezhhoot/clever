import path from "node:path";
import { fileURLToPath } from "node:url";
import { SequelizeStorage, Umzug } from "umzug";
import sequelize from "../config/database.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.js", { cwd: currentDir }]
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console
});

export { migrator };