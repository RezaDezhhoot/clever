import { DataTypes, literal } from "sequelize";

export async function up({ context: queryInterface }) {
  await queryInterface.createTable("jobs", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    queue: { type: DataTypes.STRING, allowNull: false },
    payload: { type: DataTypes.TEXT("long"), allowNull: false },
    attempts: { type: DataTypes.INTEGER, allowNull: false },
    reserved_at: { type: DataTypes.INTEGER, allowNull: true },
    available_at: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.INTEGER, allowNull: false }
  });
  await queryInterface.addIndex("jobs", ["queue"], { name: "jobs_queue" });

  await queryInterface.createTable("job_batches", {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    total_jobs: { type: DataTypes.INTEGER, allowNull: false },
    pending_jobs: { type: DataTypes.INTEGER, allowNull: false },
    failed_jobs: { type: DataTypes.INTEGER, allowNull: false },
    failed_job_ids: { type: DataTypes.TEXT("long"), allowNull: false },
    options: { type: DataTypes.TEXT("medium"), allowNull: true },
    cancelled_at: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.INTEGER, allowNull: false },
    finished_at: { type: DataTypes.INTEGER, allowNull: true }
  });

  await queryInterface.createTable("failed_jobs", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
    uuid: { type: DataTypes.STRING, allowNull: false, unique: true },
    connection: { type: DataTypes.TEXT, allowNull: false },
    queue: { type: DataTypes.TEXT, allowNull: false },
    payload: { type: DataTypes.TEXT("long"), allowNull: false },
    exception: { type: DataTypes.TEXT("long"), allowNull: false },
    failed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: literal("CURRENT_TIMESTAMP") }
  });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable("failed_jobs");
  await queryInterface.dropTable("job_batches");
  await queryInterface.dropTable("jobs");
}
