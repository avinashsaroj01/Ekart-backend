const express = require("express");
const { fetchBrands } = require("../controller/brand");

const router = express.Router();

router.get("/", fetchBrands);

module.exports = router;
