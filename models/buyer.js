const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BuyerSchema = new mongoose.Schema({
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
    minLength: [8, "Password must be between 8 and 15 characters."],
    maxLength: [15, "Password must be between 8 and 15 characters."],
  },
  orders: [
    {
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      points: {
        type: Number,
        required: true,
      },
    },
  ],
  points: {
    type: Number,
    default: 0,
  },
});

BuyerSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

BuyerSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

BuyerSchema.methods.createJWT = function () {
  return jwt.sign({ buyerId: this._id, name: this.name }, process.env.SECRET, {
    expiresIn: process.env.LIFETIME,
  });
};

module.exports = mongoose.model("Buyer", BuyerSchema);
