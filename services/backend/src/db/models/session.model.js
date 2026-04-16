import { DataTypes } from "sequelize";

export default function createSessionModel(sequelize) {
  return sequelize.define(
    "Session",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      userId: { type: DataTypes.BIGINT, field: "user_id", allowNull: true },
      ipAddress: { type: DataTypes.STRING(45), field: "ip_address", allowNull: true },
      userAgent: { type: DataTypes.TEXT, field: "user_agent", allowNull: true },
      payload: { type: DataTypes.TEXT("long"), allowNull: false },
      lastActivity: { type: DataTypes.INTEGER, field: "last_activity", allowNull: false }
    },
    {
      tableName: "sessions",
      timestamps: false
    }
  );
}
