const authorizationMiddleware = (rol) => {
  if (!req.user) {
    return req.status(401).send({ error: "User should authenticate" });
  }
  if (!req.user.role || req.user.rol !== rol) {
    return req.status(403).send({ error: "User need permissions" });
  }
  next();
};

module.exports = authorizationMiddleware;
