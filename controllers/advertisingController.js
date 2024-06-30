const AdvertisingProduct = require("../models/advertising")
const { StatusCodes } = require("http-status-codes");


const addProduct = async(req,res) => {
    // Calculate expiration time
    req.body.expiresAt = new Date(Date.now() + (req.body.durationInDays * 24 * 60 * 60 * 1000)) 
    const newADProduct = await AdvertisingProduct.create(req.body);
    res.status(StatusCodes.CREATED).json({
        status: "success",
        data: {
        product: newADProduct,
        },
    });
}

const getMainPageAds = async (req, res) => {
    try {
        const mainPageAds = await AdvertisingProduct.find({ adPlace: 'mainPage' });
        res.status(StatusCodes.OK).json(mainPageAds);
    } catch (err) {
        res.status(StatusCodes.FORBIDDEN).json({ valid: false });
    }
};
const getMainPageAdsRandom = async (req, res) => {
    try {
      const randomMainPageAds = await AdvertisingProduct.aggregate([
        { $match: { adPlace: 'mainPage' } },
        { $sample: { size: 5 } }
      ]);
      res.status(StatusCodes.OK).json(randomMainPageAds);
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({ error: err.message });
    }
  };
const getSearchPageAdsRandom = async (req, res) => {
    try {
      const randomSearchPageAds = await AdvertisingProduct.aggregate([
        { $match: { adPlace: 'searchPageAds' } },
        { $sample: { size: 5 } }
      ]);
      res.status(StatusCodes.OK).json(randomSearchPageAds);
    } catch (err) {
      res.status(StatusCodes.FORBIDDEN).json({ error: err.message });
    }
  };

const getSearchPageAds = async (req, res) => {
    try {
        const searchPageAds = await AdvertisingProduct.find({ adPlace: 'searchPage' });
        res.status(StatusCodes.OK).json(searchPageAds);
    } catch (err) {
        res.status(StatusCodes.FORBIDDEN).json({ valid: false });
    }
};

module.exports = {addProduct,getMainPageAds,getSearchPageAds,getMainPageAdsRandom,getSearchPageAdsRandom}