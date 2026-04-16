import { DataTypes } from "sequelize";

export default function createCacheLockModel(sequelize) {
  return sequelize.define(
    "CacheLock",
    {
      key: { type: DataTypes.STRING, primaryKey: true },
      owner: { type: DataTypes.STRING, allowNull: false },
      expiration: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      tableName: "cache_locks",
      timestamps: false
    }
  );
}
