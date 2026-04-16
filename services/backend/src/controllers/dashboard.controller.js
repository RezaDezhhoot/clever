import { Op } from "sequelize";
import { Child, Setting, User, Version } from "../db/models/index.js";
import { serializeUser } from "../utils/serializers.js";

function normalizeSettings(rows) {
  const map = rows.reduce((carry, row) => {
    carry[row.name] = row.value;
    return carry;
  }, {});

  return {
    title: map.title || "Clever Quest",
    logo: map.logo || "",
    status: map.status === "true"
  };
}

async function stats(_req, res, next) {
  try {
    const [users, children, verifiedUsers, adminUsers, recentUsers, settingsRows, versions] = await Promise.all([
      User.count(),
      Child.count(),
      User.count({
        where: {
          emailVerifiedAt: {
            [Op.not]: null
          }
        }
      }),
      User.count({ where: { role: "admin" } }),
      User.findAll({
        limit: 6,
        order: [["createdAt", "DESC"]],
        include: [{ model: Child, as: "child" }]
      }),
      Setting.findAll({ order: [["name", "ASC"]] }),
      Version.findAll({ order: [["platform", "ASC"]] })
    ]);

    const settings = normalizeSettings(settingsRows.map((row) => row.get({ plain: true })));
    const versionItems = versions.map((row) => row.get({ plain: true }));
    const forcedUpdates = versionItems.filter((item) => item.force).length;
    const childCoverage = users ? Math.round((children / users) * 100) : 0;
    const verificationRate = users ? Math.round((verifiedUsers / users) * 100) : 0;

    return res.json({
      counters: {
        users,
        children,
        verifiedUsers,
        adminUsers,
        forcedUpdates,
        releaseChannels: versionItems.length
      },
      health: {
        childCoverage,
        verificationRate,
        applicationStatus: settings.status,
        title: settings.title,
        logo: settings.logo
      },
      recentUsers: recentUsers.map(serializeUser),
      versions: versionItems
    });
  } catch (error) {
    return next(error);
  }
}

export {
  stats
};
