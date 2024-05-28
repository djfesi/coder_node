module.exports = {
  userIsLoggedIn: (req, res, next) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);
    if (!isLoggedIn) {
      return res.status(401).redirect("/products");
    }
    next();
  },

  userIsNotLoggedIn: (req, res, next) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);
    if (isLoggedIn) {
      return res
        .status(401)
        .json({ error: "User should not be logged in" })
        .redirect("/login");
    }
    next();
  },

  authorizeAdmin: (req, res, next) => {
    if (req.signedCookies.userRole !== "admin") {
      return res
        .status(403)
        .json({ error: "No tienes permisos de administrador" });
    }
    next();
  },

  authorizeUser: (req, res, next) => {
    if (req.signedCookies.userRole !== "user") {
      return res.status(403).json({ error: "No tienes permisos de usuario" });
    }
    next();
  },

  authorizeViewUser: (req, res, next) => {
    if (req.signedCookies.userRole !== "user") {
      return res.redirect("/products");
    }
    next();
  },

  authorizeViewAdmin: (req, res, next) => {
    if (req.signedCookies.userRole !== "admin") {
      return res.redirect("/products");
    }
    next();
  },
};
