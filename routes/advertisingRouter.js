const express = require("express");
const router = express.Router();
const {
  addProduct,
  getNonExpiredProducts,
} = require("../controllers/advertisingController");

router.post("/advertising/add-product", addProduct);
router.get("/advertising/get-products", getNonExpiredProducts);

module.exports = router;
