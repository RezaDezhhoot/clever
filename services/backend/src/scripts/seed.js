import { Setting, sequelize, User, Version } from "../db/models/index.js";

async function seed() {
  await sequelize.authenticate();

  const [adminUser] = await User.findOrCreate({
    where: { email: "admin@cleverquest.local" },
    defaults: {
      name: "Administrator",
      emailVerifiedAt: new Date(),
      password: "1234",
      role: "admin",
      avatar: null
    }
  });

  adminUser.name = "Administrator";
  adminUser.role = "admin";
  adminUser.emailVerifiedAt = adminUser.emailVerifiedAt || new Date();
  adminUser.avatar = adminUser.avatar || null;
  adminUser.password = "1234";
  await adminUser.save();

  await sequelize.query(`
    SELECT setval(
      pg_get_serial_sequence('"users"', 'id'),
      COALESCE((SELECT MAX(id) FROM "users"), 1),
      (SELECT EXISTS (SELECT 1 FROM "users"))
    );
  `);

  await Version.upsert({ platform: "app_store", force: false, version: "0.0.1" });
  await Version.upsert({ platform: "play_store", force: false, version: "0.0.1" });

  await Setting.upsert({ name: "title", value: "Clever Quest" });
  await Setting.upsert({ name: "logo", value: "" });
  await Setting.upsert({ name: "status", value: "true" });

  console.log("Database seed completed.");
  await sequelize.close();
}

seed().catch(async (error) => {
  console.error(error);
  await sequelize.close();
  process.exit(1);
});
