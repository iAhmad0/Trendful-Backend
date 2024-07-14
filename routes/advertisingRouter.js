const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAdProducts,
} = require("../controllers/advertisingController");

router.post("/advertising/add-product", addProduct);
router.get("/advertising/get-products", getAdProducts);

module.exports = router;
