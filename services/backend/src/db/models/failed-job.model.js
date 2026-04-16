import { DataTypes } from "sequelize";

export default function createFailedJobModel(sequelize) {
  return sequelize.define(
    "FailedJob",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      uuid: { type: DataTypes.STRING, allowNull: false, unique: true },
      connection: { type: DataTypes.TEXT, allowNull: false },
      queue: { type: DataTypes.TEXT, allowNull: false },
      payload: { type: DataTypes.TEXT("long"), allowNull: false },
      exception: { type: DataTypes.TEXT("long"), allowNull: false },
      failedAt: { type: DataTypes.DATE, field: "failed_at", allowNull: false }
    },
    {
      tableName: "failed_jobs",
      timestamps: false
    }
  );
}
