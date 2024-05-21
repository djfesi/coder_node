const passport = require("passport");
const { Strategy } = require("passport-github2");
const User = require("../models/user.model");
// const hashingUtils = require("../utils/hashing");
const { clientID, clientSecret, callbackURL } = require("./github.private");
const cartModel = require("../models/cart.model");

const initializeStrategy = () => {
  passport.use(
    "github",
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await User.findOne({
            email: profile._json.email
              ? profile._json.email
              : profile._json.login,
          });
          if (user) {
            return done(null, user);
          }

          const fullName = profile._json.name;
          const lastName = fullName.substring(fullName.lastIndexOf(" ") * 1);
          const firstName = fullName.substring(0, fullName.lastIndexOf(" "))
            ? fullName.substring(0, fullName.lastIndexOf(" "))
            : lastName;

          // DEBIDO A QUE NO SE PUEDE TOMAR EL EMAIL DE GITHUB TOMA EL NOMBRE DE USUARIO EN CASO DE NO RECIBIR EL MAIL

          const newCart = new cartModel({ products: [] });
          await newCart.save();
          const newUser = {
            firstName,
            lastName,
            age: 20,
            email: profile._json.email
              ? profile._json.email
              : profile._json.login,
            password: "",
            cart: newCart._id,
          };

          const result = await User.create(newUser);
          return done(null, result);
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
