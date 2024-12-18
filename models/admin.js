const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema({
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
});

AdminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// AdminSchema.methods.comparePassword = async function (candidatePassword) {
//   const isMatch = await bcrypt.compare(candidatePassword, this.password);
//   return isMatch;
// };

AdminSchema.methods.comparePassword = function (candidatePassword) {
  const isMatch = candidatePassword === this.password;
  return isMatch;
};

AdminSchema.methods.createJWT = function () {
  return jwt.sign({ adminID: this._id, name: this.name }, process.env.SECRET, {
    expiresIn: process.env.LIFETIME,
  });
};

module.exports = mongoose.model("Admin", AdminSchema);
