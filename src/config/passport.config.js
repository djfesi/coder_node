const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../models/user.model");
const hashingUtils = require("../utils/hashing");
const cartModel = require("../models/cart.model");

const initializeStrategy = () => {
  passport.use(
    "register",
    new Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, passport, done) => {
        const { firstName, lastName, age, email, password } = req.body;
        try {
          const user = await User.findOne({ email: username });
          if (user) {
            return done(null, false);
          }

          const newCart = new cartModel({ products: [] });
          await newCart.save();

          const newUser = {
            firstName,
            lastName,
            age: +age,
            email,
            password: hashingUtils.hashPassword(password),
            cart: newCart._id
          };

          const result = await User.create(newUser);
          return done(null, result);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.use(
    "login",
    new Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) {
            return done(null, false);
          }
          const user = await User.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }
          if (!hashingUtils.isValidPassword(password, user.password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

module.exports = initializeStrategy;
