const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProduct,
  searchProduct,
} = require("../controllers/product");

router.get("/api/v1/all-products", getAllProducts);
router.get("/api/v1/:id", getProduct);
router.post("/api/v1/search", searchProduct);

module.exports = router;
