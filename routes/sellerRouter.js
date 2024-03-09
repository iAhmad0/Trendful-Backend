const express = require("express");
const router = express.Router();

// controller functions
const {
  loginSeller,
  signupSeller,
  checkToken,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getSellerInfo,
} = require("../controllers/sellerController");

// signup route
router.post("/seller/signup", signupSeller);

// login route
router.post("/seller/login", loginSeller);

router.post("/api/seller/token", checkToken);

router.route("/api/sellerInfo").post(getSellerInfo);

// products
router.post("/seller/create-product", createProduct);
router.get("/seller/get-products", getAllProducts);
router.put("/seller/update-product/:id", updateProduct);
router.delete("/seller/delete-product/:id", deleteProduct);

module.exports = router;
