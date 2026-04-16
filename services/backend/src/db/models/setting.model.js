import { DataTypes } from "sequelize";

export default function createSettingModel(sequelize) {
  return sequelize.define(
    "Setting",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      value: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: "settings",
      underscored: true
    }
  );
}
