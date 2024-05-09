const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { secret } = require("../utils/jwt");

const cookieExtractor = (req) =>
  req && req.cookies ? req.cookies["accessToken"] : null;

const initializeStrategy = () => {
  passport.use(
    "jwt",
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: secret,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload.email);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

module.exports = initializeStrategy;
