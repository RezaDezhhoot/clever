import { DataTypes } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("cache", {
    key: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    value: { type: DataTypes.TEXT("medium"), allowNull: false },
    expiration: { type: DataTypes.INTEGER, allowNull: false }
  });
  await queryInterface.addIndex("cache", ["expiration"], { name: "cache_expiration" });

  await queryInterface.createTable("cache_locks", {
    key: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    owner: { type: DataTypes.STRING, allowNull: false },
    expiration: { type: DataTypes.INTEGER, allowNull: false }
  });
  await queryInterface.addIndex("cache_locks", ["expiration"], { name: "cache_locks_expiration" });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("cache_locks");
  await queryInterface.dropTable("cache");
}
