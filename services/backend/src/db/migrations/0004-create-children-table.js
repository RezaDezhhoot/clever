import { DataTypes, literal } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("children", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: true },
    birthdate: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") }
  });
  await queryInterface.addIndex("children", ["user_id"], { name: "children_user_id" });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("children");
}
