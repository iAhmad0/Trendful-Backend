const AdvertisingProduct = require("../models/advertising");
const { StatusCodes } = require("http-status-codes");

const addProduct = async (req, res) => {
  // Calculate expiration time

  const newADProduct = await AdvertisingProduct.create({
    durationInDays: req.body.durationInDays,
    productID: req.body.productID,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: {
      product: newADProduct,
    },
  });
};

const getAdProducts = async (req, res) => {
  try {
    const adProducts = await AdvertisingProduct.find();

    res.status(StatusCodes.OK).json(adProducts);
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).json({ error: err.message });
  }
};

module.exports = {
  addProduct,
  getAdProducts,
};
