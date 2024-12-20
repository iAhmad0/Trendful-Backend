const { required } = require("joi");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  buyerID: {
    type: String,
    required: true,
  },
  buyerInfo: {
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
  },
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
  shipping: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  //   status: {
  //     type: String,
  //     required: true,
  //     default: "Pending",
  //   },
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
