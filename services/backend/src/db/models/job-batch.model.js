import { DataTypes } from "sequelize";

export default function createJobBatchModel(sequelize) {
  return sequelize.define(
    "JobBatch",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      totalJobs: { type: DataTypes.INTEGER, field: "total_jobs", allowNull: false },
      pendingJobs: { type: DataTypes.INTEGER, field: "pending_jobs", allowNull: false },
      failedJobs: { type: DataTypes.INTEGER, field: "failed_jobs", allowNull: false },
      failedJobIds: { type: DataTypes.TEXT("long"), field: "failed_job_ids", allowNull: false },
      options: { type: DataTypes.TEXT("medium"), allowNull: true },
      cancelledAt: { type: DataTypes.INTEGER, field: "cancelled_at", allowNull: true },
      createdAt: { type: DataTypes.INTEGER, field: "created_at", allowNull: false },
      finishedAt: { type: DataTypes.INTEGER, field: "finished_at", allowNull: true }
    },
    {
      tableName: "job_batches",
      timestamps: false
    }
  );
}
