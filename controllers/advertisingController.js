const AdvertisingProduct = require("../models/advertising");
const { StatusCodes } = require("http-status-codes");

const addProduct = async (req, res) => {
  // Calculate expiration time
  req.body.expiresAt = new Date(
    Date.now() + req.body.durationInDays * 24 * 60 * 60 * 1000
  );
  const newADProduct = await AdvertisingProduct.create(req.body);
  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: {
      product: newADProduct,
    },
  });
};
const getNonExpiredProducts = async (req, res) => {
  try {
    const currentDate = new Date();
    const nonExpiredProducts = await AdvertisingProduct.find({
      expiresAt: { $gt: currentDate },
    });
    res.status(StatusCodes.OK).json(nonExpiredProducts);
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ error: err.message });
  }
};

module.exports = {
  addProduct,
  getNonExpiredProducts,
};
