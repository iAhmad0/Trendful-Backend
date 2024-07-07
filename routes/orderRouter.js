const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  order,
} = require("../controllers/orderController");

router.post("/order", createOrder);
router.get("/getOrder/:id", getOrder);
router.get("/getOrders", getOrders);
router.put("/updateOrder/:id", updateOrder);
router.delete("/deleteOrder/:id", deleteOrder);

router.post("/api/make-order", order);

module.exports = router;
