const mongoose = require("mongoose");

const HomeSchema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
  },
  { capped: { size: 1024, max: 6 } }
);

module.exports = mongoose.model("Homeproduct", HomeSchema);
