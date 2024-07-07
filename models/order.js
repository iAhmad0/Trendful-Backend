const { required } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sellerID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  products: [
    {
      _id: false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  //   status: {
  //     type: String,
  //     required: true,
  //     default: "Pending",
  //   },
  shipping: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Order", orderSchema);
