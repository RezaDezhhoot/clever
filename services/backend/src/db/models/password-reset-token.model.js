import { DataTypes } from "sequelize";

export default function createPasswordResetTokenModel(sequelize) {
  return sequelize.define(
    "PasswordResetToken",
    {
      email: { type: DataTypes.STRING, primaryKey: true },
      token: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, field: "created_at", allowNull: true }
    },
    {
      tableName: "password_reset_tokens",
      timestamps: false
    }
  );
}
