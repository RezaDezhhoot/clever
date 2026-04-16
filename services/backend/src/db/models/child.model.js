import { DataTypes } from "sequelize";

export default function createChildModel(sequelize) {
  return sequelize.define(
    "Child",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.BIGINT, field: "user_id", allowNull: false },
      name: { type: DataTypes.STRING, allowNull: true },
      birthdate: { type: DataTypes.DATE, allowNull: true }
    },
    {
      tableName: "children",
      underscored: true
    }
  );
}
