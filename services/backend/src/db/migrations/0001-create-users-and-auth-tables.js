import { DataTypes, literal } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("users", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    email_verified_at: { type: DataTypes.DATE, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    remember_token: { type: DataTypes.STRING, allowNull: true },
    avatar: { type: DataTypes.TEXT, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") }
  });
  await queryInterface.addIndex("users", ["role"], { name: "users_role" });

  await queryInterface.createTable("password_reset_tokens", {
    email: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: true }
  });

  await queryInterface.createTable("sessions", {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    payload: { type: DataTypes.TEXT("long"), allowNull: false },
    last_activity: { type: DataTypes.INTEGER, allowNull: false }
  });
  await queryInterface.addIndex("sessions", ["user_id"], { name: "sessions_user_id" });
  await queryInterface.addIndex("sessions", ["last_activity"], { name: "sessions_last_activity" });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("sessions");
  await queryInterface.dropTable("password_reset_tokens");
  await queryInterface.dropTable("users");
}
