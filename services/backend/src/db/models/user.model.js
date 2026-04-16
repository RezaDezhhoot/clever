import bcrypt from "bcryptjs";
import { DataTypes } from "sequelize";

const HASH_PATTERN = /^\$2[aby]\$\d{2}\$.+/;

function shouldHashPassword(user) {
  return Boolean(user.password) && user.changed("password") && !HASH_PATTERN.test(user.password);
}

export default function createUserModel(sequelize) {
  return sequelize.define(
    "User",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      emailVerifiedAt: { type: DataTypes.DATE, field: "email_verified_at", allowNull: true },
      password: { type: DataTypes.STRING, allowNull: true },
      rememberToken: { type: DataTypes.STRING, field: "remember_token", allowNull: true },
      avatar: { type: DataTypes.TEXT, allowNull: true },
      role: { type: DataTypes.STRING, allowNull: false }
    },
    {
      tableName: "users",
      underscored: true,
      hooks: {
        beforeSave: async (user) => {
          if (shouldHashPassword(user)) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    }
  );
}
