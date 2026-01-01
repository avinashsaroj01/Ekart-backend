const express = require("express");
const { fetchCategories } = require("../controller/category");

const router = express.Router();

router.get("/", fetchCategories);

module.exports = router;
