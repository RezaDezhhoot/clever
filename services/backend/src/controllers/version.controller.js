import { Version } from "../db/models/index.js";

async function index(_req, res, next) {
  try {
    const rows = await Version.findAll({ order: [["platform", "ASC"]] });
    return res.json({ items: rows });
  } catch (error) {
    return next(error);
  }
}

async function store(req, res, next) {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    if (!items.length) {
      return res.status(422).json({ message: "At least one version record is required." });
    }

    for (const item of items) {
      if (!item.platform || !item.version) {
        return res.status(422).json({ message: "Platform and version are required." });
      }

      await Version.upsert({
        platform: item.platform,
        version: item.version,
        force: Boolean(item.force)
      });
    }

    const rows = await Version.findAll({ order: [["platform", "ASC"]] });
    return res.json({ items: rows });
  } catch (error) {
    return next(error);
  }
}

export {
  index,
  store
};
