const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const nodemailer = require("nodemailer");


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

exports.transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // apikey
    pass: process.env.SMTP_PASS, // real SMTP key
  },
});
