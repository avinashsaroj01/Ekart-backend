const express = require("express");
const { createUser, loginUser, checkAuth } = require("../controller/auth");
const passport = require("passport");
const router = express.Router();
//  /auth is already added in base path
router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local", { session: false }), loginUser)
  .get(
    "/check",
    (req, res, next) => {
      console.log("➡️ /auth/check hit");
      next();
    },
    passport.authenticate("jwt", { session: false }),
    checkAuth,
  );


module.exports = router;
