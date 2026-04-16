import { DataTypes } from "sequelize";

export default function createJobModel(sequelize) {
  return sequelize.define(
    "Job",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      queue: { type: DataTypes.STRING, allowNull: false },
      payload: { type: DataTypes.TEXT("long"), allowNull: false },
      attempts: { type: DataTypes.INTEGER, allowNull: false },
      reservedAt: { type: DataTypes.INTEGER, field: "reserved_at", allowNull: true },
      availableAt: { type: DataTypes.INTEGER, field: "available_at", allowNull: false },
      createdAt: { type: DataTypes.INTEGER, field: "created_at", allowNull: false }
    },
    {
      tableName: "jobs",
      timestamps: false
    }
  );
}
