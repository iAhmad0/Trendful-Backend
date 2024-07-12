const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
    cb(null, uniqueSuffix + "." + file.mimetype.slice(6));
  },
});

const upload = multer({ storage });

// controller functions
const {
  loginSeller,
  signupSeller,
  checkToken,
  getSellerProducts,
  updateProduct,
  deleteProduct,
  getSellerInfo,
  updateSellerInfo,
  updateSellerPassword,
  addProduct,
  getProductImage,
  getHomeProducts,
  getProduct,
  getProductInfo,
  getHistory,
  searchProduct,
  getCheckoutProduct,
  getCartProduct,
  getAllProducts,
  adminDeleteProduct,
} = require("../controllers/sellerController");

// signup route
router.post("/seller/register", signupSeller);

// login route
router.post("/seller/login", loginSeller);

router.post("/api/seller/token", checkToken);

router.route("/api/sellerInfo").post(getSellerInfo).patch(updateSellerInfo);

router.route("/api/sellerPasswordChange").patch(updateSellerPassword);

router.get("/seller/get-products/:id", getSellerProducts);
router.put("/seller/update-product/:id", upload.any("images"), updateProduct);
router.delete("/seller/delete-product/:token/:id", deleteProduct);

router.post("/api/add-product", upload.any("images"), addProduct);
router.get("/api/uploads/images/:id", getProductImage);

router.get("/api/v1/home-products", getHomeProducts);
router.get("/api/v1/:id", getProduct);
router.get("/api/v1/cart/:id", getCartProduct);
router.get("/api/v1/checkout/:id", getCheckoutProduct);
router.get("/api/v1/product/:id", getProductInfo);

router.post("/api/seller/purchase-history", getHistory);

router.get("/api/search/:word", searchProduct);
router.get("/api/search-products", getAllProducts);

router.delete("/admin/delete-product/:sellerID/:id", adminDeleteProduct);

module.exports = router;
