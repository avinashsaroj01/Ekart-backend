const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  updateOrder,
} = require("../controller/order");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

module.exports = router;
