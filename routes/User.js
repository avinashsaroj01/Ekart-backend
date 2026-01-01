const express = require("express");
const { createUser, checkUser } = require("../controller/user");

const router = express.Router();

router.post("/signUp", createUser);
router.post("/login", checkUser);

module.exports = router; 
 