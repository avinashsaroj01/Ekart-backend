const express = require("express");
const { createUser, loginUser } = require("../controller/auth");

const router = express.Router();
//  /auth is already added in base path
router.post("/signup", createUser).post("/login", loginUser);

module.exports = router;
