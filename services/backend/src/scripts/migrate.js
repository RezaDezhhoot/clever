import sequelize from "../config/database.js";
import { migrator } from "../db/migrator.js";

async function migrate(direction = "up") {
  await sequelize.authenticate();

  if (direction === "down") {
    const result = await migrator.down();
    console.log(`Reverted migration: ${result?.name ?? "none"}`);
  } else {
    const executed = await migrator.up();
    console.log(`Executed ${executed.length} migration(s).`);
  }

  await sequelize.close();
}

migrate(process.argv[2]).catch(async (error) => {
  console.error(error);
  await sequelize.close();
  process.exit(1);
});

