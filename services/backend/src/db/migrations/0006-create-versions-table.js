import { DataTypes, literal } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("versions", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    platform: { type: DataTypes.STRING, allowNull: false, unique: true },
    force: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    version: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") }
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("versions");
}