module.exports = {
  userIsLoggedIn: (req, res, next) => {
    const isLoggedIn = ![null, undefined].includes(req.session.user);
    if (!isLoggedIn) {
      return res
        .status(401)
        .redirect("/products");
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
};
