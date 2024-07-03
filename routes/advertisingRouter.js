const express = require("express");
const router = express.Router();
const {
  addProduct,
  getMainPageAds,
  getSearchPageAds,
  getMainPageAdsRandom,
} = require("../controllers/advertisingController");

router.post("/advertising/add-product", addProduct);

router.get("/advertising/get-main-page-ads", getMainPageAds);
router.get("/advertising/get-Search-page-ads", getSearchPageAds);

//get random 5 products
router.get("/advertising/get-main-page-ads/random", getMainPageAdsRandom);
router.get("/advertising/get-Search-page-ads/random", getSearchPageAds);

module.exports = router;
