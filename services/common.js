const passport = require("passport");

exports.isAuth = () => {
  return passport.authenticate("jwt", { session: false });
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    console.log("🔑 JWT from cookie:", req.cookies.token);
    token = req.cookies.token;
  }
  return token;
};
