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
  updateSellerInfo,
  updateSellerPassword,
} = require("../controllers/sellerController");
const { updateBuyerInfo } = require("../controllers/buyerController");

// signup route
router.post("/seller/signup", signupSeller);

// login route
router.post("/seller/login", loginSeller);

router.post("/api/seller/token", checkToken);

router.route("/api/sellerInfo").post(getSellerInfo).patch(updateSellerInfo);

router.route("/api/sellerPasswordChange").patch(updateSellerPassword);

// products
router.post("/seller/create-product", createProduct);
router.get("/seller/get-products", getAllProducts);
router.put("/seller/update-product/:id", updateProduct);
router.delete("/seller/delete-product/:id", deleteProduct);

module.exports = router;
