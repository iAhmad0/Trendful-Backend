const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  products: [
    {
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
    },
  ],
  order: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

SellerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

SellerSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

SellerSchema.methods.createJWT = function () {
  return jwt.sign({ sellerId: this._id, name: this.name }, process.env.SECRET, {
    expiresIn: process.env.LIFETIME,
  });
};

module.exports = mongoose.model("Seller", SellerSchema);
