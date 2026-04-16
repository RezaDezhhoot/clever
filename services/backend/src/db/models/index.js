import sequelize from "../../config/database.js";
import createCacheModel from "./cache.model.js";
import createCacheLockModel from "./cache-lock.model.js";
import createChildModel from "./child.model.js";
import createFailedJobModel from "./failed-job.model.js";
import createJobBatchModel from "./job-batch.model.js";
import createJobModel from "./job.model.js";
import createPasswordResetTokenModel from "./password-reset-token.model.js";
import createSessionModel from "./session.model.js";
import createSettingModel from "./setting.model.js";
import createUserModel from "./user.model.js";
import createVersionModel from "./version.model.js";

const User = createUserModel(sequelize);
const Child = createChildModel(sequelize);
const Setting = createSettingModel(sequelize);
const Version = createVersionModel(sequelize);
const PasswordResetToken = createPasswordResetTokenModel(sequelize);
const Session = createSessionModel(sequelize);
const Cache = createCacheModel(sequelize);
const CacheLock = createCacheLockModel(sequelize);
const Job = createJobModel(sequelize);
const JobBatch = createJobBatchModel(sequelize);
const FailedJob = createFailedJobModel(sequelize);

User.hasOne(Child, { as: "child", foreignKey: "userId", sourceKey: "id" });
Child.belongsTo(User, { as: "user", foreignKey: "userId", targetKey: "id" });

export {
  sequelize,
  User,
  Child,
  Setting,
  Version,
  PasswordResetToken,
  Session,
  Cache,
  CacheLock,
  Job,
  JobBatch,
  FailedJob
};

export default {
  sequelize,
  User,
  Child,
  Setting,
  Version,
  PasswordResetToken,
  Session,
  Cache,
  CacheLock,
  Job,
  JobBatch,
  FailedJob
};
