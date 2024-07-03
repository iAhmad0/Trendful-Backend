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
} = require("../controllers/sellerController");

// signup route
router.post("/seller/signup", signupSeller);

// login route
router.post("/seller/login", loginSeller);

router.post("/api/seller/token", checkToken);

router.route("/api/sellerInfo").post(getSellerInfo).patch(updateSellerInfo);

router.route("/api/sellerPasswordChange").patch(updateSellerPassword);

router.get("/seller/get-products/:id", getSellerProducts);
router.put("/seller/update-product/:id", updateProduct);
router.delete("/seller/delete-product/:id", deleteProduct);

router.post("/api/add-product", upload.any("images"), addProduct);
router.get("/api/uploads/images/:id", getProductImage);

module.exports = router;
