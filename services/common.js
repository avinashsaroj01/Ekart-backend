const passport = require("passport");
exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjUwNTg3M2U0OTFjNWNiNjE2ZDZhNyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY4MjI4MjMzfQ.ZMo5AVzRPtAIkvvZU38TUbKcZuaqrW5l6wKpx1RRN1Y"
    return token;
};