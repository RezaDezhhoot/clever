function serializeUser(user) {
  if (!user) {
    return null;
  }

  const plain = typeof user.get === "function" ? user.get({ plain: true }) : user;

  return {
    id: plain.id,
    name: plain.name,
    email: plain.email,
    emailVerifiedAt: plain.emailVerifiedAt || plain.email_verified_at || null,
    avatar: plain.avatar,
    role: plain.role,
    createdAt: plain.createdAt || plain.created_at || null,
    updatedAt: plain.updatedAt || plain.updated_at || null,
    child: plain.child || null
  };
}

export {
  serializeUser
};
