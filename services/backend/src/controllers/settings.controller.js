import { Setting } from "../db/models/index.js";

function normalizeSettings(rows) {
  const values = rows.reduce((carry, row) => {
    if (row.name === "status") {
      carry[row.name] = row.value === "true";
      return carry;
    }

    carry[row.name] = row.value;
    return carry;
  }, {});

  return {
    rows,
    values: {
      title: values.title || "Clever Quest",
      logo: values.logo || "",
      status: Boolean(values.status)
    }
  };
}

async function index(_req, res, next) {
  try {
    const rows = await Setting.findAll({ order: [["name", "ASC"]] });
    return res.json(normalizeSettings(rows.map((row) => row.get({ plain: true }))));
  } catch (error) {
    return next(error);
  }
}

async function store(req, res, next) {
  try {
    const { title, logo, status } = req.body;

    if (!title) {
      return res.status(422).json({ message: "Title is required." });
    }

    await Promise.all([
      Setting.upsert({ name: "title", value: title }, { conflictFields: ["name"] }),
      Setting.upsert({ name: "logo", value: logo || "" }, { conflictFields: ["name"] }),
      Setting.upsert({ name: "status", value: status ? "true" : "false" }, { conflictFields: ["name"] })
    ]);

    const rows = await Setting.findAll({ order: [["name", "ASC"]] });
    return res.json(normalizeSettings(rows.map((row) => row.get({ plain: true }))));
  } catch (error) {
    return next(error);
  }
}

export {
  index,
  store
};
