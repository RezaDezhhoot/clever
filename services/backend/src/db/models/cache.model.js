import { DataTypes } from "sequelize";

export default function createCacheModel(sequelize) {
  return sequelize.define(
    "Cache",
    {
      key: { type: DataTypes.STRING, primaryKey: true },
      value: { type: DataTypes.TEXT("medium"), allowNull: false },
      expiration: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: "cache",
      timestamps: false
    }
  );
}
