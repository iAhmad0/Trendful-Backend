const mongoose = require("mongoose");

const advertisingProductsSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  // Store duration in days (or another unit)
  durationInDays: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
});

module.exports = mongoose.model(
  "AdvertisingProduct",
  advertisingProductsSchema
);
