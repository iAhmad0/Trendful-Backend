const express = require("express");
const router = express.Router();

// controller functions
const {
  loginBuyer,
  signupBuyer,
  checkToken,
  getBuyerInfo,
  updateBuyerInfo,
  updateBuyerPassword,
  getHistory,
  getDiscount,
} = require("../controllers/buyerController");

// signup route
router.post("/register", signupBuyer);

// login route
router.post("/login", loginBuyer);

router.post("/api/buyer/token", checkToken);

router.route("/api/buyerInfo").post(getBuyerInfo).patch(updateBuyerInfo);

router.post("/api/purchase-history", getHistory);

router.route("/api/buyerPasswordChange").patch(updateBuyerPassword);

router.get("/api/buyer/get-discount/:token", getDiscount);

module.exports = router;
