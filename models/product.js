const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: [
      10,
      "A product description must have more than or equal 10 characters.",
    ],
    trim: true,
  },
  images: {
    type: Array,
    required: true,
    minlength: [1, "At least one image must be provided."],
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: "String",
    required: true,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
