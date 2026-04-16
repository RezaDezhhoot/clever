import { DataTypes, literal } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("settings", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    value: { type: DataTypes.TEXT("long"), allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") }
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("settings");
}
