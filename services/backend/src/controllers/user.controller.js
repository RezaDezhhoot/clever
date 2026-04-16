import { Op } from "sequelize";
import { Child, sequelize, User } from "../db/models/index.js";
import { serializeUser } from "../utils/serializers.js";

const includeChild = [{ model: Child, as: "child" }];

function buildFilters(search) {
  if (!search) {
    return {};
  }

  return {
    [Op.or]: [
      { email: { [Op.iLike]: `%${search}%` } },
      { name: { [Op.iLike]: `%${search}%` } }
    ]
  };
}

function buildUserPayload(body, isCreate) {
  const payload = {
    name: body.name || null,
    email: body.email,
    role: body.role || "user",
    emailVerifiedAt: body.emailVerifiedAt ? new Date() : null,
    avatar: body.avatar || null
  };

  if (body.password) {
    payload.password = body.password;
  }

  if (isCreate && !payload.password) {
    return { error: "Password is required for new users." };
  }

  if (!payload.email) {
    return { error: "Email is required." };
  }

  return { payload };
}

async function findUserWithChild(id, options = {}) {
  return User.findByPk(id, {
    include: includeChild,
    ...options
  });
}

async function findUserForMutation(id, transaction) {
  const user = await User.findByPk(id, {
    transaction,
    lock: {
      level: transaction.LOCK.UPDATE,
      of: User
    }
  });

  if (!user) {
    return null;
  }

  user.child = await Child.findOne({
    where: { userId: user.id },
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  return user;
}

async function index(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const perPage = Math.min(Math.max(Number(req.query.perPage || 10), 1), 100);
    const search = String(req.query.search || "").trim();

    const { rows, count } = await User.findAndCountAll({
      where: buildFilters(search),
      include: includeChild,
      order: [["createdAt", "DESC"]],
      limit: perPage,
      offset: (page - 1) * perPage
    });

    return res.json({
      items: rows.map(serializeUser),
      meta: {
        page,
        perPage,
        total: count,
        totalPages: Math.max(Math.ceil(count / perPage), 1)
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function show(req, res, next) {
  try {
    const user = await findUserWithChild(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ item: serializeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function store(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const { error, payload } = buildUserPayload(req.body, true);

    if (error) {
      await transaction.rollback();
      return res.status(422).json({ message: error });
    }

    const existing = await User.findOne({ where: { email: payload.email }, transaction });

    if (existing) {
      await transaction.rollback();
      return res.status(422).json({ message: "Email address is already in use." });
    }

    const user = await User.create(payload, { transaction });

    await Child.create(
      {
        userId: user.id,
        name: req.body.childName || null,
        birthdate: req.body.childBirthdate || null
      },
      { transaction }
    );

    await transaction.commit();

    const result = await findUserWithChild(user.id);

    return res.status(201).json({ item: serializeUser(result) });
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
}

async function update(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const user = await findUserForMutation(req.params.id, transaction);

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found." });
    }

    const { error, payload } = buildUserPayload(req.body, false);

    if (error) {
      await transaction.rollback();
      return res.status(422).json({ message: error });
    }

    const duplicate = await User.findOne({
      where: {
        email: payload.email,
        id: { [Op.ne]: user.id }
      },
      transaction
    });

    if (duplicate) {
      await transaction.rollback();
      return res.status(422).json({ message: "Email address is already in use." });
    }

    await user.update(payload, { transaction });

    if (user.child) {
      await user.child.update(
        {
          name: req.body.childName || null,
          birthdate: req.body.childBirthdate || null
        },
        { transaction }
      );
    } else {
      await Child.create(
        {
          userId: user.id,
          name: req.body.childName || null,
          birthdate: req.body.childBirthdate || null
        },
        { transaction }
      );
    }

    await transaction.commit();

    const result = await findUserWithChild(user.id);

    return res.json({ item: serializeUser(result) });
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
}

async function destroy(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const user = await findUserForMutation(req.params.id, transaction);

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found." });
    }

    if (user.child) {
      await user.child.destroy({ transaction });
    }

    await user.destroy({ transaction });
    await transaction.commit();

    return res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
}

export {
  index,
  show,
  store,
  update,
  destroy
};
