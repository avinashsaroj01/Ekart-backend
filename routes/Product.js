const express = require("express");
const { createProduct, fetchAllProducts } = require("../controller/product");
const { fetchCategories } = require("../controller/category");
const { fetchBrands } = require("../controller/brand");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/", fetchCategories)
  .get("/", fetchBrands);

module.exports = router;
