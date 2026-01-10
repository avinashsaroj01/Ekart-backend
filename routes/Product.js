const express = require("express");
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controller/product");
const { fetchCategories } = require("../controller/category");
const { fetchBrands } = require("../controller/brand");

const router = express.Router();

router
  .post("/", createProduct)
  .get("/", fetchAllProducts)
  .get("/", fetchCategories)
  .get("/", fetchBrands)
  .get("/:id", fetchProductById)
  .get("/:id", updateProduct);

module.exports = router;
