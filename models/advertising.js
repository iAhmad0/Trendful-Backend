const mongoose = require("mongoose");

const advertisingProductsSchema = new mongoose.Schema({
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "3m",
    index: true,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "AdvertisingProduct",
  advertisingProductsSchema
);
