import { DataTypes } from "sequelize";

export default function createVersionModel(sequelize) {
  return sequelize.define(
    "Version",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      platform: { type: DataTypes.STRING, allowNull: false, unique: true },
      force: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      version: { type: DataTypes.STRING, allowNull: false }
    },
    {
      tableName: "versions",
      underscored: true
    }
  );
}
